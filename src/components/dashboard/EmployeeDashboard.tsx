import { useAppContext } from '@/context/AppContext';
import { employees } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { Palmtree, Bell } from 'lucide-react';

export function EmployeeDashboard() {
  const { currentEmployeeId, leaveRequests, notifications, employees: emps } = useAppContext();
  const employee = emps.find(e => e.id === currentEmployeeId)!;
  const myRequests = leaveRequests.filter(lr => lr.employeeId === currentEmployeeId);
  const recentNotifications = notifications.slice(0, 5);

  const statusColor = (s: string) => {
    if (s === 'Approved') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (s === 'Rejected') return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-amber-100 text-amber-800 border-amber-200';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome back, {employee.name}</h1>
        <p className="text-muted-foreground">{employee.role} · {employee.department}</p>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['Sick', 'Casual', 'Earned'] as const).map(type => (
          <Card key={type}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{type} Leave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1">
                <span className="text-3xl font-bold text-foreground">{employee.leaveBalance[type]}</span>
                <span className="text-sm text-muted-foreground mb-1">days remaining</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palmtree className="h-5 w-5" /> Recent Leave Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRequests.slice(0, 5).map(lr => (
                    <TableRow key={lr.id}>
                      <TableCell className="font-medium">{lr.type}</TableCell>
                      <TableCell>{format(parseISO(lr.startDate), 'MMM d')} - {format(parseISO(lr.endDate), 'MMM d, yyyy')}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{lr.reason}</TableCell>
                      <TableCell><Badge className={statusColor(lr.status)} variant="outline">{lr.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentNotifications.map(n => (
              <div key={n.id} className={`p-3 rounded-lg border text-sm ${!n.read ? 'bg-primary/5 border-primary/20' : 'bg-muted/50'}`}>
                <p className="text-foreground">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{format(parseISO(n.timestamp), 'MMM d, h:mm a')}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
