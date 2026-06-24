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

	// Rueckgabe:
	//   false -> noch nicht bereit, weiter versuchen
	//   true  -> fertig (angewendet ODER nichts zu tun)
	function applyBanner() {
		// Warten, bis frappe.boot geladen ist
		if (!(window.frappe && frappe.boot)) {
			return false;
		}

		const cfg = getConfig();

		// Kein Label konfiguriert -> nichts tun, aufhoeren
		if (!cfg.label) {
			return true;
		}

		const navbar = document.querySelector(".navbar");
		if (!navbar) {
			return false;
		}

		// Schon angewendet (mit gleichem Label) -> fertig
		if (navbar.dataset.envBannerApplied === cfg.label) {
			return true;
		}

		// Navbar einfaerben
		navbar.style.backgroundColor = cfg.color;
		navbar.style.borderBottom = "none";
		navbar.dataset.envBannerApplied = cfg.label;

		// Container relativ positionieren, damit das Label zentriert werden kann
		const container = navbar.querySelector(".container") || navbar;
		container.classList.add("env-banner-host");

		// Label nur einmal einfuegen
		let el = container.querySelector(".env-banner-label");
		if (!el) {
			el = document.createElement("div");
			el.className = "env-banner-label";
			container.appendChild(el);
		}
		el.textContent = cfg.label;
		el.style.color = cfg.textColor;

		return true;
	}

	function init() {
		let tries = 0;
		const timer = setInterval(function () {
			tries += 1;
			// Aufhoeren, sobald angewendet oder nach ~15s Timeout
			if (applyBanner() === true || tries > 150) {
				clearInterval(timer);
			}
		}, 100);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
