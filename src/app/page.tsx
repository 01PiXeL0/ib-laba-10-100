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
       </div>
  );
}
