import { AppState, ClarifyingQuestion, Domain } from '../types';
import { api } from './api';

// Mock responses for the prototype
const MOCK_QUESTIONS: Record<Domain, ClarifyingQuestion[]> = {
    'Software Engineering': [
        { id: '1', text: 'Preferred Architectural Pattern?', options: ['Microservices', 'Monolithic', 'Serverless', 'Event-Driven'] },
        { id: '2', text: 'Compliance Standard?', options: ['SOC 2', 'ISO 27001', 'GDPR', 'None'] },
        { id: '3', text: 'Scale Requirement?', options: ['MVP (<1k)', 'Scale (10k-1M)', 'Hyperscale (1M+)'] }
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
        { id: '1', text: 'Primary channel?', options: ['Social Media', 'Email', 'SEO', 'PPC'] },
        { id: '2', text: 'Target audience?', options: ['Gen Z', 'Millennials', 'Professionals', 'Seniors'] },
        { id: '3', text: 'Campaign goal?', options: ['Brand Awareness', 'Lead Gen', 'Sales', 'Retention'] }
    ],
    'Education': [
        { id: '1', text: 'Target grade level?', options: ['K-12', 'University', 'Professional', 'Hobbyist'] },
        { id: '2', text: 'Learning format?', options: ['Video', 'Text', 'Interactive', 'Live'] },
        { id: '3', text: 'Assessment type?', options: ['Quiz', 'Project', 'Exam', 'None'] }
    ],
    'Creative Writing': [
        { id: '1', text: 'Genre?', options: ['Sci-Fi', 'Fantasy', 'Mystery', 'Romance'] },
        { id: '2', text: 'Length format?', options: ['Short Story', 'Novel', 'Screenplay', 'Poem'] },
        { id: '3', text: 'Tone?', options: ['Dark', 'Humorous', 'Inspiring', 'Educational'] }
    ],
    'Business': [
        { id: '1', text: 'Industry sector?', options: ['Retail', 'Tech', 'Services', 'Manufacturing'] },
        { id: '2', text: 'Business model?', options: ['B2B', 'B2C', 'SaaS', 'Marketplace'] },
        { id: '3', text: 'Growth stage?', options: ['Startup', 'Scale-up', 'Enterprise'] }
    ]
};

const EXPERT_PERSONAS: Record<Domain, string> = {
    'Software Engineering': 'Chief Technology Officer (CTO) & Principal Cloud Architect',
    'Legal': 'Senior Partner at a Top International Law Firm (Magic Circle)',
    'Medical': 'Chief Medical Officer (CMO) & Regulatory Affairs Director',
    'Finance': 'Quantitative Analyst (Quant) & Chief Risk Officer',
    'Marketing': 'Chief Marketing Officer (CMO) & Brand Strategist',
    'Education': 'Curriculum Director & EdTech Specialist',
    'Creative Writing': 'Best-Selling Author & Screenwriter',
    'Business': 'Management Consultant (MBB) & Venture Capitalist'
};

