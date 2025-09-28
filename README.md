## Smart Product Assistant

AI-powered product search and recommendations. Backend: Node/Express, MongoDB, Redis, OpenAI. Frontend: React + Tailwind. Swagger docs included.

### Features
- **AI-enhanced search** (OpenAI) with query understanding and explanations
- **REST API** with **Swagger** docs at `/api-docs`
- **Caching, rate limiting, validation**
- **MongoDB** for products, **Redis** for caching

### Quick Start (Docker)
Requires Docker and an OpenAI API key.

```bash
export OPENAI_API_KEY=your_openai_api_key
docker compose up -d
```

- Frontend: `http://localhost:3000`
- API base: `http://localhost:5001/api`
- API docs: `http://localhost:5001/api-docs`

### Run Locally (without Docker)
1) Backend
```bash
cd backend
npm install
export MONGODB_URI=mongodb://localhost:27017/smart_products
export REDIS_URL=redis://localhost:6379
export OPENAI_API_KEY=your_openai_api_key
export CORS_ORIGIN=http://localhost:3000
npm run dev
```

2) Frontend
```bash
cd frontend
npm install
npm start
```

### Useful Scripts (backend)
```bash
npm run db:reset        # seed sample data and create indexes
npm run test            # run backend tests
```

### Configuration
- Required: `OPENAI_API_KEY`
- Optional (defaults shown in code): `OPENAI_MODEL`, `OPENAI_MAX_TOKENS`, `OPENAI_TEMPERATURE`, `CACHE_TTL`, `RATE_LIMIT_WINDOW`, etc. See `backend/src/config/aiConfig.ts`.

### Ports
- Frontend: `3000` → Nginx serves React app
- Backend: `5001` (container port 5000)
- MongoDB: `27017`, Redis: `6379`


