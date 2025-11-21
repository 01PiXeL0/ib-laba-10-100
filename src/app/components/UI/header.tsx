"use client";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@heroui/react";

const links = [
  { label: "Рабочее место", href: "#workspace" },
  { label: "Диалог", href: "#dialog" },
  { label: "Скоринг", href: "#engine" },
  { label: "Админ", href: "#data" },
];

export default function Header() {
  return (
    <Navbar maxWidth="xl" className="bg-white/70 backdrop-blur dark:bg-black/50">
      <NavbarBrand>
        <p className="text-2xl font-bold tracking-tight">DEVBASICS</p>
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
          <Link href="mailto:team@devbasics.ai" className="text-sm font-medium">
            Связаться
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} href="#cta" color="primary" className="font-semibold">
            Развернуть сейчас
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
