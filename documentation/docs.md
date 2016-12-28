#Dokumentation zu Arrival App

##Verwendete Plug-Ins
###App (Cordova Plug-Ins)
- **Splashscreen** (https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/)
    Um den Splashscreen beim Appstart anzuzeigen
- **Geolocation** (https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-geolocation/)
    Um die Karte, die Standord-Markierungen und die Route zum Hauptscreen hinzuzufügen
- **Storage** (https://cordova.apache.org/docs/de/latest/cordova/storage/storage.html)
    Für die Speicherung von Benutzername, dem token (für Zugriff auf private routes im Backend) und verfügbare Kontake
    
###Backend
- **express** (https://www.npmjs.com/package/express)
    Um eine HTTP Rest API zu erstellen
- **body-parser** (https://www.npmjs.com/package/body-parser)
    Für das Senden von JSON files zu der Rest API
- **jsonwebtoken** (https://www.npmjs.com/package/jsonwebtoken)
    Zur Authentifizierung der User
- **nedb** (https://www.npmjs.com/package/nedb)
    Für die Speicherung der Kontakte in einer Datenbank
    
##Benutzung

###Neuen User Account hinzufügen
Beim dem ersten Start der App wird eine seperate Seite angezeigt, in die man den Benutzernamen eingeben muss.
Ist der eingegebene Benutzername schon gespeichert, öffnet sich eine Seite, in die das Passwort eingegeben werden kann.
Wenn der Name noch nicht bekannt ist öffnet sich die Regestrierungs-Seite in der man ein neues Passwort für den Benutzernamen wählen kann.

<img src="https://github.com/marcjako/ArrivalApp/blob/development/documentation/pictures/1.png" width="150">
<img src="https://github.com/marcjako/ArrivalApp/blob/development/documentation/pictures/2.png" width="150">
<img src="https://github.com/marcjako/ArrivalApp/blob/development/documentation/pictures/3.png" width="150">

###Neue Kontakte hinzufügen
Um einen neuen Kontakt zu der Kontakliste hinzuzufügen muss im Hauptscreen zuerst auf den "Kontaktliste anzeigen"-Button gedrückt werden. Danach öffnet sich eine neue Seite, welche die verfügbaren Kontakte anzeigt. Hier kann man jetzt entweder einen neuen Kontakt hinzufügen, oder man teilt direkt den Standort.

Wenn man einen neuen Kontakt hinzufügen möchte, wird man dazu aufgefordert den entsprechenden Namen in eine Texteingabe zu schreiben. Sofern der User im backend bekannt ist, wird er zur Kontaktliste hinzugefügt.

<img src="https://github.com/marcjako/ArrivalApp/blob/development/documentation/pictures/4.png" width="150">
<img src="https://github.com/marcjako/ArrivalApp/blob/development/documentation/pictures/5.png" width="150">
<img src="https://github.com/marcjako/ArrivalApp/blob/development/documentation/pictures/6.png" width="150">

###Standort teilen
Um seinen Standort freizugeben muss man in der Kontaktliste (wird durch den "Kontaktliste anzeigen"-Button im Hauptscreen geöffnet) einfach nur den ensprechenden Kontakt auswählen und im erscheinenden Kontextmenü auf "Standort freigeben" drücken.

<img src="https://github.com/marcjako/ArrivalApp/blob/feat_docs/documentation/pictures/sampleScreenshot.png" width="150">
<img src="https://github.com/marcjako/ArrivalApp/blob/feat_docs/documentation/pictures/sampleScreenshot.png" width="150">
<img src="https://github.com/marcjako/ArrivalApp/blob/feat_docs/documentation/pictures/sampleScreenshot.png" width="150">

##Projektstruktur

###Frontend (/app/src/)

**app/**
- **Services/backendService.ts** Service zur Kommunikation mit dem Backend
- **Services/locationService.ts** Service zur Überwachung der eigenen und der Position von Kontakten.
- **Services/mapService.ts** Service zur Steuerung der Google Map (Marker, Route)
- **app.component.ts** Beim ersten Start wird zur richtigen Seite navigiert.

**pages/**
- **firststart** Erster Start mit Eingabe des Benutzernamens.
- **login** Seite zum Einloggen falls der Account bereits existiert.
- **registration** Seite zum Registrieren für neue User.
- **home** Hauptseite mit Markern und Routen.
- **contacts** Kontaktliste
- **add-contact** Seite zum Hinzufügen neuer Kontakte.

###Backend (/backend/)
- **app.js** Server starten, Dateien einbinden
- **allow-cross-domain.js** erlaubt das Senden von jwt im Header bei cross-domains
- **db-connection.js** Verbindung zur Datenbank
- **public-routes.js** öffentlich Zugängliche Routen
- **authorization.js** überprüft das jwt auf Gültigkeit
- **private-routes.js** durch jwt geschützte Routen
- **secretkey.js** geheimer Schüssel (nicht im repo)

##Besonderes

###Kompatibilität
Nach aktuellem Stand ist ArrivalApp lauffähig auf Android und im Web.

###Token für Backend Access
Durch den token wird im Backend Zugriff auf die private routes gewährt. Er besteht aus einem geheimen key, um eine sichere Verbindung zu dem backend zu gewähren. Außerdem wird der username in verschlüsselter Form in dem token gespeichert, der von dem backend ausgelesen werden kann.

Um also auf alle routes des backend zugreifen zu können, braucht man den geheimen key.
