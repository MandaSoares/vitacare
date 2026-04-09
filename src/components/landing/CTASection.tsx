import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
const ease = [0.22, 1, 0.36, 1] as const;
const CTASection = () => {
  const navigate = useNavigate();
  return (
    <section id="professionals" className="py-32">
      <div className="container mx-auto px-6">
        <motion.div
          className="glass-card-elevated rounded-2xl p-12 md:p-16 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
        >
          <p className="text-xs uppercase tracking-widest text-primary font-mono-data mb-4">
            Comece agora
          </p>
          <h2 className="text-3xl md:text-4xl text-foreground mb-4 text-balance">
            Pronto para transformar seu cuidado nutricional?
          </h2>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto">
            Seja paciente buscando resultados ou nutricionista buscando escala — o VitaCare é para você.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" onClick={() => navigate("/auth")}>
              Começar agora
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
            <Button variant="heroOutline" size="xl" onClick={() => navigate("/auth")}>
              Sou Nutricionista
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default CTASection;