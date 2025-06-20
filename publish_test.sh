#!/bin/bash
set -e
NAME=${JOB_NAME} # 项目名称
PORT=9003
VERSION=`awk '/"version"/ {match($2,/"([^"]*)"/);print substr($2,RSTART + 1 ,RLENGTH - 2 )}' ./package.json`
TAG_NAME=$NAME:$VERSION
build_dist(){
  echo 'start build dist====================================='
  rm -rf ./dist
  pnpm install --registry=https://registry.npmmirror.com/
  pnpm run build:test
  echo 'end build============================================'
}
build_image(){
  echo 'start build image===================================='

  docker build -t $TAG_NAME .
  echo 'end build image======================================'
}
deploy_image(){
  echo "start deploy version: v${VERSION}======================"
  REG=$NAME
  CURCONTAINER=$(docker ps | grep $REG | awk '{print $1}')
  if [ -n "$CURCONTAINER" ];then
    docker stop $CURCONTAINER && docker rm -f $CURCONTAINER
    echo 删除当前运行容器$CURCONTAINER
  else
    echo 当前无运行镜像
  fi
  docker run -d --name $NAME -p $PORT:80 $TAG_NAME
  echo 'end deploy============================================'
}
build_dist
build_image
deploy_image


