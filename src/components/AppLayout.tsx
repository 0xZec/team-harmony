import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useAppContext } from '@/context/AppContext';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { role, setRole, notifications } = useAppContext();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b flex items-center justify-between px-4 bg-background">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold text-foreground">Chutti Chahiye?</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="role-toggle" className="text-xs text-muted-foreground">Employee</Label>
                <Switch
                  id="role-toggle"
                  checked={role === 'manager'}
                  onCheckedChange={(checked) => setRole(checked ? 'manager' : 'employee')}
                />
                <Label htmlFor="role-toggle" className="text-xs text-muted-foreground">Manager</Label>
              </div>
              <div className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground">
                    {unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 bg-muted/30 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
