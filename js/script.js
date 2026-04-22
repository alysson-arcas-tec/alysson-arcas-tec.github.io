const languageButtons = Array.from(document.querySelectorAll(".lang-button"));
const themeToggle = document.querySelector("[data-theme-toggle]");
const translatableElements = Array.from(document.querySelectorAll("[data-pt]"));
const siteHeader = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navPanel = document.querySelector(".nav-panel");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const fadeElements = Array.from(document.querySelectorAll(".fade"));
const typingElement = document.getElementById("typing");
const projectDetailButtons = Array.from(document.querySelectorAll(".project-detail-button"));
const projectModal = document.getElementById("project-modal");
const projectModalKicker = document.getElementById("project-modal-kicker");
const projectModalTitle = document.getElementById("project-modal-title");
const projectModalContent = document.getElementById("project-modal-content");
const projectModalClose = document.querySelector(".project-modal-close");
const projectModalDismissTriggers = Array.from(document.querySelectorAll("[data-close-modal]"));
const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
const reducedMotion = reducedMotionMedia.matches;
const cursorlyPointerMedia = window.matchMedia("(hover: hover) and (pointer: fine)");
const cursorlyTouchMedia = window.matchMedia("(any-pointer: coarse)");
const cursorlyEditableSelector =
  'input, textarea, select, [contenteditable]:not([contenteditable="false"])';
const themeStorageKey = "portfolio-theme";
const cursorlyState = {
  instance: null,
  customIconIndex: null,
  isEnabled: false,
  isSuspended: false
};
const navItems = navLinks
  .map((link) => {
    const hash = link.getAttribute("href");
    const scrollTarget = hash ? document.querySelector(hash) : null;

    return {
      link,
      hash,
      scrollTarget,
      activeTarget: scrollTarget
    };
  })
  .filter((item) => item.hash && item.scrollTarget);

const pageTitles = {
  pt: "Alysson Arcas | Coordenador de Projetos",
  en: "Alysson Arcas | Project Coordinator",
  es: "Alysson Arcas | Coordinador de Proyectos"
};

const roles = {
  pt: [
    "Coordenador de Projetos de Software",
    "Líder de Equipe",
    "Especialista em Automação com IA"
  ],
  en: [
    "Software Project Coordinator",
    "Team Leader",
    "AI Automation Specialist"
  ],
  es: [
    "Coordinador de Proyectos de Software",
    "Líder de Equipo",
    "Especialista en Automatización con IA"
  ]
};

let currentLang = "pt";
let currentRoleIndex = 0;
let currentRoleLength = 0;
let isDeleting = false;
let typingTimer;
let themeToggleTimer;
let pendingNavigationHash = "";
let pendingNavigationExpiry = 0;
let pendingNavigationTimer;
let activeProjectId = "";

const modalLabels = {
  pt: {
    close: "Fechar detalhes do projeto"
  },
  en: {
    close: "Close project details"
  },
  es: {
    close: "Cerrar detalles del proyecto"
  }
};

const themeLabels = {
  pt: {
    switchToDark: "Ativar modo dark",
    switchToLight: "Ativar modo claro"
  },
  en: {
    switchToDark: "Switch to dark mode",
    switchToLight: "Switch to light mode"
  },
  es: {
    switchToDark: "Activar modo oscuro",
    switchToLight: "Activar modo claro"
  }
};

