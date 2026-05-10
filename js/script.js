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
const projectModelGrid = document.getElementById("project-model-grid");
const documentModal = document.getElementById("document-modal");
const documentModalKicker = document.getElementById("document-modal-kicker");
const documentModalTitle = document.getElementById("document-modal-title");
const documentModalDescription = document.getElementById("document-modal-description");
const documentModalPreviewButton = document.getElementById("document-modal-preview-button");
const documentModalDownload = document.getElementById("document-modal-download");
const documentModalAgent = document.getElementById("document-modal-agent");
const documentPreview = document.getElementById("document-preview");
const documentPreviewStatus = document.getElementById("document-preview-status");
const documentModalClose = document.querySelector(".document-modal-close");
const documentModalDismissTriggers = Array.from(document.querySelectorAll("[data-close-document-modal]"));
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
let activeDocumentModelId = "";
let documentPreviewRequestId = 0;
let currentProjectModelPage = 0;
const projectModelPageSize = 3;

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

const projectAutomationRepositoryBaseUrl =
  "https://github.com/alysson-arcas-tec/ai-gerador-documentos/blob/main/project-automatizacao-documentos";

const projectModelLabels = {
  pt: {
    libraryKicker: "Modelo de Projeto",
    nameColumn: "Nome",
    summaryColumn: "Resumo",
    actionColumn: "Ação",
    viewDocument: "Visualizar documento",
    moreDetails: "Mais detalhes",
    previousPage: "Anterior",
    nextPage: "Próxima",
    firstPage: "Primeira página",
    lastPage: "Última página",
    paginationStatus: "Página {current} de {total}",
    download: "Baixar documento",
    relatedAgent: "Agente relacionado",
    noAgent: "Agente específico ainda não mapeado para este modelo.",
    viewAgent: "Ver agente",
    agentDetails: "Ver mais detalhes sobre o agente",
    close: "Fechar visualização do documento",
    previewPromptStatus: "Prévia sob demanda",
    previewPromptTitle: "Visualização disponível na modal",
    previewPromptBody: "Clique em Visualizar documento para carregar a prévia aqui. Se o navegador não renderizar o arquivo, use Baixar documento.",
    loading: "Carregando prévia...",
    previewReady: "Prévia carregada no navegador.",
    svgReady: "Prévia SVG carregada.",
    previewUnavailableTitle: "Prévia não disponível neste navegador",
    unsupportedPreview: "Este tipo de arquivo não possui pré-visualização nativa confiável no navegador. Use o botão acima para baixar o documento.",
    docxLibraryMissing: "A biblioteca de leitura de DOCX não foi carregada. O arquivo continua disponível para download.",
    spreadsheetLibraryMissing: "A biblioteca de leitura de planilhas não foi carregada. O arquivo continua disponível para download.",
    fetchError: "Não foi possível carregar a prévia. Para testar localmente, abra o portfólio por um servidor HTTP em vez de abrir o HTML diretamente pelo sistema de arquivos.",
    emptySpreadsheet: "A planilha não retornou linhas visíveis para pré-visualização.",
    truncatedPreview: "Prévia limitada para manter a navegação leve. Baixe o arquivo para ver o conteúdo completo.",
    docxWarning: "Alguns detalhes de formatação do DOCX podem não aparecer exatamente como no Word."
  },
  en: {
    libraryKicker: "Project Template",
    nameColumn: "Name",
    summaryColumn: "Summary",
    actionColumn: "Action",
    viewDocument: "View document",
    moreDetails: "More details",
    previousPage: "Previous",
    nextPage: "Next",
    firstPage: "First page",
    lastPage: "Last page",
    paginationStatus: "Page {current} of {total}",
    download: "Download document",
    relatedAgent: "Related agent",
    noAgent: "No specific agent mapped to this template yet.",
    viewAgent: "View agent",
    agentDetails: "See more agent details",
    close: "Close document preview",
    previewPromptStatus: "On-demand preview",
    previewPromptTitle: "Preview available in the modal",
    previewPromptBody: "Click View document to load the preview here. If the browser cannot render the file, use Download document.",
    loading: "Loading preview...",
    previewReady: "Preview loaded in the browser.",
    svgReady: "SVG preview loaded.",
    previewUnavailableTitle: "Preview unavailable in this browser",
    unsupportedPreview: "This file type does not have a reliable native browser preview. Use the button above to download the document.",
    docxLibraryMissing: "The DOCX reader library did not load. The file is still available for download.",
    spreadsheetLibraryMissing: "The spreadsheet reader library did not load. The file is still available for download.",
    fetchError: "The preview could not be loaded. To test locally, serve the portfolio through HTTP instead of opening the HTML file directly.",
    emptySpreadsheet: "The spreadsheet did not return visible rows for preview.",
    truncatedPreview: "Preview limited to keep navigation light. Download the file to see the full content.",
    docxWarning: "Some DOCX formatting details may not look exactly like Word."
  },
  es: {
    libraryKicker: "Modelo de Proyecto",
    nameColumn: "Nombre",
    summaryColumn: "Resumen",
    actionColumn: "Acción",
    viewDocument: "Visualizar documento",
    moreDetails: "Más detalles",
    previousPage: "Anterior",
    nextPage: "Siguiente",
    firstPage: "Primera página",
    lastPage: "Última página",
    paginationStatus: "Página {current} de {total}",
    download: "Descargar documento",
    relatedAgent: "Agente relacionado",
    noAgent: "Aún no hay un agente específico mapeado para este modelo.",
    viewAgent: "Ver agente",
    agentDetails: "Ver más detalles del agente",
    close: "Cerrar visualización del documento",
    previewPromptStatus: "Vista previa bajo demanda",
    previewPromptTitle: "Visualización disponible en la modal",
    previewPromptBody: "Haz clic en Visualizar documento para cargar la vista previa aquí. Si el navegador no renderiza el archivo, usa Descargar documento.",
    loading: "Cargando vista previa...",
    previewReady: "Vista previa cargada en el navegador.",
    svgReady: "Vista previa SVG cargada.",
    previewUnavailableTitle: "Vista previa no disponible en este navegador",
    unsupportedPreview: "Este tipo de archivo no tiene una vista previa nativa confiable en el navegador. Usa el botón superior para descargarlo.",
    docxLibraryMissing: "La biblioteca de lectura de DOCX no se cargó. El archivo sigue disponible para descarga.",
    spreadsheetLibraryMissing: "La biblioteca de lectura de planillas no se cargó. El archivo sigue disponible para descarga.",
    fetchError: "No fue posible cargar la vista previa. Para probar localmente, abre el portafolio con un servidor HTTP en lugar de abrir el HTML directamente desde el sistema de archivos.",
    emptySpreadsheet: "La planilla no devolvió filas visibles para la vista previa.",
    truncatedPreview: "Vista previa limitada para mantener la navegación ligera. Descarga el archivo para ver el contenido completo.",
    docxWarning: "Algunos detalles de formato del DOCX pueden no verse exactamente como en Word."
  }
};

