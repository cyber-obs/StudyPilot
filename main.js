/* Révisions & Interro — plugin Obsidian (JS pur, aucun build nécessaire)
   Langues : Français, English, Español */
const obsidian = require('obsidian');
const {
  Plugin, Modal, Notice, PluginSettingTab, Setting, TFile, TFolder,
  Component, MarkdownRenderer, FuzzySuggestModal, Menu, normalizePath,
} = obsidian;

/* ------------------------------------------------------------------ */
/*  Traductions                                                        */
/* ------------------------------------------------------------------ */
const LANGUES = { fr: 'Français', en: 'English', es: 'Español' };

const TXT = {
  fr: {
    statusIdle: `📚 Révisions`,
    statusRunning_one: `📚 {time} · {n} fiche`,
    statusRunning_other: `📚 {time} · {n} fiches`,
    statusPaused: `⏸ {time} · en pause`,
    statusWaiting: `📝 Interro en attente`,
    tipMenu: `Révisions : clique pour ouvrir le menu`,

    menuStart: `Démarrer une séquence`,
    menuPause: `Mettre en pause`,
    menuResume: `Reprendre`,
    menuFinish: `Terminer et passer l'interro`,
    menuCancel: `Annuler la séquence`,
    menuQuickQuiz: `Interro rapide sur cette fiche`,
    menuPending: `Passer l'interro en attente`,
    menuTracking: `Ouvrir le tableau de suivi`,

    cmdMenu: `Ouvrir le menu des révisions`,
    cmdStart: `Démarrer une séquence de révision`,
    cmdPause: `Mettre en pause / reprendre la séquence`,
    cmdFinish: `Terminer la séquence et passer l'interro`,
    cmdCancel: `Annuler la séquence en cours (sans enregistrer)`,
    cmdQuick: `Interro rapide sur la fiche ouverte`,
    cmdTracking: `Ouvrir le tableau de suivi des révisions`,

    noticeStartedManual: `📚 Séquence de révision démarrée.`,
    noticeStartedAuto: `📚 Séquence démarrée automatiquement.`,
    noticeAlready: `Une séquence est déjà en cours.`,
    noticeNoSession: `Aucune séquence en cours.`,
    noticeTooShort: `Séquence trop courte : non enregistrée.`,
    noticeCancelled: `Séquence annulée, rien n'a été enregistré.`,
    noticePaused: `⏸ Séquence en pause.`,
    noticeResumed: `▶ Séquence reprise.`,
    noticeReady: `📝 Séquence terminée : ton interro est prête.`,
    noticeTakeQuiz: `Passer l'interro`,
    noticeOpenNote: `Ouvre d'abord une fiche.`,
    noticeSaved: `Séquence enregistrée.`,
    noticeWelcome: `👋 Révisions & Interro : une séquence démarre quand tu ouvres une fiche. Clique sur 📚 dans la barre d'état pour la mettre en pause, la terminer et passer une petite interro.`,

    quizTitle: `Interro de fin de séquence`,
    quizTitleQuick: `Interro rapide`,
    quizProgress: `Question {i} / {n}`,
    quizHint: `Réponds de tête (ou à voix haute), puis vérifie.`,
    quizShow: `Afficher la réponse  (Entrée)`,
    quizKnew: `✅ Je savais  (1)`,
    quizHesitated: `🤔 J'ai hésité  (2)`,
    quizMissed: `❌ Raté  (3)`,
    quizSkip: `Passer  (4)`,
    quizEsc: `Échap : reprendre plus tard, tes réponses sont gardées.`,

    recapTitle: `Bilan de la séquence`,
    recapScore: `Score : {p} %`,
    recapNotQuizzed: `non interrogée`,
    recapNew: `{s} % → progression {a} %`,
    recapChange: `{s} % → progression {b} % ➜ {a} %`,
    recapClose: `Fermer`,
    recapTracking: `Voir le tableau de suivi`,

    qCallout: `{type} : {title}`,
    qCalloutNoTitle: `{type} — {note}`,
    typeCard: `Carte`,
    typeSection: `Section`,
    typeNote: `Fiche`,
    qSection: `Explique : {title}`,
    qNote: `Résume de tête le contenu de « {note} »`,
    emptyNote: `(fiche vide)`,

    trackingFile: `Suivi des révisions.md`,
    trackTitle: `Suivi des révisions`,
    trackUpdated: `Mis à jour le {date} à {time} — généré automatiquement, ne pas modifier à la main.`,
    trackColNote: `Fiche`,
    trackColProgress: `Progression`,
    trackColCount: `Révisions`,
    trackColLast: `Dernière révision`,
    trackColTime: `Temps`,
    trackAverage_one: `**Progression moyenne : {p} %** sur {n} fiche (les moins maîtrisées en premier).`,
    trackAverage_other: `**Progression moyenne : {p} %** sur {n} fiches (les moins maîtrisées en premier).`,
    trackRecent: `Dernières séquences`,
    trackNone: `*Aucune fiche suivie pour l'instant : termine une séquence avec interro.*`,
    trackNoQuiz: `sans interro`,
    trackQuiz: `interro {p} %`,
    min: `min`,

    setLangHeading: `Langue`,
    setLang: `Langue du plugin`,
    setLangDesc: `Les noms des commandes changent après un rechargement du plugin.`,
    langAuto: `Automatique (langue d'Obsidian)`,
    setNotesHeading: `Quelles notes sont des révisions ?`,
    setInclude: `Dossiers des fiches`,
    setIncludeDesc: `Seules les notes de ces dossiers (sous-dossiers compris) comptent. Aucun dossier choisi = tout le coffre.`,
    setExclude: `Dossiers exclus`,
    setExcludeDesc: `Ces dossiers sont ignorés, même s'ils sont dans un dossier inclus.`,
    addFolder: `Ajouter un dossier`,
    wholeVault: `Tout le coffre`,
    noneExcluded: `Aucun dossier exclu`,
    removeFolder: `Retirer`,
    folderPlaceholder: `Choisis un dossier…`,
    setSeqHeading: `Séquences`,
    setAuto: `Démarrage automatique`,
    setAutoDesc: `Une séquence démarre dès que tu ouvres une fiche.`,
    setIdle: `Fin de séquence après inactivité`,
    setIdleDesc: `Minutes sans clavier ni souris avant que la séquence se termine toute seule.`,
    setMin: `Durée minimale (secondes)`,
    setMinDesc: `En dessous, la séquence n'est pas enregistrée.`,
    setQuizHeading: `Interro`,
    setNbQ: `Nombre de questions`,
    setNbQDesc: `Les questions viennent des callouts, des lignes « question :: réponse » et des sections ## de tes fiches.`,
    setImpact: `Impact de l'interro sur la progression`,
    setImpactDesc: `À chaque interro, la progression se rapproche de ton score de ce pourcentage (100 % = elle prend directement ton score).`,
    setHow: `Tu te notes toi-même après chaque réponse : ✅ = 100 %, 🤔 = 50 %, ❌ = 0 %.`,
    setTrackHeading: `Suivi`,
    setProp: `Propriété de progression`,
    setPropDesc: `Propriété (0 à 100) écrite en haut de chaque fiche.`,
    setFile: `Note de suivi`,
    setFileDesc: `Chemin de la note générée. Vide = « {def} ».`,
    setAutoTrack: `Mettre à jour la note de suivi automatiquement`,

    cmdNextDue: `Ouvrir la prochaine fiche à réviser`,
    menuNextDue: `Ouvrir la prochaine fiche à réviser`,
    noticeNoneDue: `Aucune fiche à réviser pour le moment 🎉`,
    noticeDue_one: `📅 {n} fiche à réviser aujourd'hui ou en retard.`,
    noticeDue_other: `📅 {n} fiches à réviser aujourd'hui ou en retard.`,
    recapNext: `prochaine révision : {date}`,
    trackColNext: `Prochaine révision`,
    trackDue: `À réviser (aujourd'hui ou en retard)`,
    setPlanHeading: `Planification`,
    setPlan: `Planifier les prochaines révisions`,
    setPlanDesc: `Calcule la date de la prochaine révision d'après ton score (écarts de plus en plus grands) et l'écrit dans la propriété prochaine_revision. Une mauvaise note la ramène à demain.`,
    setMaxInterval: `Écart maximum entre deux révisions (jours)`,
    setMaxIntervalDesc: `Plafond de l'intervalle calculé.`,
    setScheduler: `Qui planifie les révisions ?`,
    setSchedulerDesc: `« Mon plugin » calcule prochaine_revision. « Spaced Repetition » : après l'interro, chaque fiche interrogée est notée dans Spaced Repetition (Facile, Bien ou Difficile selon ton score) et ses dates sr-due sont utilisées partout (suivi, rappels, prochaine fiche).`,
    schedInterne: `Mon plugin`,
    schedSR: `Spaced Repetition`,
    setSRHeading: `Spaced Repetition`,
    srDetected: `✅ Plugin Spaced Repetition détecté.`,
    srMissing: `ℹ️ Plugin Spaced Repetition non détecté : installe-le et active-le dans les extensions communautaires pour utiliser ces options.`,
    setSRTag: `Ajouter le tag de révision de Spaced Repetition`,
    setSRTagDesc: `Spaced Repetition ne planifie que les fiches portant son tag (#{tag} chez toi). Il est ajouté aux fiches interrogées, seulement quand « Spaced Repetition » planifie.`,
    recapSRCards: `Revoir les cartes avec Spaced Repetition`,
    noticeSRMissing: `Spaced Repetition est introuvable : la planification de mon plugin est utilisée.`,
    noticeSRFail: `Impossible de traiter « {note} » dans Spaced Repetition.`,
  },

  en: {
    statusIdle: `📚 Revision`,
    statusRunning_one: `📚 {time} · {n} note`,
    statusRunning_other: `📚 {time} · {n} notes`,
    statusPaused: `⏸ {time} · paused`,
    statusWaiting: `📝 Quiz waiting`,
    tipMenu: `Revision: click to open the menu`,

    menuStart: `Start a session`,
    menuPause: `Pause`,
    menuResume: `Resume`,
    menuFinish: `Finish and take the quiz`,
    menuCancel: `Cancel the session`,
    menuQuickQuiz: `Quick quiz on this note`,
    menuPending: `Take the pending quiz`,
    menuTracking: `Open the tracking table`,

    cmdMenu: `Open the revision menu`,
    cmdStart: `Start a revision session`,
    cmdPause: `Pause / resume the session`,
    cmdFinish: `Finish the session and take the quiz`,
    cmdCancel: `Cancel the current session (without saving)`,
    cmdQuick: `Quick quiz on the open note`,
    cmdTracking: `Open the revision tracking table`,

    noticeStartedManual: `📚 Revision session started.`,
    noticeStartedAuto: `📚 Session started automatically.`,
    noticeAlready: `A session is already running.`,
    noticeNoSession: `No session in progress.`,
    noticeTooShort: `Session too short: not saved.`,
    noticeCancelled: `Session cancelled, nothing was saved.`,
    noticePaused: `⏸ Session paused.`,
    noticeResumed: `▶ Session resumed.`,
    noticeReady: `📝 Session over: your quiz is ready.`,
    noticeTakeQuiz: `Take the quiz`,
    noticeOpenNote: `Open a note first.`,
    noticeSaved: `Session saved.`,
    noticeWelcome: `👋 Revision & Quiz: a session starts when you open a note. Click 📚 in the status bar to pause it, finish it and take a short quiz.`,

    quizTitle: `End-of-session quiz`,
    quizTitleQuick: `Quick quiz`,
    quizProgress: `Question {i} / {n}`,
    quizHint: `Answer in your head (or out loud), then check.`,
    quizShow: `Show the answer  (Enter)`,
    quizKnew: `✅ I knew it  (1)`,
    quizHesitated: `🤔 I hesitated  (2)`,
    quizMissed: `❌ Missed  (3)`,
    quizSkip: `Skip  (4)`,
    quizEsc: `Esc: resume later, your answers are kept.`,

    recapTitle: `Session summary`,
    recapScore: `Score: {p}%`,
    recapNotQuizzed: `not quizzed`,
    recapNew: `{s}% → progress {a}%`,
    recapChange: `{s}% → progress {b}% ➜ {a}%`,
    recapClose: `Close`,
    recapTracking: `See the tracking table`,

    qCallout: `{type}: {title}`,
    qCalloutNoTitle: `{type} — from {note}`,
    typeCard: `Card`,
    typeSection: `Section`,
    typeNote: `Note`,
    qSection: `Explain: {title}`,
    qNote: `Summarize from memory the content of “{note}”`,
    emptyNote: `(empty note)`,

    trackingFile: `Revision tracking.md`,
    trackTitle: `Revision tracking`,
    trackUpdated: `Updated on {date} at {time} — generated automatically, do not edit by hand.`,
    trackColNote: `Note`,
    trackColProgress: `Progress`,
    trackColCount: `Revisions`,
    trackColLast: `Last revision`,
    trackColTime: `Time`,
    trackAverage_one: `**Average progress: {p}%** over {n} note (least mastered first).`,
    trackAverage_other: `**Average progress: {p}%** over {n} notes (least mastered first).`,
    trackRecent: `Latest sessions`,
    trackNone: `*No tracked notes yet: finish a session with a quiz.*`,
    trackNoQuiz: `no quiz`,
    trackQuiz: `quiz {p}%`,
    min: `min`,

    setLangHeading: `Language`,
    setLang: `Plugin language`,
    setLangDesc: `Command names change after the plugin is reloaded.`,
    langAuto: `Automatic (Obsidian's language)`,
    setNotesHeading: `Which notes count as revision?`,
    setInclude: `Note folders`,
    setIncludeDesc: `Only notes in these folders (subfolders included) count. No folder chosen = the whole vault.`,
    setExclude: `Excluded folders`,
    setExcludeDesc: `These folders are ignored, even inside an included folder.`,
    addFolder: `Add a folder`,
    wholeVault: `Whole vault`,
    noneExcluded: `No excluded folder`,
    removeFolder: `Remove`,
    folderPlaceholder: `Choose a folder…`,
    setSeqHeading: `Sessions`,
    setAuto: `Automatic start`,
    setAutoDesc: `A session starts as soon as you open a note.`,
    setIdle: `End session after inactivity`,
    setIdleDesc: `Minutes without keyboard or mouse before the session ends by itself.`,
    setMin: `Minimum duration (seconds)`,
    setMinDesc: `Shorter sessions are not saved.`,
    setQuizHeading: `Quiz`,
    setNbQ: `Number of questions`,
    setNbQDesc: `Questions come from callouts, “question :: answer” lines and ## sections of your notes.`,
    setImpact: `Quiz impact on progress`,
    setImpactDesc: `After each quiz, progress moves toward your score by this percentage (100% = it takes your score directly).`,
    setHow: `You grade yourself after each answer: ✅ = 100%, 🤔 = 50%, ❌ = 0%.`,
    setTrackHeading: `Tracking`,
    setProp: `Progress property`,
    setPropDesc: `Property (0 to 100) written at the top of each note.`,
    setFile: `Tracking note`,
    setFileDesc: `Path of the generated note. Empty = “{def}”.`,
    setAutoTrack: `Update the tracking note automatically`,

    cmdNextDue: `Open the next note to review`,
    menuNextDue: `Open the next note to review`,
    noticeNoneDue: `No notes to review right now 🎉`,
    noticeDue_one: `📅 {n} note to review today or overdue.`,
    noticeDue_other: `📅 {n} notes to review today or overdue.`,
    recapNext: `next review: {date}`,
    trackColNext: `Next review`,
    trackDue: `To review (today or overdue)`,
    setPlanHeading: `Scheduling`,
    setPlan: `Schedule the next reviews`,
    setPlanDesc: `Calculates the next review date from your score (growing gaps) and writes it to the prochaine_revision property. A poor score brings it back to tomorrow.`,
    setMaxInterval: `Maximum gap between reviews (days)`,
    setMaxIntervalDesc: `Upper limit of the computed interval.`,
    setScheduler: `Who schedules the reviews?`,
    setSchedulerDesc: `“My plugin” calculates prochaine_revision. “Spaced Repetition”: after the quiz, each quizzed note is rated in Spaced Repetition (Easy, Good or Hard depending on your score) and its sr-due dates are used everywhere (tracking, reminders, next note).`,
    schedInterne: `My plugin`,
    schedSR: `Spaced Repetition`,
    setSRHeading: `Spaced Repetition`,
    srDetected: `✅ Spaced Repetition plugin detected.`,
    srMissing: `ℹ️ Spaced Repetition plugin not detected: install and enable it in community plugins to use these options.`,
    setSRTag: `Add the Spaced Repetition review tag`,
    setSRTagDesc: `Spaced Repetition only schedules notes carrying its tag (#{tag} on your setup). It is added to quizzed notes, only when “Spaced Repetition” does the scheduling.`,
    recapSRCards: `Review the cards with Spaced Repetition`,
    noticeSRMissing: `Spaced Repetition not found: using my plugin's scheduling.`,
    noticeSRFail: `Could not process “{note}” in Spaced Repetition.`,
  },

  es: {
    statusIdle: `📚 Repaso`,
    statusRunning_one: `📚 {time} · {n} ficha`,
    statusRunning_other: `📚 {time} · {n} fichas`,
    statusPaused: `⏸ {time} · en pausa`,
    statusWaiting: `📝 Test pendiente`,
    tipMenu: `Repaso: haz clic para abrir el menú`,

    menuStart: `Empezar una sesión`,
    menuPause: `Pausar`,
    menuResume: `Reanudar`,
    menuFinish: `Terminar y hacer el test`,
    menuCancel: `Cancelar la sesión`,
    menuQuickQuiz: `Test rápido de esta ficha`,
    menuPending: `Hacer el test pendiente`,
    menuTracking: `Abrir la tabla de seguimiento`,

    cmdMenu: `Abrir el menú de repaso`,
    cmdStart: `Empezar una sesión de repaso`,
    cmdPause: `Pausar / reanudar la sesión`,
    cmdFinish: `Terminar la sesión y hacer el test`,
    cmdCancel: `Cancelar la sesión en curso (sin guardar)`,
    cmdQuick: `Test rápido de la ficha abierta`,
    cmdTracking: `Abrir la tabla de seguimiento del repaso`,

    noticeStartedManual: `📚 Sesión de repaso iniciada.`,
    noticeStartedAuto: `📚 Sesión iniciada automáticamente.`,
    noticeAlready: `Ya hay una sesión en curso.`,
    noticeNoSession: `Ninguna sesión en curso.`,
    noticeTooShort: `Sesión demasiado corta: no se guarda.`,
    noticeCancelled: `Sesión cancelada, no se guardó nada.`,
    noticePaused: `⏸ Sesión en pausa.`,
    noticeResumed: `▶ Sesión reanudada.`,
    noticeReady: `📝 Sesión terminada: tu test está listo.`,
    noticeTakeQuiz: `Hacer el test`,
    noticeOpenNote: `Abre primero una ficha.`,
    noticeSaved: `Sesión guardada.`,
    noticeWelcome: `👋 Repaso y Test: una sesión empieza cuando abres una ficha. Haz clic en 📚 en la barra de estado para pausarla, terminarla y hacer un test corto.`,

    quizTitle: `Test de fin de sesión`,
    quizTitleQuick: `Test rápido`,
    quizProgress: `Pregunta {i} / {n}`,
    quizHint: `Responde de memoria (o en voz alta) y luego comprueba.`,
    quizShow: `Mostrar la respuesta  (Intro)`,
    quizKnew: `✅ Lo sabía  (1)`,
    quizHesitated: `🤔 Dudé  (2)`,
    quizMissed: `❌ Fallé  (3)`,
    quizSkip: `Saltar  (4)`,
    quizEsc: `Esc: seguir más tarde, tus respuestas se conservan.`,

    recapTitle: `Resumen de la sesión`,
    recapScore: `Puntuación: {p} %`,
    recapNotQuizzed: `sin preguntas`,
    recapNew: `{s} % → progreso {a} %`,
    recapChange: `{s} % → progreso {b} % ➜ {a} %`,
    recapClose: `Cerrar`,
    recapTracking: `Ver la tabla de seguimiento`,

    qCallout: `{type}: {title}`,
    qCalloutNoTitle: `{type} — de {note}`,
    typeCard: `Tarjeta`,
    typeSection: `Sección`,
    typeNote: `Ficha`,
    qSection: `Explica: {title}`,
    qNote: `Resume de memoria el contenido de «{note}»`,
    emptyNote: `(ficha vacía)`,

    trackingFile: `Seguimiento del repaso.md`,
    trackTitle: `Seguimiento del repaso`,
    trackUpdated: `Actualizado el {date} a las {time} — generado automáticamente, no editar a mano.`,
    trackColNote: `Ficha`,
    trackColProgress: `Progreso`,
    trackColCount: `Repasos`,
    trackColLast: `Último repaso`,
    trackColTime: `Tiempo`,
    trackAverage_one: `**Progreso medio: {p} %** en {n} ficha (las menos dominadas primero).`,
    trackAverage_other: `**Progreso medio: {p} %** en {n} fichas (las menos dominadas primero).`,
    trackRecent: `Últimas sesiones`,
    trackNone: `*Todavía no hay fichas en seguimiento: termina una sesión con test.*`,
    trackNoQuiz: `sin test`,
    trackQuiz: `test {p} %`,
    min: `min`,

    setLangHeading: `Idioma`,
    setLang: `Idioma del plugin`,
    setLangDesc: `Los nombres de los comandos cambian al recargar el plugin.`,
    langAuto: `Automático (idioma de Obsidian)`,
    setNotesHeading: `¿Qué notas cuentan como repaso?`,
    setInclude: `Carpetas de fichas`,
    setIncludeDesc: `Solo cuentan las notas de estas carpetas (subcarpetas incluidas). Ninguna carpeta = toda la bóveda.`,
    setExclude: `Carpetas excluidas`,
    setExcludeDesc: `Estas carpetas se ignoran, aunque estén dentro de una carpeta incluida.`,
    addFolder: `Añadir una carpeta`,
    wholeVault: `Toda la bóveda`,
    noneExcluded: `Ninguna carpeta excluida`,
    removeFolder: `Quitar`,
    folderPlaceholder: `Elige una carpeta…`,
    setSeqHeading: `Sesiones`,
    setAuto: `Inicio automático`,
    setAutoDesc: `Una sesión empieza en cuanto abres una ficha.`,
    setIdle: `Fin de sesión por inactividad`,
    setIdleDesc: `Minutos sin teclado ni ratón antes de que la sesión termine sola.`,
    setMin: `Duración mínima (segundos)`,
    setMinDesc: `Las sesiones más cortas no se guardan.`,
    setQuizHeading: `Test`,
    setNbQ: `Número de preguntas`,
    setNbQDesc: `Las preguntas salen de los callouts, de las líneas «pregunta :: respuesta» y de las secciones ## de tus fichas.`,
    setImpact: `Impacto del test en el progreso`,
    setImpactDesc: `Tras cada test, el progreso se acerca a tu puntuación en este porcentaje (100 % = toma directamente tu puntuación).`,
    setHow: `Te calificas tú después de cada respuesta: ✅ = 100 %, 🤔 = 50 %, ❌ = 0 %.`,
    setTrackHeading: `Seguimiento`,
    setProp: `Propiedad de progreso`,
    setPropDesc: `Propiedad (0 a 100) escrita al principio de cada ficha.`,
    setFile: `Nota de seguimiento`,
    setFileDesc: `Ruta de la nota generada. Vacío = «{def}».`,
    setAutoTrack: `Actualizar la nota de seguimiento automáticamente`,

    cmdNextDue: `Abrir la próxima ficha para repasar`,
    menuNextDue: `Abrir la próxima ficha para repasar`,
    noticeNoneDue: `No hay fichas para repasar ahora 🎉`,
    noticeDue_one: `📅 {n} ficha para repasar hoy o con retraso.`,
    noticeDue_other: `📅 {n} fichas para repasar hoy o con retraso.`,
    recapNext: `próximo repaso: {date}`,
    trackColNext: `Próximo repaso`,
    trackDue: `Para repasar (hoy o con retraso)`,
    setPlanHeading: `Planificación`,
    setPlan: `Planificar los próximos repasos`,
    setPlanDesc: `Calcula la fecha del próximo repaso según tu puntuación (intervalos cada vez mayores) y la escribe en la propiedad prochaine_revision. Una mala nota la acerca a mañana.`,
    setMaxInterval: `Intervalo máximo entre repasos (días)`,
    setMaxIntervalDesc: `Límite del intervalo calculado.`,
    setScheduler: `¿Quién planifica los repasos?`,
    setSchedulerDesc: `«Mi plugin» calcula prochaine_revision. «Spaced Repetition»: tras el test, cada ficha evaluada se puntúa en Spaced Repetition (Fácil, Bien o Difícil según tu puntuación) y sus fechas sr-due se usan en todas partes (seguimiento, avisos, próxima ficha).`,
    schedInterne: `Mi plugin`,
    schedSR: `Spaced Repetition`,
    setSRHeading: `Spaced Repetition`,
    srDetected: `✅ Plugin Spaced Repetition detectado.`,
    srMissing: `ℹ️ Plugin Spaced Repetition no detectado: instálalo y actívalo en los plugins de la comunidad para usar estas opciones.`,
    setSRTag: `Añadir la etiqueta de repaso de Spaced Repetition`,
    setSRTagDesc: `Spaced Repetition solo planifica las fichas con su etiqueta (#{tag} en tu caso). Se añade a las fichas evaluadas, solo cuando planifica «Spaced Repetition».`,
    recapSRCards: `Repasar las tarjetas con Spaced Repetition`,
    noticeSRMissing: `No se encuentra Spaced Repetition: se usa la planificación de mi plugin.`,
    noticeSRFail: `No se pudo procesar «{note}» en Spaced Repetition.`,
  },
};

