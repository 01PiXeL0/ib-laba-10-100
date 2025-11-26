"use client";
import { HeroUIProvider } from "@heroui/react";
import Header from "./header";
import AuthModal from "../auth-modal";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <Header />
      {children}
      <AuthModal />
    </HeroUIProvider>
  );
}
