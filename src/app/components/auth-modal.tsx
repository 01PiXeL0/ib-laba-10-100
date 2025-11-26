"use client";

import { Button, Input, Tabs, Tab } from "@heroui/react";
import { useEffect, useState, useTransition } from "react";

type AuthMode = "login" | "register";

type Props = {
  open: boolean;
  mode: AuthMode;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
  onSuccess?: (data: { mode: AuthMode; user?: { id: number; email: string; name?: string | null } }) => void;
};

export default function AuthModal({ open, mode, onClose, onModeChange, onSuccess }: Props) {
  const [email, setEmail] = useState("demo@devbasics.ai");
  const [password, setPassword] = useState("demo1234");
  const [name, setName] = useState("Demo User");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!open) {
      setStatus(null);
      setError(null);
    }
  }, [open]);

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
    open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl shadow-blue-900/40">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div className="flex flex-col">
              <span className="text-lg font-semibold">{mode === "login" ? "Вход" : "Регистрация"}</span>
              <span className="text-sm text-zinc-400">Прямая запись в PostgreSQL через Prisma</span>
            </div>
            <Button variant="light" onPress={onClose} size="sm">
              Закрыть
            </Button>
          </div>

          <div className="flex flex-col gap-4 px-6 py-5">
            <Tabs
              selectedKey={mode}
              onSelectionChange={(key) => onModeChange(key as AuthMode)}
              variant="bordered"
              color="primary"
              aria-label="Выбор режима авторизации"
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

            <p className="text-xs text-zinc-400">
              Пароли хэшируются через scrypt и хранятся в таблице `User`. Подключите `DATABASE_URL` и запустите миграцию Prisma перед деплоем.
            </p>

            {status && <p className="text-sm font-semibold text-emerald-400">{status}</p>}
            {error && <p className="text-sm font-semibold text-rose-400">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
            <Button variant="light" onPress={onClose}>
              Закрыть
            </Button>
            <Button color="primary" onPress={handleSubmit} isDisabled={pending}>
              {pending ? "Отправляем..." : mode === "login" ? "Войти" : "Создать"}
            </Button>
          </div>
        </div>
      </div>
    )
  );
}
