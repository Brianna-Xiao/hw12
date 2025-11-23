import { NavLink } from "@/components/NavLink";
import { TrendingUp, Compass, User } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const links = [
    { to: "/invest", label: "Invest", icon: TrendingUp },
    { to: "/discover", label: "Discover", icon: Compass },
    { to: "/profile", label: "Profile", icon: User },
  ];

  return (
    <>
      {/* Desktop Navigation - Side */}
      <nav className="hidden md:flex fixed left-0 top-0 h-screen w-20 flex-col items-center justify-center gap-8 border-r border-border bg-card shadow-soft z-50">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className="flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 hover:bg-accent group"
            activeClassName="bg-primary/10 text-primary"
          >
            <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Mobile Navigation - Bottom */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around border-t border-border bg-card shadow-elevated z-50">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={cn(
              "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all duration-200"
            )}
            activeClassName="text-primary"
          >
            {({ isActive }) => (
              <>
                <Icon className={cn("w-6 h-6", isActive && "scale-110")} />
                <span className="text-xs font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Navigation;
