export function createStatusUi(statusNode) {
  function set(message, type = "") {
    statusNode.textContent = message;
    statusNode.className = `status ${type}`.trim();
  }

  return { set };
}

export function bindRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}
