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

###Neuer User Account hinzufügen
Beim dem ersten Start der App wird eine seperate Seite angezeigt, in die man den Benutzernamen eingeben muss.
Ist der Benutzername schon gespeichert, öffnet sich eine Seite, in die man seine Passwort eintragen muss.
Wenn der Name noch nicht bekannt ist öffnet sich die Regestrierungs-Seite in der man ein neues Passwort wählen kann.

![Sample Screenshot](https://github.com/marcjako/ArrivalApp/documentation/pictures/sampleScreenshot.png)

###Neue Kontakte hinzufügen

##Besonderes

###Token für Backend Access
