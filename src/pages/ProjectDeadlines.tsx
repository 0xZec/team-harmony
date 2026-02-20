import { useAppContext } from '@/context/AppContext';
import { projects, TEAM_SIZE } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getOverlappingLeaves } from '@/utils/autoApproval';

const ProjectDeadlines = () => {
  const { leaveRequests, employees } = useAppContext();
  const today = new Date();

  const projectsWithImpact = projects.map(p => {
    const deadline = parseISO(p.deadline);
    const daysUntil = differenceInCalendarDays(deadline, today);
    const leavesNearDeadline = getOverlappingLeaves(
      leaveRequests.filter(lr => lr.status !== 'Rejected'),
      format(today, 'yyyy-MM-dd'),
      p.deadline
    ).filter(lr => p.assignedEmployees.includes(lr.employeeId));

    const impactLevel = leavesNearDeadline.length >= 2 ? 'High' : leavesNearDeadline.length === 1 ? 'Medium' : 'Low';
    return { ...p, daysUntil, leavesNearDeadline, impactLevel, deadline };
  }).sort((a, b) => a.daysUntil - b.daysUntil);

  const impactColor = (level: string) => {
    if (level === 'High') return 'bg-red-100 text-red-800 border-red-200';
    if (level === 'Medium') return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  const priorityColor = (p: string) => {
    if (p === 'High') return 'bg-red-100 text-red-800 border-red-200';
    if (p === 'Medium') return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Project Deadlines</h1>
        <p className="text-muted-foreground">Track deadlines and leave impact on projects</p>
      </div>

      <div className="grid gap-4">
        {projectsWithImpact.map(p => (
          <Card key={p.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{p.name}</CardTitle>
                  <Badge className={priorityColor(p.priority)} variant="outline">{p.priority}</Badge>
                </div>
                <Badge className={impactColor(p.impactLevel)} variant="outline">
                  {p.impactLevel === 'Low' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                  {p.impactLevel} Impact
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                <span>Deadline: <span className="font-medium text-foreground">{format(p.deadline, 'MMM d, yyyy')}</span></span>
                <span className={p.daysUntil <= 7 ? 'text-red-600 font-medium' : ''}>{p.daysUntil} days away</span>
                <span>{p.assignedEmployees.length} team members</span>
              </div>
              {p.leavesNearDeadline.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-amber-800 mb-2">⚠️ Team members on leave near deadline:</p>
                  <div className="flex flex-wrap gap-2">
                    {p.leavesNearDeadline.map(lr => {
                      const emp = employees.find(e => e.id === lr.employeeId);
                      return (
                        <Badge key={lr.id} variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                          {emp?.name} ({lr.type}, {format(parseISO(lr.startDate), 'MMM d')}-{format(parseISO(lr.endDate), 'MMM d')})
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-1">
                {p.assignedEmployees.map(empId => {
                  const emp = employees.find(e => e.id === empId);
                  const onLeave = p.leavesNearDeadline.some(lr => lr.employeeId === empId);
                  return (
                    <Badge key={empId} variant="outline" className={onLeave ? 'border-amber-300 bg-amber-50' : ''}>
                      {emp?.avatar}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectDeadlines;
