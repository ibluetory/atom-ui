#!/bin/bash

# 如果部署线上环境需要修改 .env.production 里的服务地址
echo 'start build ...'

# build
# npm run build:prod

# navigate into the build output directory
cd dist

# start upload
scp -P22 -r ./* liguowen@192.168.1.112:/data/java/webapp/seismic/WEB-INF/classes/static

cd -
