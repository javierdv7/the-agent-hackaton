import Spline from "@splinetool/react-spline/next";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Mic } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col relative h-screen items-center justify-center font-sans p-0">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "19rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset>
          <Spline scene="https://prod.spline.design/1ff7UimOLWlh5QfW/scene.splinecode" />
          <header className="flex h-16 shrink-0 items-center gap-2 px-2 absolute top-0">
            <SidebarTrigger className="-ml-1" />
          </header>
          <div className="w-full h-20 absolute bottom-0 p-2 gap-2 flex">
            <Input placeholder="Pregunta lo que quieras" className="w-full h-full rounded-full bg-zinc-100/10 border-zinc-100/20"></Input>
            <button className="h-full w-20 flex items-center justify-center rounded-full bg-zinc-100/10 border-zinc-100/20 border-1">
              <Mic className="w-5 h-5 text-zinc-500" />
            </button>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
