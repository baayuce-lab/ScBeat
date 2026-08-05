export type Language = 'tr' | 'en' | 'es';

export interface Translations {
  // Brand & Header
  appTitle: string;
  appSubtitle: string;
  analysisMode: string;
  editorMode: string;
  pitchDeckBtn: string;
  scriptDoctorBtn: string;
  historyBtn: string;
  languageLabel: string;

  // Hero Masthead
  heroTag: string;
  heroSystemId: string;
  heroTitle: string;
  heroSubtitle: string;

  // Presets & Input Form
  quickPresetsTitle: string;
  quickPresetsSubtitle: string;
  projectTitleLabel: string;
  projectTitlePlaceholder: string;
  inputFormatLabel: string;
  genreLabel: string;
  targetMediumLabel: string;
  scriptTextLabel: string;
  wordsLabel: string;
  pagesLabel: string;
  clearBtn: string;
  analysisFocusLabel: string;
  runAnalysisBtn: string;
  analyzingState: string;

  // Format Options
  formatScreenplay: string;
  formatPitch: string;
  formatOutline: string;
  formatTreatment: string;
  formatLogline: string;

  // Screenplay Editor
  editorTitle: string;
  editorSubtitle: string;
  sceneHeading: string;
  action: string;
  character: string;
  parenthetical: string;
  dialogue: string;
  transition: string;
  tabShortcutHint: string;
  enterShortcutHint: string;
  loadSampleBtn: string;
  analyzeInDoctorBtn: string;
  exportFdxBtn: string;
  exportTxtBtn: string;
  exportFountainBtn: string;
  downloadPdfBtn: string;
  generatingPdf: string;
  clearEditorBtn: string;
  statsScenes: string;
  statsElements: string;
  statsEstRuntime: string;

  // Overview Bar & Tabs
  tabLogline: string;
  tabBeats: string;
  tabTension: string;
  tabCharacters: string;
  tabPacing: string;
  scriptDoctorVerdictTitle: string;
  overallScore: string;
  commercialViability: string;
  craftExecution: string;
  strengthsTitle: string;
  priorityFixesTitle: string;

  // Chat Drawer
  chatTitle: string;
  chatSubtitle: string;
  chatPlaceholder: string;
  chatSendBtn: string;
  chatAnalyzing: string;

  // History Drawer
  historyTitle: string;
  historyClearAll: string;
  historyEmpty: string;
  historyLoad: string;

