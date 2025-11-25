# ---------------------------
# 1) Build Stage
# ---------------------------
FROM node:20-slim AS builder

WORKDIR /app

# package.json 먼저 복사 → 캐시 활용
COPY package*.json ./

# devDependencies 포함 전체 설치
RUN npm install

# 소스 전체 복사
COPY . .

# TypeScript → JS 빌드(tsup, swagger.json 생성)
RUN npm run build


# ---------------------------
# 2) Run Stage (Production)
# ---------------------------
FROM node:20-slim

WORKDIR /app

# package.json만 복사 → 프로덕션용만 설치
COPY package*.json ./

RUN npm install --production

# builder에서 필요한 결과물만 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/swagger.json ./swagger.json

# OpenSSL 설치 (prisma 필수)
RUN apt-get update -y && apt-get install -y openssl

RUN npx prisma generate

# 실행 전 Prisma migrate deploy
CMD npx prisma migrate deploy && node dist/server.js
