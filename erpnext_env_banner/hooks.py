app_name = "erpnext_env_banner"
app_title = "ERPNext Env Banner"
app_publisher = "Joker IT AG"
app_description = "Zeigt im Desk einen farbigen Hinweis, in welcher Umgebung (Prod/Test/Dev) man gerade arbeitet."
app_email = "info@joker-it.ch"
app_license = "MIT"

# Wird im Desk auf jeder Seite geladen
app_include_js = "env_banner.bundle.js"
app_include_css = "env_banner.bundle.css"

# Konfig aus site_config.json an das Frontend (frappe.boot) durchreichen
extend_bootinfo = "erpnext_env_banner.boot.boot_session"