function getAgentFileUrl(agentId) {
  return `${projectAutomationRepositoryBaseUrl}/agents/${agentId}.json`;
}

const projectModelAgents = {
  "wbs-dictionary": {
    id: "wbs-dictionary",
    title: {
      pt: "Agente de Dicionário da EAP",
      en: "WBS Dictionary Agent",
      es: "Agente de Diccionario de la EDT"
    },
    summary: {
      pt: "Gera o dicionário da EAP a partir do escopo e de respostas complementares.",
      en: "Generates the WBS dictionary from the project scope and complementary answers.",
      es: "Genera el diccionario de la EDT a partir del alcance y respuestas complementarias."
    },
    href: getAgentFileUrl("wbs-dictionary")
  },
  "infrastructure-sizing": {
    id: "infrastructure-sizing",
    title: {
      pt: "Agente de Infraestrutura e Arquitetura",
      en: "Infrastructure and Architecture Agent",
      es: "Agente de Infraestructura y Arquitectura"
    },
    summary: {
      pt: "Automatiza o documento de dimensionamento técnico, ambientes, integrações, segurança e premissas operacionais.",
      en: "Automates the technical sizing document, environments, integrations, security and operating assumptions.",
      es: "Automatiza el documento de dimensionamiento técnico, ambientes, integraciones, seguridad y premisas operativas."
    },
    href: getAgentFileUrl("infrastructure-sizing")
  },
  "team-directory": {
    id: "team-directory",
    title: {
      pt: "Agente de Diretório da Equipe",
      en: "Team Directory Agent",
      es: "Agente de Directorio del Equipo"
    },
    summary: {
      pt: "Monta o diretório da equipe com papéis, contatos, responsabilidades e informações operacionais do projeto.",
      en: "Builds the team directory with roles, contacts, responsibilities and project operating information.",
      es: "Monta el directorio del equipo con roles, contactos, responsabilidades e información operativa del proyecto."
    },
    href: getAgentFileUrl("team-directory")
  },
  "status-report": {
    id: "status-report",
    title: {
      pt: "Agente de Status Report",
      en: "Status Report Agent",
      es: "Agente de Status Report"
    },
    summary: {
      pt: "Gera relatórios periódicos com andamento, riscos, próximos passos e leitura executiva do projeto.",
      en: "Generates periodic reports with progress, risks, next steps and an executive project view.",
      es: "Genera reportes periódicos con avance, riesgos, próximos pasos y lectura ejecutiva del proyecto."
    },
    href: getAgentFileUrl("status-report")
  },
  "project-timeline": {
    id: "project-timeline",
    title: {
      pt: "Agente de Timeline do Projeto",
      en: "Project Timeline Agent",
      es: "Agente de Timeline del Proyecto"
    },
    summary: {
      pt: "Cria uma timeline visual do projeto com fases, ciclos, marcos e entregas principais.",
      en: "Creates a visual project timeline with phases, cycles, milestones and key deliveries.",
      es: "Crea una línea de tiempo visual del proyecto con fases, ciclos, hitos y entregas principales."
    },
    href: getAgentFileUrl("project-timeline")
  },
  "cycle-details": {
    id: "cycle-details",
    title: {
      pt: "Agente de Detalhamento dos Ciclos",
      en: "Cycle Details Agent",
      es: "Agente de Detalle de Ciclos"
    },
    summary: {
      pt: "Gera a planilha de ciclos com métricas, datas, entregas, capacidade e acompanhamento por sprint.",
      en: "Generates the cycle spreadsheet with metrics, dates, deliveries, capacity and sprint tracking.",
      es: "Genera la planilla de ciclos con métricas, fechas, entregas, capacidad y seguimiento por sprint."
    },
    href: getAgentFileUrl("cycle-details")
  },
  "acceptance-term": {
    id: "acceptance-term",
    title: {
      pt: "Agente de Termo de Aceite",
      en: "Acceptance Term Agent",
      es: "Agente de Término de Aceptación"
    },
    summary: {
      pt: "Preenche o termo de aceite de entrega por sprint ou ciclo com critérios e responsáveis.",
      en: "Fills the delivery acceptance term by sprint or cycle with criteria and owners.",
      es: "Completa el término de aceptación por sprint o ciclo con criterios y responsables."
    },
    href: getAgentFileUrl("acceptance-term")
  },
  "sprint-backlog": {
    id: "sprint-backlog",
    title: {
      pt: "Agente de Backlog de Sprint",
      en: "Sprint Backlog Agent",
      es: "Agente de Backlog de Sprint"
    },
    summary: {
      pt: "Gera backlog, alocação, riscos e indicadores de capacidade para acompanhamento da sprint.",
      en: "Generates backlog, allocation, risks and capacity indicators for sprint tracking.",
      es: "Genera backlog, asignación, riesgos e indicadores de capacidad para el seguimiento de la sprint."
    },
    href: getAgentFileUrl("sprint-backlog")
  },
  "kickoff-minutes": {
    id: "kickoff-minutes",
    title: {
      pt: "Agente de Ata de Kick-off",
      en: "Kick-off Minutes Agent",
      es: "Agente de Acta de Kick-off"
    },
    summary: {
      pt: "Gera a ata inicial do projeto com participantes, objetivos, decisões, pendências e próximos passos.",
      en: "Generates the project kick-off minutes with attendees, goals, decisions, pending items and next steps.",
      es: "Genera el acta inicial del proyecto con participantes, objetivos, decisiones, pendientes y próximos pasos."
    },
    href: getAgentFileUrl("kickoff-minutes")
  },
  "retrospective-minutes": {
    id: "retrospective-minutes",
    title: {
      pt: "Agente de Ata de Retrospectiva",
      en: "Retrospective Minutes Agent",
      es: "Agente de Acta de Retrospectiva"
    },
    summary: {
      pt: "Gera a ata de retrospectiva com aprendizados, ações de melhoria e acordos para os próximos ciclos.",
      en: "Generates retrospective minutes with learnings, improvement actions and agreements for upcoming cycles.",
      es: "Genera el acta de retrospectiva con aprendizajes, acciones de mejora y acuerdos para próximos ciclos."
    },
    href: getAgentFileUrl("retrospective-minutes")
  }
};

