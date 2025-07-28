# Lodge Management Platform

## Overview
A bilingual (English-Telugu) lodge management platform for admin-only room allocation, guest registration, payment processing, and SMS billing. Built with Node.js, React, and PostgreSQL.

## Project Architecture
- **Frontend**: React with TypeScript, Vite, shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based admin authentication
- **Language Support**: Bilingual English-Telugu interface

## Core Features
1. Admin Authentication
2. Lodge Onboarding and Settings
3. Guest Registration and Details Collection
4. Room Management and Allotment
5. Payment Processing (Cash/QR Code)
6. Billing and SMS Sending
7. Admin Analytics and Reporting

## Recent Changes
- ✓ Database schema created with all required tables (2025-01-28)
- ✓ Server setup with Express, authentication, and API routes (2025-01-28)
- ✓ Frontend created with React, TypeScript, and bilingual UI (2025-01-28)
- ✓ Vite configuration fixed for path aliases (2025-01-28)
- ✓ Application server running on port 3000 (2025-01-28)

## Current Status
- Server: Running successfully with database connected
- Frontend: React application with bilingual (English-Telugu) interface
- Authentication: Session-based admin authentication implemented
- Database: PostgreSQL with all tables created
- Features: Login, Setup, Dashboard, Guests, Bookings pages created

## Test Credentials
- Default admin: username 'admin', password 'admin123'

## User Preferences
- Use PostgreSQL database instead of in-memory storage
- Focus on bilingual (English-Telugu) user interface
- Admin-only access with session-based authentication