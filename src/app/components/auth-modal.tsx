"use client";

import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tabs, Tab } from "@heroui/react";
import { useEffect, useState, useTransition } from "react";

type AuthMode = "login" | "register";

type Props = {
  onSuccess?: (data: { mode: AuthMode; user?: { id: number; email: string; name?: string | null } }) => void;
};

export default function AuthModal({ onSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("demo@devbasics.ai");
  const [password, setPassword] = useState("demo1234");
  const [name, setName] = useState("Demo User");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const handler = (e: CustomEvent<{ mode?: AuthMode }>) => {
      if (e.detail?.mode) setMode(e.detail.mode);
      setOpen(true);
    };
    window.addEventListener("devbasics:auth", handler as EventListener);
    return () => window.removeEventListener("devbasics:auth", handler as EventListener);
  }, []);

  const handleSubmit = () => {
    setStatus(null);
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch(`/api/auth/${mode === "login" ? "login" : "register"}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || "Не удалось выполнить запрос");
        setStatus(json.message || "Готово");
        onSuccess?.({ mode, user: json.user });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка");
      }
    });
  };

  return (
    <Modal isOpen={open} onOpenChange={setOpen} size="lg" backdrop="blur" placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {mode === "login" ? "Вход" : "Регистрация"}
              <p className="text-sm text-zinc-500">Прямая запись в PostgreSQL через Prisma</p>
            </ModalHeader>
            <ModalBody className="space-y-3">
              <Tabs
                selectedKey={mode}
                onSelectionChange={(key) => setMode(key as AuthMode)}
                variant="bordered"
                color="primary"
              >
                <Tab key="login" title="Войти" />
                <Tab key="register" title="Создать аккаунт" />
              </Tabs>
              {mode === "register" && (
                <Input label="Имя" placeholder="Как к вам обращаться" value={name} onChange={(e) => setName(e.target.value)} />
              )}
              <Input
                label="Email"
                placeholder="you@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Пароль"
                placeholder="Минимум 6 символов"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-zinc-500">
                Пароли хэшируются через scrypt и хранятся в таблице `User`. Подключите `DATABASE_URL` и запустите миграцию Prisma
                перед деплоем.
              </p>
              {status && <p className="text-sm font-semibold text-emerald-400">{status}</p>}
              {error && <p className="text-sm font-semibold text-rose-400">{error}</p>}
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={() => onClose()}>Закрыть</Button>
              <Button color="primary" onPress={handleSubmit} isDisabled={pending}>
                {pending ? "Отправляем..." : mode === "login" ? "Войти" : "Создать"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
