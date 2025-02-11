# FROM: 사용할 도커 이미지 설정
# NodeJS 버전 중 20 번대를 선택하여 이미지를 가져온다.
FROM node:20

# WORKDIR: 코드 실행 경로(작업 경로)
WORKDIR /app

# 모듈 설치 및 빌드
COPY package.json yarn.lock ./
RUN yarn install

# COPY source(카피할 파일 경로 -) dest(카피할 파일을 넣을 경로 = WORKDIR)
# . : 호스트의 현재 디렉토리, . : 컨테이너 내부의 작업 디렉토리
# 즉, 현재 디렉토리에 있는 모든 파일을 컨테이너 내부의 /var/app 으로 복사

COPY . .

# 3001 포트 열기(main.ts 에 지정된 포트 번호를 입력한다. 원래 기본은 3000)
EXPOSE 3000

# node 는 Node 환경에서 파일을 실행 시 사용되는 키워드이다.
# dist/main.js 는 node 키워드로 실행하고자 하는 파일의 경로이다.
# 즉, 도커 컨테이너가 실행될 때 dist/mian.js 를 같이 실행(node) 한다.
#CMD [ "node","dist/main.js" ]
CMD ["yarn", "start:dev"]
