import { Employee, LeaveRequest, Project, Notification } from '@/types/types';

export const TEAM_SIZE = 8;

export const employees: Employee[] = [
  { id: 'emp-1', name: 'Aayush', avatar: 'AY', department: 'Engineering', role: 'Frontend Developer', leaveBalance: { Sick: 10, Casual: 8, Earned: 15 } },
  { id: 'emp-2', name: 'Vani Garg', avatar: 'VG', department: 'Engineering', role: 'Backend Developer', leaveBalance: { Sick: 7, Casual: 5, Earned: 12 } },
  { id: 'emp-3', name: 'Vivan', avatar: 'VA', department: 'Design', role: 'UI Designer', leaveBalance: { Sick: 9, Casual: 6, Earned: 14 } },
  { id: 'emp-4', name: 'Shaurya', avatar: 'SR', department: 'Engineering', role: 'DevOps Engineer', leaveBalance: { Sick: 10, Casual: 8, Earned: 15 } },
  { id: 'emp-5', name: 'Ankit', avatar: 'AN', department: 'Product', role: 'Product Manager', leaveBalance: { Sick: 6, Casual: 4, Earned: 10 } },
  { id: 'emp-6', name: 'Rohan', avatar: 'RH', department: 'Engineering', role: 'QA Engineer', leaveBalance: { Sick: 8, Casual: 7, Earned: 13 } },
  { id: 'emp-7', name: 'Arjun', avatar: 'AJ', department: 'Design', role: 'UX Researcher', leaveBalance: { Sick: 10, Casual: 8, Earned: 15 } },
  { id: 'emp-8', name: 'Priya Patel', avatar: 'PP', department: 'Engineering', role: 'Full Stack Developer', leaveBalance: { Sick: 5, Casual: 3, Earned: 11 } },
];

export const initialLeaveRequests: LeaveRequest[] = [
  { id: 'lr-1', employeeId: 'emp-2', type: 'Casual', startDate: '2026-02-23', endDate: '2026-02-24', reason: 'Family event', status: 'Pending', createdAt: '2026-02-18T10:00:00Z' },
  { id: 'lr-2', employeeId: 'emp-3', type: 'Sick', startDate: '2026-02-25', endDate: '2026-02-26', reason: 'Medical appointment', status: 'Pending', createdAt: '2026-02-19T09:00:00Z' },
  { id: 'lr-3', employeeId: 'emp-5', type: 'Earned', startDate: '2026-03-02', endDate: '2026-03-06', reason: 'Vacation trip', status: 'Pending', createdAt: '2026-02-17T14:00:00Z' },
  { id: 'lr-4', employeeId: 'emp-1', type: 'Sick', startDate: '2026-02-10', endDate: '2026-02-11', reason: 'Flu', status: 'Approved', createdAt: '2026-02-08T08:00:00Z' },
  { id: 'lr-5', employeeId: 'emp-1', type: 'Casual', startDate: '2026-01-20', endDate: '2026-01-20', reason: 'Personal errand', status: 'Approved', createdAt: '2026-01-18T11:00:00Z' },
  { id: 'lr-6', employeeId: 'emp-6', type: 'Earned', startDate: '2026-02-27', endDate: '2026-02-28', reason: 'Short break', status: 'Pending', createdAt: '2026-02-19T16:00:00Z' },
  { id: 'lr-7', employeeId: 'emp-4', type: 'Casual', startDate: '2026-01-15', endDate: '2026-01-16', reason: 'Moving house', status: 'Rejected', createdAt: '2026-01-12T09:00:00Z', managerComment: 'Critical deployment scheduled' },
  { id: 'lr-8', employeeId: 'emp-8', type: 'Sick', startDate: '2026-02-26', endDate: '2026-02-27', reason: 'Dental surgery', status: 'Pending', createdAt: '2026-02-20T08:00:00Z' },
];

export const projects: Project[] = [
  { id: 'proj-1', name: 'Platform v3.0 Launch', deadline: '2026-02-28', assignedEmployees: ['emp-1', 'emp-2', 'emp-4', 'emp-8'], priority: 'High' },
  { id: 'proj-2', name: 'Mobile App Redesign', deadline: '2026-03-05', assignedEmployees: ['emp-3', 'emp-7', 'emp-1'], priority: 'High' },
  { id: 'proj-3', name: 'Q1 Analytics Dashboard', deadline: '2026-03-15', assignedEmployees: ['emp-5', 'emp-6'], priority: 'Medium' },
  { id: 'proj-4', name: 'API Documentation Update', deadline: '2026-03-10', assignedEmployees: ['emp-2', 'emp-8'], priority: 'Low' },
  { id: 'proj-5', name: 'Security Audit', deadline: '2026-03-20', assignedEmployees: ['emp-4', 'emp-6'], priority: 'High' },
];

export const initialNotifications: Notification[] = [
  { id: 'n-1', message: 'Your Sick leave (Feb 10-11) was approved', timestamp: '2026-02-09T10:00:00Z', read: true, type: 'approval' },
  { id: 'n-2', message: 'Your Casual leave (Jan 20) was approved', timestamp: '2026-01-19T14:00:00Z', read: true, type: 'approval' },
  { id: 'n-3', message: 'New leave request submitted successfully', timestamp: '2026-02-18T10:00:00Z', read: false, type: 'info' },
];
