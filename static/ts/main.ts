// UI logic: theme toggle, mobile menu, scrollspy, reveal-on-scroll, contact form.

const html = document.documentElement;

/* ---------- Language toggle (EN / JP) ---------- */
type Lang = "en" | "ja";

const I18N: Record<string, Record<Lang, string>> = {
  nav_about: { en: "About", ja: "自己紹介" },
  nav_projects: { en: "Projects", ja: "プロジェクト" },
  nav_skills: { en: "Skills", ja: "スキル" },
  nav_experience: { en: "Experience & Certs", ja: "経歴・資格" },
  nav_contact: { en: "Contact", ja: "お問い合わせ" },
  nav_resume: { en: "Download Resume ↓", ja: "履歴書ダウンロード ↓" },
  hero_badge: { en: "Open to AI & Software Engineering Internships", ja: "AI・ソフトウェアエンジニアリングインターンシップ募集中" },
  hero_wave: { en: "Hi, I'm Thae!", ja: "こんにちは、Thaeです！" },
  hero_sub: {
    en: "Final-year Computer Science student at the University of Computer Studies (Mandalay), specializing in AI, Databases, and Cloud Computing - building scalable backend systems with Python (Django) and Java (Spring Boot).",
    ja: "ヤンゴンコンピュータ大学（マンダレー）でAI・データベース・クラウドコンピューティングを専攻する最終学年の学生です。Python（Django）とJava（Spring Boot）によるスケーラブルなバックエンドシステムを構築しています。",
  },
  hero_role: { en: "AI & Backend Developer.", ja: "AI・バックエンド開発者。" },
  cta_projects: { en: "View Projects", ja: "プロジェクトを見る" },
  cta_contact: { en: "Contact Me", ja: "お問い合わせ" },
  about_label: { en: "01. About", ja: "01. 自己紹介" },
  about_title: { en: "ABOUT ME", ja: "自己紹介" },
  projects_label: { en: "02. Projects", ja: "02. プロジェクト" },
  projects_title: { en: "PROJECTS", ja: "プロジェクト" },
  filter_all: { en: "All", ja: "すべて" },
  filter_web: { en: "Full-Stack Web", ja: "フルスタックWeb" },
  pai_problem: { en: "Problem", ja: "課題" },
  pai_approach: { en: "Approach", ja: "手法" },
  pai_impact: { en: "Impact", ja: "成果" },
  demo: { en: "Live Demo", ja: "デモ" },
  repo: { en: "GitHub Repo", ja: "GitHubリポジトリ" },
  skills_label: { en: "03. Skills", ja: "03. スキル" },
  skills_title: { en: "SKILLS & TOOLS", ja: "スキル" },
  exp_label: { en: "04. Experience & Certifications", ja: "04. 経歴・資格" },
  exp_title: { en: "EXPERIENCE", ja: "経歴・資格" },
  contact_label: { en: "05. Contact", ja: "05. お問い合わせ" },
  contact_title: { en: "LET'S CONNECT!", ja: "お問い合わせ" },
  contact_desc: {
    en: "I'm currently seeking AI and software engineering internship opportunities. Whether you have an opening, a question, or just want to connect — my inbox is always open.",
    ja: "現在、AIおよびソフトウェアエンジニアリングのインターンシップの機会を探しています。ご質問やご連絡もお気軽にどうぞ。",
  },
  form_name: { en: "NAME", ja: "氏名" },
  form_email: { en: "EMAIL", ja: "メールアドレス" },
  form_message: { en: "MESSAGE", ja: "メッセージ" },
  form_send: { en: "Send message", ja: "送信する" },
};

let lang: Lang = "en";
try {
  lang = (localStorage.getItem("lang") as Lang) === "ja" ? "ja" : "en";
} catch {
  /* storage unavailable */
}

const langBtns = Array.from(document.querySelectorAll<HTMLButtonElement>(".lang-btn"));

function applyLang(next: Lang): void {
  lang = next;
  document.querySelectorAll<HTMLElement>("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const entry = key ? I18N[key] : undefined;
    if (entry) el.textContent = entry[next];
  });
  document.documentElement.lang = next === "ja" ? "ja" : "en";
  langBtns.forEach((b) => b.classList.toggle("lang-active", b.dataset.lang === next));
  try {
    localStorage.setItem("lang", next);
  } catch {
    /* storage unavailable */
  }
}

langBtns.forEach((b) => b.addEventListener("click", () => applyLang((b.dataset.lang as Lang) || "en")));
applyLang(lang);

/* ---------- Project filtering ---------- */
const filterBtns = Array.from(document.querySelectorAll<HTMLButtonElement>(".filter-btn"));
const projectCards = Array.from(document.querySelectorAll<HTMLElement>(".project-card"));

