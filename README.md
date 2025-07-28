

# Greeting Cards App
Це монорепозиторій і двох частин:

- **backend** (NestJS + GraphQL + TypeORM + PostgreSQL)  
- **frontend** (Next.js + Apollo Client + TailwindCSS)

---

# 📦 Backend

### 🚀 Швидкий старт

1. Скопіюйте приклад `.env` та заповніть змінні: 
``` bash 
cp .env

- DB_HOST=localhost
- DB_PORT=5432
- DB_USERNAME=postgres
- DB_PASSWORD=password
- DB_NAME=greeting_db
- JWT_SECRET=your_jwt_secret
- NODE_ENV=development
- PORT=4000
- FRONT_PORT=3000

## Install dependencies:

- cd back-end
- yarn install

## Create Database

- yarn create:db

## Active migration

- yarn migration:run

## Turn on server 

- yarn start:dev

# 📦 Frontend

## ENV file

- NEXT_PUBLIC_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql

## Install dependencies:

- cd frontend
- yarn install

## Turn on server

- yarn dev

