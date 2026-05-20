import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RadarChart from "@/components/landing/RadarChart";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Leaf, AlertCircle, CheckCircle, Info, Droplet, Flame } from "lucide-react";

const indicators = [
  { title: "Proteína", value: "1,8 g/kg", note: "Abaixo da meta", tone: "danger", meta: "Meta: 2,0 g/kg", icon: "leaf" },
  { title: "Glicemia GHbA1c", value: "Estável", note: "Dentro da meta", tone: "success", meta: "90-110 mg/dL", icon: "drop" },
  { title: "Hidratação", value: "6 copos", note: "Boa hidratação", tone: "success", meta: "Meta: 8 copos", icon: "droplet" },
  { title: "Gasto calórico", value: "1.850 kcal", note: "Dentro do esperado", tone: "neutral", meta: "Meta: 2.000 kcal", icon: "flame" },
];

const insights = [
  { 
    title: "Aumente o consumo de fibras", 
    text: "Seu consumo de fibras está abaixo do recomendado. Inclua mais frutas, verduras e grãos integrais.",
    priority: "Prioridade média",
    icon: "leaf",
    tone: "success"
  },
  { 
    title: "Ajuste a ingestão de proteína", 
    text: "Para seus objetivos, tente aumentar um pouco mais o consumo de proteínas ao longo do dia.",
    priority: "Prioridade alta",
    icon: "alert",
    tone: "warning"
  },
  { 
    title: "Continue assim!", 
    text: "Sua hidratação está excelente. Mantenha esse hábito!",
    priority: "Muito bom",
    icon: "check",
    tone: "success"
  },
];

const PreAnalysis: React.FC = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40%" });
  const [hoverRadar, setHoverRadar] = useState(false);

  return (
    <div className="w-full min-w-0 space-y-6">
      <div ref={ref} className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-start gap-6">
          <div className="col-span-1 lg:col-span-4">
            <h3 className="text-sm font-medium text-slate-600">Seu índice nutricional</h3>
            <div className="mt-4">
              <motion.div
                animate={{ scale: hoverRadar ? 1.06 : 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="text-6xl font-bold text-slate-900 leading-none">82%</div>
              </motion.div>
              <div className="mt-2 text-base text-emerald-700 font-medium">Muito bom</div>
              <div className="mt-4 text-sm text-slate-500">Seu perfil nutricional está acima da média.</div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-700">Evolução positiva ↑ 12%</div>
              <div className="mt-4 text-xs text-slate-400">Última análise: 10/05/2024</div>
            </div>
          </div>

          <div className="mt-4 lg:mt-0 lg:col-span-8">
            <div
              className="mx-auto w-full max-w-[420px] overflow-hidden"
              onMouseEnter={() => setHoverRadar(true)}
              onMouseLeave={() => setHoverRadar(false)}
            >
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}>
                <div className="w-full h-[360px]">
                  <RadarChart isHovered={hoverRadar} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Indicadores principais</h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {indicators.map((it, idx) => {
            const getIcon = () => {
              if (idx === 0) return <Leaf className="h-5 w-5 text-slate-400" />;
              if (idx === 1) return <Droplet className="h-5 w-5 text-slate-400" />;
              if (idx === 2) return <Droplet className="h-5 w-5 text-slate-400" />;
              if (idx === 3) return <Flame className="h-5 w-5 text-slate-400" />;
            };
            const getStatusColor = () => {
              if (it.note === "Abaixo da meta") return "text-red-600";
              if (it.note === "Dentro da meta" || it.note === "Boa hidratação" || it.note === "Dentro do esperado") return "text-emerald-600";
              return "text-slate-600";
            };
            return (
              <div key={idx} className="rounded-lg border border-slate-100 bg-white p-4">
                <div className="text-xs text-slate-500">{it.title}</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{it.value}</div>
                <div className={`mt-2 text-sm font-medium px-2 py-1 rounded border ${it.note === "Abaixo da meta" ? "border-red-200 text-red-600 bg-red-50" : "border-emerald-200 text-emerald-600 bg-emerald-50"} inline-block`}>{it.note}</div>
                <div className="mt-3 text-xs text-slate-400">{it.meta}</div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-center">
                  {getIcon()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Insights e recomendações</h3>
        <div className="space-y-3">
          {insights.map((ins, i) => {
            const getIcon = () => {
              if (ins.icon === "leaf") return <Leaf className="h-6 w-6 text-emerald-600" />;
              if (ins.icon === "alert") return <AlertCircle className="h-6 w-6 text-orange-600" />;
              if (ins.icon === "check") return <CheckCircle className="h-6 w-6 text-emerald-600" />;
              return <Info className="h-6 w-6 text-slate-400" />;
            };
            const badgeClassName =
              ins.priority === "Prioridade alta"
                ? "border-orange-100 bg-orange-50 text-orange-500"
                : "border-emerald-100 bg-emerald-50 text-emerald-600";
            return (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg border border-slate-100 bg-white p-4">
                <div className="flex-shrink-0 pt-1">{getIcon()}</div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{ins.title}</div>
                  <div className="text-sm text-slate-600 mt-1">{ins.text}</div>
                </div>
                <div className={`flex-shrink-0 rounded-full border px-4 py-2 text-sm font-semibold leading-none ${badgeClassName}`}>
                  {ins.priority}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4 flex gap-3">
        <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-emerald-700">Esta análise foi gerada com base nos seus registros alimentares, dados do plano alimentar e respostas ao seu perfil. <button className="underline hover:no-underline">Saiba mais sobre a análise IA</button></div>
      </div>
    </div>
  );
};

export default PreAnalysis;
