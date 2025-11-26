"use client";
import { Button, Card, CardBody, CardHeader, Input, Radio, RadioGroup, Slider, Textarea } from "@heroui/react";
import { useMemo, useState, useTransition } from "react";

const areas = ["IT / Data / AI", "Медицина", "Экономика", "Инжиниринг", "Креатив", "Образование", "Экология", "Новые роли"];
const valueKeys = [
  { key: "autonomy", label: "Независимость" },
  { key: "stability", label: "Стабильность" },
  { key: "impact", label: "Общественная польза" },
  { key: "income", label: "Доход" },
  { key: "creativity", label: "Креативность" },
];

export default function AssessmentPage() {
  const [profile, setProfile] = useState({ name: "", email: "", level: "" });
  const [selectedAreas, setSelectedAreas] = useState<string[]>(["IT / Data / AI"]);
  const [workFocus, setWorkFocus] = useState("данные");
  const [workStyle, setWorkStyle] = useState("удалённо");
  const [studyDepth, setStudyDepth] = useState("быстрый старт");
  const [values, setValues] = useState<Record<string, number>>({ autonomy: 60, stability: 55, impact: 65, income: 70, creativity: 75 });
  const [skills, setSkills] = useState("SQL, Python, Аналитика");
  const [learningPlan, setLearningPlan] = useState("SQL → Python → портфолио");
  const [freeText, setFreeText] = useState("Хочу работать с данными и продуктами");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const featureSnapshot = useMemo(
    () => ({
      data_affinity: workFocus === "данные" ? 1 : 0.6,
      people_focus: workFocus === "люди" ? 1 : 0.4,
      autonomy: values.autonomy / 100,
      stability: values.stability / 100,
      creativity: values.creativity / 100,
      impact: values.impact / 100,
      income: values.income / 100,
    }),
    [values, workFocus],
  );

  const handleSubmit = () => {
    setStatus(null);
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/assessments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profile,
            screening: { areas: selectedAreas, workFocus, workStyle, studyDepth },
            motivations: {
              values,
              skills: skills
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
              learningPlan: learningPlan
                .split("→")
                .map((item) => item.trim())
                .filter(Boolean),
              freeText,
            },
            featureSnapshot,
          }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || "Не удалось сохранить оценку");
        setStatus(`Сохранено #${json.assessment.id}`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white">
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-5 pb-16 pt-14">
        <header className="space-y-3">
          <p className="text-sm uppercase text-zinc-400">Этап 2 — тест</p>
          <h1 className="text-4xl font-bold">Скринер и углублённые ответы</h1>
          <p className="text-lg text-zinc-300">После входа пользователь проходит этот блок, а результаты уходят в таблицу Assessment.</p>
        </header>

        <Card shadow="sm" className="border border-white/10 bg-white/5">
          <CardHeader className="text-lg font-semibold text-white">Профиль и скринер</CardHeader>
          <CardBody className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <Input label="Имя" placeholder="Анна" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
              <Input label="Email" placeholder="user@mail.com" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
              <Input label="Уровень" placeholder="Студент / Middle / Senior" value={profile.level} onChange={(e) => setProfile((p) => ({ ...p, level: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-200">Области</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {areas.map((area) => {
                  const checked = selectedAreas.includes(area);
                  return (
                    <label
                      key={area}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm hover:border-white/20"
                    >
                      <input
                        type="checkbox"
                        className="h-5 w-5 rounded border-slate-500 bg-slate-900 text-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        checked={checked}
                        onChange={(e) => {
                          setSelectedAreas((prev) => {
                            if (e.target.checked) return [...prev, area];
                            return prev.filter((item) => item !== area);
                          });
                        }}
                      />
                      <span className="text-zinc-100">{area}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <RadioGroup label="Фокус" value={workFocus} onValueChange={setWorkFocus} orientation="vertical">
                <Radio value="данные">Данные</Radio>
                <Radio value="люди">Люди</Radio>
                <Radio value="оборудование">Оборудование</Radio>
              </RadioGroup>
              <RadioGroup label="Формат" value={workStyle} onValueChange={setWorkStyle} orientation="vertical">
                <Radio value="офис">Офис</Radio>
                <Radio value="гибрид">Гибрид</Radio>
                <Radio value="удалённо">Удалённо</Radio>
                <Radio value="полевой">Полевой</Radio>
              </RadioGroup>
              <RadioGroup label="Учёба" value={studyDepth} onValueChange={setStudyDepth} orientation="vertical">
                <Radio value="быстрый старт">Быстрый старт</Radio>
                <Radio value="долгая учёба">Долгая учёба</Radio>
                <Radio value="гибко">Гибко, смешанный путь</Radio>
              </RadioGroup>
            </div>
          </CardBody>
        </Card>

        <Card shadow="sm" className="border border-white/10 bg-white/5">
          <CardHeader className="text-lg font-semibold text-white">Ценности и свободный ввод</CardHeader>
          <CardBody className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {valueKeys.map((item) => (
                <div key={item.key} className="space-y-1 rounded-xl border border-white/10 bg-black/30 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="text-xs text-zinc-400">{values[item.key] ?? 0}%</span>
                  </div>
                  <Slider
                    aria-label={item.label}
                    size="sm"
                    value={values[item.key] ?? 0}
                    onChange={(val) => setValues((prev) => ({ ...prev, [item.key]: val as number }))}
                  />
                </div>
              ))}
            </div>
            <Input label="Навыки" placeholder="SQL, Figma, преподавание" value={skills} onChange={(e) => setSkills(e.target.value)} />
            <Input label="План обучения" placeholder="SQL → Python → проекты" value={learningPlan} onChange={(e) => setLearningPlan(e.target.value)} />
            <Textarea
              label="Свободный ввод"
              placeholder="Что нравится и не нравится в работе"
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
            />
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              Snapshot: {JSON.stringify(featureSnapshot)}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button color="primary" onPress={handleSubmit} isDisabled={pending}>
                {pending ? "Сохраняем..." : "Сохранить оценку"}
              </Button>
              <Button
                variant="bordered"
                color="secondary"
                onPress={() => window.dispatchEvent(new CustomEvent("devbasics:auth", { detail: { mode: "login" } }))}
              >
                Войти перед отправкой
              </Button>
            </div>
            {status && <p className="text-sm font-semibold text-emerald-400">{status}</p>}
            {error && <p className="text-sm font-semibold text-rose-400">{error}</p>}
          </CardBody>
        </Card>
      </main>
    </div>
  );
}
