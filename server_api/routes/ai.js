const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const EXPERT_PERSONAS = {
    'Software Engineering': 'Chief Technology Officer (CTO) & Principal Cloud Architect',
    'Legal': 'Senior Partner at a Top International Law Firm (Magic Circle)',
    'Medical': 'Chief Medical Officer (CMO) & Regulatory Affairs Director',
    'Finance': 'Quantitative Analyst (Quant) & Chief Risk Officer',
    'Marketing': 'Chief Marketing Officer (CMO) & Brand Strategist',
    'Education': 'Curriculum Director & EdTech Specialist',
    'Creative Writing': 'Best-Selling Author & Screenwriter',
    'Business': 'Management Consultant (MBB) & Venture Capitalist'
};

const EXECUTION_PLANS = {
    'Software Engineering': `## Phase 1: Discovery & Architecture (Weeks 1-2)
- [ ] **Requirement Analysis**: Deep dive into user stories, defining functional & non-functional requirements (NFRs) based on IEEE 830.
- [ ] **System Design**: Define microservices boundaries, API contracts (OpenAPI 3.0), and database schemas (ERD).
- [ ] **Tech Stack Selection**: Finalize decision matrix for the chosen architecture pattern.
- [ ] **Compliance Review**: Security audit planning.

## Phase 2: Core Development (Weeks 3-8)
- [ ] **Infrastructure as Code**: Terraform/CDK setup for cloud resources.
- [ ] **Authentication Module**: Implement OAuth2/OIDC provider integration.
- [ ] **Core Business Logic**: Develop main service layer with 90%+ unit test coverage.
- [ ] **API Gateway**: Setup rate limiting, versioning, and documentation.

## Phase 3: Integration & QA (Weeks 9-11)
- [ ] **Integration Testing**: End-to-end testing scenarios.
- [ ] **Performance Testing**: Load testing using k6 or Gatling.
- [ ] **Security Pen-Testing**: OWASP Top 10 vulnerability assessment.
- [ ] **Accessibility Audit**: WCAG 2.1 AA compliance check.

## Phase 4: Deployment & Maintenance
- [ ] **CI/CD Pipeline**: Blue-Green deployment strategy.
- [ ] **Observability**: Setup Prometheus/Grafana or Datadog dashboards.
- [ ] **Documentation**: API docs, runbooks, and architecture decision records (ADRs).`,
    
    'Legal': `## Phase 1: Due Diligence & Structuring
- [ ] **Jurisdictional Analysis**: Review case law and regulatory environment.
- [ ] **Risk Assessment**: Matrix analysis of liability scenarios.
- [ ] **Term Sheet Drafting**: Establish key commercial terms.

## Phase 2: Drafting & Negotiation
- [ ] **Primary Instrument**: Draft master agreement using precision legal logic.
- [ ] **Schedule Generation**: Create specific schedules for SLAs and Deliverables.
- [ ] **Internal Review**: Peer review by subject matter expert.
- [ ] **External Counsel**: Engage specialist counsel if cross-border issues arise.

## Phase 3: Execution & Closing
- [ ] **Final Reconciliation**: Address counterparty comments.
- [ ] **Signature**: Digital execution (eIDAS compliant).
- [ ] **Post-Closing**: Compliance filing and binder generation.
- [ ] **Ongoing Compliance**: Schedule periodic reviews and updates.`,
    
    'Medical': `## Phase 1: Regulatory Strategy
- [ ] **Classification**: Confirm device/solution class under applicable framework.
- [ ] **Gap Analysis**: Assess current quality system against ISO 13485.
- [ ] **Regulatory Pathway**: Define pre-submission meeting with regulatory body.

## Phase 2: Design & Development
- [ ] **Design Controls**: Establish DHF (Design History File).
- [ ] **Risk Management**: ISO 14971 Hazard Analysis & FMEA.
- [ ] **Prototype V1**: Initial proof of concept with clinical advisory board review.
- [ ] **Usability Engineering**: IEC 62366 human factors study.

## Phase 3: Verification & Validation
- [ ] **Bench Testing**: Applicable safety standards verification.
- [ ] **Biocompatibility**: ISO 10993 series testing if applicable.
- [ ] **Clinical Study**: Protocol design and IRB/Ethics committee approval.
- [ ] **Regulatory Submission**: Prepare and submit technical file.`,
    
    'Finance': `## Phase 1: Quantitative Modeling
- [ ] **Data Ingestion**: Setup pipelines for real-time market data.
- [ ] **Model Development**: Implement quantitative model in Python/R.
- [ ] **Backtesting**: Validate strategy against 10+ year historical data.
- [ ] **Parameter Optimization**: Grid search / Bayesian optimization.

## Phase 2: Risk & Compliance
- [ ] **Regulatory Check**: Ensure adherence to applicable framework.
- [ ] **Stress Testing**: Run Monte Carlo simulations for extreme market conditions.
- [ ] **Risk Limits**: Define position limits, drawdown thresholds, VaR caps.

## Phase 3: Execution Infrastructure
- [ ] **Low-Latency Setup**: Co-location or cloud proximity configuration.
- [ ] **Order Management System**: FIX protocol or REST API integration.
- [ ] **Monitoring**: Real-time P&L, risk dashboard, and alerting system.
- [ ] **Audit Trail**: Complete transaction logging for regulatory reporting.`,
    
    'Marketing': `## Phase 1: Market Research
- [ ] **Audience Analysis**: Deep dive into demographics, psychographics, and behavioral data.
- [ ] **Competitor Analysis**: SWOT analysis and competitive positioning matrix.
- [ ] **Brand Audit**: Review current brand assets, voice, and market perception.

## Phase 2: Strategy Development
- [ ] **Channel Strategy**: Define primary and secondary channel mix.
- [ ] **Content Calendar**: 3-6 month content roadmap with themes and formats.
- [ ] **Campaign Framework**: Define campaign structure, budgets, and KPIs.
- [ ] **Creative Brief**: Develop core messaging, value prop, and creative direction.

## Phase 3: Execution & Optimization
- [ ] **Campaign Launch**: Rollout of initial creatives, copy, and media buys.
- [ ] **A/B Testing**: Continuous split testing of key elements.
- [ ] **Performance Tracking**: KPI dashboard setup (ROAS, CAC, LTV, CTR).
- [ ] **Monthly Reporting**: Performance review and strategy refinement.`,
    
    'Education': `## Phase 1: Curriculum Design
- [ ] **Learning Objectives**: Define Bloom's Taxonomy goals for the target audience.
- [ ] **Content Mapping**: Align with relevant standards or certification requirements.
- [ ] **Instructional Design**: Choose appropriate pedagogical frameworks (ADDIE, SAM).

## Phase 2: Content Production
- [ ] **Material Creation**: Develop slides, scripts, videos, and interactive exercises.
- [ ] **SME Review**: Peer review by subject matter experts.
- [ ] **Accessibility**: Ensure content meets WCAG and UDL guidelines.

## Phase 3: Delivery & Assessment
- [ ] **LMS Setup**: Configure learning management system and enrollment flow.
- [ ] **Pilot**: Beta test with a small cohort and collect feedback.
- [ ] **Assessment Tools**: Implement formative and summative evaluations.
- [ ] **Iteration**: Refine content based on learner performance data.`,
    
    'Creative Writing': `## Phase 1: World Building & Outlining
- [ ] **Setting the Scene**: Detailed world-building notes and lore bible.
- [ ] **Character Profiles**: Deep dive into protagonist/antagonist motivations, arcs, and backstories.
- [ ] **Plot Structure**: Map out the three-act structure or chosen narrative framework.

## Phase 2: Drafting
- [ ] **Zero Draft**: Fast draft focusing on plot progression without self-editing.
- [ ] **Scene Weaving**: Integrating subplots, themes, and motifs.
- [ ] **Dialogue Pass**: Ensuring each character has a distinct voice.

## Phase 3: Revision
- [ ] **Developmental Edit**: Structural changes for pacing and narrative consistency.
- [ ] **Line Edit**: Polishing prose, tightening sentences, and improving flow.
- [ ] **Copy Edit**: Grammar, spelling, and punctuation pass.
- [ ] **Beta Readers**: Gather external feedback before final submission.`,
    
    'Business': `## Phase 1: Market Analysis
- [ ] **Opportunity Assessment**: TAM/SAM/SOM analysis and market sizing.
- [ ] **Business Model Canvas**: Defining value proposition, channels, and revenue streams.
- [ ] **Competitive Landscape**: Porter's Five Forces analysis.

## Phase 2: Strategic Planning
- [ ] **Financial Modeling**: 3-5 year P&L, cash flow, and balance sheet projections.
- [ ] **Go-to-Market Strategy**: Define acquisition channels, partnerships, and launch plan.
- [ ] **OKRs & KPIs**: Set quarterly objectives and measurable key results.

## Phase 3: Execution
- [ ] **Team Building**: Identify key hires and organizational structure.
- [ ] **MVP Launch**: Minimum Viable Product rollout with feedback loops.
- [ ] **Investor Relations**: Prepare pitch deck, data room, and investor communications.
- [ ] **Scaling Plan**: Define the criteria and playbook for geographic/vertical expansion.`
};

