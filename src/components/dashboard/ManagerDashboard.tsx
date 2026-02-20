import { useAppContext } from '@/context/AppContext';
import { projects, TEAM_SIZE } from '@/data/mockData';
import { evaluateAutoApproval } from '@/utils/autoApproval';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { CheckCircle2, XCircle, AlertTriangle, Users, Clock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { getOverlappingLeaves } from '@/utils/autoApproval';

export function ManagerDashboard() {
  const { leaveRequests, employees, updateRequestStatus } = useAppContext();
  const pendingRequests = leaveRequests.filter(lr => lr.status === 'Pending');
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  // Team availability today
  const today = new Date().toISOString().split('T')[0];
  const onLeaveToday = getOverlappingLeaves(leaveRequests.filter(lr => lr.status === 'Approved'), today, today);
  const availableToday = TEAM_SIZE - onLeaveToday.length;
  const capacityToday = Math.round((availableToday / TEAM_SIZE) * 100);

  const handleReject = () => {
    if (rejectId) {
      updateRequestStatus(rejectId, 'Rejected', comment);
      setRejectId(null);
      setComment('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Manager Dashboard</h1>
        <p className="text-muted-foreground">Review leave requests and monitor team availability</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle></CardHeader>
          <CardContent><span className="text-3xl font-bold text-amber-600">{pendingRequests.length}</span></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Team Size</CardTitle></CardHeader>
          <CardContent><span className="text-3xl font-bold text-foreground">{TEAM_SIZE}</span></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Available Today</CardTitle></CardHeader>
          <CardContent><span className="text-3xl font-bold text-emerald-600">{availableToday}</span></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Capacity Today</CardTitle></CardHeader>
          <CardContent>
            <span className={`text-3xl font-bold ${capacityToday >= 70 ? 'text-emerald-600' : 'text-red-600'}`}>{capacityToday}%</span>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Pending Leave Requests</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {pendingRequests.length === 0 && <p className="text-muted-foreground text-center py-8">No pending requests</p>}
          {pendingRequests.map(req => {
            const emp = employees.find(e => e.id === req.employeeId)!;
            const result = evaluateAutoApproval(req, emp, leaveRequests, projects, TEAM_SIZE);
            return (
              <div key={req.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{emp.name}</h3>
                    <p className="text-sm text-muted-foreground">{emp.role} · {emp.department}</p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">{req.type}</span> · {format(parseISO(req.startDate), 'MMM d')} – {format(parseISO(req.endDate), 'MMM d, yyyy')}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Reason: {req.reason}</p>
                  </div>
                  <div>
                    {result.canAutoApprove ? (
                      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200" variant="outline">
                        <ShieldCheck className="h-3 w-3 mr-1" /> Auto-Approve Recommended
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 border-red-200" variant="outline">
                        <AlertTriangle className="h-3 w-3 mr-1" /> High Impact
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Rule Breakdown */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded ${result.rules.capacityOk ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {result.rules.capacityOk ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    Capacity {result.capacityDuringLeave}%
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded ${result.rules.noDeadlineConflict ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {result.rules.noDeadlineConflict ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {result.rules.noDeadlineConflict ? 'No deadline conflicts' : `${result.conflictingDeadlines.length} deadline conflict(s)`}
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded ${result.rules.sufficientBalance ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {result.rules.sufficientBalance ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    {result.rules.sufficientBalance ? 'Sufficient balance' : 'Insufficient balance'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => updateRequestStatus(req.id, 'Approved')} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => setRejectId(req.id)}>
                    <XCircle className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Dialog open={!!rejectId} onOpenChange={() => { setRejectId(null); setComment(''); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reject Leave Request</DialogTitle></DialogHeader>
          <Textarea placeholder="Add a comment (optional)..." value={comment} onChange={e => setComment(e.target.value)} />
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectId(null); setComment(''); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleReject}>Reject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
