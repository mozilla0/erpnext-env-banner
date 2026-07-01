(function () {
	"use strict";

	var badgeEl = null;
	var reattaching = false;
	var titleTagged = false;

	function getConfig() {
		var boot = (window.frappe && frappe.boot) || {};
		return {
			label: boot.environment_label,
			color: boot.environment_color || "#c0392b",
			textColor: boot.environment_text_color || "#ffffff",
		};
	}

	function tagTitle(cfg) {
		if (titleTagged) return;
		var prefix = "[" + cfg.label + "] ";
		if (document.title.indexOf(prefix) !== 0) {
			document.title = prefix + document.title;
		}
		titleTagged = true;
	}

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

	// Misst die reale Position und korrigiert aufs Fensterzentrum,
	// auch wenn ein Vorfahre ein CSS-transform hat.
	function positionBadge() {
		if (!badgeEl || !badgeEl.isConnected) return;
		badgeEl.style.left = "0px";
		badgeEl.style.top = "0px";
		var r = badgeEl.getBoundingClientRect();
		var targetLeft = Math.max(0, (window.innerWidth - r.width) / 2);
		badgeEl.style.left = targetLeft - r.left + "px";
		badgeEl.style.top = 0 - r.top + "px";
	}

	function colorNavbar(cfg) {
		var navbar = document.querySelector(".navbar");
		if (navbar && navbar.dataset.envBannerApplied !== cfg.label) {
			navbar.style.backgroundColor = cfg.color;
			navbar.style.borderBottom = "none";
			navbar.dataset.envBannerApplied = cfg.label;
		}
	}

	function apply() {
		if (!(window.frappe && frappe.boot)) return false;
		var cfg = getConfig();
		if (!cfg.label) return true;
		if (!document.body) return false;
		tagTitle(cfg);
		mountBadge(cfg);
		positionBadge();
		colorNavbar(cfg);
		return true;
	}

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
				positionBadge();
				reattaching = false;
			} else {
				positionBadge();
			}
			colorNavbar(cfg);
		});
		obs.observe(document.documentElement, { childList: true, subtree: true });
	}

	function hookEvents() {
		window.addEventListener("resize", positionBadge);
		try {
			if (window.frappe && frappe.router && frappe.router.on) {
				frappe.router.on("change", function () {
					setTimeout(apply, 150);
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
				hookEvents();
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