async function generateWithGemini(prompt) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        return null; // Fall back to mock
    }
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (err) {
        console.error('Gemini API error:', err.message);
        return null;
    }
}

router.post('/generate', async (req, res) => {
    const { domain, idea, clarificationAnswers, subDomain } = req.body;

    if (!domain || !idea) {
        return res.status(400).json({ error: 'Domain and idea are required' });
    }

    const persona = EXPERT_PERSONAS[domain] || 'Expert Principal Consultant';
    const answers = Object.entries(clarificationAnswers || {}).map(([k, v]) => `- Q${k}: ${v}`).join('\n');
    const projectId = 'PROMPTLY-' + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Try Gemini AI first
    const srsPrompt = `You are a ${persona} with 25+ years of experience. Generate a comprehensive System Requirements Specification (SRS) document for the following project:

Project: "${idea}"
Domain: ${domain}
Vertical: ${subDomain}
User Requirements:\n${answers}

Format as a professional SRS document with sections:
1. Vision Statement
2. Stakeholder Analysis  
3. Functional Requirements (at least 5 detailed requirements)
4. Non-Functional Requirements (performance, security, scalability)
5. Technical Architecture Overview
6. Data Model Overview
7. Integration Points & APIs
8. Compliance & Regulatory Considerations

Project ID: ${projectId}
Be specific, detailed, and professional. Use markdown formatting.`;

    const architectPromptContent = `[SYSTEM_PROTOCOL: ARCHITECT_LEVEL_7]\nAct as the ${persona} with over 25 years of industry-dominating experience. \nYour objective is to engineer a high-fidelity execution blueprint for the following project vision: "${idea}".\n\nPROJECT SPECIFICATIONS:\n- Primary Domain: ${domain}\n- Vertical: ${subDomain}\n- User Constraints & Feedback:\n${answers}\n\nEXECUTION PARAMETERS:\n1. Architectural Integrity: Define a multi-layer topology that prioritizes extreme scalability and structural modularity.\n2. Risk Mitigation: Identify potential failure points in the logic flow and provide sub-protocols for immediate failover.\n3. Resource Optimization: Design the solution to use minimal computational overhead while maintaining Maximum Throughput.\n4. Security Vectoring: Ensure every node in the proposed system adheres to international regulatory standards relevant to ${domain}.\n\nOUTPUT REQUIREMENTS:\n- Provide a full system hierarchy with component breakdown.\n- Include a technical stack decision matrix with pros/cons for each selection.\n- Outline a 12-month roadmap divided into bi-weekly development sprints.\n- Generate a "Proof of Concept" code snippet or structural logic map.\n- Define success metrics and KPIs for each phase.\n\nYour response must be formal, detailed, and ready for immediate implementation in an Enterprise environment.`;

    const criticPromptContent = `[SYSTEM_PROTOCOL: CRITIC_LEVEL_9]\nAct as a world-class Adversarial Auditor and Chief Risk Officer. \nYour task is to ruthlessly critique the architectural proposal for: "${idea}".\n\nCRITIQUE VECTORS:\n1. Compliance & Regulation: Analyze the synthesis against ${domain} legal/industry standards. Is it actually viable?\n2. Stress Testing: If this system experiences 10x the projected load, where does it break first?\n3. Technical Debt: Identify where the architect might have prioritized speed over long-term stability.\n4. Competitive Edge: Does this solution actually disrupt the current ${subDomain} market, or is it a derivative copy?\n5. Financial Viability: Is the ROI realistic given market conditions?\n\nUSER CONTEXT:\n${answers}\n\nDeliver a "Go/No-Go" report with specific remediations required for each identified vulnerability. Include:\n- Risk Score (1-10) for each vector\n- Concrete remediation steps\n- Timeline for addressing critical issues\n- Final recommendation: GO / NO-GO / GO WITH CONDITIONS`;

    let srsText = null;
    try {
        // Try to generate SRS with Gemini
        srsText = await generateWithGemini(srsPrompt);
    } catch(e) {
        console.error('Failed to generate SRS:', e);
    }

    // Fallback SRS if AI not available
    if (!srsText) {
        srsText = `# System Requirements Specification
**Project ID**: ${projectId}
**Domain**: ${domain} | **Vertical**: ${subDomain}
**Generated**: ${new Date().toISOString().split('T')[0]}

---

## 1. Vision Statement
To deliver a world-class ${subDomain} solution tailored for: "${idea}".

As a ${persona}, I have analyzed the current market conditions in ${domain}. The primary competitive advantage will be derived from the integration of context-aware logic layers and deep domain expertise.

## 2. Stakeholder Analysis
- **Primary Users**: End-users interacting with the ${subDomain} interface daily.
- **Secondary Users**: Administrators and system managers.
- **External Stakeholders**: Regulatory bodies, third-party integrators, and investors.

## 3. Functional Requirements
- **FR-01**: The system SHALL provide a robust ${subDomain} workflow with sub-500ms response times.
- **FR-02**: The system SHALL support multi-tenant architecture with isolated data environments.
- **FR-03**: The system SHALL integrate with industry-standard ${domain} APIs and data sources.
- **FR-04**: The system SHALL provide comprehensive audit logging for all critical operations.
- **FR-05**: The system SHALL support role-based access control (RBAC) with granular permissions.
- **FR-06**: The system SHALL implement real-time notifications for critical events.
- **FR-07**: The system SHALL provide data export capabilities in CSV, PDF, and JSON formats.

## 4. Non-Functional Requirements
- **Performance**: Latency under 500ms (P95), 99.9% uptime SLA.
- **Security**: End-to-end encryption (AES-256), OWASP Top 10 compliance.
- **Scalability**: Horizontal scaling to support 10M+ concurrent sessions.
- **Compliance**: Adherence to ${domain} regulatory standards.

## 5. Technical Architecture Overview
Utilizing a micro-kernel architecture with event-driven triggers for resource modulation. The system employs a CQRS pattern with separate read/write models for optimal performance.

## 6. Data Model Overview
Core entities: User, Session, ${subDomain.replace(/\s+/g, '')}Record, AuditLog, Configuration. Relationships are normalized to 3NF with denormalized read models for reporting.

## 7. Integration Points & APIs
- REST API: OpenAPI 3.0 specification with versioning.
- Webhooks: Real-time event notifications for partner systems.
- ${domain} specific data feeds and regulatory reporting endpoints.

## 8. Compliance & Regulatory Considerations
Based on the ${domain} domain, the following compliance frameworks apply:
${Object.entries(clarificationAnswers || {}).map(([k, v]) => `- Requirement ${k}: ${v} compliance standards`).join('\n')}`;
    }

    // Determine execution plan
    const plan = EXECUTION_PLANS[domain] || EXECUTION_PLANS['Business'];
    const finalPlan = plan
        .replace(/{Answer 1}/g, Object.values(clarificationAnswers || {})[0] || 'Standard')
        .replace(/{Answer 2}/g, Object.values(clarificationAnswers || {})[1] || 'Standard')
        .replace(/{Answer 3}/g, Object.values(clarificationAnswers || {})[2] || 'Standard');

    const blueprint = {
        srs: srsText,
        prompts: [
            { title: 'The Architect Prime', content: architectPromptContent },
            { title: 'The Adversarial Critic', content: criticPromptContent }
        ],
        plan: finalPlan
    };

    res.json(blueprint);
});

module.exports = router;
