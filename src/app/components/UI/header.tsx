"use client";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, Chip } from "@heroui/react";

const links = [
  { label: "Рабочее место", href: "#workspace" },
  { label: "Диалог", href: "#dialog" },
  { label: "Скоринг", href: "#engine" },
  { label: "Админ", href: "#data" },
  { label: "Аккаунт", href: "#account" },
];

export default function Header() {
  return (
    <Navbar
      maxWidth="xl"
      className="border-b border-white/10 bg-gradient-to-r from-white/70 via-white/50 to-white/30 backdrop-blur dark:from-black/80 dark:via-black/60 dark:to-black/50"
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
            Live on Supabase
          </Chip>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} href="#account" color="primary" className="font-semibold shadow-md shadow-blue-500/30">
            Войти / Регистрация
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