function langueAuto() {
  let l = '';
  try { if (typeof obsidian.getLanguage === 'function') l = obsidian.getLanguage(); } catch (e) { /* ignore */ }
  if (!l) { try { l = window.localStorage.getItem('language') || ''; } catch (e) { /* ignore */ } }
  if (!l) { try { l = window.moment.locale(); } catch (e) { /* ignore */ } }
  l = String(l || 'en').slice(0, 2).toLowerCase();
  return TXT[l] ? l : 'en';
}

/* ------------------------------------------------------------------ */
/*  Constantes et petits utilitaires                                   */
/* ------------------------------------------------------------------ */
const DEFAUTS = {
  langue: 'auto',             // auto | fr | en | es
  dossiersInclus: [],         // vide = tout le coffre
  dossiersExclus: [],         // toujours ignorés, même dans un dossier inclus
  autoDemarrage: true,        // démarre une séquence en ouvrant une fiche
  inactiviteMin: 15,          // minutes sans activité => fin de séquence
  nbQuestions: 8,             // taille de l'interro
  minSecondes: 60,            // en dessous, la séquence n'est pas enregistrée
  impact: 40,                 // % de rapprochement de la progression vers le score
  planifier: true,            // calcule prochaine_revision / intervalle_revision
  intervalleMax: 90,          // plafond de l'intervalle, en jours
  planificateur: 'interne',   // 'interne' (mon plugin) | 'sr' (plugin Spaced Repetition)
  ajouterTagSR: true,         // mode 'sr' : ajoute le tag de révision SR aux fiches interrogées
  propAvancement: 'progression',
  fichierSuivi: '',           // vide = nom par défaut dans la langue choisie
  majSuiviAuto: true,
  bienvenueVue: false,
};

