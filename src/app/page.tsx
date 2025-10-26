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
        <AppSidebar className="z-[400]" />
        <SidebarInset className="bg-grid-glow flex flex-col items-center justify-center relative">
          <div className="w-full h-full z-[100] hidden sm:block absolute inset-0">
            <Spline scene="https://prod.spline.design/aOWMFN9EyxGf5rvB/scene.splinecode" />
          </div>
          <header className="flex h-16 w-full shrink-0 items-center gap-2 px-2 top-0 relative z-[1000]">
            <SidebarTrigger className="z-[300]" />
          </header>
          <div className="flex-1 w-full relative z-[200]">
            <Chat />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
