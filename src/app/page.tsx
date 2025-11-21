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
  Radio,
  RadioGroup,
  Slider,
  Textarea,
} from "@heroui/react";
import { useMemo, useState, useTransition } from "react";

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
  "Какие области вас интересуют? (IT, медицина, финансы, дизайн, наука и др.)",
  "Хотите работать с людьми, данными, оборудованием или идеями?",
  "Какой формат работы: офис / гибрид / удалённо / полевой?",
  "Готовность учиться 5+ лет или быстрый старт?",
  "Уровень готовности к регулярному взаимодействию с людьми?",
  "Ограничения: физические, география, график?",
];

const deepQuestions = [
  "Что приносит удовлетворение: решать логические задачи, создавать визуал, общаться, организовывать?",
  "Опишите идеальный рабочий день. (свободный ввод)",
  "Как реагируете на ошибки: ищу источник, забываю, обсуждаю?",
  "Доводите до идеала или запускаете MVP и улучшаете?",
  "Объяснение сложной темы непрофи: упрощу, дам инфу, метафора?",
  "Готовность к риску vs стабильность?",
  "Что готовы изучать в ближайшие 6 месяцев?",
];

const situationalCases = [
  "2 дня на прототип: что сделаете минимум?",
  "Конфликт менеджера и разработчика: как действуете?",
  "Проект провалился: ваш следующий шаг?",
  "Дедлайны: как планируете и отслеживаете?",
  "Точность vs скорость vs креативность — что важнее?",
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
    why: "Высокий интерес к данным, аналитика, готовность к учёбе",
  },
  {
    id: "ux-designer",
    title: "UX/UI Дизайнер",
    area: "Креатив / Контент",
    weights: { autonomy: 0.35, stability: 0.25, impact: 0.25, income: 0.3, creativity: 0.55 },
    skills: ["Figma", "UX-исследования", "UI-киты"],
    why: "Креативность + желание улучшать пользовательский опыт",
  },
  {
    id: "sre",
    title: "Site Reliability Engineer",
    area: "IT / Data / AI",
    weights: { autonomy: 0.25, stability: 0.5, impact: 0.25, income: 0.45, creativity: 0.15 },
    skills: ["Observability", "SRE практики", "Cloud"],
    why: "Стабильность, ответственность за доступность",
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
    why: "Высокая общественная польза + данные",
  },
  {
    id: "renewable",
    title: "Инженер по возобновляемой энергии",
    area: "Экология / Энергетика",
    weights: { autonomy: 0.3, stability: 0.35, impact: 0.55, income: 0.35, creativity: 0.25 },
    skills: ["CAD/SCADA", "Полевые работы", "Проектирование"],
    why: "Сильная ценность устойчивости",
  },
  {
    id: "ed-designer",
    title: "Instructional Designer",
    area: "Образование / Социальные",
    weights: { autonomy: 0.4, stability: 0.35, impact: 0.5, income: 0.25, creativity: 0.4 },
    skills: ["Методология", "LMS", "Оценка прогресса"],
    why: "Готовность учить других, социальный импакт",
  },
  {
    id: "prompt-engineer",
    title: "Prompt Engineer / LLM Ops",
    area: "Новые роли (AI Ethics, XR, Prompt)",
    weights: { autonomy: 0.45, stability: 0.25, impact: 0.3, income: 0.4, creativity: 0.45 },
    skills: ["LLM", "Векторный поиск", "Оценка качества"],
    why: "Интерес к AI и быстрым экспериментам",
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

      return { ...role, score: Math.round((score / 6) * 100) };
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
    stability: 50,
    impact: 65,
    income: 60,
    creativity: 70,
  });
  const [skills, setSkills] = useState("Python, SQL, Figma, преподавание");
  const [learningPlan, setLearningPlan] = useState("SQL → Python/LLM → портфолио кейсы");
  const [constraints, setConstraints] = useState("Город, гибкий график, без ночных смен");
  const [freeText, setFreeText] = useState("Люблю исследовать данные, но хочу больше креатива и работы с людьми");
  const [resultStatus, setResultStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const recommendations = useMemo(() => scoreRoles(selectedAreas, values), [selectedAreas, values]);

  const roadmap = useMemo(
    () => [
      "Скринер (5–8 вопросов) → профиль интересов",
      "Углубление (15–25 вопросов, situational, RIASEC/Big Five)",
      "Гибридный скоринг (правила + эмбеддинги + LLM)",
      "Топ-5 профессий + объяснения + mini-task",
    ],
    [],
  );

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
            roadmap,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-zinc-100 text-zinc-900 dark:from-black dark:via-zinc-900 dark:to-black dark:text-zinc-50">
      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-16 sm:pt-24">
        <section className="grid items-center gap-10 lg:grid-cols-2" id="builder">
          <div className="space-y-6">
            <Chip color="primary" variant="flat" className="font-semibold">Профориентация нового поколения</Chip>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Экспертная система «Выбор профессии» — диалог, память, гибридный скоринг и Supabase-хранилище
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-300">
              Быстрый скринер, углублённый модуль, ситуационные задания, свободный ввод. Контекст сохраняется в Supabase:
              вопросы, ответы, эмбеддинги, правила и версии опросов. На выходе — топ профессий с объяснением и путями роста.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button color="primary" onPress={handleSubmit} isDisabled={isPending}>
                {isPending ? "Сохраняем сессию..." : "Сохранить сессию в Supabase"}
              </Button>
              <Button variant="bordered" as="a" href="#questions">
                Смотреть вопросы
              </Button>
              <Button variant="light" as="a" href="#engine">
                Механика вывода
              </Button>
            </div>
            {resultStatus && <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">{resultStatus}</p>}
            {error && <p className="text-sm font-semibold text-rose-500">{error}</p>}
          </div>

          <Card shadow="sm" className="backdrop-blur bg-white/70 dark:bg-zinc-900/70">
            <CardHeader className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-indigo-500">Сессия пользователя</p>
                <p className="text-lg font-semibold">Профиль + скринер + ценности</p>
              </div>
              <Chip variant="flat" color="secondary">
                Snapshot
              </Chip>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Имя или псевдоним"
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
                  label="Возраст / уровень"
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
                {areas.map((area) => (
                  <Checkbox key={area} value={area}>
                    {area}
                  </Checkbox>
                ))}
              </CheckboxGroup>

              <div className="grid gap-4 sm:grid-cols-3">
                <RadioGroup
                  label="Фокус"
                  value={workFocus}
                  onValueChange={setWorkFocus}
                  orientation="vertical"
                  classNames={{ label: "text-sm font-semibold" }}
                >
                  <Radio value="данные">Данные</Radio>
                  <Radio value="люди">Люди/команда</Radio>
                  <Radio value="оборудование">Оборудование/процессы</Radio>
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
                  <Radio value="быстрый старт (курсы)">Быстрый старт (курсы)</Radio>
                  <Radio value="2-3 года обучения">2-3 года обучения</Radio>
                  <Radio value="5+ лет и резидентура">5+ лет и резидентура</Radio>
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
                <p className="text-sm font-semibold">Ценности и мотивация (шкалы)</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {valueKeys.map((item) => (
                    <div key={item.key} className="space-y-2 rounded-xl border border-zinc-200/70 bg-zinc-50/70 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                      <div className="flex items-center justify-between text-sm font-semibold">
                        <span>{item.label}</span>
                        <Chip size="sm" variant="flat" color="secondary">{values[item.key]}</Chip>
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
        </section>

        <section id="questions" className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">Карта вопросов: от общего к узкому</h2>
            <p className="text-zinc-600 dark:text-zinc-300">
              Скринер, углублённый блок, ситуационные задачи, ценности и навыки. Всё готово к подключению в LLM-агент.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            <Card shadow="sm">
              <CardHeader className="text-lg font-semibold">Скринер (5–8 вопросов)</CardHeader>
              <CardBody className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                {screeningQuestions.map((q) => (
                  <div key={q} className="rounded-lg bg-indigo-50/60 p-2 text-indigo-900 ring-1 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-100 dark:ring-indigo-500/30">
                    {q}
                  </div>
                ))}
              </CardBody>
            </Card>
            <Card shadow="sm">
              <CardHeader className="text-lg font-semibold">Углублённый блок</CardHeader>
              <CardBody className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                {deepQuestions.map((q) => (
                  <div key={q} className="rounded-lg bg-emerald-50/70 p-2 text-emerald-900 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-100 dark:ring-emerald-500/30">
                    {q}
                  </div>
                ))}
              </CardBody>
            </Card>
            <Card shadow="sm">
              <CardHeader className="text-lg font-semibold">Ситуационные кейсы</CardHeader>
              <CardBody className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                {situationalCases.map((q) => (
                  <div key={q} className="rounded-lg bg-amber-50/70 p-2 text-amber-900 ring-1 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-100 dark:ring-amber-500/30">
                    {q}
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>
          <Card shadow="sm" className="border border-dashed border-indigo-200 dark:border-indigo-500/40">
            <CardBody className="flex flex-col gap-3 text-sm text-zinc-700 dark:text-zinc-200 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="font-semibold text-indigo-600 dark:text-indigo-300">LLM + правила</p>
                <p>
                  Ответы сохраняются в сессии: эмбеддинг, резюме, признаковые флаги для hard-фильтров и весов. Повторы
                  вопросов исключаются, диалог адаптивный.
                </p>
              </div>
              <Button color="primary" variant="flat" as="a" href="#engine">
                Перейти к механике расчёта
              </Button>
            </CardBody>
          </Card>
        </section>

        <section id="engine" className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">Механика вывода и подсчёт score</h2>
            <p className="text-zinc-600 dark:text-zinc-300">
              Гибрид: правила (hard filters), скоринг по весам, векторный матч свободного текста, подсказки LLM и объяснения.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card shadow="sm">
              <CardHeader className="text-lg font-semibold">Формула</CardHeader>
              <CardBody className="space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
                <div className="rounded-lg bg-zinc-950 px-4 py-3 font-mono text-emerald-200 ring-1 ring-zinc-800 dark:bg-zinc-950">
                  score = α * rule_score + β * embedding_match + γ * LLM_suggestions (α+β+γ=1)
                </div>
                <ul className="list-disc space-y-2 pl-4">
                  <li>Правила: фильтруем профессии по ограничениям и обязательным признакам.</li>
                  <li>Скоринг: Σ (w_i * feature_i), веса редактируются в админке.</li>
                  <li>Эмбеддинги: сопоставление свободного текста с профилем профессии.</li>
                  <li>LLM-решётка: генерация альтернатив + объяснений с отсылкой к ответам.</li>
                </ul>
              </CardBody>
            </Card>
            <Card shadow="sm">
              <CardHeader className="text-lg font-semibold">Пример применения правил</CardHeader>
              <CardBody className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                <div className="rounded-lg bg-indigo-50/60 p-3 ring-1 ring-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-100 dark:ring-indigo-500/30">
                  IF interest_data ≥ 0.7 AND math ≥ 0.6 THEN +0.25 к Data Scientist
                </div>
                <div className="rounded-lg bg-emerald-50/70 p-3 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-100 dark:ring-emerald-500/30">
                  IF prefers_people ≥ 0.7 AND creative ≥ 0.6 THEN +0.2 к Marketing / Content
                </div>
                <div className="rounded-lg bg-rose-50/70 p-3 ring-1 ring-rose-100 dark:bg-rose-500/10 dark:text-rose-100 dark:ring-rose-500/30">
                  IF not_ready_for_long_study THEN exclude Clinical doctor / Surgeon
                </div>
              </CardBody>
            </Card>
          </div>

          <Card shadow="sm" className="border border-dashed border-emerald-200 dark:border-emerald-500/40">
            <CardBody className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Chip color="success" variant="flat">
                  Живой расчёт по вашим данным
                </Chip>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">Рекомендации подставляются сразу по шкалам ценностей.</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                {recommendations.map((item) => (
                  <Card key={item.id} shadow="sm" className="h-full">
                    <CardBody className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs uppercase text-zinc-500">{item.area}</p>
                          <p className="text-base font-semibold">{item.title}</p>
                        </div>
                        <Chip color="secondary" size="sm" variant="flat">
                          {item.score}%
                        </Chip>
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-300">{item.why}</p>
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
              </div>
            </CardBody>
          </Card>
        </section>

        <section id="data" className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">Схема данных и Supabase</h2>
            <p className="text-zinc-600 dark:text-zinc-300">
              Минимальный набор таблиц для экспертной системы. Можно расширять: версии вопросов, A/B, PGVector, аудит.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card shadow="sm">
              <CardHeader className="text-lg font-semibold">Таблицы</CardHeader>
              <CardBody className="space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                <ul className="list-disc space-y-2 pl-4">
                  <li>
                    <strong>users</strong> — id, name, age, location, education, created_at
                  </li>
                  <li>
                    <strong>sessions</strong> — id, user_id, screening, motivations, feature_snapshot, started_at
                  </li>
                  <li>
                    <strong>questions</strong> — id, text, type, tags, area, version
                  </li>
                  <li>
                    <strong>answers</strong> — id, session_id, question_id, answer_value, answer_text, created_at
                  </li>
                  <li>
                    <strong>profiles</strong> — user_id, emb_vector, summary_text, traits_json
                  </li>
                  <li>
                    <strong>jobs</strong> — id, title, area, subarea, skills_json, weights_json, description
                  </li>
                  <li>
                    <strong>rules</strong> — id, condition_json, effect_json, priority
                  </li>
                  <li>
                    <strong>scores</strong> — session_id, job_id, score, components_json
                  </li>
                </ul>
              </CardBody>
            </Card>
            <Card shadow="sm">
              <CardHeader className="text-lg font-semibold">API и действия</CardHeader>
              <CardBody className="space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
                <div className="rounded-lg bg-zinc-50 p-3 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                  POST <code className="font-mono">/api/sessions</code> — сохраняет профиль, скринер, мотивацию, snapshot.
                </div>
                <div className="rounded-lg bg-zinc-50 p-3 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                  REST <code className="font-mono">/rest/v1/*</code> Supabase — для админки (jobs/rules/questions) и логов.
                </div>
                <div className="rounded-lg bg-zinc-50 p-3 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:ring-zinc-800">
                  Векторный слой: pgvector / внешнее хранилище для эмбеддингов ответов и описаний профессий.
                </div>
              </CardBody>
            </Card>
          </div>
          <Card shadow="sm" className="border border-dashed border-zinc-300 dark:border-zinc-700">
            <CardBody className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <Chip color="primary" variant="flat">
                  Админ / контроль качества
                </Chip>
                <p className="text-sm text-zinc-600 dark:text-zinc-300">
                  Редактирование базы профессий и весов, сценарии вопросов, экспорт PDF/CSV, GDPR delete, A/B версии.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Редактор профессий и навыков",
                  "Правила IF-THEN и веса",
                  "Варианты вопросов по областям",
                  "Метрики: релевантность, время, конверсия",
                  "Экспорт результатов",
                ].map((item) => (
                  <Chip key={item} variant="flat" color="default">
                    {item}
                  </Chip>
                ))}
              </div>
            </CardBody>
          </Card>
        </section>

        <section className="rounded-2xl bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 p-[1px] shadow-xl" id="cta">
          <div className="flex flex-col gap-4 rounded-[1rem] bg-zinc-950 px-6 py-8 text-zinc-100 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <p className="text-lg font-semibold">Готовы развернуть приложение?</p>
              <p className="text-sm text-zinc-300">
                Подключите ключи Supabase, PGVector и выбранную LLM — UI, вопросы, логика сохранения и расчёт уже на месте.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button color="secondary" as="a" href="mailto:team@devbasics.ai">
                Связаться
              </Button>
              <Button variant="bordered" as="a" href="#builder" color="primary">
                Собрать новую сессию
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
