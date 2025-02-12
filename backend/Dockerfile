# Node 20버전 사용
FROM node:20

# 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app

# package.json과 yarn.lock만 복사 후 종속성 설치
COPY package.json yarn.lock ./
RUN yarn install

# 백엔드 소스 코드 복사
COPY . .

# NestJS 서버가 사용하는 포트 개방
EXPOSE 3000

# 개발용 실행 (프로덕션이면 `CMD ["yarn", "start"]`로 변경)
CMD ["yarn", "start:dev"]
