### Create a .env file ###

```
.env
```

### Add the following to the .env file ###
```
DB_NAME=mute-ant
DB_USERNAME=mute-ant
DB_PASSWORD=mute-antpass
PGADMIN_DEFAULT_EMAIL=mute-ant@example.com
PGADMIN_DEFAULT_PASSWORD=pmute-antass
SWAGGER_URL=http://localhost:8080/swagger-ui.html

ACCESS_TOKEN_KEY=access_token_key
REFRESH_TOKEN_KEY=refresh_token_key
```

### Run the following command to start the application ###
``` 
docker compose -f compose.db.yaml --env-file .env -p mute-ant up -d
```

### Swagger UI ###
```
http://localhost:8080/api/v1/swagger-ui/index.html
```

### dependencies ###
```
./gradlew clean build --refresh-dependencies
```
