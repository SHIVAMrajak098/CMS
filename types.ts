
export enum Role {
  User = 'USER',
  Admin = 'ADMIN',
}

export enum Status {
  Submitted = 'Submitted',
  Classified = 'Classified',
  Assigned = 'Assigned',
  InProgress = 'In Progress',
  Resolved = 'Resolved',
  Closed = 'Closed',
}

export enum Urgency {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export enum Category {
  Infrastructure = 'Infrastructure',
  Service = 'Service',
  Safety = 'Safety',
  Billing = 'Billing',
  Other = 'Other',
}

export interface User {
  id: string;
  email: string;
  role: Role;
}

export interface AuditLogEntry {
  timestamp: string;
  adminId: string;
  action: string;
  details: string;
}

export interface Complaint {
  id: string;
  text: string;
  submittedBy: string; // User ID
  timestamp: string;
  status: Status;
  urgency: Urgency | null;
  category: Category | null;
  assignedTo: string | null; // Admin ID
  auditLog: AuditLogEntry[];
  location?: { lat: number; lng: number };
}
