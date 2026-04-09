export type Category = 'Garten' | 'Haushalt' | 'Technik' | 'Einkauf' | 'Sonstiges';
export type JobStatus = 'offen' | 'vergeben' | 'zu_bestätigen' | 'erledigt';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'senior' | 'student';
  bio?: string;
  avatarUrl?: string;
  rating?: number;
  reviewCount?: number;
  joinedDate?: string;
  curaCoins?: number;
  // Student specific
  skills?: string[];
  verified?: boolean;
  availability?: string[];
  // Senior specific
  location?: string;
  radius?: number;
  needs?: string[];
  preference?: 'same' | 'change_ok';
  curaPlus?: boolean;
  emergencyContact?: string;
}

export interface Job {
  id: string;
  title: string;
  category: Category;
  date: string;
  location: string;
  reward: number;
  status: JobStatus;
  creatorId: string;
  assigneeId?: string;
  applicants: string[];
  paymentMethod: string;
  seniorRated?: boolean;
  studentRated?: boolean;
}

export type ViewType =
  | 'landing'
  | 'login'
  | 'register'
  | 'senior'
  | 'student'
  | 'wallet'
  | 'senior-payment'
  | 'insurance'
  | 'onboarding';
