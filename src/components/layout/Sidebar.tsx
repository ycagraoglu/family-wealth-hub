import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowLeftRight, 
  Landmark, 
  CalendarCheck,
  Users,
  Settings,
  X,
  Menu
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/accounts', label: 'Hesaplar', icon: Wallet },
  { path: '/transactions', label: 'İşlemler', icon: ArrowLeftRight },
  { path: '/loans', label: 'Krediler', icon: Landmark },
  { path: '/subscriptions', label: 'Abonelikler', icon: CalendarCheck },
];

export const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-40 transition-all duration-300",
          "lg:translate-x-0 lg:w-64",
          isCollapsed ? "translate-x-0 w-64" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold">FamilyExpense</h1>
                <p className="text-xs text-muted-foreground">Aile Finansı</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <li key={item.path}>
                    <RouterNavLink
                      to={item.path}
                      onClick={() => setIsCollapsed(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive 
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20" 
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </RouterNavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-lg">
                👨‍💼
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">Ahmet</p>
                <p className="text-xs text-muted-foreground">Admin</p>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isCollapsed && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsCollapsed(false)}
        />
      )}
    </>
  );
};
