import { Home, BookOpen, Heart, StickyNote, User } from "lucide-react";
import { NavLink } from "./NavLink";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Início", to: "/" },
  { icon: BookOpen, label: "Receitas", to: "/recipes" },
  { icon: Heart, label: "Favoritos", to: "/favorites" },
  { icon: StickyNote, label: "Anotações", to: "/notes" },
  { icon: User, label: "Perfil", to: "/profile" },
];

export const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-smooth hover:bg-muted/50 min-w-[60px]"
            activeClassName="text-primary bg-primary/10"
          >
            {({ isActive }) => (
              <>
                <item.icon className={cn("w-5 h-5", isActive && "fill-primary")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};