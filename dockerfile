# ---------------------------
# 1) Build Stage
# ---------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# package.json 먼저 복사 → 캐시 활용
COPY package*.json ./

# devDependencies 포함 전체 설치
RUN npm install

# 소스 전체 복사
COPY . .

# 환경변수 설정 (Prisma Client 생성 위해 필요)
ENV DATABASE_URL="mysql://dummy:dummy@localhost:3306/dummy"

# Prisma Client 생성
RUN npx prisma generate

# TypeScript → JS 빌드(tsup, swagger.json 생성)
RUN npm run build


# ---------------------------
# 2) Run Stage (Production)
# ---------------------------
FROM node:20-alpine

WORKDIR /app

# 타임존 설정 (추가)
RUN apk add --no-cache tzdata
ENV TZ=Asia/Seoul

# package.json만 복사 → 프로덕션용만 설치
COPY package*.json ./

#  production용 의존성만 설치
RUN npm install --production

# builder에서 필요한 결과물만 복사
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/swagger.json ./swagger.json

# Prisma Client 관련 파일 복사
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 8000

CMD ["node", "dist/server.js"]
