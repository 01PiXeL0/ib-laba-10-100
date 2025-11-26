"use client";
import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";

const highlights = [
  "Три экрана: вход → тест → чат с ИИ",
  "Призма данных: Postgres + Prisma Client",
  "Готовый список вопросов и ролей",
  "UX с модальным входом и CTA",
];

const flows = [
  { title: "1) Вход", body: "Email + пароль, scrypt-хэш, запись в таблицу User." },
  {
    title: "2) Тест",
    body: "Скринер, ценности, свободный ввод и snapshot фичей. Сохраняется в Assessment через API /api/assessments.",
  },
  { title: "3) Чат", body: "История обменов сохраняется в ChatSession, можно привязать assessment_id." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      <main className="mx-auto flex max-w-5xl flex-col gap-14 px-5 pb-20 pt-16">
        <section className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]" id="hero">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Chip color="primary" variant="flat" size="sm">Prisma-ready</Chip>
              <Chip color="secondary" variant="flat" size="sm">LLM-friendly</Chip>
              <Chip color="default" variant="flat" size="sm">Multi-step UX</Chip>
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              DEVBASICS Career OS: профориентация с Prisma и отдельными этапами
            </h1>
            <p className="text-lg text-zinc-300">
              Готовый продукт: модальный вход, отдельная страница теста, отдельный чат. Данные хранятся в Postgres через Prisma, а UI
              подчёркивает процесс от регистрации до диалога с ИИ.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                color="primary"
                size="lg"
                onPress={() => window.dispatchEvent(new CustomEvent("devbasics:auth", { detail: { mode: "register" } }))}
              >
                Создать аккаунт
              </Button>
              <Button as="a" href="/assessment" size="lg" variant="bordered" color="secondary">
                Перейти к тесту
              </Button>
              <Button as="a" href="/chat" size="lg" variant="light">
                Открыть чат
              </Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Card shadow="sm" className="border border-white/10 bg-white/5">
            <CardHeader className="text-lg font-semibold text-white">Маршрут пользователя</CardHeader>
            <CardBody className="space-y-3 text-sm text-zinc-200">
              {flows.map((flow) => (
                <div key={flow.title} className="rounded-xl border border-white/10 bg-black/30 px-4 py-3">
                  <p className="text-white">{flow.title}</p>
                  <p className="text-zinc-300">{flow.body}</p>
                </div>
              ))}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-100">
                После входа можно хранить результаты теста и чаты в базе. Маршруты API вынесены отдельно, чтобы UI был чистым и
                адаптивным.
              </div>
            </CardBody>
          </Card>
        </section>

        <section className="space-y-4" id="guide">
          <h2 className="text-3xl font-bold">Что включено</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card shadow="sm" className="border border-white/10 bg-white/5">
              <CardHeader className="text-lg font-semibold text-white">Аутентификация</CardHeader>
              <CardBody className="space-y-2 text-sm text-zinc-300">
                <p>Модальное окно с переключением режима. Хэширование scrypt без сторонних пакетов.</p>
                <p>API: POST /api/auth/register, POST /api/auth/login.</p>
              </CardBody>
            </Card>
            <Card shadow="sm" className="border border-white/10 bg-white/5">
              <CardHeader className="text-lg font-semibold text-white">Тест</CardHeader>
              <CardBody className="space-y-2 text-sm text-zinc-300">
                <p>Отдельная страница для скринера, ценностей, свободного ввода.</p>
                <p>Сохранение в таблицу Assessment через Prisma.</p>
              </CardBody>
            </Card>
            <Card shadow="sm" className="border border-white/10 bg-white/5">
              <CardHeader className="text-lg font-semibold text-white">Чат</CardHeader>
              <CardBody className="space-y-2 text-sm text-zinc-300">
                <p>Поток сообщений с фиксацией в ChatSession.</p>
                <p>Готовность подключить LLM для генерации ответов.</p>
              </CardBody>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
