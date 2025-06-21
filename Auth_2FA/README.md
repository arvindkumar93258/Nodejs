# Two-Factor Authentication (2FA) System with React & Node.js

## Table of Contents
- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Setup Instructions](#setup-instructions)
- [System Architecture](#system-architecture)
- [Authentication Flow](#authentication-flow)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Project Overview

This project implements a secure Two-Factor Authentication (2FA) system using:
- Time-based One-Time Passwords (TOTP)
- Google Authenticator/Microsoft Authenticator compatible
- React.js frontend
- Node.js/Express backend
- MongoDB database

## Technology Stack

### Frontend
- React.js
- Axios (HTTP client)
- React Router (Navigation)
- QRCode.react (QR generation)
- Tailwind CSS (Styling - optional)

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- Speakeasy (TOTP implementation)
- Bcrypt (Password hashing)
- JSON Web Tokens (Authentication)
- QRCode (QR generation)

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas URI)
- Google Authenticator/Microsoft Authenticator app

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-repo/2fa-system.git
   cd 2fa-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   - Create `.env` file in backend with:
     ```
     MONGODB_URI=mongodb://localhost:27017/2fa-auth
     JWT_SECRET=your_secure_jwt_secret
     PORT=5000
     ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend Development Server**
   ```bash
   cd ../frontend
   npm start
   ```

3. **Access the Application**
   - Open `http://localhost:3000` in your browser

## System Architecture

```
Frontend (React) → Backend (Node/Express) → Database (MongoDB)
       ↑
Authenticator App (Google/Microsoft Auth)
```

## Authentication Flow

### 1. Registration Flow
1. User submits email/password
2. System creates user account
3. Redirects to 2FA setup page
4. Generates and displays QR code
5. User scans QR code with authenticator app
6. User enters verification code
7. System verifies and enables 2FA

### 2. Login Flow
1. User submits email/password
2. If 2FA enabled:
   - Returns partial token
   - Redirects to 2FA verification
3. User enters current code from authenticator app
4. System verifies code
5. Grants full access token on success

### 3. 2FA Recovery Flow
1. User requests 2FA reset
2. Verifies identity via email/password
3. Disables existing 2FA
4. Allows setting up new 2FA

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login (first factor)
- `POST /api/verify-2fa` - Verify 2FA code (second factor)

### 2FA Management
- `POST /api/generate-2fa` - Generate new 2FA secret
- `POST /api/verify-2fa-setup` - Verify initial 2FA setup
- `POST /api/disable-2fa` - Disable 2FA for user

## Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/2fa-auth` |
| `JWT_SECRET` | Secret for signing JWT tokens | `your_secure_secret` |
| `PORT` | Server port | `5000` |

## Troubleshooting

### Common Issues

1. **QR Code Not Scanning**
   - Ensure proper lighting
   - Try increasing QR code size
   - Verify URL format is `otpauth://totp/...`

2. **Verification Fails**
   - Check server time synchronization
   - Verify secret in DB matches QR code
   - Increase verification window temporarily

3. **Database Connection Issues**
   - Verify MongoDB is running
   - Check connection string in .env

4. **CORS Errors**
   - Ensure frontend URL is whitelisted
   - Verify proxy settings in development

### Debugging Tips

1. Check server logs for verification attempts:
   ```javascript
   console.log('Verification attempt:', {
     secret: cleanSecret,
     token: cleanToken,
     timeStep: currentTimeStep
   });
   ```

2. Test with known values:
   ```javascript
   // Secret: JBSWY3DPEHPK3PXP
   // Valid code: current 6-digit from authenticator
   ```

3. Verify time synchronization:
   ```bash
   # Linux/Mac
   timedatectl status
   
   # Windows
   w32tm /query /status
   ```