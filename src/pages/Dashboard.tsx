import { useAppContext } from '@/context/AppContext';
import { EmployeeDashboard } from '@/components/dashboard/EmployeeDashboard';
import { ManagerDashboard } from '@/components/dashboard/ManagerDashboard';

const Dashboard = () => {
  const { role } = useAppContext();
  return role === 'employee' ? <EmployeeDashboard /> : <ManagerDashboard />;
};

export default Dashboard;
