FROM openjdk:17-jdk-slim as builder

WORKDIR /app

COPY backend/gradlew backend/gradlew
COPY backend/gradle backend/gradle
COPY backend/build.gradle backend/settings.gradle backend/

# 종속성 캐싱을 위해 dependencies만 먼저 빌드
RUN cd backend && ./gradlew dependencies --no-daemon

COPY backend backend

RUN cd backend && ./gradlew clean bootJar --no-daemon

# 7. 멀티 스테이지 빌드
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY --from=builder /app/backend/build/libs/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
