import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    number: "01",
    title: "Crie seu perfil",
    description: "Cadastre-se e informe metas, rotina e histórico para iniciar uma jornada nutricional mais precisa.",
  },
  {
    number: "02",
    title: "Análise inteligente",
    description: "A plataforma cruza seus dados e gera uma visão inicial que ajuda a orientar o primeiro atendimento.",
  },
  {
    number: "03",
    title: "Conexão ideal",
    description: "Você é direcionado ao nutricionista mais alinhado ao seu objetivo e às suas necessidades.",
  },
  {
    number: "04",
    title: "Acompanhamento contínuo",
    description: "Seu progresso é monitorado ao longo do tempo para apoiar ajustes e decisões mais assertivas.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
        >
          <p className="text-xs uppercase tracking-widest text-primary font-mono-data mb-3">
            Processo
          </p>
          <h2 className="text-3xl md:text-4xl text-foreground mb-4">
            Como funciona
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Um fluxo simples para transformar dados em acompanhamento nutricional mais eficiente.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease }}
            >
              <span className="text-5xl font-bold text-primary/10 font-mono-data">
                {step.number}
              </span>
              <h3 className="text-base font-semibold text-foreground mt-2 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
