# ── STAGE 1: Build the Spring Boot app ─────────────────────
# We use a Maven image that already has Java 21 — no need to install it
FROM maven:3.9.6-eclipse-temurin-21 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy pom.xml first — Docker caches this layer
# If pom.xml hasn't changed, Maven won't re-download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Now copy the source code
COPY src ./src

# Build the JAR file, skip tests for speed
RUN mvn clean package -DskipTests spring-boot:repackage

# ── STAGE 2: Run the app ────────────────────────────────────
# Use a smaller image just for running — don't need Maven anymore
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy only the built JAR from Stage 1
COPY --from=builder /app/target/*.jar app.jar

# Tell Docker this container listens on port 8080
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]