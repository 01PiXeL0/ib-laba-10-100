"use client";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Chip } from "@heroui/react";

const links = [
  { label: "Главная", href: "/" },
  { label: "Тест", href: "/assessment" },
  { label: "Чат", href: "/chat" },
  { label: "Гайд", href: "#guide" },
];

export default function Header() {
  return (
    <Navbar
      maxWidth="xl"
      className="border-b border-white/10 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-900/60 backdrop-blur"
    >
      <NavbarBrand className="gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 text-lg font-bold text-white shadow-lg shadow-indigo-500/30">
          DB
        </div>
        <div className="flex flex-col leading-tight">
          <p className="text-2xl font-extrabold tracking-tight">DEVBASICS</p>
          <span className="text-xs uppercase text-zinc-500 dark:text-zinc-400">Career OS</span>
        </div>
      </NavbarBrand>
      <NavbarContent justify="center" className="hidden gap-4 sm:flex">
        {links.map((link) => (
          <NavbarItem key={link.href}>
            <Link className="text-sm font-medium" href={link.href} color="foreground">
              {link.label}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify="end" className="gap-3">
        <NavbarItem className="hidden sm:flex">
          <Chip size="sm" color="primary" variant="flat" className="font-semibold uppercase tracking-wide">
            Prisma + Postgres
          </Chip>
        </NavbarItem>
        <NavbarItem>
          <Button
            color="primary"
            className="font-semibold shadow-md shadow-blue-500/30"
            onPress={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("devbasics:auth", { detail: { mode: "login" } }));
              }
            }}
          >
            Войти / Регистрация
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
