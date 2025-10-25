export interface Env {
  AI: Ai;
  ELEVENLABS_API_KEY: string;
}

export default{
    async fetch(request, env, ctx) {
        if (request.method !== "POST") {
            return Response.json({ error: "Method not allowed" }, { status: 405 });
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

        const ttsResponse = await fetch("https://api.elevenlabs.io/v1/text-to-speech/RPyiWKUxiaFLwZodgu66", {
            method: "POST",
            headers: {
                "Accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": env.ELEVENLABS_API_KEY
            },

            body: JSON.stringify({
                text: userMessage || "No response generated",
                model_id: "eleven_flash_v2_5",
                voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75
                }
            })
        });

        if (!ttsResponse.ok) {
            return Response.json({ error: "TTS generation failed" }, { status: 500 });
        }

        return new Response(ttsResponse.body, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Cache-Control": "public, max-age=3600"
            }
        });
    }
}