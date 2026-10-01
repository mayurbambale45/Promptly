export type Domain = 'Software Engineering' | 'Legal' | 'Medical' | 'Finance' | 'Marketing' | 'Education' | 'Creative Writing' | 'Business';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  joinedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  title?: string;
  idea: string;
  domain: Domain;
  subDomain?: string;
  stage: number;
  blueprint?: {
    srs: string;
    prompts: { title: string; content: string }[];
    plan: string;
  };
  createdAt: string;
}

export interface AppState {
  currentStage: number; // 0: Role Selection, 1: Intake, 2: Clarification, 3: Dashboard, 10: History, 11: Solutions, 12: Pricing, 99: Admin
  user: User | null;
  selectedRole: 'user' | 'admin' | null;
  language: string;
  theme: 'light' | 'dark';
  domain: Domain | '';
  subDomain: string;
  idea: string;
  clarificationAnswers: Record<string, string>;
  projects: Project[];
}

export interface ClarifyingQuestion {
  id: string;
  text: string;
  options: string[];
}

export const LANGUAGES = [
  'English',
  'Hindi',
  'Marathi',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Russian',
  'Arabic',
  'Portuguese',
  'Italian',
  'Korean',
  'Dutch',
  'Turkish',
  'Vietnamese',
  'Thai',
  'Greek',
  'Hebrew',
  'Bengali'
];
