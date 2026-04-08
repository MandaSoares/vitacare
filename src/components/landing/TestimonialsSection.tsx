import { motion } from "framer-motion";
import { Star } from "lucide-react";
const ease = [0.22, 1, 0.36, 1] as const;
const testimonials = [
  {
    name: "Mariana Costa",
    role: "Paciente",
    avatar: "MC",
    stars: 5,
    text: "Em 3 meses perdi 8kg de forma saudável. A pré-análise me ajudou a entender onde eu estava errando antes mesmo da primeira consulta.",
  },
  {
    name: "Dr. Rafael Mendes",
    role: "Nutricionista Esportivo",
    avatar: "RM",
    stars: 5,
    text: "Atendo 3x mais pacientes com a mesma qualidade. Os dados de acompanhamento em tempo real são um diferencial enorme.",
  },
  {
    name: "Camila Ferreira",
    role: "Paciente",
    avatar: "CF",
    stars: 5,
    text: "Nunca tive um acompanhamento tão próximo. Minha nutricionista sabe do meu progresso antes mesmo da consulta.",
  },
  {
    name: "Dra. Juliana Alves",
    role: "Nutricionista Clínica",
    avatar: "JA",
    stars: 5,
    text: "A plataforma simplificou minha rotina e aumentou a adesão dos pacientes ao plano alimentar em mais de 60%.",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
        >
          <p className="text-xs uppercase tracking-widest text-primary font-mono-data mb-3">
            Depoimentos
          </p>
          <h2 className="text-3xl md:text-4xl text-foreground mb-4 text-balance">
            Quem usa, recomenda
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Veja o que pacientes e profissionais dizem sobre o VitaCare.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="glass-card rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1, ease }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary font-mono-data">
                    {t.avatar}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                "{t.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default TestimonialsSection