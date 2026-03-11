// Main JS for portfolio interactions

(function () {
  const header = document.getElementById("site-header");
  const heroSection = document.getElementById("hero");
  const navLinks = document.querySelectorAll(".nav__link");
  const mobileLinks = document.querySelectorAll(".nav__mobile-link");
  const mobileToggle = document.querySelector(".nav__toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const backToTopBtn = document.querySelector(".back-to-top");
  const viewProjectsBtn = document.querySelector('[data-scroll-target="#projects"]');
  const typingTextEl = document.getElementById("typing-text");
  const particlesCanvas = document.getElementById("hero-particles");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const modal = document.getElementById("project-modal");
  const modalCloseEls = modal ? modal.querySelectorAll("[data-close-modal]") : [];

  let lastScrollY = window.scrollY;

  // ------------------------------------------
  // Smooth scroll helper
  // ------------------------------------------
  function smoothScrollTo(targetSelector) {
    const target = document.querySelector(targetSelector);
    if (!target) return;
    const headerHeight = header ? header.offsetHeight : 0;
    const rect = target.getBoundingClientRect();
    const targetY = rect.top + window.scrollY - headerHeight + 4;

    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  }

  // ------------------------------------------
  // Navbar behavior
  // ------------------------------------------
  function updateHeaderState() {
    const scrollY = window.scrollY;
    if (!heroSection) return;

    const heroHeight = heroSection.offsetHeight;
    if (scrollY > heroHeight * 0.25) {
      header.classList.add("site-header--scrolled");
    } else {
      header.classList.remove("site-header--scrolled");
    }

    // Show / hide back-to-top (smooth fade via CSS class)
    if (backToTopBtn) {
      if (scrollY > heroHeight * 0.5) {
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.remove("visible");
      }
    }

    lastScrollY = scrollY;
  }

  // Active section highlighting
  function setupSectionObserver() {
    const sections = document.querySelectorAll("section[id]");
    if (!("IntersectionObserver" in window) || !sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              const href = link.getAttribute("href");
              if (href === `#${id}`) {
                link.classList.add("nav__link--active");
              } else {
                link.classList.remove("nav__link--active");
              }
            });
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // ------------------------------------------
  // Mobile menu
  // ------------------------------------------
  function toggleMobileMenu(forceState) {
    if (!mobileToggle || !mobileMenu) return;
    const isOpen =
      typeof forceState === "boolean"
        ? forceState
        : !mobileMenu.classList.contains("nav__mobile-menu--open");

    if (isOpen) {
      mobileMenu.classList.add("nav__mobile-menu--open");
      mobileToggle.classList.add("nav__toggle--open");
      mobileToggle.setAttribute("aria-expanded", "true");
      mobileMenu.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    } else {
      mobileMenu.classList.remove("nav__mobile-menu--open");
      mobileToggle.classList.remove("nav__toggle--open");
      mobileToggle.setAttribute("aria-expanded", "false");
      mobileMenu.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => toggleMobileMenu());
  }

  mobileLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        toggleMobileMenu(false);
        smoothScrollTo(href);
      }
    });
  });

  // ------------------------------------------
  // Smooth scroll for nav and hero buttons
  // ------------------------------------------
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        smoothScrollTo(href);
      }
    });
  });

  if (viewProjectsBtn) {
    viewProjectsBtn.addEventListener("click", () => {
      const target = viewProjectsBtn.getAttribute("data-scroll-target");
      if (target) smoothScrollTo(target);
    });
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  window.addEventListener("scroll", updateHeaderState, { passive: true });
  window.addEventListener("load", updateHeaderState);

  // ------------------------------------------
  // Typing effect
  // ------------------------------------------
  const typingPhrases = [
    "RAG Systems Expert",
    "Multi-Agent Architect",
    "Hackathon Winner",
    "Data + AI Engineer",
  ];

  let typingIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimeoutId = null;

  function typeLoop() {
    if (!typingTextEl) return;

    const currentPhrase = typingPhrases[typingIndex];
    const displayed =
      isDeleting ? currentPhrase.substring(0, charIndex - 1) : currentPhrase.substring(0, charIndex + 1);

    typingTextEl.textContent = displayed;

    if (!isDeleting && displayed.length === currentPhrase.length) {
      isDeleting = true;
      typingTimeoutId = setTimeout(typeLoop, 1800);
      return;
    }

    if (isDeleting && displayed.length === 0) {
      isDeleting = false;
      typingIndex = (typingIndex + 1) % typingPhrases.length;
      charIndex = 0;
      typingTimeoutId = setTimeout(typeLoop, 350);
      return;
    }

    charIndex = displayed.length;
    const baseSpeed = isDeleting ? 60 : 90;
    typingTimeoutId = setTimeout(typeLoop, baseSpeed + Math.random() * 50);
  }

  if (typingTextEl) {
    typeLoop();
    window.addEventListener("beforeunload", () => {
      if (typingTimeoutId) clearTimeout(typingTimeoutId);
    });
  }

  // ------------------------------------------
  // Scroll reveal animations
  // ------------------------------------------
  function setupScrollReveal() {
    const revealEls = document.querySelectorAll(".reveal-on-scroll");
    if (!("IntersectionObserver" in window) || !revealEls.length) {
      revealEls.forEach((el) => el.classList.add("in-view"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const index = parseInt(el.dataset.revealIndex || "0", 10);
            el.style.transitionDelay = index * 80 + "ms";
            el.classList.add("in-view");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach((el, i) => {
      el.dataset.revealIndex = String(i);
      observer.observe(el);
    });
  }

  setupScrollReveal();
  setupSectionObserver();

  // ------------------------------------------
  // Project filters
  // ------------------------------------------
  function applyFilter(filter) {
    projectCards.forEach((card) => {
      const categories = (card.getAttribute("data-category") || "").toLowerCase();
      const isVisible = filter === "all" || categories.includes(filter);
      card.style.opacity = isVisible ? "1" : "0";
      card.style.transform = isVisible ? "" : "translateY(10px)";
      card.style.pointerEvents = isVisible ? "auto" : "none";
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter") || "all";
      filterButtons.forEach((b) => b.classList.remove("filter-btn--active"));
      btn.classList.add("filter-btn--active");
      applyFilter(filter);
    });
  });

  // ------------------------------------------
  // Project modal data
  // ------------------------------------------
  const projectData = {
    "agentic-rag": {
      badge: "🏆 2nd Place Winner",
      title: "Agentic RAG Chatbot",
      subtitle: "Hybrid retrieval system with persistent memory",
      description:
        "A production-ready Agentic RAG chatbot that combines BM25 and semantic retrieval with a LangGraph-powered state machine for long-term memory and conversation management. The system is fully local using Ollama, achieving a 0.88 RAGAS faithfulness score and sub-second latency on typical workloads.",
      features: [
        "Hybrid BM25 + dense vector retrieval with dynamic routing",
        "LangGraph agent orchestration for conversation and memory state",
        "FlashRank cross-encoder for high-precision reranking of candidates",
        "Configurable retriever pipeline with evaluation-oriented tracing",
        "Observability hooks for latency, top-k statistics, and context window usage",
      ],
      metrics: [
        "0.88 RAGAS faithfulness score on evaluation dataset",
        "< 1 second median end-to-end latency on consumer hardware",
        "100% local inference using Ollama models (no external APIs)",
        "Stable context management over multi-turn conversations",
      ],
      challenges: [
        "Balancing retrieval recall vs. context window limits for long conversations",
        "Designing evaluation suites that catch subtle hallucinations",
        "Optimizing vector store queries and reranking overhead on CPU-only hardware",
      ],
      links: {
        demo: "#", // Add actual URL
        github: "#", // Add actual URL
        blog: "#", // Add actual URL
      },
    },
    codelens: {
      badge: "💻 Developer Tool",
      title: "CodeLens - Code Documentation Assistant",
      subtitle: "RAG system for code understanding and documentation",
      description:
        "CodeLens ingests a GitHub repository and builds a syntax-aware code index using Tree-sitter. It powers cross-file search, dependency graph exploration, and automatic docstring suggestions for multiple programming languages.",
      features: [
        "GitHub integration for syncing branches and pull requests",
        "Tree-sitter based parsing for robust, language-aware chunking",
        "Vectorized code embeddings with metadata-rich chunks",
        "Dependency graph visualization to understand module relationships",
        "Docstring generation and refactoring suggestions for legacy code",
      ],
      metrics: [
        "Supports multiple languages across a single unified index",
        "Speeds up onboarding by summarizing modules and key entrypoints",
        "Improves documentation coverage with AI-suggested docstrings",
      ],
      challenges: [
        "Handling large monorepos while keeping indexing performant",
        "Designing chunking strategies that respect language semantics",
        "Ensuring generated documentation remains consistent with coding standards",
      ],
      links: {
        demo: "#", // Add actual URL
        github: "#", // Add actual URL
        blog: "#", // Add actual URL
      },
    },
    "data-analyst": {
      badge: "📊 Latest Project",
      title: "AI Data Analyst Agent",
      subtitle: "Multi-agent system for automated data analysis",
      description:
        "A LangGraph-driven multi-agent system that turns CSV uploads into dashboards, pandas code, and human-readable reports. It chains analysis, visualization, and narrative agents to deliver end-to-end insights.",
      features: [
        "Automatic dashboard generation with 4 charts per dataset upload",
        "Natural language to pandas code generation with safety checks",
        "Four analysis modes: Analyze, Visualize, Summarize, Find Anomalies",
        "Self-healing agent that retries and patches failing code blocks",
        "PDF report generation combining charts, tables, and textual insights",
      ],
      metrics: [
        "Generates first dashboard within seconds for typical CSV sizes",
        "Reduces manual exploratory analysis time significantly",
        "Robust to noisy or partially-cleaned datasets via defensive agents",
      ],
      challenges: [
        "Designing reliable guardrails around executable pandas code",
        "Keeping the multi-agent graph understandable and debuggable",
        "Balancing exploration vs. overfitting insights on small datasets",
      ],
      links: {
        github: "#", // Add actual URL
      },
    },
  };

  const modalBadge = document.getElementById("project-modal-badge");
  const modalTitle = document.getElementById("project-modal-title");
  const modalSubtitle = document.getElementById("project-modal-subtitle");
  const modalDescription = document.getElementById("project-modal-description");
  const modalFeatures = document.getElementById("project-modal-features");
  const modalMetrics = document.getElementById("project-modal-metrics");
  const modalChallenges = document.getElementById("project-modal-challenges");
  const modalGithubLink = document.getElementById("project-modal-github");

  let lastFocusedElement = null;

  function clearList(el) {
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function populateList(el, items) {
    if (!el || !items) return;
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      el.appendChild(li);
    });
  }

  function openModal(projectKey) {
    if (!modal || !projectData[projectKey]) return;
    const data = projectData[projectKey];

    lastFocusedElement = document.activeElement;

    modalBadge.textContent = data.badge;
    modalTitle.textContent = data.title;
    modalSubtitle.textContent = data.subtitle;
    modalDescription.textContent = data.description;

    clearList(modalFeatures);
    clearList(modalMetrics);
    clearList(modalChallenges);
    populateList(modalFeatures, data.features);
    populateList(modalMetrics, data.metrics);
    populateList(modalChallenges, data.challenges);

    if (modalGithubLink) modalGithubLink.href = data.links.github || "#";

    modal.classList.add("modal--open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const dialog = modal.querySelector(".modal__dialog");
    if (dialog) dialog.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("modal--open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocusedElement && lastFocusedElement.focus) {
      lastFocusedElement.focus();
    }
  }

  if (modal) {
    modal.setAttribute("tabindex", "-1");

    modalCloseEls.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal();
      });
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("modal--open")) {
        closeModal();
      }
    });
  }

  const caseStudyButtons = document.querySelectorAll(".btn--case-study");
  caseStudyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const projectKey = btn.getAttribute("data-project");
      if (projectKey) {
        openModal(projectKey);
      }
    });
  });

  // ------------------------------------------
  // Particle background (canvas)
  // ------------------------------------------
  function initParticles() {
    if (!particlesCanvas || !particlesCanvas.getContext) return;
    const ctx = particlesCanvas.getContext("2d");
    if (!ctx) return;

    let width = (particlesCanvas.width = window.innerWidth);
    let height = (particlesCanvas.height = window.innerHeight);
    const particles = [];
    const isMobile = width < 768;
    const particleCount = isMobile
      ? Math.min(25, Math.floor(width / 30))
      : Math.min(80, Math.floor(width / 20));

    const mouse = { x: width / 2, y: height / 3 };

    function createParticle() {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 1.8;
      const distance = 40 + Math.random() * 260;
      return {
        baseX: mouse.x,
        baseY: mouse.y,
        angle,
        radius,
        distance,
        speed: 0.001 + Math.random() * 0.0015,
        offsetX: (Math.random() - 0.5) * 60,
        offsetY: (Math.random() - 0.5) * 40,
      };
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }

    function resize() {
      width = particlesCanvas.width = window.innerWidth;
      height = particlesCanvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY * 0.7;
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.angle += p.speed;
        const x = p.baseX + Math.cos(p.angle) * p.distance + p.offsetX;
        const y = p.baseY + Math.sin(p.angle * 1.2) * (p.distance * 0.4) + p.offsetY;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, p.radius * 4);
        gradient.addColorStop(0, "rgba(0,212,255,0.9)");
        gradient.addColorStop(1, "rgba(178,75,243,0)");

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(x, y, p.radius * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    draw();
  }

  initParticles();
})();

