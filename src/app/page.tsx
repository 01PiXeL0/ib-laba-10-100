"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Slider,
  Textarea,
} from "@heroui/react";
import { useEffect, useMemo, useState, useTransition } from "react";

const areas = [
  "IT / Data / AI",
  "Медицина / Биотех",
  "Экономика / Бизнес / Финансы",
  "Инжиниринг / Производство",
  "Креатив / Контент",
  "Образование / Социальные",
  "Экология / Энергетика",
  "Новые роли (AI Ethics, XR, Prompt)",
];

const screeningQuestions = [
  "Какой формат работы: офис / гибрид / удалённо / полевой?",
  "В чём сильнее интерес: люди, данные, оборудование, идеи?",
  "Готовность к длительной учёбе или быстрому старту?",
  "Насколько важна стабильность vs креативность?",
  "Готовность к частому общению с людьми?",
  "Ограничения: физические, география, график?",
];

const deepQuestions = [
  "Что приносит наибольшее удовлетворение в работе?",
  "Как реагируете на ошибки в проекте?",
  "Предпочтения: довести до идеала или выпускать MVP?",
  "Как объясните сложную тему не-специалисту?",
  "Готовность к риску и смене направлений?",
  "Чему хотите научиться в ближайшие месяцы?",
];

const situationalCases = [
  "Два дня на прототип — какой минимальный результат сделаете?",
  "Конфликт менеджера и разработчика — что предпримете?",
  "Срыв дедлайна — как пересоберёте план?",
  "Точность vs скорость vs креативность — что выберете?",
];

const valueKeys = [
  { key: "autonomy", label: "Независимость" },
  { key: "stability", label: "Стабильность" },
  { key: "impact", label: "Общественная польза" },
  { key: "income", label: "Высокий доход" },
  { key: "creativity", label: "Креативность" },
];

const roleCatalog = [
  {
    id: "data-scientist",
    title: "Data Scientist / ML Engineer",
    area: "IT / Data / AI",
    weights: { autonomy: 0.3, stability: 0.3, impact: 0.2, income: 0.4, creativity: 0.35 },
    skills: ["Python/SQL", "ML", "MLOps"],
    why: "Интерес к данным, аналитика, готовность к системной учёбе",
  },
  {
    id: "ux-designer",
    title: "UX/UI Дизайнер",
    area: "Креатив / Контент",
    weights: { autonomy: 0.35, stability: 0.25, impact: 0.25, income: 0.3, creativity: 0.55 },
    skills: ["Figma", "UX-исследования", "UI-киты"],
    why: "Креативность и работа с пользовательскими сценариями",
  },
  {
    id: "sre",
    title: "Site Reliability Engineer",
    area: "IT / Data / AI",
    weights: { autonomy: 0.25, stability: 0.5, impact: 0.25, income: 0.45, creativity: 0.15 },
    skills: ["Observability", "SRE практики", "Cloud"],
    why: "Ответственность за доступность и устойчивость сервисов",
  },
  {
    id: "ai-product",
    title: "AI Product Manager",
    area: "IT / Data / AI",
    weights: { autonomy: 0.4, stability: 0.3, impact: 0.35, income: 0.4, creativity: 0.35 },
    skills: ["Discovery", "LLM UX", "Метрики"],
    why: "Связка бизнеса и AI, умение объяснять сложное",
  },
  {
    id: "med-bio",
    title: "Медицинский биоинформатик",
    area: "Медицина / Биотех",
    weights: { autonomy: 0.25, stability: 0.35, impact: 0.45, income: 0.35, creativity: 0.2 },
    skills: ["Omics", "Python", "Клинические данные"],
    why: "Сильный общественный импакт и аналитика",
  },
  {
    id: "renewable",
    title: "Инженер по возобновляемой энергии",
    area: "Экология / Энергетика",
    weights: { autonomy: 0.3, stability: 0.35, impact: 0.55, income: 0.35, creativity: 0.25 },
    skills: ["CAD/SCADA", "Полевые работы", "Проектирование"],
    why: "Фокус на устойчивом развитии и инженерии",
  },
  {
    id: "ed-designer",
    title: "Instructional Designer",
    area: "Образование / Социальные",
    weights: { autonomy: 0.4, stability: 0.35, impact: 0.5, income: 0.25, creativity: 0.4 },
    skills: ["Методология", "LMS", "Оценка прогресса"],
    why: "Готовность учить других и строить программы",
  },
  {
    id: "prompt-engineer",
    title: "Prompt Engineer / LLM Ops",
    area: "Новые роли (AI Ethics, XR, Prompt)",
    weights: { autonomy: 0.45, stability: 0.25, impact: 0.3, income: 0.4, creativity: 0.45 },
    skills: ["LLM", "Векторный поиск", "Оценка качества"],
    why: "Быстрые эксперименты с AI и построение пайплайнов",
  },
];

