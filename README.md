# AutoTicket Commander

## Overview
- Monitors ticket opening for Movies on `BookMyShow` and `District`
- Ranks theatres and showtimes, selects upper row center adjacent seats
- Sends call and SMS via Twilio when seats open
- Opens booking page in an automated browser and waits for payment
- Provides REST API and React frontend for configuration and logs

## Folder Structure
- `backend`: Node.js + Express + TypeScript services and API
- `frontend`: React app (Vite) for configuration and monitoring UI
- `config/example.config.json`: Example preference configuration
- `deployment/DEPLOYMENT.md`: Deployment guide

## Backend Setup
- Install Node.js 18+
- `cd backend`
- `npm install`
- Create `.env` from `.env.example`
- `npm run build`
- `npm start`

## Frontend Setup
- `cd frontend`
- `npm install`
- `npm run dev`
- Open `http://localhost:5173`

## Environment
- `PORT`: API port
- `MONGODB_URI`: MongoDB connection string
- `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, `USER_PHONE_NUMBER`: Twilio credentials
- `REGION`: BookMyShow region slug
- `SIMULATION`: Enable simulation mode

## API
- `GET /api/config`
- `POST /api/config`
- `POST /api/monitor/start`
- `POST /api/monitor/stop`
- `POST /api/monitor/check`
- `GET /api/logs`

## Simulation Mode
- Enable `SIMULATION=true` or toggle in UI
- Generates a synthetic seat map and triggers notifications without real booking

## Production Practices
- Uses Playwright with human-like delays
- Stores secrets in `.env`
- Modular architecture with separate engines for priority and seat detection

