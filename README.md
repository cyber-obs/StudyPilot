# StudyPilot

Track your revision sessions automatically, quiz yourself at the end of each one, and keep every note's progress and next review date up to date. The plugin works in English, French and Spanish.

## What it does

- **Sessions start by themselves.** Open a note and a session begins. A timer in the status bar shows the time spent. Pause, finish or cancel from the menu behind the 📚 button.
- **A short quiz ends each session.** Questions are taken from the notes you worked on, in proportion to the time spent on each one. You read the question, think, reveal the answer, then grade yourself: ✅ 100 %, 🤔 50 %, ❌ 0 %.
- **Properties are updated for you** on every note you revised (see below).
- **A tracking note** lists every note with its progress, number of revisions, last and next review date, and the notes to review today or overdue.
- **Reminders.** At startup, the plugin tells you how many notes are due. A command opens the most overdue one.

## Where the questions come from

| In your note | Question asked |
|---|---|
| A callout, such as `> [!definition] Title` followed by text | The title is the question, the body is the answer |
| `question :: answer` | Card, one direction |
| `question ::: answer` | Card, both directions |
| A question, a line with `?`, then the answer (`??` for both directions) | Multi-line card |
| A `##` section with enough text | "Explain: section title" |
| Nothing usable | "Summarize the note from memory" |

The card syntax is the same as the one used by the Spaced Repetition plugin, so both plugins can read the same notes.

## Properties written in your notes

| Property | Meaning |
|---|---|
| `progression` | Progress from 0 to 100. After each quiz it moves toward your score by a percentage you choose (40 % by default). The property name can be changed in the settings. |
| `revisions` | Number of sessions |
| `derniere_revision` | Date of the last revision (`YYYY-MM-DD`) |
| `prochaine_revision` | Date of the next revision, calculated from your score |
| `intervalle_revision` | Gap in days used for the calculation |
| `temps_revision` | Total minutes spent revising |

### How the next review date is calculated

- Score under 50 %: back to tomorrow.
- Score from 50 % to 79 %: the gap is multiplied by 1.5 (2 days minimum).
- Score of 80 % or more: the gap is multiplied by 2.5 (3 days minimum).
- No quiz: the current gap is kept.
- The gap is capped (90 days by default, adjustable).

## Using it with the Spaced Repetition plugin

In the settings, choose who schedules the reviews:

- **My plugin** (default): the plugin calculates `prochaine_revision`.
- **Spaced Repetition**: after the quiz, each quizzed note is rated in the Spaced Repetition plugin (Easy for a score of 85 % or more, Good from 50 %, Hard below). The `sr-due` dates written by that plugin are then used for the tracking note, the reminders and the "next note" command. The review tag of Spaced Repetition can be added automatically to quizzed notes.

To do this, the plugin runs the commands of Spaced Repetition on the note, so the note is opened for a moment. This relies on internal Obsidian features (the command list and the loaded plugins). If Spaced Repetition is missing, the plugin falls back to its own scheduling. When a quizzed note contains cards, a button in the quiz summary starts the Spaced Repetition card review for that note.

## Commands

All commands are available in the command palette. No default hotkey is set.

- Open the revision menu
- Start a revision session
- Pause / resume the session
- Finish the session and take the quiz
- Cancel the current session (without saving)
- Quick quiz on the open note
- Open the revision tracking table
- Open the next note to review

## Settings

Language, folders that count as revision (several folders, and excluded folders), automatic start, inactivity delay, minimum session length, number of questions, quiz impact on progress, scheduler, maximum gap, progress property name, tracking note path.

## Installation

From Obsidian: **Settings → Community plugins → Browse**, search for "Révisions & Interro", then install and enable it.

Manual installation: download `main.js`, `manifest.json` and `styles.css` from the latest release and copy them into `<your vault>/.obsidian/plugins/revisions-interro/`.

## Privacy and disclosures

- No network use, no account, no payment, no ads and no telemetry.
- The plugin only reads and writes files inside your vault: the properties listed above and the tracking note. Its settings and session history are stored in the plugin's own `data.json`.
- When "Spaced Repetition" is chosen as scheduler, the plugin reads the settings of that plugin (its review tag) and runs its commands.

---

## Français

**Révisions & Interro** enregistre automatiquement tes séquences de révision, te fait passer une petite interro à la fin, puis met à jour dans les propriétés de chaque fiche la progression (`progression`), la date de dernière révision (`derniere_revision`) et la date de prochaine révision (`prochaine_revision`).

Une séquence démarre quand tu ouvres une fiche. Le bouton 📚 de la barre d'état ouvre un menu (pause, terminer, annuler, interro rapide). Une note « Suivi des révisions » est générée avec le tableau d'avancement et les fiches à réviser. Le plugin peut aussi déléguer la planification au plugin Spaced Repetition (réglage « Qui planifie les révisions ? »).

Aucune connexion réseau, aucun compte, aucune télémétrie : tout reste dans ton coffre.

## Español

**Révisions & Interro** registra automáticamente tus sesiones de repaso, te hace un test corto al final y actualiza en las propiedades de cada ficha el progreso, la fecha del último repaso y la del próximo. Puede delegar la planificación en el plugin Spaced Repetition. Sin conexión de red, sin cuenta y sin telemetría.

## License

[MIT](LICENSE)
