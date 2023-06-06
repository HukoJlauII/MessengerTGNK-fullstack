FROM amazoncorretto:17
ENV ARTIFACT_NAME=MessengerTGNK-0.0.1-SNAPSHOT.jar
ENV APP_HOME=/usr/app/
COPY ../backend/src/main/resources/MessengerTGNK-0.0.1-SNAPSHOT.jar ${APP_HOME}
WORKDIR $APP_HOME
EXPOSE 8080
ENTRYPOINT exec java -jar ${ARTIFACT_NAME}