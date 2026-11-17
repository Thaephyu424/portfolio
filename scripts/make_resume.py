"""Generate static/resume/resume.pdf (zero dependencies, pure Python)."""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "static" / "resume" / "resume.pdf"

W, H = 612, 792  # US Letter, points


def esc(s: str) -> str:
    return s.replace("\\", r"\\").replace("(", r"\(").replace(")", r"\)")


def text(x, y, size, font, s):
    return f"BT /{font} {size} Tf {x} {y} Td ({esc(s)}) Tj ET"


def line(x1, y1, x2, y2, wd=0.7, gray=0.8):
    return f"{gray} G {wd} w {x1} {y1} m {x2} {y2} l S"


content = "\n".join([
    # Accent header bar
    f"0.22 0.74 0.97 rg {W - 72} {H - 60} {-(W - 144)} {36} re f 0 g",
    text(72, H - 108, 24, "F2", "ALEX RIVERA"),
    text(72, H - 128, 11, "F1", "Software Engineer & AI Developer  |  San Francisco, CA"),
    text(72, H - 146, 10, "F1", "hello@alexrivera.dev  |  github.com/alexrivera  |  linkedin.com/in/alexrivera"),
    line(72, H - 162, W - 72, H - 162, 1.2, 0.85),

    # Summary
    text(72, H - 192, 12, "F2", "SUMMARY"),
    text(72, H - 212, 10, "F1",
         "Software engineer with 6+ years of experience building production web applications and"),
    text(72, H - 226, 10, "F1",
         "machine learning systems. Specialized in Python/Flask backends, TypeScript frontends,"),

    text(72, H - 240, 10, "F1",
         "and LLM/RAG pipelines serving millions of daily requests."),

    # Experience
    text(72, H - 274, 12, "F2", "EXPERIENCE"),
    text(72, H - 294, 10.5, "F2", "Senior Software Engineer - AI Platform, Nexlo Labs"),
    text(72, H - 308, 9.5, "F1", "2023 - Present"),
    text(72, H - 324, 10, "F1", "- Lead the AI platform team; shipped an internal LLM gateway used by 200+ engineers."),
    text(72, H - 338, 10, "F1", "- Cut model inference costs 38% via batching, quantization, and smart routing."),
    text(72, H - 352, 10, "F1", "- Mentor 4 engineers; own the hiring loop for ML infrastructure roles."),

    text(72, H - 378, 10.5, "F2", "Software Engineer, Cavella Health"),
    text(72, H - 392, 9.5, "F1", "2021 - 2023"),
    text(72, H - 408, 10, "F1", "- Built HIPAA-compliant document-intelligence pipeline (OCR + NLP), 100k docs/month."),
    text(72, H - 422, 10, "F1", "- Designed Flask microservices and PostgreSQL schemas for patient intake flows."),
    text(72, H - 436, 10, "F1", "- Reduced page load times 55% by migrating the frontend to TypeScript + Vite."),

    text(72, H - 462, 10.5, "F2", "Backend Engineer, Ferra Analytics"),
    text(72, H - 476, 9.5, "F1", "2019 - 2021"),
    text(72, H - 492, 10, "F1", "- Developed real-time data ingestion (Kafka + Python) for marketing analytics."),
    text(72, H - 506, 10, "F1", "- Introduced CI/CD with automated tests, cutting release cycle from 2 weeks to 2 days."),
    line(72, H - 524, W - 72, H - 524),

    # Skills
    text(72, H - 548, 12, "F2", "SKILLS"),
    text(72, H - 568, 10, "F1", "Languages:  Python, TypeScript, JavaScript, Go, SQL, Bash"),
    text(72, H - 584, 10, "F1", "AI / ML:  PyTorch, TensorFlow, Transformers, LangChain, RAG, scikit-learn"),
    text(72, H - 600, 10, "F1", "Backend:  Flask, FastAPI, Django, PostgreSQL, Redis, Celery, GraphQL"),
    text(72, H - 616, 10, "F1", "Frontend:  React, Tailwind CSS, Three.js, Vite, D3.js"),
    text(72, H - 632, 10, "F1", "Infra:  Docker, Kubernetes, AWS, GCP, Terraform, CI/CD, Linux"),
    line(72, H - 648, W - 72, H - 648),

    # Projects
    text(72, H - 672, 12, "F2", "SELECTED PROJECTS"),
    text(72, H - 692, 10, "F1", "- llm-orchestra: multi-provider LLM gateway with failover & cost tracking (12k+ stars)."),
    text(72, H - 708, 10, "F1", "- VisionGuard: real-time PPE-compliance computer vision, deployed in 40+ facilities."),
    text(72, H - 724, 10, "F1", "- DocPilot: RAG documentation assistant with citations, 94% answer accuracy."),

    # Certifications
    text(72, H - 748, 12, "F2", "CERTIFICATIONS"),
    text(72, H - 766, 10, "F1", "AWS Certified ML - Specialty (2024) | TensorFlow Developer Certificate (2023)"),
    text(72, H - 780, 10, "F1", "CKAD - Certified Kubernetes Application Developer (2023)"),
])

# Fonts
f1 = ("Font1", "Helvetica", "Helvetica")
f2 = ("Font2", "Helvetica-Bold", "Helvetica-Bold")

objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {W} {H}] /Contents 4 0 R "
    f"/Resources << /Font << /{f1[0]} << /Type /Font /Subtype /Type1 /BaseFont /{f1[2]} >> "
    f"/{f2[0]} << /Type /Font /Subtype /Type1 /BaseFont /{f2[2]} >> >> >> >>",
    f"<< /Length {len(content)} >>\nstream\n{content}\nendstream",
]

pdf = bytearray(b"%PDF-1.4\n")
offsets = []
for i, obj in enumerate(objects, start=1):
    offsets.append(len(pdf))
    pdf += f"{i} 0 obj\n{obj}\nendobj\n".encode()

xref_pos = len(pdf)
pdf += f"xref\n0 {len(objects) + 1}\n".encode()
pdf += b"0000000000 65535 f \n"
for off in offsets:
    pdf += f"{off:010d} 00000 n \n".encode()
pdf += (
    f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\n"
    f"startxref\n{xref_pos}\n%%EOF\n"
).encode()

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_bytes(pdf)
print(f"Wrote {OUT} ({len(pdf)} bytes)")
