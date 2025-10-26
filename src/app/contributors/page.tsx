"use client";

import { AppSidebar } from "@/components/app-sidebar"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { Separator } from "@/components/ui/separator"
import React from "react";
import { Github, Linkedin } from "lucide-react"; // Añadido para los íconos

const Button = ({
  variant,
  size,
  asChild,
  children,
  "aria-label": ariaLabel,
  ...props
}: {
  variant: "outline";
  size: "icon";
  asChild?: boolean;
  children: React.ReactNode;
  "aria-label": string;
  [key: string]: any;
}) => {
  let classes =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

  if (variant === "outline") {
    classes +=
      " border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground";
  }

  if (size === "icon") {
    classes += " h-9 w-9";
  }

  if (asChild && React.isValidElement(children)) {
    // Clona las clases y props en el elemento hijo (ej. <a>)
    return React.cloneElement(children, {
      className: `${classes} ${children.props.className || ""}`,
      "aria-label": ariaLabel,
      ...props,
    });
  }

  return (
    <button className={classes} aria-label={ariaLabel} {...props}>
      {children}
    </button>
  );
};

const contributors = [
  {
    name: "Javier Vargas",
    role: "Desarrollador de Frontend",
    githubUser: "javierdv7",
    linkedinHandle: "javierdvt",
    avatarUrl: "https://github.com/javierdv7.png",
  },
  {
    name: "Leonor Arteaga",
    role: "Desarrollador Backend",
    githubUser: "1eo0",
    linkedinHandle: "leonor-arteaga-flores-561791379",
    avatarUrl: "https://github.com/1eo0.png",
  },
  {
    name: "Víctor Moreno",
    role: "Desarrollador de Backend",
    githubUser: "viccmoor",
    linkedinHandle: "victor-moreno-ortiz",
    avatarUrl: "https://github.com/viccmoor.png",
  },
];

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Colaboradores</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* Contenido principal de la página de colaboradores */}
        <main className="flex-1 flex-col gap-4 p-4 pt-6 md:p-6">
          <h1 className="text-3xl font-bold tracking-tight mb-6">
            Conoce a Nuestro Equipo
          </h1>

          {/* Cuadrícula responsiva de tarjetas de colaboradores */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {contributors.map((contrib) => (
              <div
                key={contrib.githubUser}
                className="flex flex-col items-center rounded-xl border bg-card text-card-foreground shadow-sm p-6 text-center"
              >
                {/* Avatar */}
                <img
                  src={`${contrib.avatarUrl}?size=120`}
                  alt={`Avatar de ${contrib.name}`}
                  className="mb-4 h-24 w-24 rounded-full border-2 border-primary/10"
                  width={96}
                  height={96}
                  // Añadir un fallback en caso de que la imagen de GitHub falle
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevenir bucles infinitos
                    target.src = `https://placehold.co/96x96/e2e8f0/64748b?text=${contrib.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}`;
                  }}
                />

                {/* Nombre y Rol */}
                <h3 className="mb-1 text-xl font-semibold">{contrib.name}</h3>
                <p className="text-sm text-muted-foreground">{contrib.role}</p>

                {/* Enlaces a Redes Sociales */}
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    aria-label={`Perfil de GitHub de ${contrib.name}`}
                  >
                    <a
                      href={`https://github.com/${contrib.githubUser}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    aria-label={`Perfil de LinkedIn de ${contrib.name}`}
                  >
                    <a
                      href={`https://linkedin.com/in/${contrib.linkedinHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}