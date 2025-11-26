"use client";
import { HeroUIProvider } from "@heroui/react";
import { useState } from "react";
import Header from "./header";
import AuthModal from "../auth-modal";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  return (
    <HeroUIProvider>
      <Header onAuth={(mode = "login") => {
        setAuthMode(mode);
        setAuthOpen(true);
      }} />
      {children}
      <AuthModal
        open={authOpen}
        mode={authMode}
        onModeChange={setAuthMode}
        onClose={() => setAuthOpen(false)}
      />
    </HeroUIProvider>
  );
}