filterBtns.forEach((btn) =>
  btn.addEventListener("click", () => {
    const f = btn.dataset.filter || "all";
    filterBtns.forEach((b) => {
      const active = b === btn;
      b.classList.toggle("filter-active", active);
      b.setAttribute("aria-pressed", String(active));
    });
    projectCards.forEach((card) => {
      card.classList.toggle("hidden", f !== "all" && card.dataset.category !== f);
    });
  })
);

/* ---------- Theme toggle ---------- */
const themeToggle = document.getElementById("theme-toggle") as HTMLButtonElement | null;

function setTheme(mode: "dark" | "light"): void {
  html.classList.toggle("light", mode === "light");
  html.classList.toggle("dark", mode === "dark");
  try {
    localStorage.setItem("theme", mode);
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new CustomEvent("themechange", { detail: mode }));
}

themeToggle?.addEventListener("click", () => {
  setTheme(html.classList.contains("light") ? "dark" : "light");
});

/* ---------- Navbar background on scroll ---------- */
const navbar = document.getElementById("navbar");

function updateNavbar(): void {
  if (!navbar) return;
  if (window.scrollY > 24) {
    navbar.classList.add("bg-bg/80", "backdrop-blur-md", "border-border");
    navbar.classList.remove("border-transparent");
  } else {
    navbar.classList.remove("bg-bg/80", "backdrop-blur-md", "border-border");
    navbar.classList.add("border-transparent");
  }
}
window.addEventListener("scroll", updateNavbar, { passive: true });
updateNavbar();

/* ---------- Mobile menu ---------- */
const menuToggle = document.getElementById("menu-toggle") as HTMLButtonElement | null;
const mobileMenu = document.getElementById("mobile-menu");

function closeMenu(): void {
  mobileMenu?.classList.add("hidden");
  menuToggle?.setAttribute("aria-expanded", "false");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = !mobileMenu?.classList.contains("hidden");
  mobileMenu?.classList.toggle("hidden", isOpen);
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
});

document.querySelectorAll<HTMLAnchorElement>(".mobile-link").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

/* ---------- Scrollspy ---------- */
const sections = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".nav-link"));

const spy = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const id = entry.target.id;
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("text-accent", active);
        link.classList.toggle("text-muted", !active);
      });
    }
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((s) => spy.observe(s));

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------- Contact form ---------- */
const form = document.getElementById("contact-form") as HTMLFormElement | null;
const submitBtn = document.getElementById("contact-submit") as HTMLButtonElement | null;
const statusEl = document.getElementById("form-status");

function showError(field: string, msg: string | null): void {
  const input = form?.querySelector<HTMLInputElement>(`[name="${field}"]`);
  const errorEl = form?.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
  if (errorEl) {
    errorEl.textContent = msg ?? "";
    errorEl.classList.toggle("hidden", !msg);
  }
  if (input) {
    input.classList.toggle("border-red-400", Boolean(msg));
  }
}

form?.addEventListener("submit", async (ev) => {
  ev.preventDefault();

  const data = {
    name: (form.elements.namedItem("name") as HTMLInputElement).value,
    email: (form.elements.namedItem("email") as HTMLInputElement).value,
    message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    website: (form.elements.namedItem("website") as HTMLInputElement).value,
  };

  const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  let valid = true;
  showError("name", data.name.trim() ? null : "Please enter your name.");
  showError("email", EMAIL_RE.test(data.email) ? null : "Please enter a valid email.");
  showError("message", data.message.trim() ? null : "Please enter a message.");
  if (!data.name.trim() || !EMAIL_RE.test(data.email) || !data.message.trim()) valid = false;
  if (!valid) return;

  submitBtn?.setAttribute("disabled", "true");
  submitBtn!.textContent = "Sending…";
  if (statusEl) {
    statusEl.classList.add("hidden");
  }

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = (await res.json()) as { ok: boolean; message?: string; errors?: Record<string, string> };

    if (res.ok && body.ok) {
      form.reset();
      if (statusEl) {
        statusEl.textContent = "✔ " + (body.message ?? "Message sent!");
        statusEl.classList.remove("hidden");
        statusEl.classList.remove("text-red-400");
        statusEl.classList.add("text-accent");
      }
    } else {
      if (body.errors) {
        for (const [field, msg] of Object.entries(body.errors)) showError(field, msg);
      }
      throw new Error("validation");
    }
  } catch {
    if (statusEl) {
      statusEl.textContent = "✘ Something went wrong — please try again.";
      statusEl.classList.remove("hidden");
      statusEl.classList.add("text-red-400");
      statusEl.classList.remove("text-accent");
    }
  } finally {
    submitBtn?.removeAttribute("disabled");
    submitBtn!.textContent = "Send message";
  }
});
