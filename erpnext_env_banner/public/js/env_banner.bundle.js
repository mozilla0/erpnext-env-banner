/* ===== ENV BANNER v10 (bundled) ===== */
(function () {
	"use strict";
	console.log("[env-banner] script geladen (v10, bundled)");

	var barEl = null, reattaching = false, titleTagged = false, loggedOnce = false;

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
		if (document.title.indexOf(prefix) !== 0) document.title = prefix + document.title;
		titleTagged = true;
	}

	function mountBar(cfg) {
		if (!document.body) return;
		if (!barEl) {
			barEl = document.createElement("div");
			barEl.id = "env-banner-bar";
		}
		if (barEl.textContent !== cfg.label) barEl.textContent = cfg.label;
		barEl.style.backgroundColor = cfg.color;
		barEl.style.color = cfg.textColor;
		if (!barEl.isConnected) document.body.appendChild(barEl);
	}

	function positionBar() {
		if (!barEl || !barEl.isConnected) return;
		barEl.style.left = "0px";
		barEl.style.top = "0px";
		var r = barEl.getBoundingClientRect();
		barEl.style.left = 0 - r.left + "px";
		barEl.style.top = 0 - r.top + "px";
		barEl.style.width = window.innerWidth + "px";
	}

	function apply() {
		if (!(window.frappe && frappe.boot)) return false;
		var cfg = getConfig();
		if (!cfg.label) {
			if (!loggedOnce) { console.log("[env-banner] boot da, aber KEIN environment_label"); loggedOnce = true; }
			return true;
		}
		if (!document.body) return false;
		tagTitle(cfg);
		mountBar(cfg);
		positionBar();
		if (!loggedOnce) { console.log("[env-banner] Balken aktiv:", cfg.label); loggedOnce = true; }
		return true;
	}

	function startObserver() {
		if (!window.MutationObserver) return;
		var obs = new MutationObserver(function () {
			if (reattaching || !(window.frappe && frappe.boot)) return;
			var cfg = getConfig();
			if (!cfg.label) return;
			if (!barEl || !barEl.isConnected) {
				reattaching = true; mountBar(cfg); positionBar(); reattaching = false;
			} else { positionBar(); }
		});
		obs.observe(document.documentElement, { childList: true, subtree: true });
	}

	function hookEvents() {
		window.addEventListener("resize", positionBar);
		try {
			if (window.frappe && frappe.router && frappe.router.on) {
				frappe.router.on("change", function () { setTimeout(apply, 150); });
			}
		} catch (e) {}
	}

	function init() {
		var tries = 0;
		var timer = setInterval(function () {
			tries += 1;
			var done = apply();
			if (done && getConfig().label) { startObserver(); hookEvents(); clearInterval(timer); }
			else if (done || tries > 150) { clearInterval(timer); }
		}, 200);
	}

	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
	else init();
})();
