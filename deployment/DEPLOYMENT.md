# Deployment Guide

## Render (Backend)
- Create a new Web Service
- Build Command: `npm run build`
- Start Command: `npm start`
- Environment: supply `.env` variables
- MongoDB: use a managed instance

## Vercel (Frontend)
- Import `frontend` as a project
- Build Command: `npm run build`
- Output Directory: `dist`
- Set proxy to backend API domain

## Twilio
- Verify `TWILIO_FROM_NUMBER`
- Add `USER_PHONE_NUMBER`
- Ensure voice calls are allowed in your region

