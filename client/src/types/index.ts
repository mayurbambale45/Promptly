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
  title: string;
  domain: Domain;
  stage: number;
  createdAt: string;
}

export interface AppState {
  currentStage: number; // 0: Role Selection, 0.5: Auth, 1: Intake, ...
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
  options: string[]; // For lazy users
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
