const phoneNumber = "5588999229020";

const serviceSelect = document.querySelector("#serviceSelect");
const patientName = document.querySelector("#patientName");
const patientEmail = document.querySelector("#patientEmail");
const bookingForm = document.querySelector("#agendamento");
const specialtyButtons = document.querySelectorAll("[data-service]");
const scheduleLinks = document.querySelectorAll(".schedule-link");
const serviceHelper = document.querySelector("#serviceHelper");
const reviewTrack = document.querySelector("#reviewTrack");
const siteHeader = document.querySelector(".site-header");
const imageLightbox = document.querySelector("#imageLightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxClose = document.querySelector(".lightbox-close");
let lastScrollY = window.scrollY;

function buildMessage(service) {
  const name = patientName?.value.trim();
  const email = patientEmail?.value.trim();
  const intro = name ? `Olá, meu nome é ${name}.` : "Olá.";
  const emailLine = email ? `Meu email é ${email}.` : "";

  return [
    intro,
    "Vim pelo site da Clínica Costa Campos.",
    `Gostaria de agendar atendimento para ${service}.`,
    emailLine,
    "Pode me informar os horários disponíveis?"
  ].filter(Boolean).join(" ");
}

function openWhatsApp(service) {
  const message = encodeURIComponent(buildMessage(service));
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank", "noopener");
}

function updateServiceHelper(service) {
  if (!serviceHelper) {
    return;
  }

  serviceHelper.classList.add("is-updating");
  window.setTimeout(() => {
    serviceHelper.textContent = `Vamos preparar sua mensagem para ${service}.`;
    serviceHelper.classList.remove("is-updating");
  }, 140);
}

bookingForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  openWhatsApp(serviceSelect.value);
});

serviceSelect?.addEventListener("change", () => {
  updateServiceHelper(serviceSelect.value);
});

specialtyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const service = button.dataset.service;
    serviceSelect.value = service;
    updateServiceHelper(service);
    document.querySelector("#agendamento")?.scrollIntoView({ behavior: "smooth" });
    serviceSelect.focus({ preventScroll: true });
  });
});

scheduleLinks.forEach((link) => {
  link.addEventListener("click", () => {
    window.setTimeout(() => {
      patientName?.focus({ preventScroll: true });
    }, 650);
  });
});

function closeLightbox() {
  imageLightbox?.classList.remove("is-open");
  imageLightbox?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("no-scroll");
  if (lightboxImage) {
    lightboxImage.src = "";
    lightboxImage.alt = "";
  }
}

document.querySelectorAll("[data-lightbox-src]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!imageLightbox || !lightboxImage) {
      return;
    }

    lightboxImage.src = button.dataset.lightboxSrc;
    lightboxImage.alt = button.dataset.lightboxAlt || "";
    imageLightbox.classList.add("is-open");
    imageLightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    lightboxClose?.focus({ preventScroll: true });
  });
});

document.addEventListener("click", (event) => {
  const image = event.target.closest(".doctor-card img");

  if (!image || !imageLightbox || !lightboxImage) {
    return;
  }

  lightboxImage.src = image.dataset.fullSrc || image.currentSrc || image.src;
  lightboxImage.alt = image.alt || "Profissional da Clínica Costa Campos";
  imageLightbox.classList.add("is-open");
  imageLightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  lightboxClose?.focus({ preventScroll: true });
});

lightboxClose?.addEventListener("click", closeLightbox);

imageLightbox?.addEventListener("click", (event) => {
  if (event.target === imageLightbox) {
    closeLightbox();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && imageLightbox?.classList.contains("is-open")) {
    closeLightbox();
  }
});

window.addEventListener("scroll", () => {
  if (!siteHeader) {
    return;
  }

  const currentScrollY = window.scrollY;
  const isScrollingDown = currentScrollY > lastScrollY + 8;
  const isScrollingUp = currentScrollY < lastScrollY - 8;

  if (isScrollingDown && currentScrollY > 140) {
    siteHeader.classList.add("is-hidden");
  }

  if (isScrollingUp || currentScrollY < 40) {
    siteHeader.classList.remove("is-hidden");
  }

  lastScrollY = currentScrollY;
}, { passive: true });

document.querySelectorAll(".professionals-track").forEach((track) => {
  const items = Array.from(track.children);
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });
});

if (reviewTrack) {
  const originalReviews = Array.from(reviewTrack.children);
  const beforeReviews = document.createDocumentFragment();
  const afterReviews = document.createDocumentFragment();

  originalReviews.forEach((item) => {
    const beforeClone = item.cloneNode(true);
    const afterClone = item.cloneNode(true);

    beforeClone.setAttribute("aria-hidden", "true");
    afterClone.setAttribute("aria-hidden", "true");
    beforeReviews.appendChild(beforeClone);
    afterReviews.appendChild(afterClone);
  });

  reviewTrack.prepend(beforeReviews);
  reviewTrack.appendChild(afterReviews);

  let activeReview = originalReviews.length;

  function centerActiveReview(animate = true) {
    const cards = Array.from(reviewTrack.children);
    const activeCard = cards[activeReview];
    const frame = reviewTrack.parentElement;

    if (!activeCard || !frame) {
      return;
    }

    cards.forEach((card, index) => {
      card.classList.toggle("is-active", index === activeReview);
    });

    reviewTrack.style.transition = animate ? "transform 620ms cubic-bezier(0.16, 1, 0.3, 1)" : "none";
    const offset = frame.clientWidth / 2 - (activeCard.offsetLeft + activeCard.offsetWidth / 2);
    reviewTrack.style.transform = `translate3d(${offset}px, 0, 0)`;

    if (!animate) {
      requestAnimationFrame(() => {
        reviewTrack.style.transition = "transform 620ms cubic-bezier(0.16, 1, 0.3, 1)";
      });
    }
  }

  centerActiveReview(false);

  window.addEventListener("resize", () => centerActiveReview(false));

  setInterval(() => {
    activeReview += 1;
    centerActiveReview(true);

    if (activeReview >= originalReviews.length * 2) {
      window.setTimeout(() => {
        activeReview = originalReviews.length;
        centerActiveReview(false);
      }, 680);
    }
  }, 3300);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