const projectDetails = {
  pt: {
    refeicoes: {
      kicker: "Projeto Gestão de Refeições",
      title: "Sistema de Gestão de Refeições",
      intro: [
        "O Sistema de Gestão de Refeições foi desenvolvido para atender às demandas da Secretaria Municipal de Educação de Curitiba, permitindo o controle completo da distribuição de alimentos nas escolas públicas da cidade.",
        "A solução atende mais de 450 unidades educacionais e oferece funcionalidades que possibilitam a educadores, nutricionistas e equipes administrativas gerenciar refeições de forma eficiente."
      ],
      sections: [
        {
          heading: "Entre os principais recursos, destacam-se",
          items: [
            "Solicitação e controle de refeições por unidade escolar.",
            "Gestão de dietas especiais com alergias, intolerâncias e restrições alimentares.",
            "Criação de cardápios mensais com informações nutricionais.",
            "Substituição automática de refeições para alunos com restrições.",
            "Avaliação da qualidade das refeições e desempenho do serviço.",
            "Módulo financeiro para cálculo de pagamentos e geração de relatórios."
          ]
        },
        {
          heading: "Atuação",
          paragraphs: [
            "Coordenação completa do projeto com duração de 2 anos, além de 1 ano de atuação na sustentação, conduzindo cerimônias ágeis como planejamento, kickoff, reviews, retrospectivas e acompanhamento executivo."
          ]
        }
      ]
    },
    cardapio: {
      kicker: "Cardápio do Aluno",
      title: "Cardápio do Aluno (Curitiba App)",
      intro: [
        "O módulo de Cardápio do Aluno foi desenvolvido para o aplicativo Curitiba App, com o objetivo de aproximar os responsáveis da rotina alimentar dos estudantes da rede pública.",
        "A funcionalidade permite que pais e responsáveis visualizem, em tempo real, o cardápio das unidades escolares onde os alunos estão matriculados."
      ],
      sections: [
        {
          heading: "O projeto envolveu",
          items: [
            "Integração com o Sistema de Gestão de Refeições.",
            "Identificação do vínculo entre usuário e aluno.",
            "Exibição personalizada do cardápio por unidade escolar.",
            "Garantia de segurança e consistência dos dados."
          ]
        },
        {
          heading: "Resultado",
          paragraphs: [
            "Com duração de 2 meses até sua publicação, o projeto trouxe mais transparência e modernização para os serviços digitais da Prefeitura."
          ]
        },
        {
          heading: "Atuação",
          paragraphs: [
            "Coordenação do projeto utilizando metodologia ágil, incluindo planejamento, execução, acompanhamento e entrega."
          ]
        }
      ]
    },
    movimento: {
      kicker: "Curitiba em Movimento",
      title: "Curitiba em Movimento",
      intro: [
        "O módulo de Reserva de Espaço Físico faz parte do programa Curitiba em Movimento, oferecendo à população a possibilidade de reservar espaços públicos de forma simples e online.",
        "O sistema foi projetado para democratizar o acesso aos espaços públicos e incentivar atividades sociais e esportivas."
      ],
      sections: [
        {
          heading: "A solução permite reservar",
          items: [
            "Quadras esportivas.",
            "Piscinas.",
            "Salões comunitários.",
            "Espaços para atividades diversas."
          ]
        },
        {
          heading: "Principais funcionalidades",
          items: [
            "Consulta de disponibilidade em tempo real.",
            "Controle de vagas e horários.",
            "Gestão de reservas e cancelamentos.",
            "Emissão de termos de uso.",
            "Organização de itens vinculados à reserva."
          ]
        },
        {
          heading: "Atuação",
          paragraphs: [
            "Atuação como Analista de Sistemas com apoio à coordenação do projeto, participando das cerimônias ágeis e da gestão das entregas."
          ]
        }
      ]
    }
  }
};

