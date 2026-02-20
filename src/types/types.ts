export type Role = 'employee' | 'manager';

export type LeaveType = 'Sick' | 'Casual' | 'Earned';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Employee {
  id: string;
  name: string;
  avatar: string;
  department: string;
  role: string;
  leaveBalance: Record<LeaveType, number>;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
  managerComment?: string;
}

export interface Project {
  id: string;
  name: string;
  deadline: string;
  assignedEmployees: string[];
  priority: 'High' | 'Medium' | 'Low';
}

export interface Notification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'approval' | 'rejection' | 'info';
}

export interface AutoApprovalResult {
  canAutoApprove: boolean;
  rules: {
    capacityOk: boolean;
    noDeadlineConflict: boolean;
    sufficientBalance: boolean;
  };
  capacityDuringLeave: number;
  conflictingDeadlines: Project[];
}
