# Node.js backend for Arrival App

### Routes

- **POST** /newUser
    body for posting a new user:
    `{ 
    	"id": #STRING, 
    	"location": {"long": #INT, "lat": #INT},
    	"access": #STRING,
    	"pushid": #STRING
    }`
    
    
- **GET** /getLocation/:id
    _:id_ is user id as #STRING
    
    
- **GET** /getPushid/:id
    _:id_ is user id as #STRING
    
    
- **POST** /giveAccess
    body for giving fromID user access to toID user:
    `{ 
    	"fromID": #STRING, 
    	"toID": #STRING
    }`

### Install

`npm install`

### Run

`node app.js`