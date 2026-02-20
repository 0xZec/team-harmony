import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Reports = () => {
  const { leaveRequests, employees } = useAppContext();

  const typeData = (['Sick', 'Casual', 'Earned'] as const).map(type => ({
    name: type,
    value: leaveRequests.filter(lr => lr.type === type).length,
  }));
  const PIE_COLORS = ['hsl(0, 84%, 60%)', 'hsl(38, 92%, 50%)', 'hsl(142, 71%, 45%)'];

  // Status breakdown
  const statusData = (['Approved', 'Pending', 'Rejected'] as const).map(status => ({
    name: status,
    value: leaveRequests.filter(lr => lr.status === status).length,
  }));
  const STATUS_COLORS = ['hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)'];

  // Department-wise
  const departments = [...new Set(employees.map(e => e.department))];
  const deptData = departments.map(dept => {
    const deptEmployees = employees.filter(e => e.department === dept).map(e => e.id);
    const total = leaveRequests.filter(lr => deptEmployees.includes(lr.employeeId)).length;
    const approved = leaveRequests.filter(lr => deptEmployees.includes(lr.employeeId) && lr.status === 'Approved').length;
    const pending = leaveRequests.filter(lr => deptEmployees.includes(lr.employeeId) && lr.status === 'Pending').length;
    return { department: dept, total, approved, pending };
  });

  // Auto-approval stats (mock)
  const autoApproved = leaveRequests.filter(lr => lr.status === 'Approved').length;
  const manualReview = leaveRequests.filter(lr => lr.status === 'Pending' || lr.status === 'Rejected').length;
  const approvalData = [
    { name: 'Auto-Eligible', value: autoApproved },
    { name: 'Manual Review', value: manualReview },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-muted-foreground">Leave analytics and trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leave by Type */}
        <Card>
          <CardHeader><CardTitle>Leave by Type</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {typeData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card>
          <CardHeader><CardTitle>Request Status</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Trends */}
        <Card>
          <CardHeader><CardTitle>Department-wise Leaves</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="department" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Bar dataKey="approved" fill="hsl(142, 71%, 45%)" name="Approved" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="hsl(38, 92%, 50%)" name="Pending" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Auto vs Manual */}
        <Card>
          <CardHeader><CardTitle>Auto-Approval vs Manual Review</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={approvalData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  <Cell fill="hsl(142, 71%, 45%)" />
                  <Cell fill="hsl(38, 92%, 50%)" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
