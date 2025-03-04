### Install [Docker](https://www.docker.com/) + basic set up

### Ensure you have [Intelliji](https://www.jetbrains.com/idea/download/?section=windows) ultimate version + gradlew (java 23)

### Create a .env file

```
.env
```

### Add the following to the .env file

```
DB_NAME=mute-ant
DB_USERNAME=mute-ant
DB_PASSWORD=mute-ant
PGADMIN_DEFAULT_EMAIL=mute-ant@example.com
PGADMIN_DEFAULT_PASSWORD=mute-antpass
SWAGGER_URL=http://localhost:8080/swagger-ui.html

ACCESS_TOKEN_KEY=access_token_key
REFRESH_TOKEN_KEY=refresh_token_key
```

### Run the following command to start the application

```
docker compose -f compose.db.yaml --env-file .env -p mute-ant up -d
```

### Open docker and run all container name "mute-ant", then run "http://localhost:5050/login?next=/" and sign in with account in .env file

### Click to server (at the left corner) then register a server

In column General

- Name : mute-ant

then change to column Connection

- In column Connection

- Host name/ address : mute-ant_postgres

- Port : 5432 - Maintenace : mute-ant

- Username: mute-ant

- Password : mute-antpass

  click "save password?"
  then click save

If u want to see the table click
mute-ant -> schemas -> public -> tables

### At intelliji run icon db at the right sidebar, then click the icon "+" and find postgre with icon elephant -> exist popup

change

    - Name : mute-ant@localhost

In tab general

    - Host : localhost

    - User : mute-ant

    - password : mute-antpass

    - database : mute-ant

Then click test connection,
if have a green tick -> run -> apply -> OK
else a red x so it wrong check a field again or call me (LTPPPP) in group chat to help u config

then click the icon reload near the icon "+" at begin to import sync database

If you want see the database lick the arrow down of "public"

### Run API

```
./gradlew clean build --refresh-dependencies
```

then run the project in intelliji

### Build docker after each edit(remove the old one)

```
docker compose down
docker compose up --build -d
```

### Swagger UI

After run the project then enter this link to access swagger API

```
http://localhost:8080/api/v1/swagger-ui/index.html

```
