FROM node:20-bookworm-slim

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://ollama.com/install.sh | sh

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
RUN chmod +x scripts/start.sh

ENV PORT=8080
ENV OLLAMA_HOST=0.0.0.0:11434
ENV OLLAMA_BASE_URL=http://127.0.0.1:11434
ENV OLLAMA_MODELS=/data/ollama/models

EXPOSE 8080

CMD ["sh", "scripts/start.sh"]