projectDetails.en = {
  refeicoes: {
    kicker: "Meal Management Project",
    title: "Meal Management System",
    intro: [
      "The Meal Management System was developed to meet the needs of Curitiba's Municipal Department of Education, enabling full control over food distribution across the city's public schools.",
      "The solution supports more than 450 educational units and offers features that help educators, nutritionists, and administrative teams manage meals efficiently."
    ],
    sections: [
      {
        heading: "Key capabilities",
        items: [
          "Meal requests and control by school unit.",
          "Management of special diets for allergies, intolerances, and dietary restrictions.",
          "Creation of monthly menus with nutritional information.",
          "Automatic meal replacement for students with restrictions.",
          "Evaluation of meal quality and service performance.",
          "Financial module for payment calculation and report generation."
        ]
      },
      {
        heading: "Role",
        paragraphs: [
          "Full project coordination over a 2-year delivery cycle, plus 1 additional year in support, leading agile ceremonies such as planning, kickoff meetings, reviews, retrospectives, and executive follow-up."
        ]
      }
    ]
  },
  cardapio: {
    kicker: "Student Menu",
    title: "Student Menu (Curitiba App)",
    intro: [
      "The Student Menu module was developed for the Curitiba App to bring guardians closer to the eating routine of students in the public school system.",
      "The feature allows parents and guardians to view, in real time, the menu of the school units where the students are enrolled."
    ],
    sections: [
      {
        heading: "Project scope",
        items: [
          "Integration with the Meal Management System.",
          "Identification of the link between the user and the student.",
          "Personalized menu display by school unit.",
          "Security and data consistency assurance."
        ]
      },
      {
        heading: "Outcome",
        paragraphs: [
          "With a 2-month timeline until publication, the project delivered more transparency and modernization to the city's digital public services."
        ]
      },
      {
        heading: "Role",
        paragraphs: [
          "Project coordination using agile methodology, including planning, execution, monitoring, and delivery."
        ]
      }
    ]
  },
  movimento: {
    kicker: "Curitiba in Motion",
    title: "Curitiba in Motion",
    intro: [
      "The Physical Space Reservation module is part of the Curitiba in Motion program, giving citizens the ability to book public spaces in a simple online experience.",
      "The system was designed to democratize access to public spaces and encourage social and sports activities."
    ],
    sections: [
      {
        heading: "The solution allows booking",
        items: [
          "Sports courts.",
          "Swimming pools.",
          "Community halls.",
          "Spaces for different activities."
        ]
      },
      {
        heading: "Main features",
        items: [
          "Real-time availability lookup.",
          "Capacity and schedule control.",
          "Reservation and cancellation management.",
          "Issuance of terms of use.",
          "Organization of items linked to each reservation."
        ]
      },
      {
        heading: "Role",
        paragraphs: [
          "Worked as a Systems Analyst supporting project coordination, participating in agile ceremonies and delivery management."
        ]
      }
    ]
  }
};

projectDetails.es = {
  refeicoes: {
    kicker: "Proyecto Gestion de Comidas",
    title: "Sistema de Gestion de Comidas",
    intro: [
      "El Sistema de Gestion de Comidas fue desarrollado para atender las demandas de la Secretaria Municipal de Educacion de Curitiba, permitiendo el control completo de la distribucion de alimentos en las escuelas publicas de la ciudad.",
      "La solucion atiende a mas de 450 unidades educativas y ofrece funcionalidades que permiten a educadores, nutricionistas y equipos administrativos gestionar las comidas de manera eficiente."
    ],
    sections: [
      {
        heading: "Principales recursos",
        items: [
          "Solicitud y control de comidas por unidad escolar.",
          "Gestion de dietas especiales con alergias, intolerancias y restricciones alimentarias.",
          "Creacion de menus mensuales con informacion nutricional.",
          "Sustitucion automatica de comidas para alumnos con restricciones.",
          "Evaluacion de la calidad de las comidas y del desempeno del servicio.",
          "Modulo financiero para calculo de pagos y generacion de informes."
        ]
      },
      {
        heading: "Actuacion",
        paragraphs: [
          "Coordinacion completa del proyecto durante 2 anos, ademas de 1 ano de actuacion en sustentacion, conduciendo ceremonias agiles como planificacion, kickoff, reviews, retrospectivas y seguimiento ejecutivo."
        ]
      }
    ]
  },
  cardapio: {
    kicker: "Menu del Alumno",
    title: "Menu del Alumno (Curitiba App)",
    intro: [
      "El modulo Menu del Alumno fue desarrollado para la aplicacion Curitiba App con el objetivo de acercar a los responsables a la rutina alimentaria de los estudiantes de la red publica.",
      "La funcionalidad permite que padres y responsables visualicen, en tiempo real, el menu de las unidades escolares donde los alumnos estan matriculados."
    ],
    sections: [
      {
        heading: "El proyecto incluyo",
        items: [
          "Integracion con el Sistema de Gestion de Comidas.",
          "Identificacion del vinculo entre usuario y alumno.",
          "Visualizacion personalizada del menu por unidad escolar.",
          "Garantia de seguridad y consistencia de los datos."
        ]
      },
      {
        heading: "Resultado",
        paragraphs: [
          "Con una duracion de 2 meses hasta su publicacion, el proyecto aporto mas transparencia y modernizacion a los servicios digitales del Ayuntamiento."
        ]
      },
      {
        heading: "Actuacion",
        paragraphs: [
          "Coordinacion del proyecto utilizando metodologia agil, incluyendo planificacion, ejecucion, seguimiento y entrega."
        ]
      }
    ]
  },
  movimento: {
    kicker: "Curitiba en Movimiento",
    title: "Curitiba en Movimiento",
    intro: [
      "El modulo de Reserva de Espacio Fisico forma parte del programa Curitiba en Movimiento, ofreciendo a la poblacion la posibilidad de reservar espacios publicos de forma simple y en linea.",
      "El sistema fue disenado para democratizar el acceso a los espacios publicos e incentivar actividades sociales y deportivas."
    ],
    sections: [
      {
        heading: "La solucion permite reservar",
        items: [
          "Canchas deportivas.",
          "Piscinas.",
          "Salones comunitarios.",
          "Espacios para actividades diversas."
        ]
      },
      {
        heading: "Principales funcionalidades",
        items: [
          "Consulta de disponibilidad en tiempo real.",
          "Control de cupos y horarios.",
          "Gestion de reservas y cancelaciones.",
          "Emision de terminos de uso.",
          "Organizacion de elementos vinculados a la reserva."
        ]
      },
      {
        heading: "Actuacion",
        paragraphs: [
          "Actuacion como Analista de Sistemas con apoyo a la coordinacion del proyecto, participando en ceremonias agiles y en la gestion de las entregas."
        ]
      }
    ]
  }
};

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getHeaderOffset() {
  return siteHeader ? siteHeader.getBoundingClientRect().height : 0;
}

