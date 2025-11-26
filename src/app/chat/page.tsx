"use client";
import { Button, Card, CardBody, CardHeader, Chip, Textarea } from "@heroui/react";
import { useState, useTransition } from "react";

type Message = { role: "user" | "assistant"; content: string };

const starterMessages: Message[] = [
  { role: "assistant", content: "Привет! Я помню, что ты выбрал направление IT / Data и ценишь креативность." },
  { role: "assistant", content: "Хочешь углубиться в ML или посмотреть альтернативы в продукте?" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(starterMessages);
  const [input, setInput] = useState("");
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const nextMessages = [...messages, { role: "user", content: input } as Message];
    setMessages(nextMessages);
    setInput("");
  };

  const saveChat = () => {
    setStatus(null);
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: messages, summary: "Сессия сохранена локально" }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || "Не удалось сохранить чат");
        setStatus(`Чат #${json.chat.id} сохранён`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-5 pb-16 pt-14">
        <header className="space-y-2">
          <p className="text-sm uppercase text-zinc-400">Этап 3 — чат</p>
          <h1 className="text-4xl font-bold">Диалог с ИИ</h1>
          <p className="text-lg text-zinc-300">Пример UI, который можно подключить к LLM. Сообщения сохраняются в ChatSession через Prisma.</p>
        </header>

        <Card shadow="sm" className="border border-white/10 bg-white/5">
          <CardHeader className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300">Связка с результатами теста</p>
              <p className="text-lg font-semibold text-white">История сообщений</p>
            </div>
            <Chip color="secondary" variant="flat">
              Live
            </Chip>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-3 rounded-xl border border-white/10 bg-black/30 p-4">
              {messages.map((msg, idx) => (
                <div key={idx} className="space-y-1 rounded-lg bg-white/5 p-3">
                  <p className="text-xs uppercase tracking-wide text-zinc-400">{msg.role === "assistant" ? "Ассистент" : "Вы"}</p>
                  <p className="text-sm text-white">{msg.content}</p>
                </div>
              ))}
            </div>
            <Textarea
              label="Сообщение"
              placeholder="Спроси про карьерный путь, навыки или альтернативы"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex flex-wrap gap-3">
              <Button color="primary" onPress={handleSend} isDisabled={pending}>
                Отправить
              </Button>
              <Button variant="bordered" color="secondary" onPress={saveChat} isDisabled={pending}>
                Сохранить переписку
              </Button>
            </div>
            {status && <p className="text-sm font-semibold text-emerald-400">{status}</p>}
            {error && <p className="text-sm font-semibold text-rose-400">{error}</p>}
          </CardBody>
        </Card>

        <Card shadow="sm" className="border border-white/10 bg-white/5">
          <CardHeader className="text-lg font-semibold text-white">Тонкости UX</CardHeader>
          <CardBody className="space-y-2 text-sm text-zinc-300">
            <p>Чат стартует с контекста последнего теста. Кнопки для мини-тестов и уточнений можно добавить в этом блоке.</p>
            <p>Экспорт переписки или связь с конкретной оценкой — через поле assessmentId при вызове API.</p>
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
