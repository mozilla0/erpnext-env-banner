(function () {
	"use strict";

	function getConfig() {
		const boot = (window.frappe && frappe.boot) || {};
		return {
			label: boot.environment_label,
			color: boot.environment_color || "#c0392b",
			textColor: boot.environment_text_color || "#ffffff",
		};
	}

	// Festes Label an document.body -> unabhaengig vom Layout (v16 Workspace,
	// Liste, Formular). Bleibt bei SPA-Navigation bestehen.
	function ensureBadge(cfg) {
		let badge = document.getElementById("env-banner-badge");
		if (!badge) {
			badge = document.createElement("div");
			badge.id = "env-banner-badge";
			document.body.appendChild(badge);
		}
		if (badge.textContent !== cfg.label) badge.textContent = cfg.label;
		badge.style.backgroundColor = cfg.color;
		badge.style.color = cfg.textColor;
	}

	// Bonus: klassische Navbar einfaerben, falls auf der Seite vorhanden.
	function colorNavbar(cfg) {
		const navbar = document.querySelector(".navbar");
		if (navbar && navbar.dataset.envBannerApplied !== cfg.label) {
			navbar.style.backgroundColor = cfg.color;
			navbar.style.borderBottom = "none";
			navbar.dataset.envBannerApplied = cfg.label;
		}
	}

	// Rueckgabe: false = noch nicht bereit; true = fertig (angewendet ODER nichts zu tun)
	function apply() {
		if (!(window.frappe && frappe.boot)) return false; // boot noch nicht geladen
		const cfg = getConfig();
		if (!cfg.label) return true; // nichts konfiguriert
		if (!document.body) return false;
		ensureBadge(cfg);
		colorNavbar(cfg);
		return true;
	}

	function init() {
		let tries = 0;
		let successTicks = 0;
		const timer = setInterval(function () {
			tries += 1;
			if (apply() === true) {
				successTicks += 1;
				// Ein paar Ticks weiterlaufen, um spaet gerenderte Navbar zu erwischen
				if (successTicks > 8) clearInterval(timer);
			}
			if (tries > 150) clearInterval(timer); // ~30s Sicherheits-Timeout
		}, 200);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