  // Ready State Empty Card
  readyTitle: string;
  readySubtitle: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  tr: {
    appTitle: 'ScriptBeat',
    appSubtitle: 'Senaryo Doktoru ve Dramaturji Analiz Stüdyosu',
    analysisMode: 'Dramaturji Analizi',
    editorMode: 'Senaryonu Yaz',
    pitchDeckBtn: 'Pitch Deck Sunumu',
    scriptDoctorBtn: 'Senaryo Doktoru',
    historyBtn: 'Geçmiş',
    languageLabel: 'Dil Seçimi',

    heroTag: 'Studio Dramaturji & Pitch Deck Motoru',
    heroSystemId: 'SİSTEM KODU: #SB-9928-TR',
    heroTitle: 'Senaryo Yapısını Analiz Edin & Profesyonel Pitch Deck Oluşturun',
    heroSubtitle: 'ScriptBeat dramatik mekanikleri, 3 perdeli yapı vuruşlarını, karakter yaylarını ve tempo düşüşlerini değerlendirir. Studio kalitesinde logline ve sunum verileri üretir.',

    quickPresetsTitle: 'Hızlı Başlangıç Senaryo Taslakları',
    quickPresetsSubtitle: 'Örnek senaryo sahnesi veya proje fikri yükleyin',
    projectTitleLabel: 'Proje Başlığı',
    projectTitlePlaceholder: 'ör. Gümüş Karar',
    inputFormatLabel: 'Girdi Formatı',
    genreLabel: 'Ana Tür',
    targetMediumLabel: 'Hedef Format',
    scriptTextLabel: 'Senaryo Sahnesi veya Metin Girdisi',
    wordsLabel: 'kelime',
    pagesLabel: 'sayfa',
    clearBtn: 'Temizle',
    analysisFocusLabel: 'Analiz Odak Alanları',
    runAnalysisBtn: 'Dramatik Yapı Analizini Başlat',
    analyzingState: 'Dramaturji Motoru Çalışıyor...',

    formatScreenplay: 'Senaryo Sahnesi / Alıntı',
    formatPitch: 'Proje Fikri / Treatment',
    formatOutline: '3 Perdeli Taslak / Vuruş Haritası',
    formatTreatment: 'Genel Özet Treatment',
    formatLogline: 'Sadece Logline ve Hipotez',

    editorTitle: 'Senaryonu Yaz',
    editorSubtitle: 'Profesyonel senaryo formatında (Sahne Başlığı, Aksiyon, Karakter, Diyalog, Geçiş) senaryo yazın.',
    sceneHeading: 'SAHNE BAŞLIĞI (INT/EXT)',
    action: 'AKSİYON / BETİMLEME',
    character: 'KARAKTER İSMİ',
    parenthetical: 'PARANTEZ (İFADE)',
    dialogue: 'DİYALOG',
    transition: 'GEÇİŞ (CUT TO / FADE IN)',
    tabShortcutHint: 'Tab: Öğe Tipi Değiştir (Sahne -> Aksiyon -> Karakter -> Diyalog)',
    enterShortcutHint: 'Enter: Yeni Satır',
    loadSampleBtn: 'Örnek Senaryo Yükle',
    analyzeInDoctorBtn: 'Senaryo Doktoruna Gönder (Analiz Et)',
    exportFdxBtn: 'Final Draft (.fdx) İndir',
    exportTxtBtn: 'Metin (.txt) İndir',
    exportFountainBtn: 'Fountain (.fountain) İndir',
    downloadPdfBtn: 'PDF Olarak İndir',
    generatingPdf: 'PDF Oluşturuluyor...',
    clearEditorBtn: 'Metni Temizle',
    statsScenes: 'Sahne Sayısı',
    statsElements: 'Satır/Öğe',
    statsEstRuntime: 'Tahmini Süre',

    tabLogline: 'Logline & Hipotez',
    tabBeats: '3 Perdeli Yapı',
    tabTension: 'Gerilim Grafiği',
    tabCharacters: 'Karakter Analizi',
    tabPacing: 'Tempo & Çözümler',
    scriptDoctorVerdictTitle: 'Senaryo Doktoru Kararı',
    overallScore: 'Genel Skor',
    commercialViability: 'Ticari Potansiyel',
    craftExecution: 'Yazım Kalitesi',
    strengthsTitle: 'Öne Çıkan Güçlü Yönler',
    priorityFixesTitle: 'Öncelikli Düzeltmeler',

    chatTitle: 'Senaryo Doktoru Tezgahı',
    chatSubtitle: 'Canlı Yapay Zekâ Dramaturg & Sahne Yeniden Yazarı',
    chatPlaceholder: 'Sahne revizyonu, diyalog güçlendirme veya Perde 2 düzeltmesi isteyin...',
    chatSendBtn: 'Gönder',
    chatAnalyzing: 'Dramaturgunuz sahnenizi inceliyor...',

    historyTitle: 'Analiz Geçmişi',
    historyClearAll: 'Tümünü Temizle',
    historyEmpty: 'Henüz kaydedilmiş dramaturji raporu yok.',
    historyLoad: 'Raporu Yükle',

    readyTitle: 'Senaryo Analizine Hazır',
    readySubtitle: 'Yukarıdaki hazır taslaklardan birini seçin veya kendi senaryo metninizi yapıştırarak 3 perdeli yapı raporu ve Pitch Deck sunumu oluşturun.',
  },
  en: {
    appTitle: 'ScriptBeat',
    appSubtitle: 'Hollywood Script Doctor & Dramaturgy Studio',
    analysisMode: 'Dramaturgy Analysis',
    editorMode: 'Write Your Script',
    pitchDeckBtn: 'Pitch Deck Slide View',
    scriptDoctorBtn: 'Script Doctor',
    historyBtn: 'History',
    languageLabel: 'Language',

    heroTag: 'Studio Dramaturgy & Pitch Deck Engine',
    heroSystemId: 'SYSTEM ID: #SB-9928-EN',
    heroTitle: 'Evaluate Screenplay Structure & Format Producer Pitch Decks',
    heroSubtitle: 'ScriptBeat evaluates narrative mechanics, 3-act structure beats, character arcs, and tension sags. Get instant studio-grade logline refinements and producer pitch deck data.',

    quickPresetsTitle: 'Quick Start Script Presets',
    quickPresetsSubtitle: 'Load sample script excerpt or pitch concept',
    projectTitleLabel: 'Project Title',
    projectTitlePlaceholder: 'e.g. The Silver Verdict',
    inputFormatLabel: 'Input Format',
    genreLabel: 'Primary Genre',
    targetMediumLabel: 'Target Medium',
    scriptTextLabel: 'Screenplay Excerpt or Story Submission',
    wordsLabel: 'words',
    pagesLabel: 'pages',
    clearBtn: 'Clear',
    analysisFocusLabel: 'Analysis Focus Areas',
    runAnalysisBtn: 'Run Dramatic Structure Analysis',
    analyzingState: 'Running Dramaturgy Engine...',

    formatScreenplay: 'Screenplay Excerpt / Scene',
    formatPitch: 'Pitch Concept / Treatment',
    formatOutline: '3-Act Outline / Beat Sheet',
    formatTreatment: 'Treatment Summary',
    formatLogline: 'Logline & Premise Only',

    editorTitle: 'Write Your Script',
    editorSubtitle: 'Write screenplays formatted with standard Hollywood screenplay elements (Scene Heading, Action, Character, Dialogue, Parenthetical, Transition).',
    sceneHeading: 'SCENE HEADING (INT/EXT)',
    action: 'ACTION / DESCRIPTION',
    character: 'CHARACTER NAME',
    parenthetical: 'PARENTHETICAL',
    dialogue: 'DIALOGUE',
    transition: 'TRANSITION (CUT TO / FADE IN)',
    tabShortcutHint: 'Tab: Switch Element Type (Scene -> Action -> Character -> Dialogue)',
    enterShortcutHint: 'Enter: Next Line',
    loadSampleBtn: 'Load Sample Script',
    analyzeInDoctorBtn: 'Send to Script Doctor (Analyze)',
    exportFdxBtn: 'Export Final Draft (.fdx)',
    exportTxtBtn: 'Export Text (.txt)',
    exportFountainBtn: 'Export Fountain (.fountain)',
    downloadPdfBtn: 'Download PDF',
    generatingPdf: 'Generating PDF...',
    clearEditorBtn: 'Clear Script',
    statsScenes: 'Scene Count',
    statsElements: 'Lines/Elements',
    statsEstRuntime: 'Est. Runtime',

    tabLogline: 'Logline & Premise',
    tabBeats: '3-Act Beats',
    tabTension: 'Tension Curve',
    tabCharacters: 'Character Arcs',
    tabPacing: 'Pacing & Fixes',
    scriptDoctorVerdictTitle: 'Script Doctor Verdict',
    overallScore: 'Overall Score',
    commercialViability: 'Commercial Viability',
    craftExecution: 'Craft Execution',
    strengthsTitle: 'Top Strengths',
    priorityFixesTitle: 'Priority Fixes',

    chatTitle: 'Script Doctor Workbench',
    chatSubtitle: 'Live AI Dramaturge & Scene Rewriter',
    chatPlaceholder: 'Ask for scene rewrites, logline polish, or Act 2 fixes...',
    chatSendBtn: 'Send',
    chatAnalyzing: 'Hollywood Dramaturge is analyzing your scene...',

    historyTitle: 'Analysis History',
    historyClearAll: 'Clear All',
    historyEmpty: 'No saved dramaturgy reports yet.',
    historyLoad: 'Load Report',

    readyTitle: 'Ready for Screenplay Analysis',
    readySubtitle: 'Choose a quick-start preset above or paste your script excerpt to generate a 3-act structure report, character arc study, and Producer Pitch Deck slides.',
  },
  es: {
    appTitle: 'ScriptBeat',
    appSubtitle: 'Doctor de Guiones de Hollywood y Estudio Dramatúrgico',
    analysisMode: 'Análisis Dramatúrgico',
    editorMode: 'Escribe Tu Guion',
    pitchDeckBtn: 'Presentación Pitch Deck',
    scriptDoctorBtn: 'Doctor de Guion',
    historyBtn: 'Historial',
    languageLabel: 'Idioma',

    heroTag: 'Motor de Dramaturgia de Estudio y Pitch Deck',
    heroSystemId: 'CÓDIGO DE SISTEMA: #SB-9928-ES',
    heroTitle: 'Evalúe la Estructura del Guion y Genere Pitch Decks de Productor',
    heroSubtitle: 'ScriptBeat evalúa la mecánica narrativa, puntos de estructura en 3 actos, arcos de personajes y caídas de tensión. Obtenga refinamientos de logline de calidad de estudio.',

    quickPresetsTitle: 'Borradores de Guion de Inicio Rápido',
    quickPresetsSubtitle: 'Cargue una escena de muestra o concepto de proyecto',
    projectTitleLabel: 'Título del Proyecto',
    projectTitlePlaceholder: 'ej. El Veredicto de Plata',
    inputFormatLabel: 'Formato de Entrada',
    genreLabel: 'Género Principal',
    targetMediumLabel: 'Formato Objetivo',
    scriptTextLabel: 'Escena de Guion o Texto de Entrada',
    wordsLabel: 'palabras',
    pagesLabel: 'páginas',
    clearBtn: 'Limpiar',
    analysisFocusLabel: 'Áreas de Enfoque del Análisis',
    runAnalysisBtn: 'Ejecutar Análisis de Estructura Dramática',
    analyzingState: 'Ejecutando Motor Dramatúrgico...',

    formatScreenplay: 'Extracto de Guion / Escena',
    formatPitch: 'Concepto de Pitch / Treatment',
    formatOutline: 'Esquema de 3 Actos / Escaleta',
    formatTreatment: 'Resumen de Tratamiento',
    formatLogline: 'Solo Logline e Hipótesis',

    editorTitle: 'Escribe Tu Guion',
    editorSubtitle: 'Escriba guiones con elementos estándar de Hollywood (Encabezado de Escena, Acción, Personaje, Diálogo, Acotación, Transición).',
    sceneHeading: 'ENCABEZADO DE ESCENA (INT/EXT)',
    action: 'ACCIÓN / DESCRIPCIÓN',
    character: 'NOMBRE DEL PERSONAJE',
    parenthetical: 'ACOTACIÓN (ACOT)',
    dialogue: 'DIÁLOGO',
    transition: 'TRANSICIÓN (CORTE A / FADE IN)',
    tabShortcutHint: 'Tab: Cambiar Tipo de Elemento (Escena -> Acción -> Personaje -> Diálogo)',
    enterShortcutHint: 'Enter: Nueva Línea',
    loadSampleBtn: 'Cargar Guion de Muestra',
    analyzeInDoctorBtn: 'Enviar a Doctor de Guion (Analizar)',
    exportFdxBtn: 'Exportar Final Draft (.fdx)',
    exportTxtBtn: 'Exportar Texto (.txt)',
    exportFountainBtn: 'Exportar Fountain (.fountain)',
    downloadPdfBtn: 'Descargar PDF',
    generatingPdf: 'Generando PDF...',
    clearEditorBtn: 'Limpiar Texto',
    statsScenes: 'Número de Escenas',
    statsElements: 'Líneas/Elementos',
    statsEstRuntime: 'Tiempo Estimado',

    tabLogline: 'Logline e Hipótesis',
    tabBeats: 'Estructura en 3 Actos',
    tabTension: 'Curva de Tensión',
    tabCharacters: 'Arcos de Personajes',
    tabPacing: 'Ritmo y Soluciones',
    scriptDoctorVerdictTitle: 'Veredicto del Doctor de Guion',
    overallScore: 'Puntuación General',
    commercialViability: 'Viabilidad Comercial',
    craftExecution: 'Calidad de Escritura',
    strengthsTitle: 'Principales Fortalezas',
    priorityFixesTitle: 'Correcciones Prioritarias',

    chatTitle: 'Mesa de Trabajo del Doctor de Guion',
    chatSubtitle: 'Dramaturgo IA en Vivo y Reescritor de Escenas',
    chatPlaceholder: 'Solicite reescritura de escenas, pulido de logline o arreglos del Acto 2...',
    chatSendBtn: 'Enviar',
    chatAnalyzing: 'El dramaturgo de Hollywood está analizando su escena...',

    historyTitle: 'Historial de Análisis',
    historyClearAll: 'Borrar Todo',
    historyEmpty: 'Aún no hay informes de dramaturgia guardados.',
    historyLoad: 'Cargar Informe',

    readyTitle: 'Listo para Análisis de Guion',
    readySubtitle: 'Elija un borrador rápido arriba o pegue el extracto de su guion para generar un informe de estructura en 3 actos y diapositivas de Pitch Deck.',
  },
};
