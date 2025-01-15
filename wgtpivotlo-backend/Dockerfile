# # https://stackoverflow.com/questions/27767264/how-to-dockerize-a-maven-project-how-many-ways-to-accomplish-it
# # Step 1: mvn clean and package into a .jar
# FROM maven:3.9.9-eclipse-temurin-23-alpine as builder
# WORKDIR /app
# COPY pom.xml .
# RUN mvn dependency:go-offline
# COPY src/ ./src/
# RUN mvn clean package -DskipTests=true

# # Step 2: Bring jar file from builder container into a prod container
# FROM eclipse-temurin:23-jre-alpine as prod
# RUN mkdir /app
# # Retrieve jar from builder
# COPY --from=builder /app/target/*.jar /app/app.jar
# #ENV SERVER_PORT=8080
# WORKDIR /app
# EXPOSE 8080
# ENTRYPOINT ["java","-jar","./app.jar"]

FROM eclipse-temurin:23-jre-alpine
COPY target/*.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]