const projectModelDocuments = [
  {
    id: "escopo",
    title: "Escopo",
    category: {
      pt: "Iniciação",
      en: "Initiation",
      es: "Inicio"
    },
    extension: ".docx",
    fileName: "01-escopo.docx",
    path: "assets/documentos-modelo/01-escopo.docx",
    description: {
      pt: "Modelo base para registrar objetivos, contexto, premissas, restrições, entregas e critérios iniciais do projeto.",
      en: "Base template for recording goals, context, assumptions, constraints, deliveries and initial project criteria.",
      es: "Modelo base para registrar objetivos, contexto, premisas, restricciones, entregas y criterios iniciales del proyecto."
    }
  },
  {
    id: "estimativa-sfp",
    title: "Estimativa SFP - Sistema MK Barbearia",
    category: {
      pt: "Estimativa",
      en: "Estimation",
      es: "Estimación"
    },
    extension: ".docx",
    fileName: "02-estimativa-sfp-sistema-mk-barbearia.docx",
    path: "assets/documentos-modelo/02-estimativa-sfp-sistema-mk-barbearia.docx",
    description: {
      pt: "Documento para apoiar estimativa funcional, esforço, tamanho e planejamento inicial do Sistema MK Barbearia.",
      en: "Document to support functional estimation, effort, sizing and initial planning for the MK Barber Shop System.",
      es: "Documento para apoyar la estimación funcional, esfuerzo, tamaño y planificación inicial del Sistema MK Barbearia."
    }
  },
  {
    id: "plano-projeto",
    title: "Plano do Projeto",
    category: {
      pt: "Planejamento",
      en: "Planning",
      es: "Planificación"
    },
    extension: ".docx",
    fileName: "03-plano-do-projeto.docx",
    path: "assets/documentos-modelo/03-plano-do-projeto.docx",
    description: {
      pt: "Documento central para consolidar governança, cronograma, comunicação, riscos e estratégia de execução.",
      en: "Central document for consolidating governance, schedule, communication, risks and execution strategy.",
      es: "Documento central para consolidar gobernanza, cronograma, comunicación, riesgos y estrategia de ejecución."
    }
  },
  {
    id: "dicionario-eap",
    title: "Dicionário da EAP",
    category: {
      pt: "Escopo",
      en: "Scope",
      es: "Alcance"
    },
    extension: ".docx",
    fileName: "04-dicionario-da-eap.docx",
    path: "assets/documentos-modelo/04-dicionario-da-eap.docx",
    agentId: "wbs-dictionary",
    description: {
      pt: "Detalha os pacotes de trabalho da EAP, critérios de aceite, premissas e itens fora do escopo.",
      en: "Details WBS work packages, acceptance criteria, assumptions and out-of-scope items.",
      es: "Detalla los paquetes de trabajo de la EDT, criterios de aceptación, premisas e ítems fuera de alcance."
    }
  },
  {
    id: "infraestrutura-arquitetura",
    title: "Dimensionamento de Infraestrutura e Arquitetura",
    category: {
      pt: "Arquitetura",
      en: "Architecture",
      es: "Arquitectura"
    },
    extension: ".docx",
    fileName: "05-dimensionamento-de-infraestrutura-e-arquitetura.docx",
    path: "assets/documentos-modelo/05-dimensionamento-de-infraestrutura-e-arquitetura.docx",
    agentId: "infrastructure-sizing",
    description: {
      pt: "Organiza ambientes, stack tecnológica, integrações, segurança, backup, monitoramento e premissas técnicas.",
      en: "Organizes environments, technology stack, integrations, security, backup, monitoring and technical assumptions.",
      es: "Organiza ambientes, stack tecnológica, integraciones, seguridad, backup, monitoreo y premisas técnicas."
    }
  },
  {
    id: "diretorio-equipe",
    title: "Diretório da Equipe",
    category: {
      pt: "Equipe",
      en: "Team",
      es: "Equipo"
    },
    extension: ".docx",
    fileName: "06-diretorio-da-equipe.docx",
    path: "assets/documentos-modelo/06-diretorio-da-equipe.docx",
    agentId: "team-directory",
    description: {
      pt: "Centraliza papéis, responsabilidades, contatos, disponibilidade e informações de referência dos integrantes.",
      en: "Centralizes roles, responsibilities, contacts, availability and reference information for team members.",
      es: "Centraliza roles, responsabilidades, contactos, disponibilidad e información de referencia de los integrantes."
    }
  },
  {
    id: "status-report",
    title: "Status Report",
    category: {
      pt: "Acompanhamento",
      en: "Tracking",
      es: "Seguimiento"
    },
    extension: ".docx",
    fileName: "07-status-report.docx",
    path: "assets/documentos-modelo/07-status-report.docx",
    agentId: "status-report",
    description: {
      pt: "Modelo para comunicar andamento, indicadores, riscos, impedimentos, decisões e próximos passos do projeto.",
      en: "Template for communicating progress, indicators, risks, blockers, decisions and next project steps.",
      es: "Modelo para comunicar avance, indicadores, riesgos, impedimentos, decisiones y próximos pasos del proyecto."
    }
  },
  {
    id: "timeline-projeto",
    title: "Timeline do Sistema MK Barbearia",
    category: {
      pt: "Cronograma",
      en: "Timeline",
      es: "Cronograma"
    },
    extension: ".svg",
    fileName: "07-timeline-sistema-mk-barbearia.svg",
    path: "assets/documentos-modelo/07-timeline-sistema-mk-barbearia.svg",
    agentId: "project-timeline",
    description: {
      pt: "Visualização gráfica das fases, marcos e ciclos de entrega do projeto.",
      en: "Graphic view of project phases, milestones and delivery cycles.",
      es: "Visualización gráfica de las fases, hitos y ciclos de entrega del proyecto."
    }
  },
  {
    id: "detalhamento-ciclos",
    title: "Detalhamento dos Ciclos",
    category: {
      pt: "Ciclos",
      en: "Cycles",
      es: "Ciclos"
    },
    extension: ".xlsx",
    fileName: "08-detalhamento-dos-ciclos.xlsx",
    path: "assets/documentos-modelo/08-detalhamento-dos-ciclos.xlsx",
    agentId: "cycle-details",
    description: {
      pt: "Planilha para detalhar ciclos, sprints, entregas, métricas, datas e acompanhamento da evolução.",
      en: "Spreadsheet for detailing cycles, sprints, deliveries, metrics, dates and progress tracking.",
      es: "Planilla para detallar ciclos, sprints, entregas, métricas, fechas y seguimiento de la evolución."
    }
  },
  {
    id: "termo-aceite",
    title: "Termo de Aceite - Sprint 3",
    category: {
      pt: "Aceite",
      en: "Acceptance",
      es: "Aceptación"
    },
    extension: ".docx",
    fileName: "09-termo-de-aceite-sprint-3.docx",
    path: "assets/documentos-modelo/09-termo-de-aceite-sprint-3.docx",
    agentId: "acceptance-term",
    description: {
      pt: "Formaliza aceite de entrega, critérios atendidos, responsáveis, ressalvas e aprovação da sprint.",
      en: "Formalizes delivery acceptance, fulfilled criteria, owners, caveats and sprint approval.",
      es: "Formaliza aceptación de entrega, criterios atendidos, responsables, salvedades y aprobación de la sprint."
    }
  },
  {
    id: "backlog-sprint",
    title: "Backlog Sprint 3",
    category: {
      pt: "Backlog",
      en: "Backlog",
      es: "Backlog"
    },
    extension: ".xlsx",
    fileName: "10-backlog-sprint-3.xlsx",
    path: "assets/documentos-modelo/10-backlog-sprint-3.xlsx",
    agentId: "sprint-backlog",
    description: {
      pt: "Planilha para organizar itens da sprint, alocação, esforço, riscos, prioridades e indicadores de capacidade.",
      en: "Spreadsheet for organizing sprint items, allocation, effort, risks, priorities and capacity indicators.",
      es: "Planilla para organizar ítems de la sprint, asignación, esfuerzo, riesgos, prioridades e indicadores de capacidad."
    }
  },
  {
    id: "ata-kickoff",
    title: "Ata de Reunião de Kick-off",
    category: {
      pt: "Reuniões",
      en: "Meetings",
      es: "Reuniones"
    },
    extension: ".docx",
    fileName: "ata-de-reuniao-de-kick-off.docx",
    path: "assets/documentos-modelo/ata-de-reuniao-de-kick-off.docx",
    agentId: "kickoff-minutes",
    description: {
      pt: "Registra alinhamentos iniciais, participantes, objetivos, decisões, pendências e próximos passos do kick-off.",
      en: "Records initial alignments, attendees, goals, decisions, pending items and kick-off next steps.",
      es: "Registra alineaciones iniciales, participantes, objetivos, decisiones, pendientes y próximos pasos del kick-off."
    }
  },
  {
    id: "ata-retrospectiva",
    title: "Ata de Retrospectiva",
    category: {
      pt: "Melhoria contínua",
      en: "Continuous Improvement",
      es: "Mejora continua"
    },
    extension: ".docx",
    fileName: "ata-de-retrospectiva.docx",
    path: "assets/documentos-modelo/ata-de-retrospectiva.docx",
    agentId: "retrospective-minutes",
    description: {
      pt: "Consolida aprendizados, pontos positivos, oportunidades de melhoria e ações combinadas para os próximos ciclos.",
      en: "Consolidates learnings, strengths, improvement opportunities and agreed actions for upcoming cycles.",
      es: "Consolida aprendizajes, puntos positivos, oportunidades de mejora y acciones acordadas para próximos ciclos."
    }
  }
];

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

