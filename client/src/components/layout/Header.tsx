import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon, MenuIcon } from "lucide-react";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Usar o useEffect para evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="bg-card dark:bg-card shadow-sm fixed w-full z-10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleSidebar}
            className="p-1 rounded-full md:hidden"
          >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
          <h1 className="text-xl font-semibold text-primary">SEO Project Manager</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/" className="hidden md:block text-sm font-medium hover:text-primary">
            Dashboard
          </Link>
          <Link href="/relatorios" className="hidden md:block text-sm font-medium hover:text-primary">
            Relatórios
          </Link>
          <Link href="/configuracoes" className="hidden md:block text-sm font-medium hover:text-primary">
            Configurações
          </Link>
          <Link href="/ajuda" className="hidden md:block text-sm font-medium hover:text-primary">
            Ajuda
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-1 rounded-full"
          >
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
            <span className="sr-only">Alternar tema</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
