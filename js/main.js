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
  const copyEmailButtons = document.querySelectorAll("[data-copy-email]");

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
  // Copy email button
  // ------------------------------------------
  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback for non-secure contexts / older browsers
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(ta);
      return Promise.resolve();
    } catch (err) {
      document.body.removeChild(ta);
      return Promise.reject(err);
    }
  }

  copyEmailButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const email = btn.getAttribute("data-copy-email");
      if (!email) return;
      const original = btn.textContent;
      try {
        await copyToClipboard(email);
        btn.textContent = "Copied";
      } catch {
        btn.textContent = "Copy failed";
      } finally {
        setTimeout(() => {
          btn.textContent = original || "Copy";
        }, 1200);
      }
    });
  });

  // ------------------------------------------
  // Typing effect
  // ------------------------------------------
  // Rotating phrases in hero (no "RAG expert" / "Hackathon winner" – those stay in About/stats only)
  const typingPhrases = [
    "Solving Problems with AI",
    "Building Intelligent Agents",
    "Multi-Agent Workflows",
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
    // When hero gets focus (e.g. tab or click), advance to next phrase
    const heroEl = document.getElementById("hero");
    if (heroEl) {
      heroEl.addEventListener("focusin", () => {
        if (typingTimeoutId) clearTimeout(typingTimeoutId);
        typingIndex = (typingIndex + 1) % typingPhrases.length;
        charIndex = 0;
        isDeleting = false;
        typeLoop();
      });
    }
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
    const grid = document.querySelector(".projects__grid");
    let visibleCount = 0;

    if (grid) {
      // Prevent noticeable left-right “travel” during reflow
      grid.classList.add("is-filtering");
      window.clearTimeout(grid._filterT);
      grid._filterT = window.setTimeout(() => grid.classList.remove("is-filtering"), 260);
    }

    projectCards.forEach((card) => {
      const categories = (card.getAttribute("data-category") || "").toLowerCase();
      const isVisible = filter === "all" || categories.includes(filter);

      // Only show the "featured" layout on the All view
      if (card.dataset.featured === "true") {
        card.classList.toggle("project-card--featured", filter === "all");
      }

      if (isVisible) {
        visibleCount += 1;
        // Ensure it participates in the grid layout
        card.style.display = "";
        card.style.opacity = "1";
        card.style.transform = "";
        card.style.pointerEvents = "auto";
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(10px)";
        card.style.pointerEvents = "none";
        // Remove from layout immediately to avoid large empty grid space
        card.style.display = "none";
      }
    });

    if (grid) {
      grid.classList.toggle("projects__grid--single", visibleCount === 1);
      grid.classList.toggle("projects__grid--double", visibleCount === 2);
    }
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
        "Hackathon-winning production RAG system with hybrid retrieval (BM25 + semantic), FlashRank cross-encoder reranking, and a LangGraph state machine for persistent memory. Fully local deployment using Ollama (Llama 3.1-8B) with evaluation-driven iteration via RAGAS.",
      features: [
        "Hybrid retrieval (BM25 + semantic) with FlashRank reranking (precision improved from 0.65 → 0.92)",
        "LangGraph state machine for selective memory across conversations",
        "Chunking + ingestion pipelines with ChromaDB and LlamaIndex",
        "Local inference via Ollama—under 1s query latency, zero API costs",
        "Quality loops using RAGAS metrics until production-grade precision",
      ],
      metrics: [
        "RAGAS faithfulness: 0.88",
        "Context precision: 0.92",
        "< 1s median latency on local hardware",
        "100% local inference (Ollama)",
      ],
      challenges: [
        "Tuning hybrid retrieval vs. latency on CPU-only hardware",
        "Designing memory policies that stay faithful across long threads",
        "Building evaluation suites that catch retrieval regressions early",
      ],
      links: {
        github: "#", // Add actual URL
      },
    },
    "multimodal-rag": {
      badge: "Multimodal RAG",
      title: "Multimodal RAG System",
      subtitle: "Hybrid dense + graph retrieval across modalities",
      description:
        "Multimodal RAG pipeline ingesting PDF, PNG, MP3, JPEG, and TXT via OCR, image captioning, and audio transcription. Uses Hugging Face Transformers and PyTorch for embeddings; combines Qdrant vector search with a Neo4j knowledge graph for hybrid retrieval and semantic reranking.",
      features: [
        "Cross-modal embeddings and ingestion for heterogeneous file types",
        "Qdrant + Neo4j hybrid retrieval with semantic reranking",
        "~40% improvement in RAGAS retrieval precision vs dense-only baseline",
        "MLflow tracking across embedding models and chunking strategies",
        "FastAPI backend + Streamlit monitoring UI",
      ],
      metrics: [
        "~40% lift in RAGAS retrieval precision vs dense-only baseline",
        "Experiment lineage tracked in MLflow",
        "Real-time monitoring via Streamlit UI",
      ],
      challenges: [
        "Aligning chunking strategies across modalities without losing context",
        "Balancing graph complexity vs query latency",
        "Managing embedding experiments reproducibly at scale",
      ],
      links: {
        github: "#", // Add actual URL
      },
    },
    "ragas-platform": {
      badge: "RAG evaluation",
      title: "RAGAS Evaluation Platform",
      subtitle: "Automated benchmarking with CI quality gates",
      description:
        "FastAPI + PostgreSQL backend that runs automated A/B tests across chunk sizes, retrieval strategies, and LLM configurations—implemented core RAGAS metrics with per-question breakdowns, statistical analysis, PDF reporting, and pytest-driven CI gates.",
      features: [
        "Four RAGAS metrics: faithfulness, context precision/recall, answer relevancy",
        "Embedding benchmarks via Hugging Face Transformers across retrieval setups",
        "MLflow logging for reproducibility and artifact versioning",
        "PDF reports with executive summaries and actionable recommendations",
        "pytest in CI—build fails if faithfulness drops below 0.85",
      ],
      metrics: [
        "Faithfulness gate: 0.85 minimum in CI",
        "Full experiment reproducibility via MLflow",
        "Automated statistical analysis with scikit-learn",
      ],
      challenges: [
        "Standardizing evaluation datasets across configuration changes",
        "Keeping CI runtime reasonable while running full RAGAS suites",
        "Surfacing actionable deltas in PDF reports for stakeholders",
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
  let removeModalTrap = null;

  function getFocusableElements(root) {
    if (!root) return [];
    const selectors = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "textarea:not([disabled])",
      "select:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ];
    return Array.from(root.querySelectorAll(selectors.join(","))).filter(
      (el) => el.offsetParent !== null && !el.hasAttribute("aria-hidden")
    );
  }

  function trapFocus(modalRoot) {
    const dialog = modalRoot.querySelector(".modal__dialog");
    if (!dialog) return () => {};

    const onKeyDown = (e) => {
      if (e.key !== "Tab" || !modalRoot.classList.contains("modal--open")) return;
      const focusables = getFocusableElements(dialog);
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (e.shiftKey) {
        if (active === first || active === dialog) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }

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
    if (removeModalTrap) removeModalTrap();
    removeModalTrap = trapFocus(modal);
    if (dialog) {
      dialog.setAttribute("tabindex", "-1");
      dialog.focus();
      const focusables = getFocusableElements(dialog);
      if (focusables.length) focusables[0].focus();
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("modal--open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (removeModalTrap) {
      removeModalTrap();
      removeModalTrap = null;
    }
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
    const alpha = isMobile ? 0.55 : 0.9;

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
        gradient.addColorStop(0, `rgba(0,212,255,${alpha})`);
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

