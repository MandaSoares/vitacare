import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import RadarChart from "./RadarChart";

const ease = [0.22, 1, 0.36, 1] as const;

const healthIndicators = [
  { label: "Proteína", value: "1.8g/kg", status: "ok" },
  { label: "Glicemia", value: "Estável", status: "ok" },
  { label: "Fibras", value: "18g/dia", status: "alert" },
  { label: "Hidratação", value: "Boa", status: "ok" },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const goToLogin = () => navigate("/login");
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left: Text */}
        <motion.div
          className="max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-medium text-primary font-mono-data">
              Análise Inteligente Ativa
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.1] text-foreground text-balance mb-6">
            Sua dieta não é um palpite.{" "}
            <span className="text-primary">É um plano baseado em dados.</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-md">
            Conectamos você aos melhores nutricionistas com uma camada de inteligência
            que antecipa necessidades, organiza dados de saúde e torna o cuidado mais personalizado.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" size="xl" onClick={goToLogin}>
              Começar como Paciente
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button variant="heroOutline" size="xl" onClick={goToLogin}>
              Para Profissionais
            </Button>
          </div>
        </motion.div>

        {/* Right: Floating UI Card */}
        <motion.div
          className="relative flex justify-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease }}
        >
          <div className="glass-card-elevated rounded-2xl p-6 w-full max-w-sm animate-float">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Pré-análise Inteligente
                </p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  Perfil Nutricional
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="text-xs font-medium text-accent font-mono-data">
                  82%
                </span>
              </div>
            </div>

            <RadarChart />

            <div className="grid grid-cols-2 gap-3 mt-4">
              {healthIndicators.map((item) => (
                <div
                  key={item.label}
                  className="rounded-clinical bg-secondary/50 p-2.5 text-center"
                >
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className={`text-sm font-semibold font-mono-data mt-0.5 ${
                    item.status === "ok" ? "text-primary" : "text-amber-600"
                  }`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
