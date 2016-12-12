#Dokumentation zu Arrival App

##Verwendete Plug-Ins
###App (Cordova Plug-Ins)
- **Splashscreen** (https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-splashscreen/)
    Um den Splashscreen beim Appstart anzuzeigen
- **Geolocation** (https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-geolocation/)
    Um die Karte, die Markierungen und die Route zum Hauptscreen hinzuzufügen
- **Storage** (https://cordova.apache.org/docs/de/latest/cordova/storage/storage.html)
    Für die Speicherung von Benutzername, dem token (für sicheren Zugriff auf backend) und verfügbare Kontake
    
###Backend
- **express** (https://www.npmjs.com/package/express)
    Um eine HTTP Rest API zu erstellen
- **body-parser** (https://www.npmjs.com/package/body-parser)
    Für das senden von JSON files zu der Rest API
- **jsonwebtoken** (https://www.npmjs.com/package/jsonwebtoken)
    Zur Authentifizierung der User
- **nedb** (https://www.npmjs.com/package/nedb)
    Für dich Speicherung der Kontakte in einer Datenbank
    
##Benutzung

###Neuen User Account hinzufügen
Beim dem ersten Start der App wird eine seperate Seite angezeigt, in die man den Benutzernamen eingeben muss.
Ist der Benutzername schon gespeichert, öffnet sich eine Seite, in die man seine Passwort eintragen muss.
Wenn der Name noch nicht bekannt ist öffnet sich die Regestrierungs-Seite in der man ein neues Passwort wählen kann.

<img src="https://github.com/marcjako/ArrivalApp/blob/feat_docs/documentation/pictures/sampleScreenshot.png" width="250">bla
<img src="https://github.com/marcjako/ArrivalApp/blob/feat_docs/documentation/pictures/sampleScreenshot.png" width="250">
<img src="https://github.com/marcjako/ArrivalApp/blob/feat_docs/documentation/pictures/sampleScreenshot.png" width="250">

###Neue Kontakte hinzufügen
Um einen neuen User zu der Kontakliste hinzuzufügen muss im Hauptscreen zuerst auf den "Kontaktliste anzeigen"-Button drücken. Danach öffnet sich eine neue Seite, die die verfügbaren Kontakte anzeigt. Hier kann man jetzt entweder einen neuen Kontakt hinzufügen, oder man teilt direkt den Standort.

Wenn man einen neuen Kontakt hinzufügen möchte, wird man dazu aufgefprdert den entsprechenden Namen in eine Texteingabe zu schreiben. Sofern der User im backend bekannt ist, wird er zur Kontaktliste hinzugefügt.

###Standort teilen
Um seinen Standort freizugeben muss man in der Kontaktliste (wir durch den "Kontaktliste anzeigen"-Button im Hauptscreen geöffnet) einfach nur den ensprechenden Kontakt anklicken und im erscheinenden Kontextmenü auf "Standort freigeben drücken."

##Besonderes

###Token für Backend Access
