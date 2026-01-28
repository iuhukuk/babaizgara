(() => {
  const qs = (s, root=document) => root.querySelector(s);
  const qsa = (s, root=document) => Array.from(root.querySelectorAll(s));

  // Year
  const yearEl = qs("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // =========================
  // Görselli Menü: filter + search
  // =========================
  const menuGrid = qs("#menuGrid");
  const pills = qsa(".pill[data-filter]");
  const searchInput = qs("#menuSearch");

  let activeFilter = "all";
  let activeQuery = "";

  function applyMenuFilter() {
    if (!menuGrid) return;
    const items = qsa(".menuItem", menuGrid);

    items.forEach(item => {
      const cat = (item.getAttribute("data-cat") || "").toLowerCase();
      const name = (item.getAttribute("data-name") || "").toLowerCase();
      const text = (item.textContent || "").toLowerCase();

      const catOk = (activeFilter === "all") ? true : (cat === activeFilter);
      const qOk = activeQuery ? (name.includes(activeQuery) || text.includes(activeQuery)) : true;

      item.style.display = (catOk && qOk) ? "" : "none";
    });
  }

  if (pills.length) {
    pills.forEach(p => {
      p.addEventListener("click", () => {
        pills.forEach(x => {
          x.classList.remove("is-active");
          x.setAttribute("aria-selected", "false");
        });
        p.classList.add("is-active");
        p.setAttribute("aria-selected", "true");

        activeFilter = (p.getAttribute("data-filter") || "all").toLowerCase();
        applyMenuFilter();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      activeQuery = (searchInput.value || "").trim().toLowerCase();
      applyMenuFilter();
    });
  }

  // =========================
  // Fiyat Listesi Modal
  // =========================
  const openPriceBtn = qs("#openPriceList");
  const menuModal = qs("#menuModal");

  function openMenuModal() {
    if (!menuModal) return;
    menuModal.classList.add("is-open");
    menuModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeMenuModal() {
    if (!menuModal) return;
    menuModal.classList.remove("is-open");
    menuModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  if (openPriceBtn) {
    openPriceBtn.addEventListener("click", openMenuModal);
  }

  if (menuModal) {
    menuModal.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      if (t.dataset.close !== undefined) closeMenuModal();
    });
  }

  // ESC ile kapat (sadece fiyat modal açıksa)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuModal && menuModal.classList.contains("is-open")) {
      closeMenuModal();
    }
  });
})();
