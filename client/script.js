const revealSections = [...document.querySelectorAll("[data-reveal]")];
const typedHeadingConfig = [
  { sectionId: "skills", selector: "[data-skills-typed]", text: "My Skills" },
  { sectionId: "projects", selector: "[data-projects-typed]", text: "Projects" },
  { sectionId: "experience", selector: "[data-experience-typed]", text: "Experience" },
  { sectionId: "contact", selector: "[data-contact-typed]", text: "Contact" },
];

const typedHeadingState = new Map();

function playTypingEffect(sectionId, textElement, finalText) {
  const state = typedHeadingState.get(sectionId);
  if (!state || !textElement) {
    return;
  }

  if (state.timer) {
    clearInterval(state.timer);
  }

  let charIndex = 0;
  textElement.textContent = "";

  state.timer = setInterval(() => {
    charIndex += 1;
    textElement.textContent = finalText.slice(0, charIndex);

    if (charIndex >= finalText.length) {
      clearInterval(state.timer);
      state.timer = null;
    }
  }, 90);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove("opacity-0", "translate-y-8");
        entry.target.classList.add("opacity-100", "translate-y-0");
      }
    });
  },
  {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.16,
  }
);

revealSections.forEach((section) => {
  section.classList.add("opacity-0", "translate-y-8", "transition", "duration-700", "ease-out");
  revealObserver.observe(section);
});

typedHeadingConfig.forEach(({ sectionId, selector, text }) => {
  const sectionElement = document.getElementById(sectionId);
  const textElement = document.querySelector(selector);

  if (!sectionElement || !textElement) {
    return;
  }

  typedHeadingState.set(sectionId, { inView: false, timer: null });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const state = typedHeadingState.get(sectionId);
        if (!state) {
          return;
        }

        if (entry.isIntersecting && !state.inView) {
          state.inView = true;
          playTypingEffect(sectionId, textElement, text);
        } else if (!entry.isIntersecting) {
          state.inView = false;
        }
      });
    },
    {
      threshold: 0.55,
    }
  );

  sectionObserver.observe(sectionElement);
});

const form = document.getElementById("contactForm");
const statusText = document.getElementById("status");

if (form && statusText) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    statusText.textContent = "Sending message...";
    statusText.classList.remove("text-rose-300");
    statusText.classList.add("text-white");

    const data = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      message: document.getElementById("message").value.trim(),
    };

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        statusText.textContent = result.message || "Message sent successfully.";
        form.reset();
      } else {
        statusText.textContent = result.message || "Something went wrong.";
        statusText.classList.remove("text-white");
        statusText.classList.add("text-rose-300");
      }
    } catch (error) {
      statusText.textContent = "Cannot reach server. Please try again later.";
      statusText.classList.remove("text-white");
      statusText.classList.add("text-rose-300");
    }
  });
}