function getElementDocumentTop(element) {
  let top = 0;
  let currentElement = element;

  while (currentElement) {
    top += currentElement.offsetTop;
    currentElement = currentElement.offsetParent;
  }

  return top;
}

function getTargetScrollTop(hash) {
  const item = navItems.find((entry) => entry.hash === hash);

  if (!item) {
    return 0;
  }

  if (hash === "#home") {
    return 0;
  }

  return Math.max(0, getElementDocumentTop(item.scrollTarget) - (getHeaderOffset() + 14));
}

function setActiveLink(hash) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === hash);
  });
}

function startPendingNavigation(hash) {
  pendingNavigationHash = hash;
  pendingNavigationExpiry = Date.now() + 1400;

  window.clearTimeout(pendingNavigationTimer);
  pendingNavigationTimer = window.setTimeout(() => {
    pendingNavigationHash = "";
    pendingNavigationExpiry = 0;
    updateActiveSection();
  }, reducedMotion ? 0 : 1400);
}

function getActiveTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function persistTheme(theme) {
  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch (error) {
    // Ignore storage failures and keep the theme only for the current session.
  }
}

function updateThemeToggleLabel() {
  if (!themeToggle) {
    return;
  }

  const labels = themeLabels[currentLang] ?? themeLabels.pt;
  const activeTheme = getActiveTheme();
  const nextActionLabel =
    activeTheme === "dark" ? labels.switchToLight : labels.switchToDark;

  themeToggle.setAttribute("aria-label", nextActionLabel);
  themeToggle.setAttribute("title", nextActionLabel);
  themeToggle.setAttribute("aria-pressed", String(activeTheme === "light"));
}

function animateThemeToggle() {
  if (!themeToggle || reducedMotion) {
    return;
  }

  window.clearTimeout(themeToggleTimer);
  themeToggle.classList.remove("is-changing");
  void themeToggle.offsetWidth;
  themeToggle.classList.add("is-changing");

  themeToggleTimer = window.setTimeout(() => {
    themeToggle.classList.remove("is-changing");
  }, 340);
}

function setTheme(theme, { persist = true, animate = false } = {}) {
  const nextTheme = theme === "light" ? "light" : "dark";

  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.style.colorScheme = nextTheme;

  if (persist) {
    persistTheme(nextTheme);
  }

  if (animate) {
    animateThemeToggle();
  }

  updateThemeToggleLabel();
  syncCursorlyTheme();
}

function toggleTheme() {
  const nextTheme = getActiveTheme() === "dark" ? "light" : "dark";
  setTheme(nextTheme, { persist: true, animate: true });
}

