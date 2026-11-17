"""Generate static/resume/resume.pdf from CV content (zero dependencies, pure Python)."""
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
    text(72, H - 108, 24, "F2", "THAE PHYU SOE"),
    text(72, H - 128, 11, "F1", "AI & Backend Development  |  Mandalay, Myanmar"),
    text(72, H - 146, 10, "F1", "thaephyusoe76890@gmail.com  |  +959-752-955-375  |  github.com/Thaephyu424"),
    line(72, H - 162, W - 72, H - 162, 1.2, 0.85),

    # Summary
    text(72, H - 192, 12, "F2", "PROFESSIONAL SUMMARY"),
    text(72, H - 212, 10, "F1",
         "Final-year Computer Science student specializing in AI, Databases, and Cloud Computing at the University"),
    text(72, H - 226, 10, "F1",
         "of Computer Studies (Mandalay). Strong foundation in Python (Django) and Java (Spring Boot) backend"),
    text(72, H - 240, 10, "F1",
         "development, data engineering fundamentals, relational database schema design, and system architecture."),
    text(72, H - 254, 10, "F1",
         "Applying analytical and programming capabilities in the UIT-CITT AI Internship program."),

    # Education
    text(72, H - 288, 12, "F2", "EDUCATION"),
    text(72, H - 308, 10.5, "F2", "Bachelor of Computer Science (B.C.Sc.)"),
    text(72, H - 322, 10, "F1", "University of Computer Studies (Mandalay)  |  2022 - 2027"),
    text(72, H - 338, 10, "F1", "Majors / Specializations: AI, Database Management, and Cloud Computing"),

    # Certifications
    text(72, H - 372, 12, "F2", "CERTIFICATIONS"),
    text(72, H - 392, 10, "F1", "- Data Engineering (DE Level-1 Certification) - Realistic Infotech Group (RIG)"),
    text(72, H - 408, 10, "F1", "- Japanese Language Proficiency Test (JLPT N3) - Passed"),
    line(72, H - 424, W - 72, H - 424),

    # Skills
    text(72, H - 448, 12, "F2", "TECHNICAL SKILLS"),
    text(72, H - 468, 10, "F1", "Programming Languages:  Java, JavaScript, PHP, C#, Python"),
    text(72, H - 484, 10, "F1", "Frameworks & Web:  Django, Spring Boot, HTML, CSS, Tailwind CSS"),
    text(72, H - 500, 10, "F1", "Databases & Data:  MySQL, Relational Database Design, Data Engineering (DE Level-1 Certified)"),
    text(72, H - 516, 10, "F1", "Developer Tools:  Git, GitHub, Figma, VS Code, PyCharm, Jupyter Notebook"),
    text(72, H - 532, 10, "F1", "Languages:  Burmese (Native), English (Intermediate), Japanese (JLPT N3)"),
    line(72, H - 548, W - 72, H - 548),

    # Experience & Activities
    text(72, H - 572, 12, "F2", "EXPERIENCE & ACTIVITIES"),
    text(72, H - 592, 10.5, "F2", "Academic Web & Backend Development - University of Computer Studies (Mandalay)"),
    text(72, H - 606, 9.5, "F1", "2022 - Present"),
    text(72, H - 622, 10, "F1", "- Built web applications with HTML, CSS, JavaScript, PHP, Java, and C# through academic projects."),
    text(72, H - 636, 10, "F1", "- Designed relational database schemas and practiced data engineering fundamentals."),
    text(72, H - 650, 10, "F1", "- Current focus: Python (Django), advanced backend systems, and system architecture."),

    text(72, H - 676, 10.5, "F2", "Static & Interactive Web Applications - University Project Competition"),
    text(72, H - 690, 9.5, "F1", "2023"),
    text(72, H - 706, 10, "F1", "- Collaborated under strict deadlines to build user-centric web applications (HTML/CSS/JavaScript)."),
    text(72, H - 720, 10, "F1", "- Applied Figma for UX/UI prototyping and layout structure before frontend implementation."),
    line(72, H - 736, W - 72, H - 736),

    # References
    text(72, H - 758, 12, "F2", "REFERENCES"),
    text(72, H - 774, 10, "F1", "University of Computer Studies (Mandalay), Department of Student Affairs - +959-2059604 - www.cumandalay.edu.mm"),
])

f1 = ("F1", "Helvetica", "Helvetica")
f2 = ("F2", "Helvetica-Bold", "Helvetica-Bold")

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
