# Backend Dockerfile (Rust)
FROM rust:1.94-slim AS builder

WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*

# Copy manifests
COPY Cargo.toml Cargo.lock ./

# Create dummy source for dependency caching
RUN mkdir -p src && echo "fn main() {}" > src/main.rs

# Build dependencies only
RUN cargo build --release && rm -rf src

# Copy actual source
COPY src ./src

# Build release
RUN touch src/main.rs && cargo build --release

# Production stage
FROM debian:bookworm-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy binary
COPY --from=builder /app/target/release/globe-news-api /usr/local/bin/

# Create data directory
RUN mkdir -p /app/data

ENV DATABASE_URL=sqlite:///app/data/globe_news.db?mode=rwc
ENV RUST_LOG=info
ENV PORT=8080

EXPOSE 8080

CMD ["globe-news-api"]