const TICK_MS = 5000;
const MIN_NOTE_SEC = 20;      // une fiche ouverte moins que ça n'est pas "révisée"

const pad = (n) => String(n).padStart(2, '0');
const dateISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const heureFR = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const fmtDuree = (sec) => {
  const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
  return `${pad(m)}:${pad(s)}`;
};
const melanger = (tab) => {
  const a = tab.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const maj1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const attendre = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));
const SR_ID = 'obsidian-spaced-repetition';   // identifiant du plugin Spaced Repetition

/* ------------------------------------------------------------------ */
/*  Extraction des questions depuis le contenu d'une fiche             */
/* ------------------------------------------------------------------ */
function extraireQuestions(contenu, nomNote, t) {
  const texte = contenu
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
    .replace(/[ \t]*<!--\s*SR:[\s\S]*?-->/g, '');   // dates de planification des cartes Spaced Repetition
  const lignes = texte.split(/\r?\n/);
  const qs = [];

  // 1) Callouts : > [!definition] Titre  puis corps en "> ..."
  for (let i = 0; i < lignes.length; i++) {
    const m = lignes[i].match(/^>\s*\[!([\w-]+)\][+-]?\s*(.*)$/);
    if (!m) continue;
    const type = maj1(m[1]);
    const titre = m[2].trim();
    const corps = [];
    let j = i + 1;
    while (j < lignes.length && /^>/.test(lignes[j])) {
      corps.push(lignes[j].replace(/^>\s?/, ''));
      j++;
    }
    const reponse = corps.join('\n').trim();
    if ((!titre && reponse.length < 15) || reponse.length < 8) { i = j - 1; continue; }
    qs.push({
      type,
      question: titre ? t('qCallout', { type, title: titre }) : t('qCalloutNoTitle', { type, note: nomNote }),
      reponse,
    });
    i = j - 1;
  }

  // 2) Cartes (syntaxe de Spaced Repetition) :
  //    question :: réponse   |   question ::: réponse (dans les deux sens)
  //    question sur plusieurs lignes, puis une ligne "?" (ou "??" dans les deux sens), puis la réponse
  const carte = (question, reponse) => ({ type: t('typeCard'), question, reponse, carte: true });
  for (const l of lignes) {
    if (/^\s*[>#]/.test(l) || l.includes('{{')) continue;
    let m = l.match(/^\s*(?:[-*]\s+)?(.{3,}?)\s*:::\s*(.+)$/);
    if (m) {
      qs.push(carte(m[1].trim(), m[2].trim()), carte(m[2].trim(), m[1].trim()));
      continue;
    }
    m = l.match(/^\s*(?:[-*]\s+)?(.{3,}?)\s*::\s*(.+)$/);
    if (m && !/^:/.test(m[2])) qs.push(carte(m[1].trim(), m[2].trim()));
  }
  for (let i = 0; i < lignes.length; i++) {
    const marque = lignes[i].trim();
    if (marque !== '?' && marque !== '??') continue;
    let debut = i - 1;
    while (debut >= 0 && lignes[debut].trim() && !/^#{1,6}\s/.test(lignes[debut])) debut--;
    let fin = i + 1;
    while (fin < lignes.length && lignes[fin].trim() && !/^#{1,6}\s/.test(lignes[fin])) fin++;
    const q = lignes.slice(debut + 1, i).join('\n').trim();
    const r = lignes.slice(i + 1, fin).join('\n').trim();
    if (!q || !r) continue;
    qs.push(carte(q, r));
    if (marque === '??') qs.push(carte(r, q));
  }

  // 3) Sections : ## Titre + contenu
  let dansCode = false;
  let courant = null;
  const sections = [];
  for (const l of lignes) {
    if (/^\s*(```|~~~)/.test(l)) dansCode = !dansCode;
    const h = !dansCode && l.match(/^(#{2,4})\s+(.+?)\s*#*\s*$/);
    if (h) {
      if (courant) sections.push(courant);
      courant = { titre: h[2].trim(), lignes: [] };
    } else if (courant) {
      courant.lignes.push(l);
    }
  }
  if (courant) sections.push(courant);
  for (const s of sections) {
    const corps = s.lignes.join('\n').trim();
    if (corps.length < 60) continue;
    qs.push({
      type: t('typeSection'),
      question: t('qSection', { title: s.titre }),
      reponse: corps.length > 900 ? corps.slice(0, 900).trimEnd() + ' …' : corps,
    });
  }

  // 4) Repli : fiche sans rien d'exploitable
  if (!qs.length) {
    const plan = lignes.filter((l) => /^#{1,6}\s/.test(l)).join('\n');
    const brut = texte.trim();
    qs.push({
      type: t('typeNote'),
      question: t('qNote', { note: nomNote }),
      reponse: plan || (brut.length > 600 ? brut.slice(0, 600) + ' …' : brut) || t('emptyNote'),
    });
  }
  return qs;
}

/* ------------------------------------------------------------------ */
/*  Plugin                                                             */
/* ------------------------------------------------------------------ */
module.exports = class RevisionsInterroPlugin extends Plugin {
  async onload() {
    const charge = (await this.loadData()) || {};
    this.reglages = Object.assign({}, DEFAUTS, charge.reglages || {});
    this.sessions = Array.isArray(charge.sessions) ? charge.sessions : [];

    // Migration de l'ancien réglage à un seul dossier
    const ancien = charge.reglages && charge.reglages.dossierFiches;
    if (typeof ancien === 'string' && ancien.trim() && !(charge.reglages.dossiersInclus || []).length) {
      this.reglages.dossiersInclus = [ancien.trim()];
    }
    delete this.reglages.dossierFiches;

    this.session = null;       // séquence en cours
    this.attente = null;       // { session, questions, progress, prevenu } : interro à passer
    this.quizOuvert = false;
    this.ignoreOuverture = false; // vrai quand le plugin ouvre lui-même des fiches (Spaced Repetition)
    this.derniereActivite = Date.now();
    this.dernierTick = Date.now();

    this.statut = this.addStatusBarItem();
    this.statut.addClass('rvi-statut');
    this.statut.addEventListener('click', (evt) => this.ouvrirMenu(evt));

    this.addRibbonIcon('graduation-cap', this.t('tipMenu'), (evt) => this.ouvrirMenu(evt));

    this.addCommand({ id: 'menu', name: this.t('cmdMenu'), callback: () => this.ouvrirMenu() });
    this.addCommand({ id: 'demarrer-sequence', name: this.t('cmdStart'), callback: () => this.demarrerSequence(true) });
    this.addCommand({ id: 'pause-sequence', name: this.t('cmdPause'), callback: () => this.basculerPause() });
    this.addCommand({ id: 'terminer-sequence', name: this.t('cmdFinish'), callback: () => this.terminerSequence() });
    this.addCommand({ id: 'annuler-sequence', name: this.t('cmdCancel'), callback: () => this.annulerSequence() });
    this.addCommand({ id: 'interro-note', name: this.t('cmdQuick'), callback: () => this.interroNoteCourante() });
    this.addCommand({ id: 'ouvrir-suivi', name: this.t('cmdTracking'), callback: () => this.ouvrirSuivi() });
    this.addCommand({ id: 'prochaine-fiche', name: this.t('cmdNextDue'), callback: () => this.ouvrirProchaine() });

    // Activité de l'utilisateur
    const reel = () => this.toucher(true);
    const leger = () => this.toucher(false);
    this.registerDomEvent(document, 'keydown', reel);
    this.registerDomEvent(document, 'mousedown', reel);
    this.registerDomEvent(document, 'touchstart', reel);
    this.registerDomEvent(document, 'wheel', leger);
    this.registerDomEvent(document, 'mousemove', leger);
    this.registerDomEvent(document, 'scroll', leger, true);

    // Ouverture d'une fiche => démarrage auto
    this.registerEvent(this.app.workspace.on('file-open', (f) => {
      if (this.ignoreOuverture || !this.reglages.autoDemarrage || !f) return;
      if (this.session || this.attente) return;
      if (this.estFiche(f)) this.demarrerSequence(false);
    }));

    this.registerInterval(window.setInterval(() => this.tick(), TICK_MS));
    this.addSettingTab(new RevisionsSettingTab(this.app, this));
    this.majStatut();

    this.app.workspace.onLayoutReady(() => {
      if (!this.reglages.bienvenueVue) {
        new Notice(this.t('noticeWelcome'), 15000);
        this.reglages.bienvenueVue = true;
        this.sauver();
      }
      const f = this.app.workspace.getActiveFile();
      if (this.reglages.autoDemarrage && f && this.estFiche(f)) this.demarrerSequence(false);
      // Laisse le temps à Obsidian d'indexer les propriétés avant de compter les fiches à réviser
      window.setTimeout(() => this.avertirARevoir(), 4000);
    });
  }

  onunload() {
    // Une séquence en cours est sauvegardée sans interro pour ne rien perdre
    if (this.session) {
      const s = this.cloturer(false);
      if (s) this.enregistrer(s, new Map(), true);
    }
  }

  async sauver() {
    await this.saveData({ reglages: this.reglages, sessions: this.sessions.slice(-500) });
  }

  /* ---------- Langue ---------- */
  langue() {
    const l = this.reglages.langue;
    return TXT[l] ? l : langueAuto();
  }

  t(cle, vars) {
    const dico = TXT[this.langue()] || TXT.en;
    let s = dico[cle];
    if (s === undefined) s = TXT.en[cle];
    if (s === undefined) return cle;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? String(vars[k]) : m));
    return s;
  }

  /** Version avec pluriel : tp('clé', n) cherche clé_one ou clé_other. */
  tp(cle, n, vars) {
    return this.t(`${cle}_${n === 1 ? 'one' : 'other'}`, Object.assign({ n }, vars || {}));
  }

  cheminSuivi() {
    let c = String(this.reglages.fichierSuivi || '').trim() || this.t('trackingFile');
    if (!/\.md$/i.test(c)) c += '.md';
    return normalizePath(c);
  }

  /* ---------- Périmètre ---------- */
  estFiche(f) {
    if (!(f instanceof TFile) || f.extension !== 'md') return false;
    if (f.path === this.cheminSuivi()) return false;
    const dans = (d) => f.path.startsWith(d + '/');
    const exclus = this.nettoyerDossiers(this.reglages.dossiersExclus);
    if (exclus.some(dans)) return false;
    const inclus = this.nettoyerDossiers(this.reglages.dossiersInclus);
    if (!inclus.length) return true;
    return inclus.some(dans);
  }

  /** Normalise une liste de dossiers : sans / de début ou de fin, sans doublons ni lignes vides. */
  nettoyerDossiers(liste) {
    const vus = new Set();
    for (const d of Array.isArray(liste) ? liste : []) {
      const n = String(d).trim().replace(/^\/+|\/+$/g, '');
      if (n) vus.add(n);
    }
    return [...vus];
  }

  tousLesDossiers() {
    return this.app.vault.getAllLoadedFiles()
      .filter((f) => f instanceof TFolder && f.path !== '/')
      .map((f) => f.path)
      .sort((a, b) => a.localeCompare(b));
  }

  /* ---------- Activité / chronomètre ---------- */
  toucher(reel) {
    this.derniereActivite = Date.now();
    // Retour après une séquence terminée : on propose l'interro sans l'imposer
    if (reel && this.attente && !this.quizOuvert && !this.session && !this.attente.prevenu) {
      this.rappelInterro();
    }
  }

  rappelInterro() {
    if (!this.attente) return;
    this.attente.prevenu = true;
    const frag = createFragment((f) => {
      f.createSpan({ text: this.t('noticeReady') + ' ' });
      const b = f.createEl('button', { text: this.t('noticeTakeQuiz'), cls: 'mod-cta' });
      b.addEventListener('click', () => this.ouvrirQuiz());
    });
    new Notice(frag, 12000);
  }

  tick() {
    const now = Date.now();
    const delta = Math.min((now - this.dernierTick) / 1000, TICK_MS * 2 / 1000);
    this.dernierTick = now;

    const s = this.session;
    if (s && !s.pause) {
      const inactifMs = now - this.derniereActivite;
      if (inactifMs > this.reglages.inactiviteMin * 60000) {
        const fini = this.cloturer(true);
        if (fini) this.mettreEnAttente(fini, false);
      } else if (!this.quizOuvert) {
        s.actif += delta;
        const f = this.app.workspace.getActiveFile();
        if (f && this.estFiche(f)) {
          const n = s.notes[f.path] || (s.notes[f.path] = { secondes: 0 });
          n.secondes += delta;
        }
      }
    }
    this.majStatut();
  }

  majStatut() {
    const el = this.statut;
    el.removeClass('rvi-actif'); el.removeClass('rvi-attente'); el.removeClass('rvi-pause');
    el.setAttr('aria-label', this.t('tipMenu'));
    if (this.session) {
      const nb = Object.values(this.session.notes).filter((n) => n.secondes >= MIN_NOTE_SEC).length;
      const time = fmtDuree(this.session.actif);
      if (this.session.pause) {
        el.setText(this.t('statusPaused', { time }));
        el.addClass('rvi-pause');
      } else {
        el.setText(this.tp('statusRunning', nb, { time }));
        el.addClass('rvi-actif');
      }
    } else if (this.attente) {
      el.setText(this.t('statusWaiting'));
      el.addClass('rvi-attente');
    } else {
      el.setText(this.t('statusIdle'));
    }
  }

  /* ---------- Menu ---------- */
  ouvrirMenu(evt) {
    const menu = new Menu();
    const item = (titre, icone, fn) => menu.addItem((i) => i.setTitle(titre).setIcon(icone).onClick(fn));

    if (this.session) {
      if (this.session.pause) item(this.t('menuResume'), 'play', () => this.basculerPause());
      else item(this.t('menuPause'), 'pause', () => this.basculerPause());
      item(this.t('menuFinish'), 'check', () => this.terminerSequence());
      item(this.t('menuCancel'), 'x', () => this.annulerSequence());
    } else if (this.attente) {
      item(this.t('menuPending'), 'list-checks', () => this.ouvrirQuiz());
    } else {
      item(this.t('menuStart'), 'play', () => this.demarrerSequence(true));
      item(this.t('menuQuickQuiz'), 'zap', () => this.interroNoteCourante());
      if (this.reglages.planifier) item(this.t('menuNextDue'), 'calendar', () => this.ouvrirProchaine());
    }
    menu.addSeparator();
    item(this.t('menuTracking'), 'table', () => this.ouvrirSuivi());

    if (evt && typeof menu.showAtMouseEvent === 'function') menu.showAtMouseEvent(evt);
    else menu.showAtPosition({ x: Math.round(window.innerWidth / 2), y: Math.round(window.innerHeight / 3) });
  }

  /* ---------- Cycle d'une séquence ---------- */
  demarrerSequence(manuel) {
    if (this.session) { if (manuel) new Notice(this.t('noticeAlready')); return; }
    if (this.attente) { this.ouvrirQuiz(); return; }
    this.session = { debut: Date.now(), actif: 0, pause: false, notes: {} };
    this.derniereActivite = Date.now();
    this.dernierTick = Date.now();
    const f = this.app.workspace.getActiveFile();
    if (f && this.estFiche(f)) this.session.notes[f.path] = { secondes: 0 };
    new Notice(this.t(manuel ? 'noticeStartedManual' : 'noticeStartedAuto'));
    this.majStatut();
  }

  basculerPause() {
    if (!this.session) { new Notice(this.t('noticeNoSession')); return; }
    this.session.pause = !this.session.pause;
    this.derniereActivite = Date.now();
    this.dernierTick = Date.now();
    new Notice(this.t(this.session.pause ? 'noticePaused' : 'noticeResumed'));
    this.majStatut();
  }

  /** Ferme la séquence en cours et renvoie son bilan (ou null si trop courte). */
  cloturer(parInactivite) {
    const s = this.session;
    this.session = null;
    if (!s) return null;
    s.fin = parInactivite ? Math.max(this.derniereActivite, s.debut) : Date.now();
    for (const k of Object.keys(s.notes)) {
      if (s.notes[k].secondes < MIN_NOTE_SEC) delete s.notes[k];
    }
    const total = Object.values(s.notes).reduce((a, n) => a + n.secondes, 0);
    if (!Object.keys(s.notes).length || total < this.reglages.minSecondes) {
      new Notice(this.t('noticeTooShort'));
      this.majStatut();
      return null;
    }
    s.total = total;
    s.duree = s.actif;
    return s;
  }

  annulerSequence() {
    if (!this.session) { new Notice(this.t('noticeNoSession')); return; }
    this.session = null;
    new Notice(this.t('noticeCancelled'));
    this.majStatut();
  }

  async terminerSequence() {
    if (!this.session) {
      if (this.attente) return this.ouvrirQuiz();
      new Notice(this.t('noticeNoSession'));
      return;
    }
    const s = this.cloturer(false);
    this.majStatut();
    if (s) await this.mettreEnAttente(s, true);
  }

  async mettreEnAttente(session, ouvrirMaintenant) {
    const questions = await this.construireQuestions(session);
    this.attente = { session, questions, progress: null, prevenu: false };
    this.majStatut();
    if (ouvrirMaintenant) this.ouvrirQuiz();
    else this.rappelInterro();
  }

  async interroNoteCourante() {
    if (this.attente) { this.ouvrirQuiz(); return; }
    const f = this.app.workspace.getActiveFile();
    if (!f || !this.estFiche(f)) { new Notice(this.t('noticeOpenNote')); return; }
    const session = {
      debut: Date.now(), fin: Date.now(), total: 0, duree: 0, rapide: true,
      notes: { [f.path]: { secondes: 0 } },
    };
    const questions = await this.construireQuestions(session);
    this.attente = { session, questions, progress: null, prevenu: true };
    this.majStatut();
    this.ouvrirQuiz();
  }

  /* ---------- Interro ---------- */
  async construireQuestions(session) {
    const t = (c, v) => this.t(c, v);
    const pools = [];
    for (const chemin of Object.keys(session.notes)) {
      const f = this.app.vault.getAbstractFileByPath(chemin);
      if (!(f instanceof TFile)) continue;
      const contenu = await this.app.vault.cachedRead(f);
      const qs = melanger(extraireQuestions(contenu, f.basename, t)).map((q) => ({
        ...q, chemin, nomNote: f.basename,
      }));
      pools.push({ chemin, poids: Math.max(session.notes[chemin].secondes, 1), pris: 0, qs });
    }
    const total = Math.max(1, this.reglages.nbQuestions);
    const choisies = [];
    // 1 question par fiche d'abord (les plus travaillées en premier)…
    for (const p of pools.slice().sort((a, b) => b.poids - a.poids)) {
      if (choisies.length >= total) break;
      if (p.qs.length) { choisies.push(p.qs.shift()); p.pris++; }
    }
    // …puis répartition proportionnelle au temps passé
    while (choisies.length < total) {
      const dispo = pools.filter((p) => p.qs.length);
      if (!dispo.length) break;
      dispo.sort((a, b) => b.poids / (b.pris + 1) - a.poids / (a.pris + 1));
      const p = dispo[0];
      choisies.push(p.qs.shift());
      p.pris++;
    }
    return melanger(choisies);
  }

  ouvrirQuiz() {
    if (!this.attente || this.quizOuvert) return;
    if (!this.attente.questions.length) {
      const { session } = this.attente;
      this.attente = null;
      this.enregistrer(session, new Map(), false);
      return;
    }
    this.quizOuvert = true;
    new QuizModal(this.app, this).open();
  }

  /* ---------- Enregistrement ---------- */
  lireAvancement(f) {
    const fm = this.app.metadataCache.getFileCache(f)?.frontmatter;
    const v = fm ? parseFloat(fm[this.reglages.propAvancement]) : NaN;
    return Number.isFinite(v) ? v : null;
  }

  /**
   * @param {Map<string, number>} scores  chemin -> score 0..1 (absent = pas d'interro sur cette fiche)
   */
  async enregistrer(session, scores, silencieux) {
    const prop = this.reglages.propAvancement;
    const k = Math.max(0.1, Math.min(1, (Number(this.reglages.impact) || 40) / 100));
    const bilan = [];
    const jour = dateISO(new Date(session.fin || Date.now()));
    const modeSR = this.modeSR();
    if (this.reglages.planificateur === 'sr' && !modeSR && !this.srAvertie && scores.size) {
      this.srAvertie = true;
      new Notice(this.t('noticeSRMissing'));
    }

    for (const chemin of Object.keys(session.notes)) {
      const f = this.app.vault.getAbstractFileByPath(chemin);
      if (!(f instanceof TFile)) continue;
      const avant = this.lireAvancement(f);
      const score = scores.has(chemin) ? scores.get(chemin) : null;
      const sec = session.notes[chemin].secondes || 0;
      let apres = avant;
      if (score !== null) {
        const s100 = score * 100;
        apres = avant === null ? Math.round(s100) : Math.round(avant + (s100 - avant) * k);
      }
      let prochaine = null;
      try {
        await this.app.fileManager.processFrontMatter(f, (fm) => {
          if (this.reglages.planifier && !modeSR) {
            const inter = this.calculerIntervalle(parseFloat(fm.intervalle_revision) || 0, score);
            fm.intervalle_revision = inter;
            prochaine = this.ajouterJours(session.fin, inter);
            fm.prochaine_revision = prochaine;
          }
          if (!session.rapide) {
            fm.revisions = (parseInt(fm.revisions, 10) || 0) + 1;
            fm.derniere_revision = jour;
            fm.temps_revision = Math.round(((parseFloat(fm.temps_revision) || 0) + sec / 60) * 10) / 10;
          } else {
            fm.derniere_revision = jour;
          }
          if (apres !== null) fm[prop] = apres;
        });
      } catch (e) {
        console.error('[Révisions & Interro] frontmatter', chemin, e);
      }
      bilan.push({ chemin, nom: f.basename, score, avant, apres, secondes: sec, prochaine });
    }

    // Délègue la planification à Spaced Repetition (note chaque fiche interrogée)
    if (modeSR && this.reglages.planifier) await this.deleguerASR(bilan);

    const notes = bilan.filter((b) => b.score !== null);
    const global = notes.length ? notes.reduce((a, b) => a + b.score, 0) / notes.length : null;
    this.sessions.push({
      debut: session.debut, fin: session.fin, duree: Math.round(session.duree || 0), rapide: !!session.rapide,
      score: global,
      notes: bilan.map((b) => ({ chemin: b.chemin, secondes: Math.round(b.secondes), score: b.score })),
    });
    await this.sauver();
    if (this.reglages.majSuiviAuto) await this.majSuivi();
    this.majStatut();
    if (!silencieux && global === null) new Notice(this.t('noticeSaved'));
    return { bilan, global };
  }

  /* ---------- Intégration du plugin Spaced Repetition ---------- */
  srCommandes() {
    const cmds = (this.app.commands && this.app.commands.commands) || {};
    return Object.keys(cmds).filter((id) => id.startsWith(SR_ID + ':'));
  }

  srDispo() {
    try { return this.srCommandes().length > 0; } catch (e) { return false; }
  }

  /** Cherche une commande de Spaced Repetition par un morceau de son identifiant. */
  srCommande(motif) {
    try { return this.srCommandes().find((id) => id.includes(motif)) || null; } catch (e) { return null; }
  }

  /** Vrai si c'est Spaced Repetition qui planifie (choisi dans les réglages ET installé). */
  modeSR() {
    return this.reglages.planificateur === 'sr' && this.srDispo();
  }

  /** Tag de révision configuré dans Spaced Repetition (sans #). */
  srTag() {
    try {
      const reglagesSR = this.app.plugins.plugins[SR_ID].data.settings;
      const tag = Array.isArray(reglagesSR.tagsToReview) && reglagesSR.tagsToReview[0];
      if (tag) return String(tag).replace(/^#/, '');
    } catch (e) { /* valeur par défaut ci-dessous */ }
    return 'review';
  }

  /** Date de prochaine révision d'une fiche : sr-due (mode SR) ou prochaine_revision. */
  dateARevoir(fm) {
    if (!fm) return '';
    const brut = this.modeSR() ? fm['sr-due'] : fm.prochaine_revision;
    const v = brut ? String(brut).slice(0, 10) : '';
    return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : '';
  }

  /** Note chaque fiche interrogée dans Spaced Repetition : Facile / Bien / Difficile selon le score. */
  async deleguerASR(bilan) {
    const retour = this.app.workspace.getActiveFile();
    this.ignoreOuverture = true;
    try {
      for (const b of bilan) {
        if (b.score === null) continue;
        const f = this.app.vault.getAbstractFileByPath(b.chemin);
        if (!(f instanceof TFile)) continue;
        const motif = b.score >= 0.85 ? 'note-review-easy' : b.score >= 0.5 ? 'note-review-good' : 'note-review-hard';
        const id = this.srCommande(motif);
        if (!id) { new Notice(this.t('noticeSRFail', { note: b.nom })); continue; }
        try {
          if (this.reglages.ajouterTagSR) {
            const tag = this.srTag();
            await this.app.fileManager.processFrontMatter(f, (fm) => {
              if (fm['sr-due']) return;               // déjà dans le circuit de Spaced Repetition
              let tags = fm.tags;
              if (typeof tags === 'string') tags = tags.split(/[,\s]+/).filter(Boolean);
              if (!Array.isArray(tags)) tags = [];
              if (!tags.some((x) => String(x).replace(/^#/, '') === tag)) tags.push(tag);
              fm.tags = tags;
            });
            await attendre(300);
          }
          await this.app.workspace.getLeaf(false).openFile(f);
          await attendre(400);
          this.app.commands.executeCommandById(id);
          await attendre(700);
          const contenu = await this.app.vault.read(f);
          const m = contenu.match(/^sr-due:\s*["']?(\d{4}-\d{2}-\d{2})/m);
          if (m) b.prochaine = m[1];
        } catch (e) {
          console.error('[Révisions & Interro] Spaced Repetition', b.chemin, e);
          new Notice(this.t('noticeSRFail', { note: b.nom }));
        }
      }
      if (retour) await this.app.workspace.getLeaf(false).openFile(retour);
    } finally {
      window.setTimeout(() => { this.ignoreOuverture = false; }, 600);
    }
  }

  /** Lance la révision des cartes de la fiche dans Spaced Repetition. */
  async revoirCartesSR(chemin) {
    const id = this.srCommande('review-flashcards-in-note');
    const f = this.app.vault.getAbstractFileByPath(chemin);
    if (!id || !(f instanceof TFile)) {
      new Notice(this.t('noticeSRFail', { note: String(chemin).split('/').pop().replace(/\.md$/, '') }));
      return;
    }
    this.ignoreOuverture = true;
    try {
      await this.app.workspace.getLeaf(false).openFile(f);
      await attendre(300);
      this.app.commands.executeCommandById(id);
    } finally {
      window.setTimeout(() => { this.ignoreOuverture = false; }, 600);
    }
  }

  /* ---------- Planification des révisions ---------- */
  /**
   * Intervalle (en jours) avant la prochaine révision.
   * Mauvais score : retour à demain. Score moyen : écart x1,5. Bon score : écart x2,5.
   * Sans interro : on garde l'intervalle actuel.
   */
  calculerIntervalle(prev, score) {
    const max = Math.max(1, Number(this.reglages.intervalleMax) || 90);
    const base = prev > 0 ? prev : 1;
    let n;
    if (score === null) n = base;
    else if (score < 0.5) n = 1;
    else if (score < 0.8) n = Math.max(2, Math.round(base * 1.5));
    else n = Math.max(3, Math.round(base * 2.5));
    return Math.max(1, Math.min(max, n));
  }

  ajouterJours(horodatage, n) {
    const d = new Date(horodatage || Date.now());
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + n);
    return dateISO(d);
  }

  /** Fiches dont la prochaine révision est aujourd'hui ou en retard, la plus en retard d'abord. */
  fichesARevoir() {
    const aujourdhui = dateISO(new Date());
    const res = [];
    for (const f of this.app.vault.getMarkdownFiles()) {
      if (!this.estFiche(f)) continue;
      const fm = this.app.metadataCache.getFileCache(f)?.frontmatter;
      const v = this.dateARevoir(fm);
      if (v && v <= aujourdhui) res.push({ f, date: v });
    }
    res.sort((a, b) => a.date.localeCompare(b.date));
    return res;
  }

  avertirARevoir() {
    if (!this.reglages.planifier) return;
    const n = this.fichesARevoir().length;
    if (n > 0) new Notice(this.tp('noticeDue', n), 8000);
  }

  async ouvrirProchaine() {
    const liste = this.fichesARevoir();
    if (!liste.length) { new Notice(this.t('noticeNoneDue')); return; }
    await this.app.workspace.getLeaf(false).openFile(liste[0].f);
  }

  /* ---------- Tableau de suivi ---------- */
  barre(p) {
    const n = Math.max(0, Math.min(10, Math.round(p / 10)));
    return '█'.repeat(n) + '░'.repeat(10 - n);
  }

  async majSuivi() {
    const prop = this.reglages.propAvancement;
    const fiches = this.app.vault.getMarkdownFiles().filter((f) => this.estFiche(f));
    const lignes = [];
    for (const f of fiches) {
      const fm = this.app.metadataCache.getFileCache(f)?.frontmatter;
      if (!fm || fm[prop] === undefined) continue;
      lignes.push({
        f, av: parseFloat(fm[prop]) || 0,
        rev: parseInt(fm.revisions, 10) || 0,
        der: fm.derniere_revision || '—',
        temps: parseFloat(fm.temps_revision) || 0,
        next: this.dateARevoir(fm),
      });
    }
    lignes.sort((a, b) => a.av - b.av);
    const aujourdhui = dateISO(new Date());
    const adReviser = lignes.filter((l) => l.next && l.next <= aujourdhui)
      .sort((a, b) => a.next.localeCompare(b.next));

    const min = this.t('min');
    const lien = (f) => `[[${f.path.replace(/\.md$/, '')}\\|${f.basename}]]`;
    const now = new Date();
    let md = `---\ncssclasses: [suivi-revisions]\n---\n# ${this.t('trackTitle')}\n\n`;
    md += `*${this.t('trackUpdated', { date: dateISO(now), time: heureFR(now) })}*\n\n`;
    if (adReviser.length) {
      md += `## ${this.t('trackDue')}\n\n`;
      for (const l of adReviser) md += `- ${lien(l.f)} — ${l.next}\n`;
      md += '\n';
    }
    if (lignes.length) {
      md += `| ${this.t('trackColNote')} | ${this.t('trackColProgress')} | ${this.t('trackColCount')} | ${this.t('trackColLast')} | ${this.t('trackColNext')} | ${this.t('trackColTime')} |\n|---|---|---|---|---|---|\n`;
      for (const l of lignes) {
        const next = l.next ? (l.next <= aujourdhui ? `⚠ ${l.next}` : l.next) : '—';
        md += `| ${lien(l.f)} | \`${this.barre(l.av)}\` ${l.av} % | ${l.rev} | ${l.der} | ${next} | ${l.temps} ${min} |\n`;
      }
      const moy = Math.round(lignes.reduce((a, l) => a + l.av, 0) / lignes.length);
      md += `\n${this.tp('trackAverage', lignes.length, { p: moy })}\n`;
    } else {
      md += `${this.t('trackNone')}\n`;
    }

    const recentes = this.sessions.filter((s) => !s.rapide).slice(-15).reverse();
    if (recentes.length) {
      md += `\n## ${this.t('trackRecent')}\n\n`;
      for (const s of recentes) {
        const d = new Date(s.debut);
        const sec = s.duree !== undefined ? s.duree : ((s.fin || s.debut) - s.debut) / 1000;
        const sc = s.score === null || s.score === undefined
          ? this.t('trackNoQuiz') : this.t('trackQuiz', { p: Math.round(s.score * 100) });
        const noms = s.notes.map((n) => n.chemin.split('/').pop().replace(/\.md$/, '')).join(', ');
        md += `- ${dateISO(d)} ${heureFR(d)} · ${Math.round(sec / 60)} ${min} · ${sc} · ${noms}\n`;
      }
    }

    const chemin = this.cheminSuivi();
    const existant = this.app.vault.getAbstractFileByPath(chemin);
    if (existant instanceof TFile) {
      await this.app.vault.process(existant, () => md);
    } else {
      const dossier = chemin.includes('/') ? chemin.slice(0, chemin.lastIndexOf('/')) : '';
      if (dossier && !this.app.vault.getAbstractFileByPath(dossier)) await this.app.vault.createFolder(dossier);
      await this.app.vault.create(chemin, md);
    }
  }

  async ouvrirSuivi() {
    await this.majSuivi();
    const f = this.app.vault.getAbstractFileByPath(this.cheminSuivi());
    if (f instanceof TFile) await this.app.workspace.getLeaf(false).openFile(f);
  }
};

/* ------------------------------------------------------------------ */
/*  Fenêtre d'interro                                                  */
/* ------------------------------------------------------------------ */
class QuizModal extends Modal {
  constructor(app, plugin) {
    super(app);
    this.plugin = plugin;
    const a = plugin.attente;
    // La progression est gardée dans l'interro en attente : fermer la fenêtre ne perd rien
    this.p = a.progress || (a.progress = { index: 0, notes: new Map() });
    this.composant = new Component();
    this.fini = false;
    this.reponseVisible = false;
  }

  t(c, v) { return this.plugin.t(c, v); }

  onOpen() {
    this.composant.load();
    this.modalEl.addClass('rvi-modal');
    this.contentEl.addClass('rvi-modal');

    const revele = (e) => { if (!this.fini && !this.reponseVisible) { e.preventDefault(); this.reveler(); } };
    this.scope.register([], 'Enter', revele);
    this.scope.register([], ' ', revele);
    this.scope.register([], '1', () => this.noter(1));
    this.scope.register([], '2', () => this.noter(0.5));
    this.scope.register([], '3', () => this.noter(0));
    this.scope.register([], '4', () => this.passer());

    this.afficherQuestion();
  }

  onClose() {
    this.plugin.quizOuvert = false;
    this.composant.unload();
    this.contentEl.empty();
    this.plugin.majStatut();
  }

  get questions() { return this.plugin.attente ? this.plugin.attente.questions : []; }

  rendre(el, markdown, chemin) {
    return MarkdownRenderer.render
      ? MarkdownRenderer.render(this.app, markdown, el, chemin, this.composant)
      : MarkdownRenderer.renderMarkdown(markdown, el, chemin, this.composant);
  }

  afficherQuestion() {
    const { contentEl } = this;
    contentEl.empty();
    this.reponseVisible = false;
    const q = this.questions[this.p.index];
    const total = this.questions.length;
    const rapide = this.plugin.attente.session.rapide;

    contentEl.createEl('h2', { text: this.t(rapide ? 'quizTitleQuick' : 'quizTitle') });
    contentEl.createDiv({ cls: 'rvi-progression', text: this.t('quizProgress', { i: this.p.index + 1, n: total }) });
    const barre = contentEl.createDiv({ cls: 'rvi-barre' });
    const rempli = barre.createDiv();
    if (typeof rempli.setCssProps === 'function') {
      rempli.setCssProps({ '--rvi-progress': `${(this.p.index / total) * 100}%` });
    }

    contentEl.createDiv({ cls: 'rvi-etiquette', text: `${q.nomNote} · ${q.type}` });
    const zq = contentEl.createDiv({ cls: 'rvi-question' });
    this.rendre(zq, q.question, q.chemin);
    contentEl.createDiv({ cls: 'rvi-consigne', text: this.t('quizHint') });

    const zone = contentEl.createDiv();
    const boutons = zone.createDiv({ cls: 'rvi-boutons' });
    const btn = boutons.createEl('button', { text: this.t('quizShow'), cls: 'mod-cta' });
    btn.addEventListener('click', () => this.reveler());
    const skip = boutons.createEl('button', { text: this.t('quizSkip') });
    skip.addEventListener('click', () => this.passer());
    this.zone = zone;

    contentEl.createDiv({ cls: 'rvi-pied', text: this.t('quizEsc') });
  }

  reveler() {
    if (this.reponseVisible) return;
    this.reponseVisible = true;
    const q = this.questions[this.p.index];
    this.zone.empty();
    const rep = this.zone.createDiv({ cls: 'rvi-reponse' });
    this.rendre(rep, q.reponse, q.chemin);
    const boutons = this.zone.createDiv({ cls: 'rvi-boutons' });
    boutons.createEl('button', { text: this.t('quizKnew') }).addEventListener('click', () => this.noter(1));
    boutons.createEl('button', { text: this.t('quizHesitated') }).addEventListener('click', () => this.noter(0.5));
    boutons.createEl('button', { text: this.t('quizMissed') }).addEventListener('click', () => this.noter(0));
  }

  async passer() {
    if (this.fini) return;
    await this.avancer();
  }

  async noter(valeur) {
    if (this.fini || !this.reponseVisible) return;
    const q = this.questions[this.p.index];
    if (!this.p.notes.has(q.chemin)) this.p.notes.set(q.chemin, []);
    this.p.notes.get(q.chemin).push(valeur);
    await this.avancer();
  }

  async avancer() {
    this.p.index++;
    if (this.p.index < this.questions.length) this.afficherQuestion();
    else await this.terminer();
  }

  async terminer() {
    this.fini = true;
    const { session } = this.plugin.attente;
    const toutes = this.questions.slice();
    const scores = new Map();
    for (const [chemin, vals] of this.p.notes) {
      scores.set(chemin, vals.reduce((a, b) => a + b, 0) / vals.length);
    }
    this.plugin.attente = null;
    const { bilan, global } = await this.plugin.enregistrer(session, scores, true);

    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl('h2', { text: this.t('recapTitle') });
    if (global !== null) {
      contentEl.createDiv({ cls: 'rvi-bilan-total', text: this.t('recapScore', { p: Math.round(global * 100) }) });
    }
    for (const b of bilan) {
      const ligne = contentEl.createDiv({ cls: 'rvi-bilan-ligne' });
      const gauche = ligne.createDiv();
      gauche.createDiv({ text: b.nom });
      if (b.prochaine) gauche.createDiv({ cls: 'rvi-bilan-next', text: this.t('recapNext', { date: b.prochaine }) });
      let txt;
      if (b.score === null) txt = this.t('recapNotQuizzed');
      else if (b.avant === null) txt = this.t('recapNew', { s: Math.round(b.score * 100), a: b.apres });
      else txt = this.t('recapChange', { s: Math.round(b.score * 100), b: b.avant, a: b.apres });
      ligne.createSpan({ text: txt });
    }
    const pied = contentEl.createDiv({ cls: 'rvi-boutons rvi-marge' });
    pied.createEl('button', { text: this.t('recapClose'), cls: 'mod-cta' }).addEventListener('click', () => this.close());
    pied.createEl('button', { text: this.t('recapTracking') })
      .addEventListener('click', () => { this.close(); this.plugin.ouvrirSuivi(); });
    const avecCartes = toutes.find((q) => q.carte);
    if (avecCartes && this.plugin.srCommande('review-flashcards-in-note')) {
      pied.createEl('button', { text: this.t('recapSRCards') })
        .addEventListener('click', () => { this.close(); this.plugin.revoirCartesSR(avecCartes.chemin); });
    }
  }
}

/* ------------------------------------------------------------------ */
/*  Sélecteur de dossier                                               */
/* ------------------------------------------------------------------ */
class FolderSuggestModal extends FuzzySuggestModal {
  constructor(app, dossiers, placeholder, onChoose) {
    super(app);
    this.dossiers = dossiers;
    this.onChoose = onChoose;
    this.setPlaceholder(placeholder);
  }
  getItems() { return this.dossiers; }
  getItemText(item) { return item; }
  onChooseItem(item) { this.onChoose(item); }
}

/* ------------------------------------------------------------------ */
/*  Réglages                                                           */
/* ------------------------------------------------------------------ */
class RevisionsSettingTab extends PluginSettingTab {
  constructor(app, plugin) { super(app, plugin); this.plugin = plugin; }

  display() {
    const { containerEl } = this;
    const p = this.plugin;
    const r = p.reglages;
    const t = (c, v) => p.t(c, v);
    containerEl.empty();
    containerEl.addClass('rvi-reglages');

    const maj = async (k, v) => { r[k] = v; await p.sauver(); };

    /* Langue (réglage général : pas de titre en tête de page, selon les consignes d'Obsidian) */
    new Setting(containerEl)
      .setName(t('setLang'))
      .setDesc(t('setLangDesc'))
      .addDropdown((d) => {
        d.addOption('auto', t('langAuto'));
        for (const [code, nom] of Object.entries(LANGUES)) d.addOption(code, nom);
        d.setValue(TXT[r.langue] ? r.langue : 'auto').onChange(async (v) => {
          await maj('langue', v);
          p.majStatut();
          this.display();
        });
      });

    /* Notes concernées */
    new Setting(containerEl).setName(t('setNotesHeading')).setHeading();
    this.listeDossiers('dossiersInclus', t('setInclude'), t('setIncludeDesc'), t('wholeVault'));
    this.listeDossiers('dossiersExclus', t('setExclude'), t('setExcludeDesc'), t('noneExcluded'));

    /* Séquences */
    new Setting(containerEl).setName(t('setSeqHeading')).setHeading();
    new Setting(containerEl)
      .setName(t('setAuto')).setDesc(t('setAutoDesc'))
      .addToggle((x) => x.setValue(r.autoDemarrage).onChange((v) => maj('autoDemarrage', v)));
    new Setting(containerEl)
      .setName(t('setIdle')).setDesc(t('setIdleDesc'))
      .addSlider((s) => s.setLimits(2, 60, 1).setValue(r.inactiviteMin).setDynamicTooltip()
        .onChange((v) => maj('inactiviteMin', v)));
    new Setting(containerEl)
      .setName(t('setMin')).setDesc(t('setMinDesc'))
      .addText((x) => x.setValue(String(r.minSecondes)).onChange((v) => {
        const n = parseInt(v, 10);
        if (Number.isFinite(n) && n >= 0) maj('minSecondes', n);
      }));

    /* Interro */
    new Setting(containerEl).setName(t('setQuizHeading')).setHeading();
    new Setting(containerEl)
      .setName(t('setNbQ')).setDesc(t('setNbQDesc'))
      .addSlider((s) => s.setLimits(3, 20, 1).setValue(r.nbQuestions).setDynamicTooltip()
        .onChange((v) => maj('nbQuestions', v)));
    new Setting(containerEl)
      .setName(t('setImpact')).setDesc(t('setImpactDesc'))
      .addSlider((s) => s.setLimits(10, 100, 5).setValue(r.impact).setDynamicTooltip()
        .onChange((v) => maj('impact', v)));
    containerEl.createDiv({ cls: 'rvi-note', text: t('setHow') });

    /* Planification */
    new Setting(containerEl).setName(t('setPlanHeading')).setHeading();
    new Setting(containerEl)
      .setName(t('setPlan')).setDesc(t('setPlanDesc'))
      .addToggle((x) => x.setValue(r.planifier).onChange((v) => maj('planifier', v)));
    new Setting(containerEl)
      .setName(t('setScheduler')).setDesc(t('setSchedulerDesc'))
      .addDropdown((d) => {
        d.addOption('interne', t('schedInterne')).addOption('sr', t('schedSR'));
        d.setValue(r.planificateur === 'sr' ? 'sr' : 'interne').onChange((v) => maj('planificateur', v));
      });
    new Setting(containerEl)
      .setName(t('setMaxInterval')).setDesc(t('setMaxIntervalDesc'))
      .addSlider((s) => s.setLimits(7, 365, 1).setValue(r.intervalleMax).setDynamicTooltip()
        .onChange((v) => maj('intervalleMax', v)));

    /* Spaced Repetition */
    new Setting(containerEl).setName(t('setSRHeading')).setHeading();
    containerEl.createDiv({ cls: 'rvi-note', text: p.srDispo() ? t('srDetected') : t('srMissing') });
    new Setting(containerEl)
      .setName(t('setSRTag')).setDesc(t('setSRTagDesc', { tag: p.srTag() }))
      .addToggle((x) => x.setValue(r.ajouterTagSR).onChange((v) => maj('ajouterTagSR', v)));

    /* Suivi */
    new Setting(containerEl).setName(t('setTrackHeading')).setHeading();
    new Setting(containerEl)
      .setName(t('setProp')).setDesc(t('setPropDesc'))
      .addText((x) => x.setValue(r.propAvancement)
        .onChange((v) => maj('propAvancement', v.trim() || 'progression')));
    new Setting(containerEl)
      .setName(t('setFile')).setDesc(t('setFileDesc', { def: t('trackingFile') }))
      .addText((x) => x.setPlaceholder(t('trackingFile')).setValue(r.fichierSuivi)
        .onChange((v) => maj('fichierSuivi', v.trim())));
    new Setting(containerEl)
      .setName(t('setAutoTrack'))
      .addToggle((x) => x.setValue(r.majSuiviAuto).onChange((v) => maj('majSuiviAuto', v)));
  }

  /** Liste de dossiers affichée en pastilles, avec un sélecteur à recherche pour en ajouter. */
  listeDossiers(cle, nom, desc, texteVide) {
    const { containerEl } = this;
    const p = this.plugin;
    const t = (c, v) => p.t(c, v);

    const reglage = new Setting(containerEl).setName(nom).setDesc(desc);
    const zone = containerEl.createDiv({ cls: 'rvi-chips' });

    const rendre = () => {
      zone.empty();
      const liste = p.nettoyerDossiers(p.reglages[cle]);
      if (!liste.length) zone.createSpan({ cls: 'rvi-vide', text: texteVide });
      for (const d of liste) {
        const chip = zone.createDiv({ cls: 'rvi-chip' });
        chip.createSpan({ text: `📁 ${d}` });
        const x = chip.createEl('button', { cls: 'rvi-chip-x', text: '×', attr: { 'aria-label': t('removeFolder') } });
        x.addEventListener('click', async () => {
          p.reglages[cle] = liste.filter((z) => z !== d);
          await p.sauver();
          rendre();
        });
      }
    };

    reglage.addButton((b) => b.setButtonText(`+ ${t('addFolder')}`).onClick(() => {
      const deja = p.nettoyerDossiers(p.reglages[cle]);
      const choix = p.tousLesDossiers().filter((d) => !deja.includes(d));
      new FolderSuggestModal(this.app, choix, t('folderPlaceholder'), async (d) => {
        p.reglages[cle] = [...deja, d];
        await p.sauver();
        rendre();
      }).open();
    }));

    rendre();
  }
}
