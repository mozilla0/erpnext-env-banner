# ERPNext Env Banner

Kleine Frappe-/ERPNext-App, die im **Desk** sofort sichtbar macht, in welcher
Umgebung man arbeitet. Sie färbt die Navbar ein und zeigt ein zentriertes Label
(z. B. `PRODUKTIV`, `TEST`, `DEV`).

Die Konfiguration erfolgt **pro Site** über die `site_config.json` – die App
selbst muss nur einmal installiert werden und verhält sich auf jeder Site
unterschiedlich. Es werden keine Core-Dateien verändert, daher ist die Lösung
update-sicher.

> Hinweis zu den Namen: Das GitHub-Repository heisst `erpnext-env-banner`
> (mit Bindestrichen), der eigentliche App-/Python-Paketname ist
> `erpnext_env_banner` (mit Unterstrichen). Python-Module dürfen keine
> Bindestriche enthalten.

## Installation (eigene Bench)

```bash
cd ~/frappe-bench

# App in die Bench holen (Git-URL des Repos)
bench get-app erpnext_env_banner https://github.com/JokerIT/erpnext-env-banner.git

# Auf der gewünschten Site installieren
bench --site meine-site install-app erpnext_env_banner

# Assets bauen und Cache leeren
bench build --app erpnext_env_banner
bench --site meine-site clear-cache

# In Produktion zusätzlich:
bench restart
```

## Installation (Frappe Cloud)

1. Repo auf GitHub anlegen und Code hochladen.
2. In einer **Private Bench Group**: Apps → Add App → From GitHub → Repo wählen.
3. Deploy/Update bauen lassen, dann die Site auf die neue Bench-Version aktualisieren.
4. Auf der Site die App installieren (Site → Apps → Install).
5. Konfiguration siehe unten (über den Site-Config-Editor im Dashboard).

## Konfiguration pro Site

Pro Site die gewünschten Werte in die `site_config.json` setzen –
auf einer eigenen Bench am einfachsten mit `set-config`, auf Frappe Cloud über
den Site-Config-Editor im Dashboard:

```bash
# Produktivsystem (rot)
bench --site prod.joker-it.ch set-config environment_label "PRODUKTIV"
bench --site prod.joker-it.ch set-config environment_color "#c0392b"

# Testsystem (orange)
bench --site test.joker-it.ch set-config environment_label "TEST"
bench --site test.joker-it.ch set-config environment_color "#e67e22"

# Entwicklung (blau)
bench --site dev.joker-it.ch set-config environment_label "DEV"
bench --site dev.joker-it.ch set-config environment_color "#2980b9"
```

Anschliessend `clear-cache` und im Browser hart neu laden (Ctrl+Shift+R).

### Verfügbare Schlüssel

| Schlüssel                | Pflicht | Beschreibung                                   | Default     |
|--------------------------|---------|------------------------------------------------|-------------|
| `environment_label`      | ja      | Text in der Navbar. Ohne Wert bleibt alles aus | –           |
| `environment_color`      | nein    | Hintergrundfarbe der Navbar (CSS-Farbe)        | `#c0392b`   |
| `environment_text_color` | nein    | Textfarbe des Labels                           | `#ffffff`   |

> Ist `environment_label` nicht gesetzt (z. B. bewusst auf der Hauptsite),
> macht die App gar nichts – die Navbar bleibt im Standard.

## Deinstallation

```bash
bench --site meine-site uninstall-app erpnext_env_banner
```
