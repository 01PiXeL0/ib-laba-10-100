import { Button, Card, CardBody } from "@heroui/react";

const quickScreen = [
  "Области интересов (IT, медицина, финансы, дизайн и др.)",
  "Работа с людьми, данными, оборудованием или идеями",
  "Предпочтения по формату работы и темпу (офис/гибрид/удалённо)",
  "Готовность учиться и уровень гибкости к переменам",
  "Ограничения и важные условия (география, здоровье, график)",
];

const deepDive = [
  "RIASEC/Big Five стилистика: склонность к исследованиям, креативу, процессам",
  "Ситуационные кейсы про дедлайны, конфликты и быстрое прототипирование",
  "Шкалы ценностей: стабильность, доход, социальная польза, автономия",
  "Свободный ввод с NLP-анализом для выявления скрытых интересов",
  "Практические навыки: код, данные, дизайн, преподавание, менеджмент",
];

const professions = [
  {
    title: "Data Scientist / ML Engineer",
    score: "92% совпадения",
    reasons: ["любите аналитику и данные", "готовность к длительному обучению", "интерес к AI-проектам"],
    steps: "SQL → Python/ML → pet-проекты → MLOps базис",
  },
  {
    title: "UX/UI Дизайнер",
    score: "76% совпадения",
    reasons: ["высокая креативность", "желание улучшать пользовательский опыт", "готовность учить других"],
    steps: "Figma → исследования → UI-киты → портфолио кейсы",
  },
  {
    title: "Инженер по устойчивой энергетике",
    score: "68% совпадения",
    reasons: ["ценность пользы обществу", "интерес к технологиям", "готовность работать в полевых условиях"],
    steps: "основы энергетики → CAD/SCADA → стажировка → сертификация",
  },
];

const dataModel = [
  { title: "Профиль сессии", detail: "вопросы, ответы, быстрые снапшоты резюме, прогресс" },
  { title: "База профессий", detail: "id, область, навыки, веса, требования, ростовые пути" },
  { title: "Правила и веса", detail: "IF–THEN фильтры + настраиваемые коэффициенты" },
  { title: "Векторный слой", detail: "эмбеддинги ответов для поиска по навыкам и интересам" },
  { title: "Оценки и объяснения", detail: "score = α*rules + β*emb + γ*LLM с причинами выбора" },
];

const steps = [
  {
    title: "Приветствие и скринер",
    text: "5–8 быстрых вопросов, чтобы выбрать области и отсеять заведомо неподходящее.",
  },
  {
    title: "Углублённый блок",
    text: "15–25 вопросов по выбранным направлениям: ценности, ситуации, навыки, свободный ввод.",
  },
  {
    title: "Скоринг и объяснения",
    text: "Гибридная модель: правила, веса, векторный матч + LLM-подсказки.",
  },
  {
    title: "Результат и путь",
    text: "Топ-5 профессий с причинами выбора, шагами развития и мини-заданиями.",
  },
];

const adminFeatures = [
  "Редактор базы профессий и весов (добавлять новые роли и навыки)",
  "Сценарии вопросов по областям, версии и A/B-тесты",
  "Экспорт результатов в PDF/CSV и контроль приватности (удалить профиль)",
  "Подключение внешних LLM или локальной модели",
  "Метрики качества: оценка релевантности, время прохождения, конверсия",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-50">
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
    </div>
  );
}
