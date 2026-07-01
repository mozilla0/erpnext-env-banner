(function () {
	"use strict";

	var badgeEl = null;
	var reattaching = false;

	function getConfig() {
		var boot = (window.frappe && frappe.boot) || {};
		return {
			label: boot.environment_label,
			color: boot.environment_color || "#c0392b",
			textColor: boot.environment_text_color || "#ffffff",
		};
	}

	// Label an <html> haengen (nicht an body): so bezieht sich position:fixed
	// aufs Fenster und nicht auf einen ggf. transformierten App-Container (v16).
	function mountBadge(cfg) {
		var root = document.documentElement;
		if (!root) return;
		if (!badgeEl) {
			badgeEl = document.createElement("div");
			badgeEl.id = "env-banner-badge";
		}
		if (badgeEl.textContent !== cfg.label) badgeEl.textContent = cfg.label;
		badgeEl.style.backgroundColor = cfg.color;
		badgeEl.style.color = cfg.textColor;
		if (!badgeEl.isConnected) root.appendChild(badgeEl);
	}

	// Bonus: klassische Navbar einfaerben, falls vorhanden.
	function colorNavbar(cfg) {
		var navbar = document.querySelector(".navbar");
		if (navbar && navbar.dataset.envBannerApplied !== cfg.label) {
			navbar.style.backgroundColor = cfg.color;
			navbar.style.borderBottom = "none";
			navbar.dataset.envBannerApplied = cfg.label;
		}
	}

	// false = boot noch nicht bereit; true = fertig (angewendet ODER nichts zu tun)
	function apply() {
		if (!(window.frappe && frappe.boot)) return false;
		var cfg = getConfig();
		if (!cfg.label) return true; // nichts konfiguriert
		mountBadge(cfg);
		colorNavbar(cfg);
		return true;
	}

	// Beobachter: haengt das Label neu ein, falls es doch entfernt wird.
	function startObserver() {
		if (!window.MutationObserver) return;
		var obs = new MutationObserver(function () {
			if (reattaching) return;
			if (!(window.frappe && frappe.boot)) return;
			var cfg = getConfig();
			if (!cfg.label) return;
			if (!badgeEl || !badgeEl.isConnected) {
				reattaching = true;
				mountBadge(cfg);
				reattaching = false;
			}
			colorNavbar(cfg);
		});
		obs.observe(document.documentElement, { childList: true, subtree: true });
	}

	// Zusaetzlich bei Frappe-Routenwechseln neu anwenden.
	function hookRouter() {
		try {
			if (window.frappe && frappe.router && frappe.router.on) {
				frappe.router.on("change", function () {
					setTimeout(apply, 100);
				});
			}
		} catch (e) {
			/* ignore */
		}
	}

	function init() {
		var tries = 0;
		var timer = setInterval(function () {
			tries += 1;
			var done = apply();
			if (done && getConfig().label) {
				startObserver();
				hookRouter();
				clearInterval(timer);
			} else if (done || tries > 150) {
				clearInterval(timer);
			}
		}, 200);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
