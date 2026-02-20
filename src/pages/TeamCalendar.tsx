import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { projects } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getOverlappingLeaves } from '@/utils/autoApproval';
import { TEAM_SIZE } from '@/data/mockData';

const TeamCalendar = () => {
  const { leaveRequests, employees } = useAppContext();
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart);

  const approvedLeaves = leaveRequests.filter(lr => lr.status !== 'Rejected');

  const getLeavesForDay = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return getOverlappingLeaves(approvedLeaves, dateStr, dateStr);
  };

  const getDeadlinesForDay = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return projects.filter(p => p.deadline === dateStr);
  };

  const prevMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  const nextMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));

  const statusColor = (s: string) => {
    if (s === 'Approved') return 'bg-emerald-500';
    return 'bg-amber-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Team Calendar</h1>
        <p className="text-muted-foreground">View team leave schedules and project milestones</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={prevMonth}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" onClick={nextMonth}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="bg-muted p-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
            ))}
            {Array.from({ length: startPad }).map((_, i) => (
              <div key={`pad-${i}`} className="bg-background p-2 min-h-[100px]" />
            ))}
            {days.map(day => {
              const dayLeaves = getLeavesForDay(day);
              const dayDeadlines = getDeadlinesForDay(day);
              const capacity = Math.round(((TEAM_SIZE - dayLeaves.filter(l => l.status === 'Approved').length) / TEAM_SIZE) * 100);

              return (
                <div key={day.toISOString()} className={`bg-background p-2 min-h-[100px] ${isToday(day) ? 'ring-2 ring-primary ring-inset' : ''}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm ${isToday(day) ? 'font-bold text-primary' : 'text-foreground'}`}>{format(day, 'd')}</span>
                    {dayLeaves.length > 0 && (
                      <span className={`text-[10px] px-1 rounded ${capacity >= 70 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {capacity}%
                      </span>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    {dayLeaves.slice(0, 3).map(lr => {
                      const emp = employees.find(e => e.id === lr.employeeId);
                      return (
                        <div key={lr.id} className={`text-[10px] text-white px-1 rounded truncate ${statusColor(lr.status)}`}>
                          {emp?.name?.split(' ')[0]}
                        </div>
                      );
                    })}
                    {dayLeaves.length > 3 && <div className="text-[10px] text-muted-foreground">+{dayLeaves.length - 3} more</div>}
                    {dayDeadlines.map(p => (
                      <div key={p.id} className="text-[10px] bg-primary/10 text-primary px-1 rounded truncate font-medium">
                        📌 {p.name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-emerald-500" /> Approved</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-amber-500" /> Pending</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-primary/20" /> 📌 Deadline</span>
      </div>
    </div>
  );
};

export default TeamCalendar;
