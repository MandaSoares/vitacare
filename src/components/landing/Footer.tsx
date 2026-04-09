import { Activity } from "lucide-react";
const Footer = () => {
  return (
    <footer className="border-t border-border py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">VitaCare</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2026 VitaCare. Nutrição baseada em dados.
        </p>
      </div>
    </footer>
  );
};
export default Footer;