function scoreRoles(selectedAreas: string[], values: Record<string, number>) {
  return roleCatalog
    .filter((role) => selectedAreas.length === 0 || selectedAreas.includes(role.area))
    .map((role) => {
      const score = Object.entries(role.weights).reduce((acc, [key, weight]) => {
        const userScore = values[key] ?? 0;
        return acc + userScore * weight;
      }, 0);

      return { ...role, score: Math.min(100, Math.round((score / 6) * 100)) };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

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
  const [isPending, startTransition] = useTransition();
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [isAuthOpen, setAuthOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("demo@devbasics.ai");
  const [authPassword, setAuthPassword] = useState("secure-demo-pass");
  const [authName, setAuthName] = useState("Demo User");
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthPending, startAuthTransition] = useTransition();

  useEffect(() => {
    const openHandler = () => setAuthOpen(true);
    if (typeof window !== "undefined") {
      window.addEventListener("devbasics:open-auth", openHandler);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("devbasics:open-auth", openHandler);
      }
    };
  }, []);

  const recommendations = useMemo(() => scoreRoles(selectedAreas, values), [selectedAreas, values]);

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
              skills: skills
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
              learningPlan: learningPlan
                .split("→")
                .map((item) => item.trim())
                .filter(Boolean),
            },
            featureSnapshot,
          }),
        });

        const json = await response.json();
        if (!response.ok) {
          throw new Error(json.error || "Не удалось сохранить сессию");
        }

        setResultStatus("Сессия сохранена в Supabase и готова к продолжению диалога");
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
        if (!response.ok) {
          throw new Error(json.error || "Не удалось обработать запрос");
        }
        setAuthStatus(json.message || "Готово");
      } catch (err) {
        setAuthError(err instanceof Error ? err.message : "Ошибка");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#0b1222] to-black text-zinc-50">
      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-5 pb-20 pt-14 sm:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.2fr,0.8fr]" id="workspace">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Chip color="secondary" variant="flat" size="sm">
                Persistent AI guidance
              </Chip>
              <Chip color="primary" variant="flat" size="sm">
                Supabase + pgvector
              </Chip>
              <Chip color="default" variant="flat" size="sm">
                LLM-ready UX
              </Chip>
            </div>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Профориентация с диалогом, памятью и гибридным скорингом
            </h1>
            <p className="text-lg text-zinc-300">
              Живой интерфейс, который собирает профиль, вычисляет рекомендации и отправляет сессию в Supabase. Готов к
              подключению LLM и вашим правилам без лишних инструкций на экране.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button color="primary" size="lg" onPress={handleSubmit} isDisabled={isPending}>
                {isPending ? "Сохраняем..." : "Сохранить сессию"}
              </Button>
              <Button variant="bordered" color="secondary" size="lg" href="#dialog" as="a">
                Посмотреть сценарий диалога
              </Button>
              <Button variant="light" size="lg" href="mailto:team@devbasics.ai" as="a">
                Связаться
              </Button>
            </div>
            {resultStatus && <p className="text-sm font-semibold text-emerald-400">{resultStatus}</p>}
            {error && <p className="text-sm font-semibold text-rose-400">{error}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              {["Объяснимые рекомендации", "Сквозная история ответов", "RLS-политики по умолчанию", "Экспорт в CSV/PDF"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 shadow-inner"
                  >
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>

          <Card shadow="sm" className="border border-white/10 bg-white/5">
            <CardHeader className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-300">Рекомендации по текущему профилю</p>
                <p className="text-lg font-semibold text-white">Топ профессий</p>
              </div>
              <Chip variant="flat" color="primary">
                Live
              </Chip>
            </CardHeader>
            <CardBody className="space-y-3">
              {recommendations.map((item) => (
                <Card key={item.id} className="border border-white/10 bg-zinc-900">
                  <CardBody className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-wide text-zinc-400">{item.area}</p>
                        <p className="text-lg font-semibold text-white">{item.title}</p>
                      </div>
                      <Chip color="secondary" variant="flat">
                        {item.score}%
                      </Chip>
                    </div>
                    <p className="text-sm text-zinc-300">{item.why}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.skills.map((skill) => (
                        <Chip key={skill} size="sm" variant="flat" color="default">
                          {skill}
                        </Chip>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              ))}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                Счёт формируется на основе ценностей, выбранных областей и фокуса работы. Свободный ввод усиливает подбор через
                векторное сопоставление.
              </div>
            </CardBody>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr,1.1fr]" id="account">
          <div className="space-y-4">
            <Chip color="primary" variant="flat" size="sm">
              Доступ и база
            </Chip>
            <h2 className="text-3xl font-bold leading-tight">Регистрация, вход и выбор базы данных</h2>
            <p className="text-zinc-300">
              Авторизация на Supabase запускает готовые политики RLS и привязывает сессии к пользователю. Рекомендуем
              держать продакшн в <span className="font-semibold text-white">Supabase (PostgreSQL + pgvector)</span> для
              векторов и правил. Лёгкий альтернативный вариант — управляемый Postgres в Neon или Railway, если хотите
              отделить хранение от аутентификации.
            </p>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-200">
              <p className="font-semibold text-white">Мини-дашборд подключений</p>
              <ul className="mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />Supabase REST и Auth — включены
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />pgvector для эмбеддингов — примените миграцию из supabase/schema.sql
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />Neon/Railway — можно использовать как внешний Postgres, сменив ENV
                </li>
              </ul>
            </div>
          </div>

          <Card shadow="sm" className="border border-white/10 bg-white/5">
            <CardHeader className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-zinc-300">Безопасный вход</p>
                <p className="text-lg font-semibold text-white">Email + пароль</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={authMode === "register" ? "solid" : "bordered"}
                  color="secondary"
                  onPress={() => {
                    setAuthMode("register");
                    setAuthOpen(true);
                  }}
                >
                  Регистрация
                </Button>
                <Button
                  size="sm"
                  variant={authMode === "login" ? "solid" : "bordered"}
                  color="primary"
                  onPress={() => {
                    setAuthMode("login");
                    setAuthOpen(true);
                  }}
                >
                  Вход
                </Button>
              </div>
            </CardHeader>
            <CardBody className="space-y-3 text-sm text-zinc-200">
                <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white">
                  Модальное окно открывается из хедера или отсюда; все запросы идут на `/api/auth/register` и
                  `/api/auth/login`, а затем проксируются в Supabase Auth. Сервисный ключ хранится только на сервере,
                  клиент использует публичный anon key.
                </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">Email → Supabase Auth</div>
                <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">Password → RLS сессии</div>
                <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">Service role → серверные вызовы</div>
                <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">Anon → клиентские сохранения</div>
              </div>
              <Button color="primary" size="md" onPress={() => setAuthOpen(true)}>
                Открыть модальное окно входа
              </Button>
            </CardBody>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.25fr,0.75fr]" id="builder">
          <Card shadow="sm" className="border border-white/10 bg-white/5">
            <CardHeader className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-zinc-300">Рабочее место</p>
                <p className="text-lg font-semibold text-white">Профиль и скринер</p>
              </div>
              <Chip variant="flat" color="secondary">
                Client-ready
              </Chip>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Имя"
                  placeholder="Анна"
                  value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                />
                <Input
                  label="Email"
                  placeholder="user@mail.com"
                  value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                />
                <Input
                  label="Уровень / возраст"
                  placeholder="Студент, Middle, Senior"
                  value={profile.ageGroup}
                  onChange={(e) => setProfile((p) => ({ ...p, ageGroup: e.target.value }))}
                />
                <Input
                  label="Локация"
                  placeholder="Москва / remote"
                  value={profile.location}
                  onChange={(e) => setProfile((p) => ({ ...p, location: e.target.value }))}
                />
                <Input
                  label="Образование"
                  placeholder="Бакалавр, курсы, самоучка"
                  value={profile.education}
                  onChange={(e) => setProfile((p) => ({ ...p, education: e.target.value }))}
                />
              </div>

              <CheckboxGroup
                label="Области интересов"
                value={selectedAreas}
                onChange={(value) => setSelectedAreas(value as string[])}
                classNames={{ label: "text-sm font-semibold" }}
              >
                <div className="grid gap-2 sm:grid-cols-2">
                  {areas.map((area) => (
                    <Checkbox key={area} value={area} className="text-sm">
                      {area}
                    </Checkbox>
                  ))}
                </div>
              </CheckboxGroup>

              <div className="grid gap-4 lg:grid-cols-3">
                <RadioGroup
                  label="Фокус"
                  value={workFocus}
                  onValueChange={setWorkFocus}
                  orientation="vertical"
                  classNames={{ label: "text-sm font-semibold" }}
                >
                  <Radio value="данные">Данные</Radio>
                  <Radio value="люди">Люди/команда</Radio>
                  <Radio value="оборудование">Оборудование</Radio>
                  <Radio value="идеи">Идеи/продукты</Radio>
                </RadioGroup>

                <RadioGroup
                  label="Формат работы"
                  value={workStyle}
                  onValueChange={setWorkStyle}
                  orientation="vertical"
                  classNames={{ label: "text-sm font-semibold" }}
                >
                  <Radio value="офис">Офис</Radio>
                  <Radio value="гибрид">Гибрид</Radio>
                  <Radio value="удалённо">Удалённо</Radio>
                  <Radio value="полевой">Полевой</Radio>
                </RadioGroup>

                <RadioGroup
                  label="Учёба"
                  value={studyDepth}
                  onValueChange={setStudyDepth}
                  orientation="vertical"
                  classNames={{ label: "text-sm font-semibold" }}
                >
                  <Radio value="быстрый старт (курсы)">Быстрый старт</Radio>
                  <Radio value="2-3 года обучения">2-3 года</Radio>
                  <Radio value="5+ лет и резидентура">5+ лет</Radio>
                </RadioGroup>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Textarea
                  label="Ограничения и условия"
                  minRows={2}
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                />
                <Textarea
                  label="Свободный ввод"
                  minRows={2}
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Textarea
                  label="Навыки / опыт"
                  minRows={2}
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
                <Textarea
                  label="План изучения (→ разделитель)"
                  minRows={2}
                  value={learningPlan}
                  onChange={(e) => setLearningPlan(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-zinc-200">Ценности и мотивация</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {valueKeys.map((item) => (
                    <div key={item.key} className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center justify-between text-sm font-semibold text-zinc-100">
                        <span>{item.label}</span>
                        <Chip size="sm" variant="flat" color="secondary">
                          {values[item.key]}
                        </Chip>
                      </div>
                      <Slider
                        value={values[item.key]}
                        onChange={(val) =>
                          setValues((prev) => ({
                            ...prev,
                            [item.key]: Array.isArray(val) ? val[0] : (val as number),
                          }))
                        }
                        minValue={0}
                        maxValue={100}
                        step={5}
                        aria-label={item.label}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          <div className="space-y-4">
            <Card shadow="sm" className="border border-white/10 bg-white/5">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-300">Признаки сессии</p>
                  <p className="text-lg font-semibold text-white">Snapshot</p>
                </div>
                <Chip variant="flat" color="primary">
                  Обновляется
                </Chip>
              </CardHeader>
              <CardBody className="space-y-3 text-sm text-zinc-200">
                <div className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(featureSnapshot).map(([key, val]) => (
                    <div key={key} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                      <p className="text-xs uppercase tracking-wide text-zinc-400">{key}</p>
                      <p className="text-sm font-semibold text-white">{val.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-100">
                  Готово для передачи в скоринг: правила, весовая модель и векторное сопоставление свободного ввода.
                </div>
              </CardBody>
            </Card>

            <Card shadow="sm" className="border border-white/10 bg-white/5">
              <CardHeader className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-zinc-300">Текущий статус</p>
                  <p className="text-lg font-semibold text-white">Сигналы</p>
                </div>
                <Chip variant="flat" color="secondary">
                  QA-ready
                </Chip>
              </CardHeader>
              <CardBody className="grid gap-3 text-sm text-zinc-200 sm:grid-cols-2">
                {["RLS на таблицах", "Anon insert sessions/answers", "Admin REST для jobs/rules/questions", "Готово к A/B верси", "Проверка валидности payload"].map(
                  (item) => (
                    <div key={item} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                      {item}
                    </div>
                  ),
                )}
              </CardBody>
            </Card>
          </div>
        </section>

        <section className="space-y-6" id="dialog">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-white">Диалоговый сценарий</h2>
            <p className="text-zinc-300">
              Набор блоков для живого общения с пользователем: короткий скринер, глубина по выбранным направлениям, ситуации и
              ценности. Без технических подсказок — только содержание для реального интервью.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card shadow="sm" className="border border-white/10 bg-white/5">
              <CardHeader className="text-lg font-semibold text-white">Скринер</CardHeader>
              <CardBody className="space-y-2 text-sm text-zinc-200">
                {screeningQuestions.map((q) => (
                  <div key={q} className="rounded-lg bg-indigo-500/10 p-2 text-indigo-50 ring-1 ring-indigo-500/30">
                    {q}
                  </div>
                ))}
              </CardBody>
            </Card>
            <Card shadow="sm" className="border border-white/10 bg-white/5">
              <CardHeader className="text-lg font-semibold text-white">Углубление</CardHeader>
              <CardBody className="space-y-2 text-sm text-zinc-200">
                {deepQuestions.map((q) => (
                  <div key={q} className="rounded-lg bg-emerald-500/10 p-2 text-emerald-50 ring-1 ring-emerald-500/30">
                    {q}
                  </div>
                ))}
              </CardBody>
            </Card>
            <Card shadow="sm" className="border border-white/10 bg-white/5">
              <CardHeader className="text-lg font-semibold text-white">Ситуации</CardHeader>
              <CardBody className="space-y-2 text-sm text-zinc-200">
                {situationalCases.map((q) => (
                  <div key={q} className="rounded-lg bg-amber-500/10 p-2 text-amber-50 ring-1 ring-amber-500/30">
                    {q}
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
          <Card shadow="sm" className="border border-white/10 bg-white/5">
            <CardBody className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <p className="font-semibold text-emerald-300">Контекст хранится в сессии</p>
                <p className="text-sm text-zinc-200">
                  История вопросов, ответы, эмбеддинги и признаки обновляются по мере диалога. Повторные вопросы исключаются,
                  а уточнения строятся на сохранённом профиле.
                </p>
              </div>
              <Button color="primary" variant="flat" as="a" href="#engine">
                К механике расчёта
              </Button>
            </CardBody>
          </Card>
        </section>

        <section className="space-y-6" id="engine">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-white">Гибридный скоринг</h2>
            <p className="text-zinc-300">Правила, веса и эмбеддинги работают вместе — с объяснимыми причинами выбора.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card shadow="sm" className="border border-white/10 bg-white/5">
              <CardHeader className="text-lg font-semibold text-white">Формула</CardHeader>
              <CardBody className="space-y-3 text-sm text-zinc-200">
                <div className="rounded-lg bg-zinc-950 px-4 py-3 font-mono text-emerald-200 ring-1 ring-zinc-800">
                  score = α * rule_score + β * embedding_match + γ * llm_boost (α+β+γ=1)
                </div>
                <ul className="list-disc space-y-2 pl-4 text-zinc-200">
                  <li>Hard-фильтры отсекают профессии по ограничениям и обязательным признакам.</li>
                  <li>Весовая модель считает совпадение по ценностям, фокусу, навыкам.</li>
                  <li>Эмбеддинги усиливают свободный ввод и описания профессий.</li>
                  <li>LLM добавляет альтернативы и объяснения с отсылкой к ответам.</li>
                </ul>
              </CardBody>
            </Card>
            <Card shadow="sm" className="border border-white/10 bg-white/5">
              <CardHeader className="text-lg font-semibold text-white">Правила в действии</CardHeader>
              <CardBody className="space-y-2 text-sm text-zinc-200">
                <div className="rounded-lg bg-indigo-500/10 p-3 ring-1 ring-indigo-500/30">
                  IF interest_data ≥ 0.7 AND math ≥ 0.6 THEN +0.25 к Data Scientist
                </div>
                <div className="rounded-lg bg-emerald-500/10 p-3 ring-1 ring-emerald-500/30">
                  IF prefers_people ≥ 0.7 AND creative ≥ 0.6 THEN +0.2 к Marketing/Content
                </div>
                <div className="rounded-lg bg-rose-500/10 p-3 ring-1 ring-rose-500/30">
                  IF not_ready_for_long_study THEN exclude Clinical doctor / Surgeon
                </div>
              </CardBody>
            </Card>
          </div>
          <Card shadow="sm" className="border border-white/10 bg-white/5">
            <CardBody className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Chip color="secondary" variant="flat">
                  Объяснение под рукой
                </Chip>
                <p className="text-sm text-zinc-200">
                  Каждая рекомендация сопровождается причинами и шагами развития. Пользователь может уточнить ответы или пройти
                  дополнительный мини-тест.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {recommendations.map((item) => (
                  <Card key={item.id} className="border border-white/10 bg-black/40">
                    <CardBody className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                        <Chip color="secondary" size="sm" variant="flat">
                          {item.score}%
                        </Chip>
                      </div>
                      <p className="text-xs uppercase tracking-wide text-zinc-400">{item.area}</p>
                      <p className="text-sm text-zinc-200">{item.why}</p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </CardBody>
          </Card>
        </section>

        <section className="space-y-6" id="data">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-white">Хранилище и админ-панель</h2>
            <p className="text-zinc-300">Supabase хранит сессии, ответы, правила и профили. Админка контролирует базу знаний и качество.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card shadow="sm" className="border border-white/10 bg-white/5">
              <CardHeader className="text-lg font-semibold text-white">Таблицы</CardHeader>
              <CardBody className="space-y-2 text-sm text-zinc-200">
                <ul className="list-disc space-y-2 pl-4">
                  <li>users — базовый профиль.</li>
                  <li>sessions — скринер, мотивации, snapshot.</li>
                  <li>answers — история вопросов.</li>
                  <li>profiles — эмбеддинги и резюме ответов.</li>
                  <li>jobs / rules / scores — каталог профессий и логика расчёта.</li>
                  <li>questions — сценарии по областям и версиям.</li>
                </ul>
              </CardBody>
            </Card>
            <Card shadow="sm" className="border border-white/10 bg-white/5">
              <CardHeader className="text-lg font-semibold text-white">Админ и контроль качества</CardHeader>
              <CardBody className="space-y-3 text-sm text-zinc-200">
                <div className="grid gap-2 sm:grid-cols-2">
                  {["Редактор профессий и навыков", "Правила IF-THEN и веса", "Варианты вопросов", "Метрики релевантности", "Экспорт CSV/PDF", "GDPR delete"].map(
                    (item) => (
                      <div key={item} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                        {item}
                      </div>
                    ),
                  )}
                </div>
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-indigo-50">
                  REST `/rest/v1/*` остаётся доступным для админки: управлять jobs, rules, questions и выгружать результаты тестов.
                </div>
              </CardBody>
            </Card>
          </div>
          <Card shadow="sm" className="border border-white/10 bg-white/5">
            <CardBody className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm text-zinc-200">
              {["Ролевая модель обновляется без деплоя", "Отслеживание времени и конверсии", "Поддержка A/B версий опроса", "Готовность к OAuth/Auth"].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">
                  {item}
                </div>
              ))}
            </CardBody>
          </Card>
        </section>

        <section className="rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 p-[1px] shadow-2xl" id="cta">
          <div className="flex flex-col gap-4 rounded-[1rem] bg-zinc-950 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-lg font-semibold text-white">Готово к развёртыванию</p>
              <p className="text-sm text-zinc-300">
                Подключите ключи Supabase, укажите LLM-провайдер и можно принимать пользователей. UI адаптивный и уже собирает нужные данные.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button color="secondary" as="a" href="mailto:team@devbasics.ai">
                Связаться
              </Button>
              <Button variant="bordered" as="a" href="#workspace" color="primary">
                Начать новую сессию
              </Button>
            </div>
          </div>
        </section>

        <Modal isOpen={isAuthOpen} onOpenChange={setAuthOpen} placement="center" size="lg" backdrop="blur">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {authMode === "register" ? "Регистрация" : "Вход"}
                  <p className="text-sm text-zinc-500">Supabase Auth с серверными ключами</p>
                </ModalHeader>
                <ModalBody className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={authMode === "register" ? "solid" : "bordered"}
                      color="secondary"
                      onPress={() => setAuthMode("register")}
                    >
                      Регистрация
                    </Button>
                    <Button
                      size="sm"
                      variant={authMode === "login" ? "solid" : "bordered"}
                      color="primary"
                      onPress={() => setAuthMode("login")}
                    >
                      Вход
                    </Button>
                  </div>
                  {authMode === "register" && (
                    <Input
                      label="Имя"
                      placeholder="Как к вам обращаться"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                    />
                  )}
                  <Input
                    label="Email"
                    placeholder="you@example.com"
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                  />
                  <Input
                    label="Пароль"
                    placeholder="Минимум 6 символов"
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                  />
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-zinc-200">
                    Все запросы идут на `/api/auth/register` и `/api/auth/login`; сервисный ключ хранится на сервере. После
                    входа можно писать админку на REST `/rest/v1/*` с ключом service role.
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button variant="light" onPress={() => { setAuthStatus(null); setAuthError(null); onClose(); }}>
                    Отмена
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      handleAuth();
                      if (!isAuthPending) {
                        setAuthOpen(true);
                      }
                    }}
                    isDisabled={isAuthPending}
                  >
                    {isAuthPending ? "Отправляем..." : authMode === "register" ? "Создать аккаунт" : "Войти"}
                  </Button>
                </ModalFooter>
                {authStatus && <p className="px-6 pb-2 text-sm font-semibold text-emerald-400">{authStatus}</p>}
                {authError && <p className="px-6 pb-2 text-sm font-semibold text-rose-400">{authError}</p>}
              </>
            )}
          </ModalContent>
        </Modal>
      </main>
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-white via-white/70 to-zinc-100 dark:from-black dark:via-zinc-900 dark:to-black">
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-18rem]">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-indigo-300 via-sky-200 to-emerald-200 opacity-60 dark:from-indigo-600 dark:via-sky-500 dark:to-emerald-500"
            aria-hidden
          />
        </div>

        <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-20 sm:pt-28">
          <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 ring-1 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-200 dark:ring-indigo-500/30">
                Интерактивная экспертная система профориентации
              </span>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                «Выбор профессии» — гибрид правил, векторного поиска и LLM с объяснимым результатом
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-300">
                Быстрый скринер, углублённые вопросы, ситуационные кейсы и персонализированные рекомендации. Система
                запоминает контекст и развивает профиль: ответы, навыки, ограничения, мотивацию.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button color="primary" as="a" href="#flow">
                  Посмотреть логику
                </Button>
                <Button variant="bordered" as="a" href="#professions">
                  Примеры рекомендаций
                </Button>
                <Button variant="light" as="a" href="#admin">
                  Что в админке
                </Button>
              </div>
            </div>
            <div className="grid gap-4 rounded-2xl bg-white/70 p-6 shadow-lg shadow-indigo-200/50 ring-1 ring-indigo-100 backdrop-blur dark:bg-zinc-900/70 dark:ring-indigo-500/20">
              <h2 className="text-xl font-semibold">Сессия пользователя</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <Card shadow="sm">
                  <CardBody className="space-y-2">
                    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">Скринер</p>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
                      {quickScreen.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
                <Card shadow="sm">
                  <CardBody className="space-y-2">
                    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">Углубление</p>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
                      {deepDive.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>
              </div>
              <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/70 p-4 text-sm text-indigo-900 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-100">
                Контекст сохраняется: вопросы, ответы, быстрые резюме, векторные эмбеддинги и признаки для правил.
              </div>
            </div>
          </section>

          <section id="flow" className="space-y-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold sm:text-3xl">Как устроен диалог и вывод</h2>
              <p className="text-zinc-600 dark:text-zinc-300">
                Чёткая последовательность, чтобы идти от общего к узкому, не терять ответы и давать объяснимые рекомендации.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step) => (
                <Card key={step.title} shadow="sm">
                  <CardBody className="space-y-2">
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">{step.text}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
            <div className="rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 p-[1px] shadow-lg">
              <div className="flex flex-col gap-4 rounded-[1rem] bg-white p-6 text-sm text-zinc-700 backdrop-blur dark:bg-zinc-900 dark:text-zinc-200 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">Формула итогового score</p>
                  <p>score = α * rule_score + β * embedding_match + γ * LLM_suggestions, где α+β+γ=1.</p>
                </div>
                <div className="rounded-lg bg-black/5 px-4 py-3 text-xs font-mono text-zinc-700 dark:bg-white/5 dark:text-zinc-100">
                  <p>Жёсткие фильтры → Веса по признакам → Векторный матч → LLM-решётка → Топ-5 профессий</p>
                </div>
              </div>
            </div>
          </section>

          <section id="professions" className="space-y-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold sm:text-3xl">Примеры рекомендаций</h2>
              <p className="text-zinc-600 dark:text-zinc-300">
                Каждая карточка показывает, почему профессия подходит, и даёт пошаговый план развития.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {professions.map((item) => (
                <Card key={item.title} shadow="sm">
                  <CardBody className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-200 dark:ring-emerald-500/30">
                        {item.score}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">Почему</p>
                      <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
                        {item.reasons.map((reason) => (
                          <li key={reason}>{reason}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">Путь развития</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300">{item.steps}</p>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold sm:text-3xl">Структура вопросов</h2>
              <p className="text-zinc-600 dark:text-zinc-300">
                От скринера до ситуационных кейсов и свободного ввода — всё, чтобы собрать предпочтения, навыки и ценности.
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <Card shadow="sm">
                <CardBody className="space-y-3">
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">Быстрый скринер</p>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
                    {quickScreen.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
              <Card shadow="sm">
                <CardBody className="space-y-3">
                  <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">Углублённые вопросы</p>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-600 dark:text-zinc-300">
                    {deepDive.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold sm:text-3xl">Данные, память и приватность</h2>
              <p className="text-zinc-600 dark:text-zinc-300">
                Сессии, профили, вектора и правила — всё хранится осмысленно, с учётом приватности и гибкости подключения LLM.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {dataModel.map((item) => (
                <Card key={item.title} shadow="sm">
                  <CardBody className="space-y-2">
                    <h3 className="text-base font-semibold">{item.title}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">{item.detail}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
            <div className="rounded-xl bg-emerald-50 px-5 py-4 text-sm text-emerald-900 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-100 dark:ring-emerald-500/30">
              Приватность: явное согласие на сбор данных, возможность удалить профиль, минимизация PII, аудит логов.
            </div>
          </section>

          <section id="admin" className="space-y-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold sm:text-3xl">Админ-панель и контроль качества</h2>
              <p className="text-zinc-600 dark:text-zinc-300">
                Дайте редакторам управлять базой профессий, правилами и версиями опросов без разработчиков.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {adminFeatures.map((item) => (
                <Card key={item} shadow="sm">
                  <CardBody>
                    <p className="text-sm text-zinc-700 dark:text-zinc-200">{item}</p>
                  </CardBody>
                </Card>
              ))}
            </div>
            <div className="rounded-2xl bg-zinc-900 px-6 py-5 text-zinc-100 ring-1 ring-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-emerald-300">Валидация рекомендаций</p>
                  <p className="text-sm text-zinc-300">
                    Опрос релевантности (1–5), A/B сравнение rule-based vs hybrid, трекинг конверсии и времени прохождения.
                  </p>
                </div>
                <Button color="primary" as="a" href="#flow" className="w-full sm:w-auto">
                  Перейти к шагам
                </Button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-600 p-[1px] shadow-lg">
            <div className="flex flex-col gap-4 rounded-[1rem] bg-zinc-950 px-6 py-8 text-zinc-100 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <p className="text-lg font-semibold">Готовы строить приложение?</p>
                <p className="text-sm text-zinc-200">
                  Подключим Supabase для хранения сессий, PGVector для эмбеддингов и выберем LLM. Макет уже готов для разработки.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button color="default" variant="flat" as="a" href="mailto:team@devbasics.ai">
                  Связаться
                </Button>
                <Button color="secondary" as="a" href="#professions">
                  Посмотреть прототип
                </Button>
              </div>
            </div>
          </section>
        </main>
  );
}
