# homebridge-fritz-enhance - Fork von homebridge-fritz-new mit Homebridge-2-Fixes

> **ℹ️ Hinweis zu diesem Fork (`weigandf/homebridge-fritz-enhance`)**
>
> Dieses Repository ist ein Fork von [glowf1sh/homebridge-fritz-new](https://github.com/glowf1sh/homebridge-fritz-new).
> Dort fehlt leider noch der Fix für **Homebridge 2.0**. Dieser Fork enthält diesen Fix
> ([PR #19](https://github.com/glowf1sh/homebridge-fritz-new/pull/19) von [puneetdixit200](https://github.com/puneetdixit200)) sowie weitere Fixes und Updates
> (z. B. Energiedaten unter Homebridge 2 wieder lesbar, `onGet`/`onSet`-Handler, Lampen-Unterstützung, Entfernung von `lodash.get`).
>
> Der Fork wird nur so lange genutzt, bis die Änderungen im Original-Repository verfügbar sind.
>
> **Installation:** In der Homebridge-Oberfläche unter *Plugins* nach **`homebridge-fritz-enhance`** suchen und installieren
> (oder `npm install homebridge-fritz-enhance`).
>
> **Umstieg von `homebridge-fritz-new`:** Das Paket heißt hier `homebridge-fritz-enhance`. Vorher
> `homebridge-fritz-new` deinstallieren. Die Konfiguration (`"platform": "FRITZ!Box"`) bleibt gleich. Da Homebridge
> Accessories pro Plugin-Name speichert, werden die Geräte einmalig neu angelegt – Raumzuordnungen und
> Automationen in der Home-App ggf. neu setzen.

> **Version 1.1.0 (Fork)** – Homebridge 1.x und 2.x, Lampen-Unterstützung, Energiedaten unter Homebridge 2 – siehe [CHANGELOG](CHANGELOG.md).

## ✅ Produktionsstatus Version 1.0.76

**Offiziell stabil und produktionsreif für:**
- 🌡️ **FRITZ!DECT 301 Heizkörperregler** - Sofortige Temperaturänderungen, OFF-Mode, Batterieanzeige
- 🔌 **FRITZ!DECT 200 Steckdosen** - Schaltbare Steckdosen mit vollständiger Leistungsmessung:
  - ⚡ **Aktuelle Leistung** in Watt (wird alle 2 Minuten aktualisiert)
  - 📈 **Gesamtverbrauch** in kWh seit Inbetriebnahme
  - 🔋 **Netzspannung** in Volt
  - 🌡️ **Temperatur** am Gerät
  - ℹ️ **Hinweis**: Energiedaten sind nur in Apps wie Eve sichtbar, nicht in Apple Home (siehe FAQ)
- 📡 **Gäste-WLAN** - Ein/Aus-Schaltung
- 💡 **Alle FRITZ! Smart Home Geräte** mit HomeKit-Integration

**Gelöste Probleme in v1.0.76:**
- ✅ Thermostate reagieren jetzt sofort (keine 2-3 Minuten Wartezeit mehr)
- ✅ OFF-Mode wird korrekt in HomeKit angezeigt
- ✅ Batteriestatus für alle Thermostate sichtbar
- ✅ Konsistente Performance für alle Gerätetypen

## ⚠️ WARUM DIESER FORK EXISTIERT

> **Das originale NPM-Paket `homebridge-fritz` von @andig wird seit Jahren nicht mehr gepflegt!**  
> Letzte Aktivität: 2019 • 22 bekannte Sicherheitslücken • Keine Reaktion auf Issues/PRs
> 
> **Dieses Repository `homebridge-fritz-new` ist ein aktiv gewarteter Fork mit:**
> - ✅ Alle 24 Sicherheitslücken behoben (0 Vulnerabilities) - Stand v1.0.46
> - ✅ Kompatibilität mit aktuellen Node.js/Homebridge Versionen
> - ✅ Regelmäßige Updates und Support
> - ✅ Aktive Community-Betreuung
> - 🚀 **Deutlich höhere Performance**: Fritz!Box wird nicht mehr mit ständigen Anfragen überlastet
> - ⚡ **Intelligentes Request-Management**: Priority Queue und Request-Limiting schützen die Fritz!Box
> - 🔧 **Robuste Fehlerbehandlung**: Keine Abstürze mehr durch UnhandledPromiseRejections

### 🚀 Installation des neuen Pakets:

```bash
# Homebridge UI: Plugins → nach "homebridge-fritz-enhance" suchen
# oder per Terminal:
npm install homebridge-fritz-enhance
```

### Alternative Installation über Git:

```bash
# In Homebridge node_modules Verzeichnis wechseln
cd /var/lib/homebridge/node_modules

# Repository klonen
git clone https://github.com/glowf1sh/homebridge-fritz-new.git
cd homebridge-fritz-new

# Dependencies installieren
npm install

# Package erstellen
npm pack

# Installation (wähle eine Methode):

# Standard NPM:
npm install -g ./homebridge-fritz-new-*.tgz

# Homebridge-Service:
npm --prefix "/var/lib/homebridge" install ./homebridge-fritz-new-*.tgz

# hb-service:
hb-service add ./homebridge-fritz-new-*.tgz
```

📚 **[Detaillierte Installationsanleitung](INSTALLATION.md)** mit allen Methoden und Troubleshooting

---

[![npm version](https://img.shields.io/npm/v/homebridge-fritz-new.svg)](https://www.npmjs.com/package/homebridge-fritz-new)
[![npm downloads](https://img.shields.io/npm/dt/homebridge-fritz-new.svg)](https://www.npmjs.com/package/homebridge-fritz-new)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen.svg)](https://nodejs.org)
[![Homebridge Version](https://img.shields.io/badge/homebridge-%3E%3D1.3.0-brightgreen.svg)](https://homebridge.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Security](https://img.shields.io/badge/vulnerabilities-0-brightgreen.svg)](https://github.com/glowf1sh/homebridge-fritz-new/security)
[![Build Status](https://github.com/glowf1sh/homebridge-fritz-new/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/glowf1sh/homebridge-fritz-new/actions/workflows/npm-publish.yml)
[![Last Commit](https://img.shields.io/github/last-commit/glowf1sh/homebridge-fritz-new.svg)](https://github.com/glowf1sh/homebridge-fritz-new/commits/master)
[![GitHub Stars](https://img.shields.io/github/stars/glowf1sh/homebridge-fritz-new.svg?style=social)](https://github.com/glowf1sh/homebridge-fritz-new/stargazers)
[![Dependencies](https://img.shields.io/badge/dependencies-6-brightgreen.svg)](https://github.com/glowf1sh/homebridge-fritz-new/blob/master/package.json)
[![Actively Maintained](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/glowf1sh/homebridge-fritz-new/graphs/commit-activity)

> **Dieser Fork ersetzt das veraltete [homebridge-fritz](https://github.com/andig/homebridge-fritz) Paket**, welches seit 2019 nicht mehr gewartet wird und 22 kritische Sicherheitslücken enthält.

> **WICHTIGER HINWEIS**: Dies ist ein aktiv gewarteter Fork mit allen Sicherheitsupdates und Bugfixes!

## 🔄 MIGRATION VOM ALTEN PAKET

### Schritt 1: Altes Paket deinstallieren
```bash
# Falls das alte homebridge-fritz installiert ist:
npm uninstall -g homebridge-fritz
```

### Schritt 2: Neues Paket installieren
```bash
npm install -g homebridge-fritz-new
```

### Schritt 3: Homebridge neustarten
```bash
sudo systemctl restart homebridge
# oder
homebridge
```

**Wichtig:** Die Konfiguration bleibt unverändert! Alle Einstellungen funktionieren weiterhin.

## 🎨 Installation mit Homebridge Config UI X

Wenn Sie Homebridge Config UI X verwenden:

1. Öffnen Sie die Homebridge Web-Oberfläche
2. Gehen Sie zu "Plugins" 
3. Suchen Sie nach `homebridge-fritz-new`
4. Klicken Sie auf "Install"
5. Nach der Installation: Homebridge neustarten

**Hinweis:** Falls das alte `homebridge-fritz` installiert ist, deinstallieren Sie es zuerst!

## 🎯 Produktionsstabilität erreicht!

**Mit Version 1.0.43 haben wir endlich volle Stabilität erreicht:**
- ✅ Keine UnhandledPromiseRejections mehr
- ✅ Keine Session-Errors oder ständige Re-Authentifizierungen
- ✅ Fritz!Box wird nicht mehr überlastet durch zu viele parallele Anfragen
- ✅ Robuste Fehlerbehandlung in allen Komponenten
- ✅ Optimierte Performance durch intelligentes Request-Management

## 📚 Versionshistorie

## 🎆 Was ist neu in Version 1.0.76?

### 📄 Dokumentations-Update
- **NPM-Synchronisation**: Dokumentation mit NPM-Release vereinheitlicht
- **Cleanup**: Unnötige Release-Notes-Dateien entfernt
- **Produktionsstatus**: Version 1.0.76 als aktueller Stable Release markiert
- **Keine Code-Änderungen**: Nur Dokumentation aktualisiert

## 🎆 Was ist neu in Version 1.0.75?

### 📚 FAQ-Bereich für Energiemessung hinzugefügt
- **Neue FAQ**: "Warum sehe ich die Watt-Anzeige nicht in Apple Home?"
- **Klarstellung**: Apple Home zeigt nur Standard-HomeKit-Funktionen
- **Lösung**: Eve App zeigt alle Energiedaten (Watt, kWh, Volt)
- **Dokumentation**: Vollständige Erklärung für FRITZ!DECT 200 Nutzer

## 🎆 Was ist neu in Version 1.0.74?

### 🔌 FRITZ!DECT 200 Leistungsmessung dokumentiert
- **Vollständige Energiedaten**: Leistung (W), Verbrauch (kWh), Spannung (V)
- **Automatische Updates**: Werte werden alle 2 Minuten von der FRITZ!Box aktualisiert
- **HomeKit Integration**: Als Custom Characteristics in der Home App sichtbar
- **API Unterstützung**: getswitchpower, getswitchenergy aus der AHA-HTTP-API

## 🎆 Was ist neu in Version 1.0.73? - FINALE STABLE RELEASE

### 🎆 Produktionsreife Version mit allen Fixes

**Zusammenfassung aller Lösungen:**
- ✅ **Sofortige Reaktion**: Alle Schaltbefehle mit Priority (keine 2-3 Min Wartezeit)
- ✅ **Performance**: 4x schnellere Reaktionszeit (50ms/25ms statt 200ms/100ms)
- ✅ **OFF Mode**: Funktioniert korrekt in HomeKit
- ✅ **Batterieanzeige**: Für alle FRITZ!DECT 301 Thermostate
- ✅ **Keine Fehler**: Keine UnhandledPromiseRejections oder Session-Errors

**Getestete Geräte:**
- 🌡️ FRITZ!DECT 301 Heizkörperregler
- 🔌 FRITZ!DECT 200 Steckdosen mit Leistungsmesser
- 📡 Gäste-WLAN Steuerung

**Technische Details:**
- Thermostat-Commands mit `priority: 10`
- Request-Interval: 50ms, Queue-Delay: 25ms
- OFF Mode aktualisiert nur Heating States
- Batterie-Info aus XML statt API

## 🛠️ Was ist neu in Version 1.0.63?

### 🛠️ Kritische Startup-Fixes
- **Keine falschen Offline-Warnungen**: Beim Start werden Geräte nicht mehr fälschlich als offline erkannt
- **Offline-Status Logging**: Nur noch bei tatsächlichen Statusänderungen
- **getCurrentTemperature**: Keine Offline-Prüfung mehr (verhindert Fehler beim Start)
- **isOffline Flag**: Speichert Offline-Status für bessere Kontrolle

## 🔋 Was ist neu in Version 1.0.62?

### 🔋 Batterie-Warnung Fix
- **Erste Warnung garantiert**: Kritische Batterie wird beim ersten Check gewarnt
- **Logging verbessert**: Debug-Log für normale Batterie (≥80%) beim Start

## 🔧 Was ist neu in Version 1.0.61?

### 🔧 Bugfixes und Verbesserungen
- **StatusFault entfernt**: Nur noch StatusActive (HomeKit-konform)
- **Keine doppelten Batterie-Warnungen**: Intelligentes Logging nur bei Änderungen
- **Bessere Initialisierung**: Keine Fehler mehr beim Start
- **Offline-Status**: Nur StatusActive wird auf false gesetzt

## 🔴 Was ist neu in Version 1.0.60?

### 🔴 Offline-Geräte besser kenntlich
- **StatusFault bei Offline**: Zeigt Fehler-Symbol in HomeKit bei offline Geräten
- **StatusActive Characteristic**: Zeigt aktiv/inaktiv Status in HomeKit
- **Kritische Batterie-Warnung**: Bei ≤5% wird StatusFault gesetzt
- **Temperatur-Fehler bei Offline**: Wirft Fehler wenn offline Gerät abgefragt wird
- **Erweiterte Logs**: Warnt bei offline Geräten und kritischer Batterie

## 🐛 Was ist neu in Version 1.0.59?

### 🐛 BatteryService vollständig gefixt
- **Alle Thermostate zeigen Batterie**: Kompletter Fix für HomeKit Batterieanzeige
- **Initial Values gesetzt**: updateValue() für BatteryLevel und StatusLowBattery
- **Startup Query**: Batterie wird direkt beim Start abgefragt

## 🐛 Was ist neu in Version 1.0.58?

### 🐛 BatteryService Fix für Thermostate
- **Fehlende Batterieanzeige behoben**: Gecachte Thermostate zeigen jetzt Batterie an
- **Automatische Reparatur**: Fehlende BatteryServices werden ergänzt
- **updateAccessoryServices**: Prüft jetzt auch Thermostate
- **Hinweis**: Version 1.0.57 übersprungen wegen NPM Konflikt

## 🐛 Was ist neu in Version 1.0.56?

### 🐛 Thermostat Command-Delay Fix
- **Debouncing entfernt**: Befehle werden sofort ohne Verzögerung ausgeführt
- **HomeKit UI**: Temperatur-Slider springt nicht mehr zurück
- **Command Queue**: Funktioniert jetzt korrekt mit sofortiger Ausführung

## 🔥 Was ist neu in Version 1.0.55?

### 🔥 Critical Thermostat Fixes
- **OFF-Befehl korrigiert**: Verwendet jetzt korrekt "253" statt "off" für FRITZ!DECT Thermostate
- **Temperatur-Limits**: Strikte Einhaltung von 8-28°C Bereich
- **Command Queue**: Rate-Limiting mit 100ms Verzögerung zwischen Befehlen
- **Batterie-Status**: Implementiert via getdeviceinfos XML-API
- **Session Auto-Relogin**: Automatische Neuanmeldung bei 403-Fehlern

## ⚡ Was ist neu in Version 1.0.54?

### ⚡ HomeKit Performance Fix
- **Massiver Performance-Boost**: HomeKit reagiert jetzt sofort auf Befehle
- **Keine UI-Freezes mehr**: Callbacks werden sofort aufgerufen
- **Verbesserte User Experience**: Schalter und Thermostate reagieren ohne Verzögerung

## 🔥 Was ist neu in Version 1.0.53?

### 🔥 Thermostat OFF/ON Fix
- **OFF/ON Modi**: String-Parameter "off"/"on" werden korrekt behandelt
- **Erweiterte Logs**: Zeigen alle Parameter und Fehlerdetails
- **HTTP 500 Fehler**: Bessere Fehlerbehandlung bei ungültigen Befehlen

## 🔋 Was ist neu in Version 1.0.64?

### 🔋 Thermostat Batterie-Fix
- **Batterie-Anzeige repariert**: Alle Thermostate zeigen jetzt Batterie in HomeKit
- **XML-basierte Abfrage**: Batterie-Daten kommen direkt aus XML statt fehlerhafter API-Calls
- **Offline-Geräte**: Zeigen weiterhin gecachte Batterie-Werte an

## 🎯 Was ist neu in Version 1.0.52?

### 🎯 Kritischer Thermostat-Fix
- **Temperatur-Konvertierung repariert**: OFF/ON Modi funktionieren wieder
- **String/Number Handling**: Robuste Behandlung verschiedener Formate
- **NaN-Fehler behoben**: Keine "NaN" Werte mehr bei Temperaturänderungen

## 🔧 Was ist neu in Version 1.0.51?

### 🔧 Thermostat-Bugfix
- **NaN-Fehler behoben**: Temperaturwerte werden korrekt umgewandelt
- **Dezimalwerte unterstützt**: Komma und Punkt als Dezimaltrennzeichen
- **Robuste Konvertierung**: String zu Number mit Fehlerbehandlung

## 🔍 Was ist neu in Version 1.0.50?

### 🔍 Debug-Verbesserungen für Thermostate
- **Erweiterte Debug-Logs**: Zeigt exakte API-Parameter
- **Fehlerdetails**: Bei HTTP 500 Fehlern werden mehr Details geloggt
- **API-Debugging**: Zeigt AIN, Temperatur und umgerechnete Parameter

## 🌡️ Was ist neu in Version 1.0.49?

### 🌡️ Thermostat-Verbesserungen
- **Temperatur-Logging**: Zeigt eingestellte Temperatur im Log
- **Erfolgsmeldungen**: Bestätigung wenn Temperatur gesetzt wurde
- **Bessere Fehlerbehandlung**: Detaillierte Fehlermeldungen

## 🐛 Was ist neu in Version 1.0.48?

### 🐛 Bugfix für Polling-Konfiguration
- **config.interval Fix**: Verwendet korrekt konfigurierten Wert
- **Default-Werte**: Sinnvolle Defaults wenn keine Konfiguration
- **Polling-Intervalle**: Respektiert Benutzer-Einstellungen

## 🚀 Was ist neu in Version 1.0.47?

### 🚀 Performance & Stabilitäts-Update
- **Optimierte Polling-Intervalle**: Angepasst für bessere Performance
- **Reduzierte API-Last**: Weniger häufige Abfragen
- **Batterie-Polling**: Nur noch alle 15 Minuten

## 🔒 Was ist neu in Version 1.0.46?

### 🔒 Sicherheitsupdate
- **Alle Sicherheitslücken behoben**: 0 bekannte Vulnerabilities
- **Dependencies aktualisiert**: Alle Pakete auf neueste Versionen
- **Audit Clean**: npm audit zeigt keine Probleme

[Weitere Versionen siehe CHANGELOG.md]

## 📖 Konfiguration

Am einfachsten über die **Homebridge-Oberfläche** (Plugin-Einstellungen) – das Plugin bringt eine `config.schema.json` mit.
Alternativ direkt in der `config.json`:

```json
{
    "platform": "FRITZ!Box",
    "name": "FRITZ!Box",
    "username": "IhrFritzBoxBenutzername",
    "password": "IhrFritzBoxPasswort",
    "url": "http://fritz.box",
    "timeout": 15000,
    "interval": 60,
    "debug": false,
    "polling": {
        "discovery": 300000,
        "switchStates": 3000,
        "sensorData": 10000,
        "batteryStatus": 900000
    },
    "devices": {
        "wifi": { "display": true, "name": "Guest WLAN" },
        "087610000434": { "display": false }
    }
}
```

### Konfigurations-Optionen

| Option | Typ | Standard | Beschreibung |
|--------|-----|----------|--------------|
| `username` | string | *Pflicht* | FRITZ!Box-Benutzername (benötigt Smart-Home-Rechte) |
| `password` | string | *Pflicht* | FRITZ!Box-Passwort |
| `url` | string | `http://fritz.box` | FRITZ!Box-URL (`http://` oder `https://`) |
| `timeout` | number | `15000` | Timeout für Anfragen an die FRITZ!Box (ms) |
| `interval` | number | `60` | Abfrageintervall (Sekunden) für Thermostate, Temperatur-/Kontaktsensoren, Taster und Gäste-WLAN |
| `debug` | boolean | `false` | Vollständige API-Antworten bei Fehlern loggen |
| `polling` | object | siehe unten | Polling-Intervalle |
| `devices` | object | `{}` | Gerätespezifische Einstellungen, siehe unten |

### Polling-Intervalle (in Millisekunden)

| Option | Standard | Minimum | Beschreibung |
|--------|----------|---------|--------------|
| `discovery` | 300000 | 1000 | Erkennung neuer/entfernter Geräte |
| `switchStates` | 3000 | 1000 | Schaltzustände der Steckdosen |
| `sensorData` | 10000 | 1000 | Temperatur- und Energiedaten |
| `batteryStatus` | 900000 | 1000 | Batteriestatus der Thermostate |

### Gerätespezifische Einstellungen (`devices`)

Geräte werden über ihre **AIN** angesprochen (zu finden in der FRITZ!Box unter *Smart Home → Gerät bearbeiten*) – **ohne Leerzeichen**, z. B. `"087610000434"` für die AIN `08761 0000434`.

| Schlüssel | Option | Standard | Beschreibung |
|-----------|--------|----------|--------------|
| `<AIN>` | `display` | `true` | Gerät in HomeKit anzeigen |
| `<AIN>` | `TemperatureSensor` | `true` | Temperatursensor anlegen (Steckdosen und eigenständige Sensoren) |
| `<AIN>` | `ContactSensor` | `true` | Kontakt-/Alarmsensor anlegen |
| `<AIN>` | `invert` | `false` | Zustand des Kontakt-/Alarmsensors invertieren |
| `wifi` | `display` | `true` | Gäste-WLAN-Schalter anzeigen |
| `wifi` | `name` | `Guest WLAN` | Name des Gäste-WLAN-Schalters |
| `wifi` | `tr64Fallback` | `false` | TR-064 als Fallback für das Gäste-WLAN |
| `wifi` | `tr64Port` | `49443` | TR-064-Port |
| `wifi` | `tr64Ssl` | `true` | TR-064 über HTTPS |

> Hinweis: Pro Homebridge-Instanz wird **eine** FRITZ!Box unterstützt.

## 🔌 Unterstützte Geräte

- **FRITZ!DECT 200/210, FRITZ!Powerline 546E**: Schaltbare Steckdose mit Energiemessung (Leistung, Verbrauch, Spannung – sichtbar z. B. in der Eve-App) und Temperatursensor
- **FRITZ!DECT 300/301/302, Comet DECT**: Heizkörperthermostate inkl. Batteriestatus
- **Temperatursensoren** (z. B. FRITZ!DECT 440, Geräte mit Temperaturfunktion)
- **Tür-/Fensterkontakte & Alarmsensoren** (z. B. FRITZ!DECT 350, HAN-FUN)
- **Taster** (FRITZ!DECT 400/440)
- **Lampen** (FRITZ!DECT 500, HAN-FUN-Leuchten): Ein/Aus und Helligkeit
  (basierend auf [PR #17](https://github.com/glowf1sh/homebridge-fritz-new/pull/17) von [BeastiW](https://github.com/BeastiW))
- **Gäste-WLAN**: Ein-/Ausschalten

### ❌ Noch nicht unterstützt

- Farbe und Farbtemperatur bei Lampen (nur Ein/Aus und Helligkeit)
- Rollladensteuerung (z. B. Rademacher RolloTron) – wird erkannt, aber nicht in HomeKit angelegt

## 🔍 Fehlerbehebung

### Häufige Probleme

**1. "Wrong user credentials" Fehler**
- Prüfen Sie Benutzername und Passwort
- Stellen Sie sicher, dass der Benutzer Smart-Home-Rechte hat
- Prüfen Sie ob die Fritz!Box erreichbar ist

**2. Geräte werden nicht gefunden**
- Smart Home muss in der Fritz!Box aktiviert sein
- Geräte müssen in der Fritz!Box angemeldet sein
- Führen Sie einen Neustart von Homebridge durch

**3. Thermostat zeigt falsche Temperatur**
- Prüfen Sie die Kalibrierung in der Fritz!Box
- Stellen Sie sicher, dass das Gerät online ist

### Debug-Modus

Für erweiterte Fehlersuche:

```json
{
    "platform": "FRITZ!Box",
    "username": "admin",
    "password": "password",
    "debug": true
}
```

## 🤝 Beitragen

Beiträge sind willkommen! Bitte beachten Sie:

1. Fork das Repository
2. Feature Branch erstellen (`git checkout -b feature/AmazingFeature`)
3. Änderungen committen (`git commit -m 'Add some AmazingFeature'`)
4. Branch pushen (`git push origin feature/AmazingFeature`)
5. Pull Request öffnen

### Code-Standards
- ESLint-Regeln befolgen
- Tests für neue Features schreiben
- Dokumentation aktualisieren
- Semantic Versioning beachten

### Tests ausführen
```bash
npm test
npm run lint
npm run coverage
```

## ❓ FAQ - Häufig gestellte Fragen

### Warum sehe ich die Watt-Anzeige nicht in Apple Home?

Apple's Home App zeigt bewusst nur Standard-HomeKit-Funktionen. Für FRITZ!DECT 200 Steckdosen bedeutet das:

**In Apple Home sichtbar:**
- ✅ Ein/Aus-Schalter
- ✅ Status (an/aus)

**Nur in Eve App (oder ähnlichen) sichtbar:**
- ⚡ Aktuelle Leistung in Watt
- 📈 Energieverbrauch in kWh
- 🔋 Spannung in Volt
- 📊 Verlaufsgraphen

**Empfehlung**: Installieren Sie die kostenlose [Eve App](https://apps.apple.com/app/eve-for-homekit/id917695792) für vollständige Energiedaten. Die Eve App zeigt ALLE Daten, auch Custom Characteristics wie Leistungsmessung.

### Warum dauerte die Temperaturänderung früher so lange?

Bis Version 1.0.69 mussten Thermostat-Befehle in einer Queue warten. Seit v1.0.70 haben alle Schaltbefehle Priority und werden sofort ausgeführt.

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 🙏 Credits

### Original-Autor
- Andreas Goetz ([@andig](https://github.com/andig)) - Ursprünglicher Entwickler von homebridge-fritz

### Fork-Maintainer
- glowf1sh ([@glowf1sh](https://github.com/glowf1sh)) - Aktueller Maintainer von homebridge-fritz-new

### Contributors
- Alle [Contributors](https://github.com/glowf1sh/homebridge-fritz-new/graphs/contributors) die zu diesem Fork beigetragen haben

### Besonderer Dank
- Homebridge Community für das großartige Framework
- AVM für die FRITZ!Box APIs
- Alle Nutzer die Bugs melden und Features vorschlagen

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/glowf1sh/homebridge-fritz-new/issues)
- **Discussions**: [GitHub Discussions](https://github.com/glowf1sh/homebridge-fritz-new/discussions)
- **NPM**: [npmjs.com/package/homebridge-fritz-new](https://www.npmjs.com/package/homebridge-fritz-new)

## 🔗 Links

- [Homebridge](https://homebridge.io)
- [FRITZ!Box](https://avm.de/produkte/fritzbox/)
- [Original homebridge-fritz](https://github.com/andig/homebridge-fritz) (veraltet)
- [NPM Package](https://www.npmjs.com/package/homebridge-fritz-new)

---

**Hinweis**: Dies ist ein Community-Fork und steht in keiner Verbindung zu AVM GmbH.