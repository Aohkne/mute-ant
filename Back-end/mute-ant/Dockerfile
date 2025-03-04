FROM openjdk:23-jdk-slim

ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar
COPY .env .env

# Load environment variables from .env
RUN export $(grep -v '^#' .env | xargs)

ENTRYPOINT ["java", "-jar", "/app.jar"]
