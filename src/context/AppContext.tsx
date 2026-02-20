import React, { createContext, useContext, useState, useCallback } from 'react';
import { Role, LeaveRequest, Notification, LeaveStatus, LeaveType } from '@/types/types';
import { employees as initialEmployees, initialLeaveRequests, initialNotifications } from '@/data/mockData';
import { countLeaveDays } from '@/utils/autoApproval';

interface AppState {
  role: Role;
  setRole: (r: Role) => void;
  currentEmployeeId: string;
  leaveRequests: LeaveRequest[];
  notifications: Notification[];
  employees: typeof initialEmployees;
  submitLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateRequestStatus: (id: string, status: LeaveStatus, comment?: string) => void;
}

const AppContext = createContext<AppState>({} as AppState);

export const useAppContext = () => useContext(AppContext);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>('employee');
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [employees, setEmployees] = useState(initialEmployees);
  const currentEmployeeId = 'emp-1'; // Alex Johnson

  const submitLeaveRequest = useCallback((req: Omit<LeaveRequest, 'id' | 'createdAt' | 'status'>) => {
    const newReq: LeaveRequest = {
      ...req,
      id: `lr-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    setLeaveRequests(prev => [newReq, ...prev]);
    setNotifications(prev => [{
      id: `n-${Date.now()}`,
      message: `Leave request (${req.type}) submitted for ${req.startDate} to ${req.endDate}`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'info',
    }, ...prev]);
  }, []);

  const updateRequestStatus = useCallback((id: string, status: LeaveStatus, comment?: string) => {
    setLeaveRequests(prev => prev.map(lr => {
      if (lr.id !== id) return lr;
      return { ...lr, status, managerComment: comment || lr.managerComment };
    }));

    const req = leaveRequests.find(lr => lr.id === id);
    if (req && status === 'Approved') {
      const days = countLeaveDays(req.startDate, req.endDate);
      setEmployees(prev => prev.map(emp => {
        if (emp.id !== req.employeeId) return emp;
        return {
          ...emp,
          leaveBalance: {
            ...emp.leaveBalance,
            [req.type]: Math.max(0, emp.leaveBalance[req.type as LeaveType] - days),
          },
        };
      }));
    }

    const emp = employees.find(e => e.id === req?.employeeId);
    setNotifications(prev => [{
      id: `n-${Date.now()}`,
      message: `${emp?.name}'s leave request was ${status.toLowerCase()}`,
      timestamp: new Date().toISOString(),
      read: false,
      type: status === 'Approved' ? 'approval' : 'rejection',
    }, ...prev]);
  }, [leaveRequests, employees]);

  return (
    <AppContext.Provider value={{
      role, setRole, currentEmployeeId,
      leaveRequests, notifications, employees,
      submitLeaveRequest, updateRequestStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
}
