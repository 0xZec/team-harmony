

# Automated Leave, Attendance & Workload Balancing System

## Overview
A professional SaaS-style application with mock data, featuring a role toggle to switch between Employee and Manager views. All core modules built in the first pass.

---

## Design System
- **Color palette**: Professional blues and greys with Red/Green/Amber status indicators
- **Layout**: Sidebar navigation + main content area
- **Components**: Shadcn UI tables, dialogs, calendars, charts (Recharts)

## Sidebar Navigation
- Dashboard (role-aware)
- My Leaves
- Team Calendar
- Project Deadlines
- Workload Analyzer
- Reports

## Module 1: Employee Dashboard
- **Leave Request Form**: Date range picker, leave type selector (Sick/Casual/Earned), reason field
- **Leave Balance Cards**: Visual cards showing remaining balance per leave type
- **Leave History Table**: Sortable table with status badges (Approved/Rejected/Pending)
- **Notifications Panel**: Real-time status updates on leave requests

## Module 2: Manager Dashboard
- **Pending Requests Queue**: List of leave requests with employee details, dates, and impact level
- **Auto-Approval Indicator**: Each request shows whether it qualifies for auto-approval with a breakdown of the 3 rules (capacity ≥70%, no deadlines within 3 days, sufficient balance)
- **Quick Actions**: Approve/Reject buttons with optional comments
- **Team Availability Summary**: At-a-glance view of team capacity today and this week

## Module 3: Team Calendar
- Monthly calendar view showing:
  - Employee leave periods (color-coded by status)
  - Project milestone markers
  - Team capacity indicator per day

## Module 4: Workload Analyzer & Impact Visualization
- **Team Capacity Chart**: Bar/area chart showing daily team capacity percentage
- **Deadline Overlap Detection**: When a leave request overlaps with a deadline, display a "High Impact" warning badge
- **Heatmap View**: Weekly heatmap showing team availability density

## Module 5: Project Deadlines
- List of upcoming project deadlines with assigned team members
- Impact indicator showing how current/pending leaves affect each deadline

## Module 6: Reports
- Leave utilization summary charts
- Department-wise leave trends
- Auto-approval vs manual approval statistics

## Auto-Approval Logic (Frontend)
Rule-based engine that evaluates each leave request:
1. ✅ Team capacity remains above 70% during requested period
2. ✅ No major deadlines within 3 days of the leave
3. ✅ Employee has sufficient leave balance

If all 3 pass → show "Auto-Approve Recommended" to manager. If any fail → show which rule(s) failed with a "High Impact" warning.

## Data
- Mock employees, projects, deadlines, and leave data
- Role toggle in the header to switch between Employee and Manager views
- All state managed reactively — approving a leave instantly updates balances, calendar, and workload charts

