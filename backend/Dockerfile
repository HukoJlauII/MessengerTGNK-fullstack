#FROM gradle AS TEMP_BUILD_IMAGE
#ENV APP_HOME=/usr/app/
#WORKDIR $APP_HOME
#COPY build.gradle settings.gradle $APP_HOME
#
#COPY gradle $APP_HOME/gradle
#COPY --chown=gradle:gradle . /home/gradle/src
#USER root
#RUN chown -R gradle /home/gradle/src
#
#RUN gradle build || return 0
#COPY . .
#RUN gradle clean build

FROM openjdk:11-jdk-slim
ENV ARTIFACT_NAME=MessengerTGNK-0.0.1-SNAPSHOT.jar
ENV APP_HOME=/usr/app/

COPY MessengerTGNK-0.0.1-SNAPSHOT.jar $APP_HOME

WORKDIR $APP_HOME
#COPY $APP_HOME/build/libs/$ARTIFACT_NAME .

EXPOSE 8080
#CMD ["sh", "-c", "java -jar $ARTIFACT_NAME"]
ENTRYPOINT exec java -jar ${APP_HOME}/${ARTIFACT_NAME}