function getLocalizedValue(value, lang = currentLang) {
  if (typeof value === "string") {
    return value;
  }

  return value?.[lang] ?? value?.pt ?? "";
}

function getProjectModelLabels() {
  return projectModelLabels[currentLang] ?? projectModelLabels.pt;
}

function getProjectModelDocument(documentId) {
  return projectModelDocuments.find((documentModel) => documentModel.id === documentId);
}

function getProjectModelAgent(documentModel) {
  if (!documentModel?.agentId) {
    return null;
  }

  return projectModelAgents[documentModel.agentId] ?? null;
}

function renderProjectModelCards() {
  if (!projectModelGrid) {
    return;
  }

  const labels = getProjectModelLabels();
  const totalPages = Math.ceil(projectModelDocuments.length / projectModelPageSize);
  currentProjectModelPage = Math.min(currentProjectModelPage, totalPages - 1);

  const startIndex = currentProjectModelPage * projectModelPageSize;
  const currentDocuments = projectModelDocuments.slice(
    startIndex,
    startIndex + projectModelPageSize
  );

  const rowsMarkup = currentDocuments
    .map((documentModel) => {
      return `
        <article class="project-model-row" role="row">
          <div class="project-model-cell project-model-name-cell" role="cell" data-label="${escapeHtml(labels.nameColumn)}">
            <button class="model-title-button" type="button" data-open-document="${escapeHtml(documentModel.id)}">
              ${escapeHtml(documentModel.title)}
            </button>
            <div class="model-meta-line">
              <span>${escapeHtml(getLocalizedValue(documentModel.category))}</span>
            </div>
          </div>
          <p class="project-model-cell model-description" role="cell" data-label="${escapeHtml(labels.summaryColumn)}">
            ${escapeHtml(getLocalizedValue(documentModel.description))}
          </p>
          <div class="project-model-cell model-card-actions" role="cell" data-label="${escapeHtml(labels.actionColumn)}">
            <button class="project-detail-button" type="button" data-open-document="${escapeHtml(documentModel.id)}">
              ${escapeHtml(labels.moreDetails)}
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  const paginationStatus = labels.paginationStatus
    .replace("{current}", String(currentProjectModelPage + 1))
    .replace("{total}", String(totalPages));

  projectModelGrid.innerHTML = `
    <div class="project-model-table card" role="table" aria-label="${escapeHtml(labels.libraryKicker)}">
      <div class="project-model-table-head" role="row">
        <span role="columnheader">${escapeHtml(labels.nameColumn)}</span>
        <span role="columnheader">${escapeHtml(labels.summaryColumn)}</span>
        <span role="columnheader">${escapeHtml(labels.actionColumn)}</span>
      </div>
      ${rowsMarkup}
    </div>
    <div class="project-model-pagination" aria-label="${escapeHtml(paginationStatus)}">
      <button
        class="project-model-page-button"
        type="button"
        aria-label="${escapeHtml(labels.firstPage)}"
        title="${escapeHtml(labels.firstPage)}"
        data-model-page="first"
        ${currentProjectModelPage === 0 ? "disabled" : ""}
      >
        &lt;&lt;
      </button>
      <button
        class="project-model-page-button"
        type="button"
        aria-label="${escapeHtml(labels.previousPage)}"
        title="${escapeHtml(labels.previousPage)}"
        data-model-page="previous"
        ${currentProjectModelPage === 0 ? "disabled" : ""}
      >
        &lt;
      </button>
      <span>${escapeHtml(paginationStatus)}</span>
      <button
        class="project-model-page-button"
        type="button"
        aria-label="${escapeHtml(labels.nextPage)}"
        title="${escapeHtml(labels.nextPage)}"
        data-model-page="next"
        ${currentProjectModelPage >= totalPages - 1 ? "disabled" : ""}
      >
        &gt;
      </button>
      <button
        class="project-model-page-button"
        type="button"
        aria-label="${escapeHtml(labels.lastPage)}"
        title="${escapeHtml(labels.lastPage)}"
        data-model-page="last"
        ${currentProjectModelPage >= totalPages - 1 ? "disabled" : ""}
      >
        &gt;&gt;
      </button>
    </div>
  `;
}

function setDocumentPreviewStatus(message) {
  if (documentPreviewStatus) {
    documentPreviewStatus.textContent = message;
  }
}

function setDocumentPreviewMessage(title, body) {
  if (!documentPreview) {
    return;
  }

  documentPreview.className = "document-preview";
  documentPreview.innerHTML = `
    <div class="document-preview-message">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(body)}</span>
    </div>
  `;
}

function resetDocumentPreviewPrompt(labels) {
  documentPreviewRequestId += 1;
  setDocumentPreviewStatus(labels.previewPromptStatus);
  setDocumentPreviewMessage(labels.previewPromptTitle, labels.previewPromptBody);
}

function renderSvgPreview(documentModel, labels) {
  if (!documentPreview) {
    return;
  }

  documentPreview.className = "document-preview";
  documentPreview.innerHTML = `
    <div class="document-preview-image">
      <img src="${escapeHtml(documentModel.path)}" alt="${escapeHtml(documentModel.title)}">
    </div>
  `;
  setDocumentPreviewStatus(labels.svgReady);
}

async function renderDocxPreview(arrayBuffer, labels, requestId) {
  if (!documentPreview) {
    return;
  }

  if (!window.mammoth?.convertToHtml) {
    setDocumentPreviewStatus(labels.previewUnavailableTitle);
    setDocumentPreviewMessage(labels.previewUnavailableTitle, labels.docxLibraryMissing);
    return;
  }

  const result = await window.mammoth.convertToHtml({ arrayBuffer });

  if (requestId !== documentPreviewRequestId) {
    return;
  }

  const documentMarkup = result.value?.trim();
  const warningMarkup = result.messages?.length
    ? `<p class="document-preview-note">${escapeHtml(labels.docxWarning)}</p>`
    : "";

  documentPreview.className = "document-preview docx-preview";
  documentPreview.innerHTML = documentMarkup
    ? `${documentMarkup}${warningMarkup}`
    : `
      <div class="document-preview-message">
        <strong>${escapeHtml(labels.previewUnavailableTitle)}</strong>
        <span>${escapeHtml(labels.unsupportedPreview)}</span>
      </div>
    `;
  setDocumentPreviewStatus(labels.previewReady);
}

function buildSpreadsheetTable(sheetName, sheet, labels) {
  const rows = window.XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    blankrows: false,
    defval: "",
    raw: false
  });

  if (!rows.length) {
    return `
      <section class="spreadsheet-sheet">
        <h3>${escapeHtml(sheetName)}</h3>
        <p class="document-preview-note">${escapeHtml(labels.emptySpreadsheet)}</p>
      </section>
    `;
  }

  const maxPreviewRows = 80;
  const maxPreviewColumns = 24;
  const originalColumnCount = rows.reduce((max, row) => Math.max(max, row.length), 0);
  const previewRows = rows
    .slice(0, maxPreviewRows)
    .map((row) => row.slice(0, maxPreviewColumns));
  const columnCount = Math.min(
    maxPreviewColumns,
    previewRows.reduce((max, row) => Math.max(max, row.length), 0)
  );
  const truncated = rows.length > maxPreviewRows || originalColumnCount > maxPreviewColumns;

  const tableRows = previewRows
    .map((row, rowIndex) => {
      const cellTag = rowIndex === 0 ? "th" : "td";
      const cells = Array.from({ length: columnCount }, (_, cellIndex) => {
        const value = row[cellIndex] ?? "";
        return `<${cellTag}>${escapeHtml(String(value))}</${cellTag}>`;
      }).join("");

      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `
    <section class="spreadsheet-sheet">
      <h3>${escapeHtml(sheetName)}</h3>
      <table class="spreadsheet-table">
        <tbody>${tableRows}</tbody>
      </table>
      ${truncated ? `<p class="document-preview-note">${escapeHtml(labels.truncatedPreview)}</p>` : ""}
    </section>
  `;
}

function renderSpreadsheetPreview(arrayBuffer, labels) {
  if (!documentPreview) {
    return;
  }

  if (!window.XLSX?.read) {
    setDocumentPreviewStatus(labels.previewUnavailableTitle);
    setDocumentPreviewMessage(labels.previewUnavailableTitle, labels.spreadsheetLibraryMissing);
    return;
  }

  const workbook = window.XLSX.read(arrayBuffer, {
    type: "array",
    cellDates: true
  });

  const visibleSheetNames = workbook.SheetNames.slice(0, 5);
  const sheetMarkup = visibleSheetNames
    .map((sheetName) => buildSpreadsheetTable(sheetName, workbook.Sheets[sheetName], labels))
    .join("");
  const truncatedWorkbook = workbook.SheetNames.length > visibleSheetNames.length;

  documentPreview.className = "document-preview";
  documentPreview.innerHTML = `
    ${sheetMarkup}
    ${truncatedWorkbook ? `<p class="document-preview-note">${escapeHtml(labels.truncatedPreview)}</p>` : ""}
  `;
  setDocumentPreviewStatus(labels.previewReady);
}

async function renderDocumentPreview(documentModel) {
  if (!documentPreview) {
    return;
  }

  const labels = getProjectModelLabels();
  const requestId = documentPreviewRequestId + 1;
  documentPreviewRequestId = requestId;

  setDocumentPreviewStatus(labels.loading);
  setDocumentPreviewMessage(labels.loading, getLocalizedValue(documentModel.description));

  if (documentModel.extension === ".svg") {
    renderSvgPreview(documentModel, labels);
    return;
  }

  if (![".docx", ".xlsx", ".xls"].includes(documentModel.extension)) {
    setDocumentPreviewStatus(labels.previewUnavailableTitle);
    setDocumentPreviewMessage(labels.previewUnavailableTitle, labels.unsupportedPreview);
    return;
  }

  try {
    const response = await fetch(documentModel.path);

    if (requestId !== documentPreviewRequestId) {
      return;
    }

    if (!response.ok) {
      throw new Error(`Preview request failed with status ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();

    if (requestId !== documentPreviewRequestId) {
      return;
    }

    if (documentModel.extension === ".docx") {
      await renderDocxPreview(arrayBuffer, labels, requestId);
      return;
    }

    renderSpreadsheetPreview(arrayBuffer, labels);
  } catch (error) {
    if (requestId !== documentPreviewRequestId) {
      return;
    }

    setDocumentPreviewStatus(labels.previewUnavailableTitle);
    setDocumentPreviewMessage(labels.previewUnavailableTitle, labels.fetchError);
  }
}

