FROM openjdk:23 AS builder
WORKDIR /build
COPY . .
RUN ./gradlew build --no-daemon

FROM openjdk:23
WORKDIR /app
COPY --from=builder /build/build/libs/*.jar /app/app.jar
CMD ["java", "-jar", "app.jar"]