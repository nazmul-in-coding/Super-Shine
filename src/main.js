function currentPath() {
  const path = window.location.pathname.replace(/\.html$/, "").replace(/\/$/, "") || "/";
  return path;
}

function linkPath(href) {
  if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return null;
  }
  return href.replace(/\.html$/, "").replace(/\/$/, "") || "/";
}

function bindNav() {
  const path = currentPath();
  document.querySelectorAll(".nav-links a, .mobile-panel a").forEach((link) => {
    const href = linkPath(link.getAttribute("href"));
    if (href && href === path) {
      link.classList.add("active");
    }
  });

  const headerEl = document.getElementById("siteHeader");
  const toggle = document.querySelector(".menu-toggle");
  const panel = document.getElementById("mobileNav");

  window.addEventListener("scroll", () => {
    headerEl?.classList.toggle("scrolled", window.scrollY > 8);
  });

  toggle?.addEventListener("click", () => {
    const open = panel.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  panel?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      panel.classList.remove("open");
      toggle?.setAttribute("aria-expanded", "false");
    });
  });
}

function showToast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 4200);
}

function bindForms() {
  document.querySelectorAll("form[data-quote], form[data-contact]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let valid = true;
      form.querySelectorAll("[required]").forEach((field) => {
        const error = field.parentElement.querySelector(".error");
        const empty = !String(field.value).trim();
        const badEmail =
          field.type === "email" &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
        if (empty || badEmail) {
          valid = false;
          if (error) {
            error.textContent = empty
              ? "Dit veld is verplicht."
              : "Vul een geldig e-mailadres in.";
          }
          field.setAttribute("aria-invalid", "true");
        } else if (error) {
          error.textContent = "";
          field.removeAttribute("aria-invalid");
        }
      });
      if (!valid) {
        form.querySelector("[aria-invalid='true']")?.focus();
        return;
      }
      form.reset();
      showToast("Bedankt. We nemen binnen één werkdag contact op.");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindNav();
  bindForms();
});
