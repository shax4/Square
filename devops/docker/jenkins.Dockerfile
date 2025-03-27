FROM jenkins/jenkins:lts

USER root

# 필수 패키지 설치 (Docker, Git, Curl 등)
RUN apt-get update && apt-get install -y \
    sudo \
    curl \
    git \
    openjdk-17-jdk \
    docker.io \
    iputils-ping \
    net-tools

# docker-compose 설치
RUN curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

# Jenkins 유저를 Docker 그룹에 추가
RUN usermod -aG docker jenkins

# Jenkins에서 sudo 사용 가능하게 설정
RUN echo "jenkins ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

USER jenkins

#CMD ["/usr/bin/tini", "--", "/usr/local/bin/jenkins.sh"]

