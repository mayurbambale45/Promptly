const express = require('express');
const router = express.Router();

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

router.post('/generate', async (req, res) => {
    const { domain, idea, clarificationAnswers, subDomain } = req.body;

    // Simulate AI synthesis delay
    await new Promise(r => setTimeout(r, 2000));

    const persona = EXPERT_PERSONAS[domain] || 'Expert Principal Consultant';
    const answers = Object.entries(clarificationAnswers).map(([k, v]) => `- ${k}: ${v}`).join('\n');

    // Generating a LARGER (10-15 lines) robust prompt payload
    const longArchitectPrompt = `
[SYSTEM_PROTOCOL: ARCHITECT_LEVEL_7]
Act as the ${persona} with over 25 years of industry-dominating experience. 
Your objective is to engineer a high-fidelity execution blueprint for the following project vision: "${idea}".

PROJECT SPECIFICATIONS:
- Primary Domain: ${domain}
- Vertical: ${subDomain}
- User Constraints & Feedback:
${answers}

EXECUTION PARAMETERS:
1. Architectural Integrity: Define a multi-layer topology that prioritizes extreme scalability and structural modularity.
2. Risk Mitigation: Identify potential failure points in the logic flow and provide sub-protocols for immediate failover.
3. Resource Optimization: Design the solution to use minimal computational overhead while maintaining Maximum Throughput.
4. Security Vectoring: Ensure every node in the proposed system adheres to international regulatory standards relevant to ${domain}.

OUTPUT REQUIREMENTS:
- Provide a full system hierarchy.
- Include a technical stack decision matrix with pros/cons for each selection.
- Outline a 12-month roadmap divided into bi-weekly biological development cycles (Sprints).
- Generate a "Proof of Concept" (PoC) code snippet or structural logic map.

Your response must be formal, detailed, and ready for immediate implementation in an Enterprise environment.
    `.trim();

    const longCriticPrompt = `
[SYSTEM_PROTOCOL: CRITIC_LEVEL_9]
Act as a world-class Adversarial Auditor and Chief Risk Officer. 
Your task is to ruthlessly critique the architectural proposal for: "${idea}".

CRITIQUE VECTORS:
1. Compliance & Regulation: Analyze the synthesis against ${domain} legal/industry standards. Is it actually viable?
2. Stress Testing: If this system experiences 10x the projected load, where does it break first?
3. Technical Debt: Identify where the architect might have prioritized speed over long-term stability.
4. Competitive Edge: Does this solution actually disrupt the current ${subDomain} market, or is it a derivative copy?

USER CONTEXT:
${answers}

You are tasked with finding the "Impossible Problem" within this vision. 
If you cannot find a critical flaw, you are not looking hard enough. 
Deliver a "Go/No-Go" report with specific remediations required for each identified vulnerability.
    `.trim();

    const blueprint = {
        srs: `# System Requirements Specification\n**Project ID**: PROMPTLY-${Math.random().toString(36).substr(2, 9).toUpperCase()}\n\n## 1. Vision Statement\nTo deliver a world-class ${subDomain} solution specifically tailored for "${idea}".\n\n## 2. Industry Context\nAs a ${persona}, I have analyzed the current market conditions in ${domain}. The primary competitive advantage will be derived from the integration of context-aware logic layers.\n\n## 3. Core Requirements\n- **Functional**: High-fidelity synthesis of data from ${domain} data streams.\n- **Non-Functional**: Latency under 500ms, 99.99% availability, and SOC2 compliance.\n\n## 4. Technical Architecture\nUtilizing a micro-kernel architecture with event-driven triggers for resource modulation.`,
        prompts: [
            { title: 'The Architect Prime (15+ Lines)', content: longArchitectPrompt },
            { title: 'The Adversarial Critic (10+ Lines)', content: longCriticPrompt }
        ],
        plan: `## Phase 1: Inception (Weeks 1-4)\n- Market triangulation and node setup.\n- Security protocol definition.\n\n## Phase 2: Core Build (Weeks 5-16)\n- MVP construction of the ${subDomain} engine.\n- Integration with ${domain} legacy systems.\n\n## Phase 3: Stress Testing (Weeks 17-20)\n- Red-team security auditing.\n- Performance scaling to 10M concurrent sessions.`
    };

    res.json(blueprint);
});

module.exports = router;
