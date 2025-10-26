import Spline from "@splinetool/react-spline/next";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Chat } from "@/components/chat";

export default function Home() {
  return (
    <div className="flex flex-col relative h-screen items-center justify-center font-sans p-0">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "19rem",
          } as React.CSSProperties
        }
        defaultOpen={false}
      >
        <AppSidebar />
        <SidebarInset className="bg-grid-glow">
          <Spline scene="https://prod.spline.design/aOWMFN9EyxGf5rvB/scene.splinecode" className="z-100 hidden sm:block" />
          <header className="flex h-16 shrink-0 items-center gap-2 px-2 absolute top-0">
            <SidebarTrigger className="z-1000" />
          </header>
          <Chat />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