const EXECUTION_PLANS: Record<Domain, string> = {
    'Software Engineering': `
## Phase 1: Discovery & Architecture (Weeks 1-2)
- [ ] **Requirement Analysis**: Deep dive into user stories, defining functional & non-functional requirements (NFRs) based on IEEE 830.
- [ ] **System Design**: Define microservices boundaries, API contracts (OpenAPI 3.0), and database schemas (ERD).
- [ ] **Tech Stack Selection**: Finalize decision matrix for {Answer 1} architecture.
- [ ] **Compliance Review**: Security audit planning for {Answer 2}.

## Phase 2: Core Development (Weeks 3-8)
- [ ] **Infrastructure as Code**: Terraform setup for {Answer 3} scale requirements.
- [ ] **Authentication Module**: Implement OAuth2/OIDC provider integration.
- [ ] **Core Business Logic**: Develop main service layer with 90% unit test coverage.

## Phase 3: Integration & QA (Weeks 9-11)
- [ ] **Integration Testing**: End-to-end testing scenarios.
- [ ] **Performance Testing**: Load testing using k6 to validate {Answer 3}.
- [ ] **Security Pen-Testing**: OWASP Top 10 vulnerability assessment.

## Phase 4: Deployment & Maintenance
- [ ] **CI/CD Pipeline**: Blue-Green deployment strategy.
- [ ] **Observability**: Setup Prometheus/Grafana dashboards.
`,
    'Legal': `
## Phase 1: Due Diligence & Structuring
- [ ] **Jurisdictional Analysis**: Review case law in {Answer 1} relevant to the matter.
- [ ] **Risk Assessment**: Matrix analysis of {Answer 2} liability scenarios.
- [ ] **Term Sheet Drafting**: Establish key commercial terms with {Answer 3}.

## Phase 2: Drafting & Negotiation
- [ ] **Primary Instrument**: Draft master agreement using precision logic.
- [ ] **Schedule Generation**: Create specific schedules for SLAs and Deliverables.
- [ ] **Internal Review**: Peer review by subject matter expert.

## Phase 3: Execution & Closing
- [ ] **Final Reconciliation**: Address counterparty comments.
- [ ] **Signature**: Digital execution (eIDAS compliant).
- [ ] **Post-Closing**: Compliance filing and binder generation.
`,
    'Medical': `
## Phase 1: Regulatory Strategy
- [ ] **Classification**: Confirm device class under {Answer 1}.
- [ ] **Gap Analysis**: Assess current quality system against ISO 13485.

## Phase 2: Design & Development
- [ ] **Design Controls**: Establish DHF (Design History File).
- [ ] **Risk Management**: ISO 14971 Hazard Analysis.
- [ ] **Prototype V1**: Initial proof of concept.

## Phase 3: Verification & Validation
- [ ] **Bench Testing**: Electrical safety (IEC 60601) and biocompatibility (ISO 10993).
- [ ] **Clinical Evolution**: Protocol design for {Answer 3}.
`,
    'Finance': `
## Phase 1: Quantitative Modeling
- [ ] **Data Ingestion**: Setup pipelines for real-time market data ({Answer 2}).
- [ ] **Model Development**: Implement {Answer 3} in Python/C++.
- [ ] **Backtesting**: Validate strategy against 10-year historical data.

## Phase 2: Risk & Compliance
- [ ] **Regulatory Check**: Ensure adherence to {Answer 1}.
- [ ] **Stress Testing**: Run Monte Carlo simulations for extreme market conditions.

## Phase 3: Execution Infrastructure
- [ ] **Low-Latency Setup**:Co-location server configuration.
- [ ] **Order Management System**: FIX protocol integration.
`,
    'Marketing': `
## Phase 1: Market Research
- [ ] **Audience Analysis**: Deep dive into {Answer 2} demographics and psychographics.
- [ ] **Competitor Analysis**: SWOT analysis of top 5 competitors.

## Phase 2: Strategy Development
- [ ] **Channel Strategy**: Develop a plan for {Answer 1} dominance.
- [ ] **Content Calendar**: 3-month roadmap for {Answer 3}.

## Phase 3: Execution
- [ ] **Campaign Launch**: Rollout of initial creatives and copy.
- [ ] **Performance Tracking**: KPI dashboard setup (ROAS, CAC, LTV).
`,
    'Education': `
## Phase 1: Curriculum Design
- [ ] **Learning Objectives**: Define Bloom's Taxonomy goals for {Answer 1}.
- [ ] **Content Mapping**: Align with {Answer 3} requirements.

## Phase 2: Content Production
- [ ] **Material Creation**: Develop slides, scripts, and {Answer 2}.
- [ ] **Review**: Peer review by subject matter experts.

## Phase 3: Delivery & Assessment
- [ ] **LMS Setup**: Configure learning management system.
- [ ] **Pilot**: Beta test with a small group of students.
`,
    'Creative Writing': `
## Phase 1: World Building & Outlining
- [ ] **Setting the Scene**: Detailed notes on {Answer 1} environment.
- [ ] **Character Profiles**: Deep dive into protagonist/antagonist motivations.

## Phase 2: Drafting
- [ ] **Zero Draft**: Fast draft focusing on plot progression.
- [ ] **Scene Weaving**: Integrating {Answer 3} tone into key scenes.

## Phase 3: Revision
- [ ] **Developmental Edit**: structural changes for pacing.
- [ ] **Line Edit**: Polishing prose and dialogue.
`,
    'Business': `
## Phase 1: Market Analysis
- [ ] **Opportunity Assessment**: TAM/SAM/SOM analysis for {Answer 1}.
- [ ] **Business Model Canvas**: Defining value proposition for {Answer 2}.

## Phase 2: Strategic Planning
- [ ] **Financial Modeling**: 3-year P&L projection.
- [ ] **Go-to-Market**: Strategy for acquiring {Answer 3} customers.

## Phase 3: Execution
- [ ] **MVP Launch**: Minimum Viable Product rollout.
- [ ] **Feedback Loop**: Iterating based on initial user data.
`
};

export const geminiService = {
    generateQuestions: async (domain: Domain, idea: string, language: string): Promise<ClarifyingQuestion[]> => {
        // Simulate AI delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        return MOCK_QUESTIONS[domain] || MOCK_QUESTIONS['Software Engineering'];
    },

    generateBlueprint: async (
        state: AppState
    ): Promise<{ srs: string; prompts: { title: string; content: string }[]; plan: string }> => {
        try {
            // Call the real backend (which now protects the IP/logic)
            const { domain, idea, clarificationAnswers, subDomain } = state;
            return await api.generateBlueprint({ domain, idea, clarificationAnswers, subDomain });
        } catch (error) {
            console.error("AI Generation failed:", error);
            throw error;
        }
    }
};