function applyTranslations(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
  document.title = pageTitles[lang];

  translatableElements.forEach((element) => {
    const translatedText = element.getAttribute(`data-${lang}`);
    if (translatedText) {
      element.textContent = translatedText;
    }
  });

  languageButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === lang);
  });

  if (projectModalClose) {
    projectModalClose.setAttribute(
      "aria-label",
      modalLabels[lang]?.close ?? modalLabels.pt.close
    );
  }

  if (activeProjectId) {
    renderProjectModal(activeProjectId);
  }

  updateThemeToggleLabel();
  restartTypingEffect();
}

function typeEffect() {
  if (!typingElement) {
    return;
  }

  const currentWords = roles[currentLang];
  const currentWord = currentWords[currentRoleIndex];

  if (!isDeleting) {
    currentRoleLength += 1;
    typingElement.textContent = currentWord.slice(0, currentRoleLength);

    if (currentRoleLength === currentWord.length) {
      isDeleting = true;
      typingTimer = window.setTimeout(typeEffect, 1300);
      return;
    }
  } else {
    currentRoleLength -= 1;
    typingElement.textContent = currentWord.slice(0, currentRoleLength);

    if (currentRoleLength === 0) {
      isDeleting = false;
      currentRoleIndex = (currentRoleIndex + 1) % currentWords.length;
      typingTimer = window.setTimeout(typeEffect, 240);
      return;
    }
  }

  typingTimer = window.setTimeout(typeEffect, isDeleting ? 48 : 78);
}

function restartTypingEffect() {
  window.clearTimeout(typingTimer);

  currentRoleIndex = 0;
  currentRoleLength = 0;
  isDeleting = false;

  if (!typingElement) {
    return;
  }

  if (reducedMotion) {
    typingElement.textContent = roles[currentLang][0];
    return;
  }

  typeEffect();
}

