FROM mysql:8

ARG MYSQL_ROOT_PASSWORD
ARG MYSQL_DATABASE
ARG MYSQL_USER
ARG MYSQL_PASSWORD

ENV MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD
ENV MYSQL_DATABASE=$MYSQL_DATABASE
ENV MYSQL_USER=$MYSQL_USER
ENV MYSQL_PASSWORD=$MYSQL_PASSWORD

# UTF-8 설정
RUN echo "[mysqld]\n\
    character-set-server=utf8mb4\n\
    collation-server=utf8mb4_unicode_ci\n\
    [client]\n\
    default-character-set=utf8mb4\n\
    [mysql]\n\
    default-character-set=utf8mb4" > /etc/mysql/conf.d/custom.cnf

# Timezone 설정
RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

EXPOSE 3306
CMD ["mysqld"]