function renderDocumentModelModal(documentId) {
  const documentModel = getProjectModelDocument(documentId);

  if (!documentModel || !documentModalTitle || !documentModalDescription) {
    return;
  }

  const labels = getProjectModelLabels();
  const agent = getProjectModelAgent(documentModel);

  if (documentModalKicker) {
    documentModalKicker.textContent = labels.libraryKicker;
  }

  documentModalTitle.textContent = documentModel.title;
  documentModalDescription.textContent = getLocalizedValue(documentModel.description);

  if (documentModalPreviewButton) {
    documentModalPreviewButton.textContent = labels.viewDocument;
  }

  if (documentModalDownload) {
    documentModalDownload.href = documentModel.path;
    documentModalDownload.setAttribute("download", documentModel.fileName);
    documentModalDownload.textContent = labels.download;
  }

  if (documentModalClose) {
    documentModalClose.setAttribute("aria-label", labels.close);
  }

  if (documentModalAgent) {
    documentModalAgent.hidden = !agent;
    documentModalAgent.innerHTML = agent
      ? `
        <p class="document-agent-label">${escapeHtml(labels.relatedAgent)}</p>
        <strong>${escapeHtml(getLocalizedValue(agent.title))}</strong>
        <p>${escapeHtml(getLocalizedValue(agent.summary))}</p>
        <a class="btn btn-accent" href="${escapeHtml(agent.href)}" target="_blank" rel="noreferrer">
          ${escapeHtml(labels.agentDetails)}
        </a>
      `
      : "";
  }

  resetDocumentPreviewPrompt(labels);
}

