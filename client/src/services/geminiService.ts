import { AppState, ClarifyingQuestion, Domain } from '../types';
import { api } from './api';

// Mock questions per domain (used as fallback)
const MOCK_QUESTIONS: Record<Domain, ClarifyingQuestion[]> = {
    'Software Engineering': [
        { id: '1', text: 'Preferred Architectural Pattern?', options: ['Microservices', 'Monolithic', 'Serverless', 'Event-Driven'] },
        { id: '2', text: 'Compliance Standard?', options: ['SOC 2', 'ISO 27001', 'GDPR', 'None'] },
        { id: '3', text: 'Scale Requirement?', options: ['MVP (<1k users)', 'Scale (10k-1M)', 'Hyperscale (1M+)', 'Internal Tool'] }
    ],
    'Legal': [
        { id: '1', text: 'Jurisdiction & Governing Law?', options: ['US (Delaware)', 'UK Common Law', 'EU (French)', 'International Arbitration'] },
        { id: '2', text: 'Liability Cap?', options: ['Standard', 'Uncapped', 'Mutual', 'Negotiable'] },
        { id: '3', text: 'Counterparty Type?', options: ['Enterprise', 'SMB', 'Consumer', 'Government'] }
    ],
    'Medical': [
        { id: '1', text: 'Regulatory Pathway?', options: ['FDA 510(k)', 'CE Mark', 'PMA', 'Wellness (Non-Reg)'] },
        { id: '2', text: 'Data Privacy Level?', options: ['HIPAA Strict', 'GDPR Health', 'Anonymized', 'Local Only'] },
        { id: '3', text: 'Clinical Trial Phase?', options: ['Pre-clinical', 'Phase I', 'Phase II/III', 'Post-Market'] }
    ],
    'Finance': [
        { id: '1', text: 'Regulatory Framework?', options: ['SEC / FINRA', 'Basel III', 'IFRS 9', 'MiFID II'] },
        { id: '2', text: 'Asset Class?', options: ['Equities', 'Derivatives', 'Fixed Income', 'Crypto'] },
        { id: '3', text: 'Risk Model?', options: ['Value-at-Risk (VaR)', 'Monte Carlo', 'Stress Testing', 'Alpha-Beta'] }
    ],
    'Marketing': [
        { id: '1', text: 'Primary Channel?', options: ['Social Media', 'Email', 'SEO', 'Paid Ads (PPC)'] },
        { id: '2', text: 'Target Audience?', options: ['Gen Z (18-25)', 'Millennials (26-40)', 'Professionals', 'Seniors (55+)'] },
        { id: '3', text: 'Campaign Goal?', options: ['Brand Awareness', 'Lead Generation', 'Direct Sales', 'Customer Retention'] }
    ],
    'Education': [
        { id: '1', text: 'Target Grade Level?', options: ['K-12', 'University', 'Professional Development', 'Hobbyist'] },
        { id: '2', text: 'Learning Format?', options: ['Video-based', 'Text & Articles', 'Interactive (Gamified)', 'Live Sessions'] },
        { id: '3', text: 'Assessment Type?', options: ['Quizzes & Tests', 'Project-based', 'Formal Exam', 'No Assessment'] }
    ],
    'Creative Writing': [
        { id: '1', text: 'Genre?', options: ['Sci-Fi / Speculative', 'Fantasy / Adventure', 'Mystery / Thriller', 'Romance / Drama'] },
        { id: '2', text: 'Length Format?', options: ['Short Story (<10k words)', 'Novella (10-40k)', 'Novel (40k+)', 'Screenplay'] },
        { id: '3', text: 'Tone & Audience?', options: ['Dark & Mature', 'Humorous & Light', 'Inspiring & Uplifting', 'Educational'] }
    ],
    'Business': [
        { id: '1', text: 'Industry Sector?', options: ['Retail & E-commerce', 'Technology & SaaS', 'Professional Services', 'Manufacturing'] },
        { id: '2', text: 'Business Model?', options: ['B2B (Business-to-Business)', 'B2C (Business-to-Consumer)', 'SaaS Platform', 'Marketplace'] },
        { id: '3', text: 'Growth Stage?', options: ['Pre-seed / Startup', 'Early Stage (Seed-A)', 'Scale-up (Series B+)', 'Enterprise'] }
    ]
};

export const geminiService = {
    generateQuestions: async (domain: Domain, idea: string, language: string): Promise<ClarifyingQuestion[]> => {
        // Simulate AI delay for realistic feel
        await new Promise(resolve => setTimeout(resolve, 1200));
        return MOCK_QUESTIONS[domain] || MOCK_QUESTIONS['Software Engineering'];
    },

    generateBlueprint: async (
        state: AppState
    ): Promise<{ srs: string; prompts: { title: string; content: string }[]; plan: string }> => {
        try {
            const { domain, idea, clarificationAnswers, subDomain } = state;
            return await api.generateBlueprint({ domain, idea, clarificationAnswers, subDomain });
        } catch (error) {
            console.error('AI Generation failed:', error);
            throw error;
        }
    }
};
