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

	// Festes Label an document.body haengen (unabhaengig vom Layout).
	function mountBadge(cfg) {
		if (!document.body) return;
		if (!badgeEl) {
			badgeEl = document.createElement("div");
			badgeEl.id = "env-banner-badge";
		}
		if (badgeEl.textContent !== cfg.label) badgeEl.textContent = cfg.label;
		badgeEl.style.backgroundColor = cfg.color;
		badgeEl.style.color = cfg.textColor;
		if (!badgeEl.isConnected) document.body.appendChild(badgeEl);
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
		if (!document.body) return false;
		mountBadge(cfg);
		colorNavbar(cfg);
		return true;
	}

	// Beobachter: haengt das Label neu ein, wenn die v16-App-Oberflaeche es entfernt.
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
		// documentElement + subtree faengt auch das Ersetzen von body-Inhalten ab
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
