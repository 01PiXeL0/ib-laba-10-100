"use client";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Button, Card, CardBody, CardHeader, Chip } from "@heroui/react";

// ⬇️ ЗАГЛУШКИ (если эти данные импортируются из других файлов — удали эти блоки)
const quickScreen: string[] = ["Интерес к данным", "Командная работа", "Удалёнка"];
const deepDive: string[] = ["Алгоритмы", "SQL", "ML"];
const steps = [
  { title: "Сбор", text: "Собираем входные данные" },
  { title: "Анализ", text: "Считаем признаки" },
  { title: "Сопоставление", text: "Матчим профессии" },
  { title: "Рекомендация", text: "Выдаём топ" },
];
const professions = [
  { title: "Data Analyst", score: "92%", reasons: ["SQL", "Python"], steps: "SQL → Python → BI" },
  { title: "ML Engineer", score: "88%", reasons: ["ML", "Данные"], steps: "Python → ML → DL" },
];
const dataModel = [
  { title: "User", detail: "Профиль" },
  { title: "Assessment", detail: "Результаты теста" },
  { title: "ChatSession", detail: "История чата" },
];
const adminFeatures = ["Правки вопросов", "A/B тесты", "Статистика"];

function scoreRoles(_: string[], __: Record<string, number>) {
  return [];
}
// ⬆️ КОНЕЦ ЗАГЛУШЕК

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
  const [profile, setProfile] = useState({ name: "", email: "", ageGroup: "", location: "", education: "" });
  const [selectedAreas, setSelectedAreas] = useState<string[]>(["IT / Data / AI"]);
  const [workFocus, setWorkFocus] = useState("данные");
  const [workStyle, setWorkStyle] = useState("удалённо");
  const [studyDepth, setStudyDepth] = useState("быстрый старт (курсы)");
  const [values, setValues] = useState<Record<string, number>>({
    autonomy: 60,
    stability: 55,
    impact: 65,
    income: 65,
    creativity: 75,
  });
  const [skills, setSkills] = useState("Python, SQL, Figma, преподавание");
  const [learningPlan, setLearningPlan] = useState("SQL → Python/LLM → портфолио");
  const [constraints, setConstraints] = useState("Город, гибкий график, без ночных смен");
  const [freeText, setFreeText] = useState("Люблю исследовать данные и делать понятные продукты");
  const [resultStatus, setResultStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [, setAuthOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("demo@devbasics.ai");
  const [authPassword, setAuthPassword] = useState("secure-demo-pass");
  const [authName, setAuthName] = useState("Demo User");
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [, startAuthTransition] = useTransition();

  useEffect(() => {
    const openHandler = () => setAuthOpen(true);
    window.addEventListener("devbasics:open-auth", openHandler);
    return () => window.removeEventListener("devbasics:open-auth", openHandler);
  }, []);

  useMemo(() => scoreRoles(selectedAreas, values), [selectedAreas, values]);

  const featureSnapshot = useMemo(
    () => ({
      data_affinity: workFocus === "данные" ? 1 : 0.6,
      people_focus: workFocus === "люди" ? 1 : 0.4,
      maker_mindset: workFocus === "оборудование" ? 0.9 : 0.5,
      autonomy: values.autonomy / 100,
      stability: values.stability / 100,
      creativity: values.creativity / 100,
      impact: values.impact / 100,
      income: values.income / 100,
    }),
    [values, workFocus],
  );

  const handleSubmit = () => {
    setResultStatus(null);
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile,
            screening: { areas: selectedAreas, workFocus, workStyle, studyDepth, constraints },
            motivations: {
              values,
              freeText,
              skills: skills.split(",").map((i) => i.trim()).filter(Boolean),
              learningPlan: learningPlan.split("→").map((i) => i.trim()).filter(Boolean),
            },
            featureSnapshot,
          }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || "Не удалось сохранить сессию");
        setResultStatus("Сессия сохранена и готова к продолжению диалога");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка");
      }
    });
  };

  const handleAuth = () => {
    setAuthStatus(null);
    setAuthError(null);
    startAuthTransition(async () => {
      try {
        const response = await fetch(`/api/auth/${authMode === "register" ? "register" : "login"}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: authEmail, password: authPassword, name: authName }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || "Не удалось обработать запрос");
        setAuthStatus(json.message || "Готово");
      } catch (err) {
        setAuthError(err instanceof Error ? err.message : "Ошибка");
      }
    });
  };

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
              Модальный вход, тест и чат с ИИ. Данные — в PostgreSQL через Prisma.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button color="primary" size="lg" onPress={() => handleAuth()}>
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
            </CardBody>
          </Card>
        </section>

        {error && <p className="text-red-400">{error}</p>}
        {resultStatus && <p className="text-emerald-400">{resultStatus}</p>}
      </main>

      {/* ВТОРАЯ СЕКЦИЯ */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-white via-white/70 to-zinc-100 dark:from-black dark:via-zinc-900 dark:to-black">
        <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-20 sm:pt-28">
          <section className="space-y-8">
            <h2 className="text-2xl font-semibold">Примеры рекомендаций</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {professions.map((item) => (
                <Card key={item.title} shadow="sm">
                  <CardBody className="space-y-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm">{item.steps}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
