// UI logic: theme toggle, mobile menu, scrollspy, reveal-on-scroll, contact form.

const html = document.documentElement;

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
