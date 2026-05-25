FROM oven/bun:1

WORKDIR /app

COPY package.json bun.lock tsconfig.json ./
COPY src ./src
COPY .env.example ./.env.example

RUN bun install --frozen-lockfile

EXPOSE 5000

CMD ["bun", "run", "start"]
