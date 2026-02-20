import { useAppContext } from '@/context/AppContext';
import { projects, TEAM_SIZE } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getOverlappingLeaves } from '@/utils/autoApproval';
import { format, addDays, parseISO, startOfWeek, eachDayOfInterval } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import { AlertTriangle } from 'lucide-react';

const WorkloadAnalyzer = () => {
  const { leaveRequests, employees } = useAppContext();
  const today = new Date(2026, 1, 20);

  const capacityData = Array.from({ length: 14 }).map((_, i) => {
    const day = addDays(today, i);
    const dateStr = format(day, 'yyyy-MM-dd');
    const onLeave = getOverlappingLeaves(
      leaveRequests.filter(lr => lr.status !== 'Rejected'),
      dateStr, dateStr
    ).length;
    const capacity = Math.round(((TEAM_SIZE - onLeave) / TEAM_SIZE) * 100);
    return {
      date: format(day, 'MMM d'),
      dayName: format(day, 'EEE'),
      capacity,
      onLeave,
      available: TEAM_SIZE - onLeave,
    };
  });

  const weekStart = startOfWeek(today);
  const heatmapWeeks = Array.from({ length: 4 }).map((_, w) => {
    const weekDays = eachDayOfInterval({
      start: addDays(weekStart, w * 7),
      end: addDays(weekStart, w * 7 + 6),
    });
    return weekDays.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const onLeave = getOverlappingLeaves(
        leaveRequests.filter(lr => lr.status !== 'Rejected'),
        dateStr, dateStr
      ).length;
      const capacity = Math.round(((TEAM_SIZE - onLeave) / TEAM_SIZE) * 100);
      return { day, dateStr, capacity, onLeave, label: format(day, 'd') };
    });
  });

  const heatColor = (cap: number) => {
    if (cap >= 90) return 'bg-emerald-200';
    if (cap >= 70) return 'bg-emerald-100';
    if (cap >= 50) return 'bg-amber-200';
    return 'bg-red-200';
  };

  const deadlineOverlaps = projects.filter(p => {
    const pendingNear = getOverlappingLeaves(
      leaveRequests.filter(lr => lr.status === 'Pending'),
      format(addDays(parseISO(p.deadline), -3), 'yyyy-MM-dd'),
      p.deadline
    ).filter(lr => p.assignedEmployees.includes(lr.employeeId));
    return pendingNear.length > 0;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Workload Analyzer</h1>
        <p className="text-muted-foreground">Team capacity and impact visualization</p>
      </div>

      {deadlineOverlaps.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span className="font-semibold text-amber-800">Deadline Overlap Detected</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {deadlineOverlaps.map(p => (
                <Badge key={p.id} className="bg-amber-100 text-amber-800 border-amber-300" variant="outline">
                  {p.name} (due {format(parseISO(p.deadline), 'MMM d')})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Team Capacity — Next 14 Days</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={capacityData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                formatter={(value: number) => [`${value}%`, 'Capacity']}
              />
              <Bar dataKey="capacity" radius={[4, 4, 0, 0]}>
                {capacityData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.capacity >= 70 ? 'hsl(142, 71%, 45%)' : entry.capacity >= 50 ? 'hsl(38, 92%, 50%)' : 'hsl(0, 84%, 60%)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Weekly Availability Heatmap</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="grid grid-cols-8 gap-1">
              <div />
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground">{d}</div>
              ))}
            </div>
            {heatmapWeeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-8 gap-1">
                <div className="text-xs text-muted-foreground flex items-center">W{wi + 1}</div>
                {week.map(cell => (
                  <div
                    key={cell.dateStr}
                    className={`${heatColor(cell.capacity)} rounded p-2 text-center text-xs font-medium`}
                    title={`${cell.dateStr}: ${cell.capacity}% capacity`}
                  >
                    {cell.label}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-emerald-200" /> ≥90%</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-emerald-100" /> 70-89%</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-amber-200" /> 50-69%</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded bg-red-200" /> &lt;50%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkloadAnalyzer;
