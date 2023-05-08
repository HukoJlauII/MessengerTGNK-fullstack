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

FROM eclipse-temurin:17-jdk-alpine
#ENV ARTIFACT_NAME=MessengerTGNK-0.0.1-SNAPSHOT.jar
VOLUME /tmp
#ENV APP_HOME=/usr/app/

COPY MessengerTGNK-0.0.1-SNAPSHOT.jar /usr/app/

WORKDIR /usr/app/
#COPY $APP_HOME/build/libs/$ARTIFACT_NAME .
ENTRYPOINT ["java", "-jar" ,"MessengerTGNK-0.0.1-SNAPSHOT.jar"]
EXPOSE 8080
#CMD ["sh", "-c", "java -jar $ARTIFACT_NAME"]
