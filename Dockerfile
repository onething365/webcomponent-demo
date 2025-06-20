FROM nginx:1.27-alpine
COPY ./dist /usr/share/nginx/html
# 替换默认配置
COPY ./nginx/nginx.default.conf /etc/nginx/conf.d/default.conf
