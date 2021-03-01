FROM node:12-stretch-slim AS First

WORKDIR /root/

RUN mkdir -p /root/gitbook
RUN apt update && apt install git -y
COPY docker-start.sh package.json package-lock.json /root/gitbook/
COPY dist /root/gitbook/dist
COPY client/dist /root/gitbook/client/dist

RUN rm -rf /root/gitbook/node_modules && rm -rf /root/gitbook/client/node_modules && cd /root/gitbook && npm install && chmod a+x /root/gitbook/docker-start.sh

RUN pwd && ls -l /root/gitbook

EXPOSE 6080

ENTRYPOINT [ "/root/gitbook/docker-start.sh" ]