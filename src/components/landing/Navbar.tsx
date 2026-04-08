import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";
import { useEffect, useState } from "react";

const sections = [
  { id: "features", label: "Funcionalidades" },
  { id: "how-it-works", label: "Como funciona" },
  { id: "nutritionists", label: "Nutricionistas" },
  { id: "testimonials", label: "Depoimentos" },
  { id: "professionals", label: "Comece Agora" },
];

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5] }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold tracking-tight text-foreground">
            VitaCare
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm">
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`transition-colors ${
                activeSection === id
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => {}}>
            Entrar
          </Button>
          <Button variant="default" size="sm" onClick={() => {}}>
            Cadastrar
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
