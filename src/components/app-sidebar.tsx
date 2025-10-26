import Link from "next/link";
import * as React from "react";
import { BotMessageSquare, PersonStandingIcon } from "lucide-react";

import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" {...props} className="z-5000">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-[#e16e09] text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <BotMessageSquare className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">EnergIA</span>
                  <span className="font-light">Asistente Energético</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/contributors">
                <div className="bg-[#e16e09] text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <PersonStandingIcon className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Contribuidores del Proyecto</span>
                  <span className="font-light">Quienes estamos detrás</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
    </Sidebar>
  );
}
