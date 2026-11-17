"""Portfolio content data. Edit this file to update the site."""

PROFILE = {
    "name": "Alex Rivera",
    "role": "Software Engineer & AI Developer",
    "tagline": "I build fast, intelligent products that ship to production.",
    "email": "hello@alexrivera.dev",
    "location": "San Francisco, CA",
    "github": "https://github.com/alexrivera",
    "linkedin": "https://www.linkedin.com/in/alexrivera",
    "twitter": "https://twitter.com/alexrivera",
}

ABOUT_TEXT = (
    "I'm a software engineer with 6+ years of experience designing and scaling "
    "web applications and machine learning systems. I specialize in Python/Flask "
    "backends, TypeScript frontends, and bringing AI features from prototype to "
    "production - including LLM-powered tooling, RAG pipelines, and real-time "
    "computer vision. I care about clean architecture, fast cold starts, and "
    "interfaces that feel effortless."
)

HIGHLIGHTS = [
    "6+ years shipping production software",
    "Built ML pipelines serving 10M+ requests/day",
    "Open-source contributor & mentor",
]

PROJECTS = [
    {
        "name": "llm-orchestra",
        "description": "Multi-provider LLM gateway with automatic failover, cost tracking, and response caching. Drop-in replacement for the OpenAI SDK.",
        "tech": ["Python", "FastAPI", "Redis", "TypeScript"],
        "link": "https://github.com/alexrivera/llm-orchestra",
        "highlight": "12k+ GitHub stars",
    },
    {
        "name": "VisionGuard",
        "description": "Real-time workplace safety computer-vision platform. Detects PPE compliance from CCTV streams with sub-200ms latency.",
        "tech": ["PyTorch", "YOLOv8", "Python", "React"],
        "link": "https://github.com/alexrivera/visionguard",
        "highlight": "Deployed in 40+ facilities",
    },
    {
        "name": "DocPilot",
        "description": "RAG-powered documentation assistant that answers questions from private codebases and wikis, with source citations.",
        "tech": ["Python", "Flask", "pgvector", "LangChain"],
        "link": "https://github.com/alexrivera/docpilot",
        "highlight": "94% answer accuracy",
    },
    {
        "name": "TrailMetrics",
        "description": "GPS analytics dashboard for endurance athletes with route heatmaps, elevation profiles, and ML-based fitness trends.",
        "tech": ["TypeScript", "D3.js", "Python", "PostGIS"],
        "link": "https://github.com/alexrivera/trailmetrics",
        "highlight": "30k active users",
    },
    {
        "name": "FormForge",
        "description": "Headless form backend with spam filtering, webhooks, and file uploads. Integrates with any static site in two lines.",
        "tech": ["Python", "Flask", "Celery", "Tailwind"],
        "link": "https://github.com/alexrivera/formforge",
        "highlight": "2M submissions processed",
    },
    {
        "name": "NeuralSketch",
        "description": "Browser-based sketch-to-image model using a distilled Stable Diffusion pipeline running fully client-side via WebGPU.",
        "tech": ["TypeScript", "WebGPU", "onnxruntime"],
        "link": "https://github.com/alexrivera/neuralsketch",
        "highlight": "Runs offline",
    },
]

SKILLS = {
    "Languages": ["Python", "TypeScript", "JavaScript", "Go", "SQL", "Bash"],
    "AI / ML": ["PyTorch", "TensorFlow", "Transformers", "LangChain", "RAG", "onnxruntime", "scikit-learn"],
    "Web & Backend": ["Flask", "FastAPI", "Django", "Node.js", "PostgreSQL", "Redis", "Celery", "GraphQL"],
    "Frontend": ["React", "Tailwind CSS", "Three.js", "Vite", "D3.js"],
    "Infra & Tools": ["Docker", "Kubernetes", "AWS", "GCP", "Terraform", "CI/CD", "Linux"],
}

EXPERIENCE = [
    {
        "role": "Senior Software Engineer - AI Platform",
        "company": "Nexlo Labs",
        "period": "2023 - Present",
        "points": [
            "Lead the AI platform team; shipped an internal LLM gateway used by 200+ engineers.",
            "Cut model inference costs 38% via batching, quantization, and smart routing.",
            "Mentor 4 engineers; own hiring loop for ML infrastructure roles.",
        ],
    },
    {
        "role": "Software Engineer",
        "company": "Cavella Health",
        "period": "2021 - 2023",
        "points": [
            "Built HIPAA-compliant document-intelligence pipeline (OCR + NLP) processing 100k docs/month.",
            "Designed Flask microservices and PostgreSQL schemas for patient intake flows.",
            "Reduced page load times 55% by moving the frontend to TypeScript + Vite.",
        ],
    },
    {
        "role": "Backend Engineer",
        "company": "Ferra Analytics",
        "period": "2019 - 2021",
        "points": [
            "Developed real-time data ingestion (Kafka + Python) for marketing analytics.",
            "Introduced CI/CD with automated tests, cutting release cycle from 2 weeks to 2 days.",
        ],
    },
]

CERTIFICATIONS = [
    {"name": "AWS Certified Machine Learning - Specialty", "issuer": "Amazon Web Services", "year": "2024"},
    {"name": "TensorFlow Developer Certificate", "issuer": "Google", "year": "2023"},
    {"name": "Certified Kubernetes Application Developer (CKAD)", "issuer": "CNCF", "year": "2023"},
    {"name": "Deep Learning Specialization", "issuer": "DeepLearning.AI", "year": "2021"},
]
