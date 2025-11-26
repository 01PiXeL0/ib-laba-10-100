"use client";
import { HeroUIProvider } from "@heroui/react";
import { useEffect, useState } from "react";
import Header from "./header";
import AuthModal from "../auth-modal";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  useEffect(() => {
    const handleAuthEvent = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: "login" | "register" }>).detail;
      setAuthMode(detail?.mode ?? "login");
      setAuthOpen(true);
    };

    window.addEventListener("devbasics:auth", handleAuthEvent);
    return () => window.removeEventListener("devbasics:auth", handleAuthEvent);
  }, []);

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