function closeMenu() {
  if (!navPanel || !navToggle) {
    return;
  }

  navPanel.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

function toggleMenu() {
  if (!navPanel || !navToggle) {
    return;
  }

  const isOpen = navPanel.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  document.body.classList.toggle("menu-open", isOpen);
}

function renderProjectModal(projectId) {
  const localizedProjects = projectDetails[currentLang] ?? projectDetails.pt;
  const project = localizedProjects[projectId] ?? projectDetails.pt[projectId];

  if (!project || !projectModalKicker || !projectModalTitle || !projectModalContent) {
    return;
  }

  projectModalKicker.textContent = project.kicker;
  projectModalTitle.textContent = project.title;

  const introMarkup = project.intro
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");

  const sectionMarkup = project.sections
    .map((section) => {
      const paragraphs = (section.paragraphs ?? [])
        .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
        .join("");

      const items = section.items?.length
        ? `
          <ul class="project-modal-list">
            ${section.items
              .map((item) => `<li>${escapeHtml(item)}</li>`)
              .join("")}
          </ul>
        `
        : "";

      return `
        <section class="project-modal-section">
          <h3>${escapeHtml(section.heading)}</h3>
          ${paragraphs}
          ${items}
        </section>
      `;
    })
    .join("");

  projectModalContent.innerHTML = `
    <div class="project-modal-intro">
      ${introMarkup}
    </div>
    ${sectionMarkup}
  `;
}

function openProjectModal(projectId) {
  if (!projectModal) {
    return;
  }

  activeProjectId = projectId;
  renderProjectModal(projectId);
  projectModal.classList.add("open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeProjectModal() {
  if (!projectModal) {
    return;
  }

  activeProjectId = "";
  projectModal.classList.remove("open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function scrollToSection(hash, updateHistory = true) {
  const item = navItems.find((entry) => entry.hash === hash);

  if (!item) {
    return;
  }

  const top = getTargetScrollTop(hash);

  if (updateHistory) {
    if (hash === "#home") {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`
      );
    } else {
      window.history.replaceState(null, "", hash);
    }
  }

  startPendingNavigation(hash);
  setActiveLink(hash);

  window.scrollTo({
    top,
    behavior: reducedMotion ? "auto" : "smooth"
  });
}

function updateActiveSection() {
  if (pendingNavigationHash) {
    const pendingTop = getTargetScrollTop(pendingNavigationHash);
    const reachedPendingTarget = Math.abs(window.scrollY - pendingTop) <= 6;
    const pendingExpired = Date.now() > pendingNavigationExpiry;

    if (!reachedPendingTarget && !pendingExpired) {
      setActiveLink(pendingNavigationHash);
      return;
    }

    window.clearTimeout(pendingNavigationTimer);
    pendingNavigationHash = "";
    pendingNavigationExpiry = 0;
  }

  const offset = getHeaderOffset() + 20;
  let activeHash = navItems[0]?.hash ?? "#home";

  navItems.forEach((item) => {
    const sectionTop = getElementDocumentTop(item.activeTarget);

    if (sectionTop - offset <= window.scrollY) {
      activeHash = item.hash;
    }
  });

  const reachedBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

  if (reachedBottom && navItems.length > 0) {
    activeHash = navItems[navItems.length - 1].hash;
  }

  setActiveLink(activeHash);
}

function setupRevealAnimations() {
  if (reducedMotion) {
    fadeElements.forEach((element) => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18
    }
  );

  fadeElements.forEach((element) => observer.observe(element));
}

function setupCanvasBackground() {
  const canvas = document.getElementById("bg");
  const context = canvas?.getContext("2d");

  if (!canvas || !context || reducedMotion) {
    return;
  }

  let particles = [];
  let animationFrameId;

  function resizeCanvas() {
    const pixelRatio = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    buildParticles(width, height);
  }

  function buildParticles(width, height) {
    const amount = width < 640 ? 26 : 42;

    particles = Array.from({ length: amount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.4 + 0.8,
      speedX: Math.random() * 0.35 - 0.175,
      speedY: Math.random() * 0.35 - 0.175
    }));
  }

  function connectParticles() {
    for (let first = 0; first < particles.length; first += 1) {
      for (let second = first + 1; second < particles.length; second += 1) {
        const deltaX = particles[first].x - particles[second].x;
        const deltaY = particles[first].y - particles[second].y;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance < 130) {
          const opacity = 1 - distance / 130;
          context.strokeStyle = `rgba(89, 182, 255, ${opacity * 0.12})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(particles[first].x, particles[first].y);
          context.lineTo(particles[second].x, particles[second].y);
          context.stroke();
        }
      }
    }
  }

  function drawFrame() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    context.clearRect(0, 0, width, height);

    particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      if (particle.x < 0 || particle.x > width) {
        particle.speedX *= -1;
      }

      if (particle.y < 0 || particle.y > height) {
        particle.speedY *= -1;
      }

      context.fillStyle = "rgba(47, 213, 143, 0.9)";
      context.beginPath();
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();
    });

    connectParticles();
    animationFrameId = window.requestAnimationFrame(drawFrame);
  }

  resizeCanvas();
  drawFrame();

  window.addEventListener("resize", () => {
    window.cancelAnimationFrame(animationFrameId);
    resizeCanvas();
    drawFrame();
  });
}

function addMediaChangeListener(mediaQuery, handler) {
  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handler);
    return;
  }

  if (typeof mediaQuery.addListener === "function") {
    mediaQuery.addListener(handler);
  }
}

