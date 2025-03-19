FROM nginx:latest

# 기존 설정 삭제
RUN rm /etc/nginx/conf.d/default.conf

# 환경변수를 적용하여 실제 nginx.conf.template 생성
COPY nginx/nginx.conf.template /etc/nginx/nginx.conf.template
CMD envsubst '$SERVER_DOMAIN' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'
