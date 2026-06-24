import frappe


def boot_session(bootinfo):
	"""Liest die Umgebungs-Konfiguration aus der site_config.json und
	stellt sie dem Desk-Frontend unter frappe.boot zur Verfuegung."""
	bootinfo.environment_label = frappe.conf.get("environment_label")
	bootinfo.environment_color = frappe.conf.get("environment_color") or "#c0392b"
	bootinfo.environment_text_color = frappe.conf.get("environment_text_color") or "#ffffff"
