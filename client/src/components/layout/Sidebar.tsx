import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  FolderClosed,
  Briefcase,
  Search,
  Network,
  TrendingUp,
  BarChart,
  Settings,
  HelpCircle,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { path: "/meus-projetos", label: "Meus Projetos", icon: <FolderClosed size={18} /> },
    { path: "/projetos-clientes", label: "Projetos de Clientes", icon: <Briefcase size={18} /> },
    { path: "/analise-keywords", label: "Análise de Keywords", icon: <Search size={18} /> },
    { path: "/clusters", label: "Clusters", icon: <Network size={18} /> },
    { path: "/melhorias-seo", label: "Melhorias SEO", icon: <TrendingUp size={18} /> },
    { path: "/relatorios", label: "Relatórios", icon: <BarChart size={18} /> },
    { path: "/configuracoes", label: "Configurações", icon: <Settings size={18} /> },
    { path: "/ajuda", label: "Ajuda", icon: <HelpCircle size={18} /> },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "translate-x-0" : ""}`}>
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Menu</h2>
        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={location === item.path ? "active" : ""}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
