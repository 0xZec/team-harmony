import { LeaveRequest, Employee, Project, AutoApprovalResult, LeaveType } from '@/types/types';
import { differenceInCalendarDays, parseISO, isWithinInterval, addDays } from 'date-fns';

export function countLeaveDays(startDate: string, endDate: string): number {
  return differenceInCalendarDays(parseISO(endDate), parseISO(startDate)) + 1;
}

export function getOverlappingLeaves(
  leaveRequests: LeaveRequest[],
  startDate: string,
  endDate: string,
  excludeId?: string
): LeaveRequest[] {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  return leaveRequests.filter(lr => {
    if (lr.id === excludeId) return false;
    if (lr.status === 'Rejected') return false;
    const lrStart = parseISO(lr.startDate);
    const lrEnd = parseISO(lr.endDate);
    return lrStart <= end && lrEnd >= start;
  });
}

export function evaluateAutoApproval(
  request: LeaveRequest,
  employee: Employee,
  allRequests: LeaveRequest[],
  allProjects: Project[],
  teamSize: number
): AutoApprovalResult {
  // Rule 1: Team capacity >= 70%
  const overlapping = getOverlappingLeaves(allRequests, request.startDate, request.endDate, request.id);
  const onLeaveCount = overlapping.length + 1; // +1 for current request
  const capacityDuringLeave = ((teamSize - onLeaveCount) / teamSize) * 100;
  const capacityOk = capacityDuringLeave >= 70;

  // Rule 2: No deadlines within 3 days
  const reqStart = parseISO(request.startDate);
  const reqEnd = parseISO(request.endDate);
  const conflictingDeadlines = allProjects.filter(p => {
    const deadline = parseISO(p.deadline);
    const windowStart = addDays(reqStart, -3);
    const windowEnd = addDays(reqEnd, 3);
    return deadline >= windowStart && deadline <= windowEnd && p.assignedEmployees.includes(request.employeeId);
  });
  const noDeadlineConflict = conflictingDeadlines.length === 0;

  // Rule 3: Sufficient balance
  const days = countLeaveDays(request.startDate, request.endDate);
  const sufficientBalance = employee.leaveBalance[request.type] >= days;

  return {
    canAutoApprove: capacityOk && noDeadlineConflict && sufficientBalance,
    rules: { capacityOk, noDeadlineConflict, sufficientBalance },
    capacityDuringLeave: Math.round(capacityDuringLeave),
    conflictingDeadlines,
  };
}
