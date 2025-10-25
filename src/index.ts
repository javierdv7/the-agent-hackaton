import { AgentNamespace, getAgentByName, Agent, WSMessage, Connection } from "agents";

export interface Env {
  AI: Ai;
  ELEVENLABS_API_KEY: string;
  EnergIA: AgentNamespace<EnergIA>;
}

const corsHeaders = {
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        let namedAgent = getAgentByName<Env, EnergIA>(env.EnergIA, "EnergIA");
        let namedResp = (await namedAgent).fetch(request);
        return namedResp;
    }
} satisfies ExportedHandler<Env>;

export class EnergIA extends Agent<Env> {
    async onStart() {
        console.log("EnergIA agent started with state:", this.state);
    }

    async onRequest(request: Request): Promise<Response> {
        if (request.method !== "POST") {
            return new Response(JSON.stringify({ error: "Method not allowed" }), {
                status: 405,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        let userMessage: string;
        try {
            const body = await request.json() as { message?: string };
            userMessage = body.message ?? "";
            if (!userMessage) {
                return Response.json({ error: "Message is required" }, { status: 400 });
            }
        } catch (error) {
            return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const context = [
            "Eres EnergIA, un agente IA para controlar la información eléctrica y domótica en un sector controlado.",
            "Tu objetivo es ayudar a los usuarios a gestionar su consumo energético de manera eficiente."
        ].join("\n");

        const messages = [
            { role: "system", content: context },
            { role: "user", content: userMessage },
        ];

        const aiResponse = await this.env.AI.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
            messages,
        }) as { response: string };

        const aiText = aiResponse.response || "No pude generar una respuesta exitósamente.";
        const ttsResponse = await fetch("https://api.elevenlabs.io/v1/text-to-speech/RPyiWKUxiaFLwZodgu66", {
            method: "POST",
            headers: {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": this.env.ELEVENLABS_API_KEY
            },
            body: JSON.stringify({
                text: aiText || "No response generated",
                model_id: "eleven_flash_v2_5",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75
                }
            })
        });

        if (!ttsResponse.ok) {
            const errorBody = await ttsResponse.text();
            console.error("Error de ElevenLabs:", errorBody);
            return new Response(JSON.stringify({ error: "TTS generation failed" }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const responseHeaders = new Headers(corsHeaders);
        responseHeaders.set("Content-Type", "audio/mpeg");
        responseHeaders.set("Cache-Control", "public, max-age=3600");

        return new Response(ttsResponse.body, {
            headers: responseHeaders,
        });
    }

    async onMessage(connection: Connection, message: WSMessage) {
        connection.send("EnergIA has received your message.");
    }
}
