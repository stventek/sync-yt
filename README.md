# Sync-YT 

Backend Application for Sync-YT Web App

##  About

Web app to watch youtube videos with others synchronously, includes:

- bulit-in chat.
- admin section.
- room based system.
- and more...

## How to run

- define the following env variables in a ```.env``` file in the root dir.
    - ACCESS_TOKEN_SECRET, JWT token secret
    - ENV, either PROD or LOCAL (default)
    - DB_CONNECTION_STRING, db connection string
- install dependencies, ```npm i```

## dev

- run development server, ```npm run dev```

## prod

- build static files, ```npm run build```
- start the server,  ```node ./build/index.js```

## Stack

- socket io, for bidirectional comuinication.
- postgresql, for perssiting admin information.
- JWT based authentication, as stateless authentication mechanism.
- express js, backend library.
- typescript, as programming language.
- sequelize, as ORM.
- and more... (check package.json for the complete list).
