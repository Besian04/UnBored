# Unbored - Webapp gegen Langeweile

**Unbored** ist eine browserbasierte Webanwendung, die Nutzer:innen dabei unterstützt, passende Freizeitaktivitäten zu finden, wenn ihnen langweilig ist oder sie sich nicht entscheiden können.

---

## Kurzbeschreibung
Die App bietet Kategorien, Aktivitätenlisten, Suche, Sortierung, Bewertungen, Playlists sowie eine Random-Funktion.  
Die Anwendung läuft vollständig **clientseitig** und speichert Daten im Browser (**Local Storage**). Es ist keine Registrierung und kein Server erforderlich.

## Ziele
* **Schnelligkeit:** Sofortige Vorschläge für Freizeitaktivitäten.
* **Entscheidungshilfe:** Unterstützung bei der Auswahl durch Filter und Zufallsfunktionen.
* **Anpassbarkeit:** Personalisierung durch Bewertungen, Sprachen und Design-Themes.
* **Einfachheit:** Nutzung ohne Registrierung und ohne Backend-Infrastruktur.

---

## Installation
> **Keine zusätzlichen Abhängigkeiten erforderlich!**

1. **Download:** Projekt als ZIP herunterladen und entpacken.
2. **Start:** Die Datei `index.html` im Browser öffnen (z.B. Chrome, Firefox, Edge).
3. **Optional:** Über einen lokalen Webserver (z.B. VS Code Live Server) starten.

**Hinweis:** Alle Daten werden im Browser (Local Storage) gespeichert. Ein Reset ist über die App oder durch Löschen des Local Storage möglich.

---

## Verwendung (User Guide)

### Kategorien & Aktivitäten
* Kategorien werden in der Sidebar angezeigt.
* Klick auf eine Kategorie zeigt die zugehörigen Aktivitäten.

### Suche, Sortierung & Details
* **Details:** Klick auf eine Aktivität öffnet die Ansicht mit Beschreibung, Dauer und Bewertung.
* **Suche:** Aktivitäten können über die Suchleiste gefiltert werden.
* **Sortierung:** Nach Name oder Bewertung (auf- und absteigend).

### Random-Funktion
* Der Random-Button wählt eine zufällige Aktivität.
* Optional kann die Auswahl nach **Dauer** eingeschränkt werden.

### Aktivitäten & Playlists hinzufügen
* **Hinzufügen:** Kategorien und Aktivitäten können über Formulare erstellt werden.
* **Playlists:** Nutzer:innen können Playlists erstellen und Aktivitäten zuordnen.

### Sprache & Theme
* Umschalten zwischen **Deutsch** und **Englisch**.
* Umschalten zwischen **Light-** und **Dark-Mode**.

---

## MoSCoW-Kriterien (Functional Requirements)

| Priorität | ID | Beschreibung |
| :--- | :--- | :--- |
| **MUST** | M1-M2 | Kategorien ansehen/auswählen; Aktivitätenliste anzeigen. |
| | M3-M4 | Details von Aktivitäten (auch aus Playlists) einsehen. |
| | M5-M6 | Kategorien und Aktivitäten über Templates hinzufügen. |
| | M7-M8 | Playlists erstellen, ansehen und Aktivitäten daraus wählen. |
| **SHOULD** | S1-S2 | Dark/Light Mode & Sprachwechsel (DE/EN). |
| | S3-S4 | Bewertungen vergeben (0-10 Sterne) & Sortierfunktionen. |
| | S5-S6 | Random-Button (optional mit Dauer-Einschränkung). |
| **COULD** | C1-C2 | Weitere Templates; Export/Import als Textdatei. |
| | C3-C4 | Freie Attributbestimmung & Playlist-Erstellung. |
| **WON’T** | W1-W3 | Kein Streaming, keine soziale Plattform, kein Login. |

---

## Non-Functional Requirements

### Performance & Stabilität
* **P1:** Reaktion innerhalb von 2–3 Sekunden nach Kategorieauswahl.
* **S1:** Wiederherstellung des letzten Zustands nach Neustart.

### Usability & Reliability
* **U1-U2:** Speicherung via Local Storage; schneller initialer Ladevorgang.
* **U3 / R1:** Intuitives UI und stabile Implementierung.

### Compatibility & Internationalisierung
* **CI1:** Lauffähig auf allen gängigen Browsern.
* **CI2:** Unterstützung von Deutsch und Englisch.
* **CI3:** Vollständig responsives Layout.

---

## Team
* Besian Alihajdaraj
* Vjollca Berbati
* Nicolas Dziwinsky
* David Ramberger