function openDocumentModelModal(documentId) {
  if (!documentModal) {
    return;
  }

  if (!getProjectModelDocument(documentId)) {
    return;
  }

  activeDocumentModelId = documentId;
  renderDocumentModelModal(documentId);
  documentModal.classList.add("open");
  documentModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeDocumentModelModal() {
  if (!documentModal) {
    return;
  }

  activeDocumentModelId = "";
  documentPreviewRequestId += 1;
  documentModal.classList.remove("open");
  documentModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
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

  if (documentModalClose) {
    documentModalClose.setAttribute("aria-label", getProjectModelLabels().close);
  }

  renderProjectModelCards();

  if (activeProjectId) {
    renderProjectModal(activeProjectId);
  }

  if (activeDocumentModelId) {
    renderDocumentModelModal(activeDocumentModelId);
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

projectModelGrid?.addEventListener("click", (event) => {
  const trigger = event.target instanceof Element
    ? event.target.closest("[data-open-document]")
    : null;
  const pageTrigger = event.target instanceof Element
    ? event.target.closest("[data-model-page]")
    : null;

  if (pageTrigger) {
    const direction = pageTrigger.dataset.modelPage;
    const totalPages = Math.ceil(projectModelDocuments.length / projectModelPageSize);

    if (direction === "first") {
      currentProjectModelPage = 0;
    }

    if (direction === "previous") {
      currentProjectModelPage = Math.max(0, currentProjectModelPage - 1);
    }

    if (direction === "next") {
      currentProjectModelPage = Math.min(totalPages - 1, currentProjectModelPage + 1);
    }

    if (direction === "last") {
      currentProjectModelPage = totalPages - 1;
    }

    renderProjectModelCards();
    return;
  }

  if (!trigger) {
    return;
  }

  openDocumentModelModal(trigger.dataset.openDocument);
});

projectModalDismissTriggers.forEach((trigger) => {
  trigger.addEventListener("click", closeProjectModal);
});

documentModalDismissTriggers.forEach((trigger) => {
  trigger.addEventListener("click", closeDocumentModelModal);
});

documentModalPreviewButton?.addEventListener("click", () => {
  const documentModel = getProjectModelDocument(activeDocumentModelId);

  if (documentModel) {
    renderDocumentPreview(documentModel);
  }
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

    if (documentModal?.classList.contains("open")) {
      closeDocumentModelModal();
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
