const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll("[data-nav-link]")];
const revealSections = [...document.querySelectorAll("[data-reveal]")];

// Highlight the nav item that matches the section currently in view.
function setActiveLink(sectionId) {
  navLinks.forEach((link) => {
    const isMatch = link.getAttribute("href") === `#${sectionId}`;
    const line = link.querySelector("[data-nav-line]");

    link.classList.toggle("text-white", isMatch);
    link.classList.toggle("text-stone-400", !isMatch);
    link.classList.toggle("translate-x-1", isMatch);

    if (line) {
      line.classList.toggle("w-16", isMatch);
      line.classList.toggle("bg-white", isMatch);
      line.classList.toggle("w-8", !isMatch);
      line.classList.toggle("bg-stone-600", !isMatch);
    }
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    const visibleEntries = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visibleEntries.length > 0) {
      setActiveLink(visibleEntries[0].target.id);
    }
  },
  {
    rootMargin: "-35% 0px -45% 0px",
    threshold: [0.2, 0.4, 0.6],
  }
);

sections.forEach((section) => observer.observe(section));

if (sections.length > 0) {
  setActiveLink(sections[0].id);
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
