
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum ProjectStatus {
  QUOTED = 'QUOTED',
  BOOKED = 'BOOKED',
  COMPLETED = 'COMPLETED',
  PAID = 'PAID'
}

export enum ProjectType {
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO',
  BOTH = 'BOTH'
}

export enum TaskStatus {
  PENDING = 'PENDING',
  PROGRESS = 'PROGRESS',
  FINISHED = 'FINISHED'
}

export interface UserProfile {
  ownerName: string;
  studioName: string;
  email: string;
  phone: string;
  password?: string;
  role: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  social?: string;
  address?: string;
  category: 'LEAD' | 'ACTIVE' | 'PREVIOUS';
}

export interface Professional {
  id: string;
  name: string;
  role: 'Photographer' | 'Cinematographer' | 'Editor' | 'Assistant';
  phone: string;
  dailyRate: number;
  portfolio?: string;
  location?: string;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  method: 'CASH' | 'BANK' | 'ONLINE';
  label: string;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  clientPhone?: string;
  location?: string;
  type: ProjectType;
  status: ProjectStatus;
  totalValue: number;
  payments: Payment[];
  date?: string;
}

export interface Transaction {
  id: string;
  projectId?: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  description: string;
  currency: 'USD' | 'BDT';
}

export interface Budget {
  category: string;
  limit: number;
  spent: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  category: string;
}

export interface Task {
  id: string;
  title: string;
  deadline: string;
  status: TaskStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export type AppView = 'DASHBOARD' | 'PROJECTS' | 'EVENTS' | 'FINANCE' | 'BUDGET' | 'SAVINGS' | 'AI_ASSISTANT' | 'TASKS' | 'CLIENTS' | 'TEAM' | 'INVOICES' | 'REPORTS' | 'PROFILE';

export interface LifeEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  category: string;
  description: string;
  clientName?: string;
  clientPhone?: string;
  location?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  schedule?: string;
  amount: number;
}

export interface SavedInvoice {
  id: string;
  projectId?: string;
  number: string;
  date: string;
  time: string;
  recipient: { name: string; email: string; phone: string; address: string };
  companyInfo: { name: string; address: string; email: string; phone: string };
  items: InvoiceItem[];
  paid: number;
  total: number;
}

export interface StorageData {
  projects: Project[];
  transactions: Transaction[];
  budgets: Budget[];
  savings: SavingsGoal[];
  events: LifeEvent[];
  tasks: Task[];
  clients: Client[];
  professionals: Professional[];
  invoices: SavedInvoice[];
  logo?: string;
  userProfile?: UserProfile;
}
