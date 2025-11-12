"use client";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@heroui/react";

export default function Header() {
  return (
    <Navbar>
      <NavbarBrand>
        <p className="text-2xl font-bold">DEVBASICS</p>
      </NavbarBrand>
      <NavbarContent justify="center" className="hidden sm:flex gap-4">
        <NavbarItem><Link href="#">Features</Link></NavbarItem>
        <NavbarItem isActive><Link href="#">Customers</Link></NavbarItem>
        <NavbarItem><Link href="#">Integrations</Link></NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex"><Link href="#">Login</Link></NavbarItem>
        <NavbarItem><Button as={Link} href="#" color="primary">Sign Up</Button></NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
