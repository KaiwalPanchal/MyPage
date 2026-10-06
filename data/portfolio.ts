export const portfolioData = {
    personal: {
        name: "Kaiwal",
        surname: "Panchal",
        year: "2026",
        profession: "Applied AI Engineer",
        bio: "Building production LLM systems, deterministic grounding guardrails, and cost-aware multi-agent architectures.",
        availability: "Available for work",
        location: "Ahmedabad, India (Open to Relocation & Remote)",
        currentJob: {
            role: "Lead Engineer",
            company: "Sylvr",
            period: "Present"
        },
        focus: ["Python", "FastAPI", "LangGraph", "TypeScript", "Next.js", "MongoDB", "Docker"]
    },
    work: [
        {
            year: "Present",
            role: "Lead Engineer",
            company: "Sylvr",
            description: "Own backend and AI architecture behind sylvr.io: 4-stage news-intelligence pipeline with 3-tier source-quote verification, token-budgeted review extraction on open-weights Gemma, and brandOS e-commerce ingestion via Celery/Playwright.",
            tech: ["Python", "FastAPI", "MongoDB Atlas", "Celery", "Gemma", "Claude Haiku", "Playwright"],
            website: "https://sylvr.io/",
            linkedin: "https://in.linkedin.com/company/sylvr-by-50een"
        },
        {
            year: "2025",
            role: "AI & NLP Intern",
            company: "Sylvr",
            description: "Engineered multi-agent analytics workflows, automated PESTEL/market synthesis over unstructured data, and built review sentiment clustering pipelines.",
            tech: ["Python", "NLP", "LangGraph", "MongoDB", "spaCy"],
            website: "https://sylvr.io/",
            linkedin: "https://in.linkedin.com/company/sylvr-by-50een"
        },
        {
            year: "2025",
            role: "Machine Learning Intern",
            company: "Town Plan Map",
            description: "Optimized production inference latency for computer-vision layout-extraction models and developed automated parsers extracting plot dimensions and zoning details from vector CAD drawings and municipal planning PDFs.",
            tech: ["Python", "Computer Vision", "CAD Parsing", "NLP"],
            website: "https://townplanmap.com/",
            linkedin: "https://in.linkedin.com/company/town-plan-map"
        },
        {
            year: "2024",
            role: "GenAI Intern",
            company: "Office Solutions PVT LTD",
            description: "Co-developed DecisionPulse natural-language analytics agent over live Azure PostgreSQL with Google ADK routing and WebSocket streaming.",
            tech: ["GenAI", "Python", "Google ADK", "PostgreSQL", "FastAPI", "WebSockets"],
            website: "https://innovationalofficesolution.com/",
            linkedin: "https://www.linkedin.com/company/innovationalofficesolution"
        }
        // Note on Softcolon Technologies (2023): If you wish to include this, keep it as:
        // {
        //     year: "2023",
        //     role: "Web Development Intern",
        //     company: "Softcolon Technologies",
        //     description: "Engineered full-stack library management system with optimized data workflows.",
        //     tech: ["Web Development", "Full Stack", "TypeScript"],
        //     website: "https://www.softcolon.com/",
        //     linkedin: "https://in.linkedin.com/company/softcolon"
        // }
    ],
    projects: [
        {
            id: "airvon",
            title: "Airvon Engineering",
            tag: "HVAC & Cleanrooms",
            description: "Turnkey HVAC design, modular cleanrooms, and NABH healthcare facility interface in Ahmedabad. Engineered around ISO 14644, WHO-GMP, and USFDA standards with interactive system layouts, technical validation documentation, and responsive architectural aesthetics.",
            role: "Frontend & Web Interface Engineering",
            website: "https://airvon.in/",
            tech: ["Next.js", "TypeScript", "Tailwind CSS", "Technical Blueprints", "ISO Validation"]
        },
        {
            id: "sylvr",
            title: "Sylvr Intelligence",
            tag: "Brand Intelligence",
            description: "The intelligence layer for Indian consumer brands tracking 50,000+ D2C entities. Architected the interactive web platform, platform economics dashboards, automated PESTEL & market synthesis flows, and live metric explorers.",
            role: "Lead Systems & Frontend Architecture",
            website: "https://sylvr.io/",
            tech: ["Next.js", "React", "Tailwind CSS", "Streaming UI", "Data Analytics"]
        },
        {
            id: "mypage",
            title: "Kaiwal Panchal (MyPage)",
            tag: "Creative Dev & Shaders",
            description: "Bespoke personal portfolio featuring custom WebGL GPU caustic wave shaders, Lenis inertia scrolling, GSAP scrub typography, dynamic highlight masking, and a hidden interactive secret game system.",
            role: "Creative Development & Interaction Design",
            website: "https://kaiwalpanchal.github.io/MyPage/",
            tech: ["Next.js 15", "WebGL Shaders", "GSAP 3", "Lenis", "Secret Game HUD"]
        }
    ],
    thoughts: [
        {
            title: "Automating AutoCAD Entity Extraction with LLMs",
            excerpt: "Extracting boundary coordinates, plot dimensions, and zoning details using pyautocad and multi-pass structured prompts.",
            date: "Mar 2025",
            readTime: "5 min",
        }
    ],
    connect: {
        email: "kaiwalextra@gmail.com",
        socials: [
            { name: "GitHub", handle: "@KaiwalPanchal", url: "https://github.com/KaiwalPanchal" },
            { name: "LinkedIn", handle: "kaiwalpanchal", url: "https://in.linkedin.com/in/kaiwalpanchal" },
            { name: "X", handle: "@KaiwalPanchal", url: "https://x.com/KaiwalPanchal" }
        ]
    },
    footer: {
        copyright: "© 2026 Kaiwal Panchal. All rights reserved.",
        builtWith: "Built by Kaiwal Panchal"
    }
};
