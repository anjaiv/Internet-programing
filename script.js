/* =========================
   SkinCare Helper - script.js
   (vanilla JS for prototype)
   Later you move logic into Angular components/services.
   ========================= */
   alert("JS loaded");

console.log("script.js loaded ");
document.addEventListener("DOMContentLoaded", () => {
  // ===== Tabs (Morning / Evening) =====
  const morningTab = document.getElementById("morning-tab");
  const eveningTab = document.getElementById("evening-tab");
  const morningPanel = document.getElementById("tab-morning");
  const eveningPanel = document.getElementById("tab-evening");

  function setTab(active) {
    const isMorning = active === "morning";

    if (morningTab && eveningTab) {
      morningTab.setAttribute("aria-selected", String(isMorning));
      eveningTab.setAttribute("aria-selected", String(!isMorning));
    }

    if (morningPanel && eveningPanel) {
      morningPanel.classList.toggle("is-hidden", !isMorning);
      eveningPanel.classList.toggle("is-hidden", isMorning);
    }
  }

  if (morningTab && eveningTab) {
    morningTab.addEventListener("click", () => setTab("morning"));
    eveningTab.addEventListener("click", () => setTab("evening"));
  }

  // ===== Routine Builder (Generate routine) =====
  const generateBtn = document.querySelector('#routines button.btn[type="button"]'); // first primary button
  const skinTypeInputs = document.querySelectorAll('input[name="skinType"]');
  const goalSelect = document.getElementById("goal");
  const budgetSelect = document.getElementById("budget");

  // Routine step containers (we fill the lists)
  const morningStepsOl = morningPanel ? morningPanel.querySelector(".steps") : null;
  const eveningStepsOl = eveningPanel ? eveningPanel.querySelector(".steps") : null;

  function getSelectedSkinType() {
    let value = "oily";
    skinTypeInputs.forEach((i) => {
      if (i.checked) value = i.value;
    });
    return value;
  }

  function buildRoutine(skinType, goal, budget) {
    // Simple demo rules (you’ll replace with API/json data later)
    const commonMorning = [
      { title: "Cleanser", desc: "Gentle cleanse to prep skin." },
      { title: "Moisturizer", desc: "Hydrate + protect the barrier." },
      { title: "SPF", desc: "Daily sunscreen (most important step)." },
    ];

    const commonEvening = [
      { title: "Cleanser", desc: "Remove SPF/makeup; double cleanse if needed." },
      { title: "Moisturizer", desc: "Repair + hydrate overnight." },
    ];

    // pick serum/active based on goal
    let morningSerum = { title: "Serum", desc: "Hydrating serum (HA) for a fresh base." };
    let eveningActive = { title: "Active", desc: "Gentle active 2–3x/week, rest nights hydrate." };

    if (goal === "acne") {
      morningSerum = { title: "Serum", desc: "Niacinamide for oil control + pores." };
      eveningActive = { title: "Active", desc: "Salicylic acid (BHA) 2–3x/week." };
    } else if (goal === "brightening") {
      morningSerum = { title: "Serum", desc: "Vitamin C / brightening serum (if tolerated)." };
      eveningActive = { title: "Active", desc: "Gentle exfoliation 1–2x/week (AHA) OR retinoid." };
    } else if (goal === "antiaging") {
      morningSerum = { title: "Serum", desc: "Antioxidant / peptide serum (optional)." };
      eveningActive = { title: "Active", desc: "Retinoid (start slowly) + hydrate." };
    } else if (goal === "soothing") {
      morningSerum = { title: "Serum", desc: "Soothing serum (panthenol/centella type)." };
      eveningActive = { title: "Active", desc: "Skip strong actives; focus on calming + barrier." };
    }

    // adjust description by skin type
    const moisturizerDesc =
      skinType === "dry"
        ? "Rich moisturizer for deep hydration."
        : skinType === "sensitive"
        ? "Fragrance-free, calming moisturizer."
        : skinType === "combination"
        ? "Light cream on T-zone, richer on dry areas."
        : "Light, non-comedogenic moisturizer.";

    // adjust by budget (demo only)
    const budgetHint =
      budget === "low"
        ? " (Budget: basic picks)"
        : budget === "high"
        ? " (Budget: premium picks)"
        : " (Budget: mid-range picks)";

    const morning = [
      commonMorning[0],
      { ...morningSerum, desc: morningSerum.desc + budgetHint },
      { title: "Moisturizer", desc: moisturizerDesc + budgetHint },
      commonMorning[2],
    ];

    const evening = [
      commonEvening[0],
      { ...eveningActive, desc: eveningActive.desc + budgetHint },
      { title: "Hydration", desc: "Hydrating/soothing serum if skin feels tight." + budgetHint },
      { title: "Moisturizer", desc: moisturizerDesc + budgetHint },
    ];

    return { morning, evening };
  }

  function renderSteps(listEl, steps) {
    if (!listEl) return;
    listEl.innerHTML = "";
    steps.forEach((s) => {
      const li = document.createElement("li");
      li.className = "step";
      li.innerHTML = `
        <div class="step__title">${escapeHtml(s.title)}</div>
        <div class="step__desc">${escapeHtml(s.desc)}</div>
      `;
      listEl.appendChild(li);
    });
  }

  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      const skinType = getSelectedSkinType();
      const goal = goalSelect ? goalSelect.value : "hydration";
      const budget = budgetSelect ? budgetSelect.value : "mid";

      const { morning, evening } = buildRoutine(skinType, goal, budget);
      renderSteps(morningStepsOl, morning);
      renderSteps(eveningStepsOl, evening);

      // switch to morning tab when generated
      setTab("morning");
      toast("Routine generated ✅");
    });
  }

  // ===== Notes (LocalStorage CRUD) =====
  const noteTitle = document.getElementById("noteTitle");
  const noteBody = document.getElementById("noteBody");
  const noteTag = document.getElementById("noteTag");

  const saveNoteBtn = document.querySelector('#notes button.btn[type="button"]'); // "Save note"
  const notesContainer = document.querySelector("#notes .panel:nth-child(2)"); // right panel
  const notesListMount = notesContainer ? notesContainer : null;

  const STORAGE_KEY = "skincare_notes_v1";

  function loadNotes() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  }

  function saveNotes(notes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }

  function createNote({ title, body, tag }) {
    return {
      id: String(Date.now()),
      title: title.trim(),
      body: body.trim(),
      tag: tag || "Routine",
      date: new Date().toISOString().slice(0, 10),
    };
  }

  function renderNotes() {
    if (!notesListMount) return;

    // Remove existing rendered notes (keep the heading)
    const existing = notesListMount.querySelectorAll(".note[data-note]");
    existing.forEach((n) => n.remove());

    const notes = loadNotes();

    if (notes.length === 0) {
      // show empty state once
      if (!notesListMount.querySelector("[data-empty]")) {
        const empty = document.createElement("p");
        empty.className = "muted";
        empty.setAttribute("data-empty", "true");
        empty.textContent = "No notes yet. Save your first note on the left.";
        notesListMount.appendChild(empty);
      }
      return;
    } else {
      const empty = notesListMount.querySelector("[data-empty]");
      if (empty) empty.remove();
    }

    // Render newest first
    notes
      .slice()
      .sort((a, b) => (a.id < b.id ? 1 : -1))
      .forEach((n) => {
        const article = document.createElement("article");
        article.className = "note";
        article.setAttribute("data-note", "true");
        article.setAttribute("data-id", n.id);
        article.innerHTML = `
          <h4>${escapeHtml(n.title || "Untitled note")}</h4>
          <p class="muted">Tag: ${escapeHtml(n.tag)} • Date: ${escapeHtml(n.date)}</p>
          <p>${escapeHtml(n.body)}</p>
          <div class="note__actions">
            <button class="btn btn--ghost" type="button" data-edit="${escapeHtml(n.id)}">Edit</button>
            <button class="btn btn--ghost" type="button" data-delete="${escapeHtml(n.id)}">Delete</button>
          </div>
        `;
        notesListMount.appendChild(article);
      });
  }

  function handleSaveNote() {
    const title = noteTitle ? noteTitle.value : "";
    const body = noteBody ? noteBody.value : "";
    const tag = noteTag ? noteTag.value : "Routine";

    if (!body.trim()) {
      toast("Write a note first ✍️");
      return;
    }

    const notes = loadNotes();
    notes.push(createNote({ title, body, tag }));
    saveNotes(notes);

    if (noteTitle) noteTitle.value = "";
    if (noteBody) noteBody.value = "";

    renderNotes();
    toast("Note saved ✅");
  }

  if (saveNoteBtn) {
    saveNoteBtn.addEventListener("click", handleSaveNote);
  }

  // Event delegation for edit/delete
  document.addEventListener("click", (e) => {
    const target = e.target;

    if (!(target instanceof HTMLElement)) return;

    const delId = target.getAttribute("data-delete");
    if (delId) {
      const notes = loadNotes().filter((n) => n.id !== delId);
      saveNotes(notes);
      renderNotes();
      toast("Note deleted 🗑️");
      return;
    }

    const editId = target.getAttribute("data-edit");
    if (editId) {
      const notes = loadNotes();
      const note = notes.find((n) => n.id === editId);
      if (!note) return;

      // Put note back into form for editing (simple approach)
      if (noteTitle) noteTitle.value = note.title;
      if (noteBody) noteBody.value = note.body;
      if (noteTag) noteTag.value = note.tag;

      // Remove the old one, next save will act like update
      const updated = notes.filter((n) => n.id !== editId);
      saveNotes(updated);
      renderNotes();
      toast("Editing note ✏️ (save to update)");
    }
  });

  // render on load
  renderNotes();

  // ===== Small Toast =====
  function toast(message) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = message;
    document.body.appendChild(t);

    requestAnimationFrame(() => t.classList.add("toast--show"));

    setTimeout(() => {
      t.classList.remove("toast--show");
      setTimeout(() => t.remove(), 250);
    }, 1600);
  }

  // ===== Helpers =====
  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
});

/* ===== Toast styles injected (so you don't need extra CSS) ===== */
(function injectToastCss() {
  const css = `
    .toast{
      position: fixed;
      left: 50%;
      bottom: 22px;
      transform: translateX(-50%) translateY(10px);
      background: #111;
      color: #fff;
      padding: 10px 14px;
      border-radius: 999px;
      font-weight: 700;
      font-size: 14px;
      opacity: 0;
      pointer-events: none;
      transition: opacity .2s ease, transform .2s ease;
      z-index: 9999;
      box-shadow: 0 10px 30px rgba(0,0,0,.18);
    }
    .toast--show{
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
})();
