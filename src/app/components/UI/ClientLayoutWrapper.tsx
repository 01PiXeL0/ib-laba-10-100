"use client";
import { HeroUIProvider } from "@heroui/react";
import Header from "./header";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <Header />
      {children}
    </HeroUIProvider>
  );
}