function getCursorlyIconUrl() {
  const styles = window.getComputedStyle(document.documentElement);
  const primary = styles.getPropertyValue("--primary").trim() || "#1f8fff";
  const text = styles.getPropertyValue("--text").trim() || "#f2f6fb";
  const softFill = document.documentElement.dataset.theme === "light"
    ? "rgba(15, 125, 232, 0.14)"
    : "rgba(31, 143, 255, 0.18)";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="9" fill="${softFill}" />
      <circle cx="16" cy="16" r="7.25" stroke="${primary}" stroke-width="2.5" />
      <circle cx="16" cy="16" r="2.75" fill="${text}" />
      <circle cx="16" cy="16" r="1.5" fill="${primary}" />
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getCursorlyEffect() {
  return {
    name: "none"
  };
}

function canUseCursorly() {
  return Boolean(window.Cursorly)
    && cursorlyPointerMedia.matches
    && !cursorlyTouchMedia.matches
    && !reducedMotionMedia.matches;
}

function getCursorlyCanvas() {
  return Array.from(document.querySelectorAll("body > canvas")).find((canvas) => (
    canvas.id !== "bg" && window.getComputedStyle(canvas).zIndex === "9999"
  )) ?? null;
}

function normalizeCursorlyCanvas() {
  const canvas = getCursorlyCanvas();

  if (!canvas) {
    return;
  }

  canvas.style.pointerEvents = "none";
  canvas.setAttribute("aria-hidden", "true");
}

function applyCursorlyState() {
  const shouldEnable = canUseCursorly() && !cursorlyState.isSuspended;
  document.documentElement.classList.toggle("cursorly-active", shouldEnable);

  if (!cursorlyState.instance) {
    cursorlyState.isEnabled = false;
    return;
  }

  normalizeCursorlyCanvas();

  if (shouldEnable) {
    cursorlyState.instance.enable();
    cursorlyState.instance.disableEffect();
  } else {
    cursorlyState.instance.disableEffect();
    cursorlyState.instance.disable();
  }

  cursorlyState.isEnabled = shouldEnable;
}

function syncCursorlyTheme() {
  if (!cursorlyState.instance) {
    return;
  }

  const iconUrl = getCursorlyIconUrl();

  if (cursorlyState.customIconIndex === null) {
    cursorlyState.customIconIndex = cursorlyState.instance.addIcon(iconUrl);
  } else {
    cursorlyState.instance.cursorIcons[cursorlyState.customIconIndex] = iconUrl;
  }

  cursorlyState.instance.setIcon(cursorlyState.customIconIndex);
  cursorlyState.instance.cursorImage.src = iconUrl;
  cursorlyState.instance.setEffect(getCursorlyEffect());
  normalizeCursorlyCanvas();
}

function ensureCursorly() {
  if (!canUseCursorly()) {
    applyCursorlyState();
    return;
  }

  if (!cursorlyState.instance) {
    cursorlyState.instance = window.Cursorly.init({
      cursor: 0,
      cursorSize: 40,
      effect: getCursorlyEffect()
    });
  }

  syncCursorlyTheme();
  applyCursorlyState();
}

function getEditableCursorTarget(target) {
  return target instanceof Element ? target.closest(cursorlyEditableSelector) : null;
}

function setupCursorly() {
  ensureCursorly();
  addMediaChangeListener(reducedMotionMedia, ensureCursorly);
  addMediaChangeListener(cursorlyPointerMedia, ensureCursorly);
  addMediaChangeListener(cursorlyTouchMedia, ensureCursorly);

  document.addEventListener("pointerover", (event) => {
    if (!getEditableCursorTarget(event.target) || cursorlyState.isSuspended) {
      return;
    }

    cursorlyState.isSuspended = true;
    applyCursorlyState();
  });

  document.addEventListener("pointerout", (event) => {
    if (!getEditableCursorTarget(event.target)) {
      return;
    }

    if (getEditableCursorTarget(event.relatedTarget)) {
      return;
    }

    cursorlyState.isSuspended = false;
    applyCursorlyState();
  });
}

projectDetailButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openProjectModal(button.dataset.projectId);
  });
});

projectModalDismissTriggers.forEach((trigger) => {
  trigger.addEventListener("click", closeProjectModal);
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyTranslations(button.dataset.lang);
    closeMenu();
  });
});

navItems.forEach((item) => {
  item.link.addEventListener("click", (event) => {
    event.preventDefault();
    closeMenu();
    scrollToSection(item.hash);
  });
});

navToggle?.addEventListener("click", toggleMenu);
themeToggle?.addEventListener("click", toggleTheme);

window.addEventListener(
  "scroll",
  () => {
    updateActiveSection();
  },
  { passive: true }
);

window.addEventListener("resize", () => {
  if (window.innerWidth > 840) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (projectModal?.classList.contains("open")) {
      closeProjectModal();
      return;
    }

    closeMenu();
  }
});

setTheme(getActiveTheme(), { persist: false });
applyTranslations(currentLang);
setupRevealAnimations();
setupCanvasBackground();
setupCursorly();
updateActiveSection();

window.addEventListener("load", () => {
  const initialHash = window.location.hash;

  if (initialHash && initialHash !== "#home") {
    scrollToSection(initialHash, false);
  } else {
    setActiveLink("#home");
  }
});
