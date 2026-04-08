import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import NutritionistProfileDialog from "./NutritionistProfileDialog";


const ease = [0.22, 1, 0.36, 1] as const;

const categories = [
  "Todos",
  "Emagrecimento",
  "Esportiva",
  "Clínica",
  "Vegetariana / Vegana",
  "Pediatria",
  "Gestantes",
  "Doenças crônicas",
];


const nutritionists = [
  {
    name: "Dra. Ana Lima",
    crn: "CRN-3 · 45892",
    location: "São Paulo, SP",
    rating: 4.97,
    reviews: 214,
    price: 180,
    avatar: "AL",
    tags: ["Emagrecimento", "Esportiva", "Funcional"],
    attendance: "Online · Presencial",
  },
  {
    name: "Dr. Carlos Melo",
    crn: "CRN-1 · 38201",
    location: "Brasília, DF",
    rating: 4.91,
    reviews: 178,
    price: 150,
    avatar: "CM",
    tags: ["Clínica", "Doenças crônicas"],
    attendance: "Online",
  },
  {
    name: "Dra. Priya Santos",
    crn: "CRN-6 · 52140",
    location: "Campinas, SP",
    rating: 4.88,
    reviews: 132,
    price: 200,
    avatar: "PS",
    tags: ["Vegana", "Gestantes", "Pediatria"],
    attendance: "Presencial",
  },
  {
    name: "Dr. Rafael Mendes",
    crn: "CRN-4 · 61023",
    location: "Rio de Janeiro, RJ",
    rating: 4.95,
    reviews: 98,
    price: 220,
    avatar: "RM",
    tags: ["Esportiva", "Performance"],
    attendance: "Online · Presencial",
  },
  {
    name: "Dra. Juliana Alves",
    crn: "CRN-2 · 47890",
    location: "Belo Horizonte, MG",
    rating: 5.0,
    reviews: 84,
    price: 190,
    avatar: "JA",
    tags: ["Clínica", "Funcional", "Anti-inflamatória"],
    attendance: "Online",
  },
  {
    name: "Dra. Beatriz Rocha",
    crn: "CRN-5 · 33102",
    location: "Curitiba, PR",
    rating: 4.82,
    reviews: 63,
    price: 160,
    avatar: "BR",
    tags: ["Gestantes", "Pediatria"],
    attendance: "Presencial",
  },
];


const NutritionistsSection = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [selectedNutritionist, setSelectedNutritionist] = useState<(typeof nutritionists)[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [attendanceFilter, setAttendanceFilter] = useState("");
  
  const filtered = nutritionists.filter((n) => {
    const matchesCategory =
      activeCategory === "Todos" ||
      n.tags.some(
        (t) =>
          t.toLowerCase().includes(activeCategory.toLowerCase()) ||
          activeCategory.toLowerCase().includes(t.toLowerCase())
      );

    const matchesSearch =
      !searchTerm ||
      n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
      const matchesLocation =
      !locationFilter ||
      n.location.toLowerCase().includes(locationFilter.toLowerCase());
    
      const matchesAttendance =
      !attendanceFilter ||
      n.attendance.toLowerCase().includes(attendanceFilter.toLowerCase());
    
      return matchesCategory && matchesSearch && matchesLocation && matchesAttendance;
  });

   return (
    <section id="nutritionists" className="py-32 bg-primary">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
        >
          <p className="text-xs uppercase tracking-widest text-primary-foreground/60 font-mono-data mb-3">
            Profissionais
          </p>
          <h2 className="text-3xl md:text-4xl text-primary-foreground mb-4 text-balance">
            Nutricionistas verificados
          </h2>
          <p className="text-primary-foreground/70 max-w-lg mx-auto">
            Profissionais qualificados prontos para transformar sua alimentação.
          </p>
        </motion.div>
        <motion.div
          className="bg-card rounded-2xl p-2 flex flex-col md:flex-row items-stretch md:items-center gap-2 max-w-3xl mx-auto mb-8 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
        >
          <div className="flex items-center gap-2 px-4 py-2.5 flex-1 min-w-0">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Nome ou especialidade"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full min-w-0"
            />
          </div>
          <div className="hidden md:block w-px h-8 bg-border" />
          <div className="flex items-center gap-2 px-4 py-2.5 flex-1 min-w-0">
            <MapPin className="h-4 w-4 text-destructive/70 shrink-0" />
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-transparent text-sm text-muted-foreground outline-none w-full cursor-pointer"
            >
              <option value="">Estado ou cidade</option>
              <option value="São Paulo">São Paulo</option>
              <option value="Rio de Janeiro">Rio de Janeiro</option>
              <option value="Minas Gerais">Minas Gerais</option>
              <option value="Paraná">Paraná</option>
              <option value="Distrito Federal">Distrito Federal</option>
            </select>
          </div>
          <div className="hidden md:block w-px h-8 bg-border" />
          <div className="flex items-center gap-2 px-4 py-2.5 flex-1 min-w-0">
            <span className="text-base shrink-0"> </span>
            <select
              value={attendanceFilter}
              onChange={(e) => setAttendanceFilter(e.target.value)}
              className="bg-transparent text-sm text-muted-foreground outline-none w-full min-w-0 cursor-pointer"
            >
              <option value="">Atendimento</option>
              <option value="Online">Online</option>
              <option value="Presencial">Presencial</option>
            </select>
          </div>
          <Button className="rounded-xl shrink-0" size="lg">
            Buscar
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </motion.div>
        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2, ease }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-card text-foreground font-medium shadow-sm"
                  : "bg-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
        {filtered.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <Search className="mb-4 h-12 w-12 text-white/40" />
            <h3 className="mb-1 text-lg font-semibold text-white">Nutricionista não encontrado</h3>
            <p className="text-sm text-white/75">Tente ajustar os filtros ou buscar por outro termo.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((n, i) => (
              <motion.div
                key={n.name}
                className="bg-card rounded-2xl overflow-hidden flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease }}
              >
                <div className="relative bg-secondary h-44 flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary font-mono-data">
                      {n.avatar}
                    </span>
                  </div>
                  <span className="absolute top-3 right-3 text-[11px] px-2.5 py-1 rounded-full bg-primary text
                    {n.attendance}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-bold text-foreground">{n.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {n.crn} · {n.location}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {n.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2.5 py-0.5 rounded-full border border-border text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto pt-5 flex items-center justify-between border-t border-border/50 mt-5">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                        <span className="text-sm font-bold text-foreground font-mono-data">
                          {n.rating.toFixed(2)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({n.reviews})
                        </span>
                      </div>
                      <span className="text-sm font-bold text-foreground font-mono-data">
                        R${n.price}/consulta
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground text-xs"
                      onClick={() => {
                        setSelectedNutritionist(n);
                        setDialogOpen(true);
                      }}
                    >
                      Ver perfil
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <NutritionistProfileDialog
          nutritionist={selectedNutritionist}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    </section>
  );
};
export default NutritionistsSection

