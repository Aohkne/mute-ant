when u edited the file of FE run

```
docker build -t fe-mute-ant .
```

wait until they run sucessfully then run

```
docker run -p 3000:3000 --env-file .env --name fe-mute-container -v "${PWD}:/app" -v "/app/node_modules" fe-mute-ant
```

after that open docker and start the image

run docker build (first line) after each file edit
