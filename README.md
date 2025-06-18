# Tryit - AI Chatbot with JWT Authentication

A modern React-based AI chatbot application with secure JWT token authentication, session management, and real-time chat capabilities.

## Features

### 🔐 JWT Authentication System
- **Secure Token Management**: JWT access and refresh tokens
- **Automatic Token Refresh**: Seamless token renewal
- **Token Validation**: Real-time token expiration checking
- **Session Persistence**: Secure localStorage token storage
- **Protected Routes**: Route-based authentication guards
- **Token Information Display**: Debug token details and status

### 💬 Chat Features
- **AI-Powered**: GPT-4o integration for intelligent responses
- **Real-time Streaming**: Word-by-word response streaming
- **Markdown Support**: Rich text formatting in messages
- **Message History**: Persistent chat conversations
- **Loading States**: Smooth user experience with loading indicators

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Beautiful Gradients**: Modern gradient backgrounds
- **Smooth Animations**: CSS animations and transitions
- **Form Validation**: Real-time input validation
- **Error Handling**: User-friendly error messages

## Tech Stack

- **Frontend**: React 19, React Router DOM
- **Authentication**: JWT tokens, jwt-decode
- **HTTP Client**: Axios with interceptors
- **Styling**: Custom CSS with modern design
- **UI Components**: React Markdown, React Loader Spinner

## JWT Authentication Architecture

### Token Management
- **Access Token**: Short-lived (15-60 minutes) for API requests
- **Refresh Token**: Long-lived (7-30 days) for token renewal
- **Secure Storage**: Tokens stored in localStorage with validation
- **Automatic Refresh**: Transparent token renewal via axios interceptors

### Security Features
- **Token Validation**: Real-time expiration checking
- **Automatic Logout**: Session termination on token expiration
- **CSRF Protection**: Secure token transmission
- **Error Handling**: Graceful authentication failure handling

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API with JWT authentication endpoints

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tryitweb-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_LINK=http://localhost:3001/api
   REACT_APP_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

Your backend should provide the following JWT authentication endpoints:

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login (returns access + refresh tokens)
- `POST /auth/refresh` - Token refresh
- `POST /auth/logout` - User logout
- `POST /chat` - Send chat messages (protected)

### Request/Response Formats

#### Signup
```json
POST /auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "User registered successfully"
}
```

#### Login
```json
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["user"]
  }
}
```

#### Token Refresh
```json
POST /auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Chat (Protected)
```json
POST /chat
Headers: {
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "api-key": "your_api_key"
}
{
  "model": "gpt-4o",
  "messages": [
    {"role": "user", "content": "Hello!"}
  ]
}
```

## JWT Token Structure

### Access Token Claims
```json
{
  "sub": "user_id",
  "iss": "your-app",
  "aud": "your-app",
  "iat": 1640995200,
  "exp": 1640998800,
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["user"]
  }
}
```

### Token Configuration
- **Access Token Expiry**: 15-60 minutes
- **Refresh Token Expiry**: 7-30 days
- **Algorithm**: HS256 (HMAC SHA-256)
- **Issuer**: Your application domain
- **Audience**: Your application domain

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── Login.js          # Login component
│   │   ├── Signup.js         # Signup component
│   │   └── Auth.css          # Authentication styles
│   ├── ChatHeader.js         # Chat header with user info
│   ├── ChatInput.js          # Message input component
│   ├── ChatMessage.js        # Individual message component
│   ├── TokenInfo.js          # JWT token information display
│   ├── TokenInfo.css         # Token info styles
│   └── styles/               # Component-specific styles
├── contexts/
│   └── AuthContext.js        # JWT authentication context
├── hooks/
│   └── useChat.js           # Chat functionality hook
├── utils/
│   └── jwtUtils.js          # JWT utility functions
├── App.js                   # Main app with routing
└── TryIt.js                # Chat interface component
```

## JWT Authentication Flow

### 1. User Registration
1. User fills signup form
2. Backend creates user account
3. Redirect to login page
4. No automatic login (security best practice)

### 2. User Login
1. User enters credentials
2. Backend validates and returns JWT tokens
3. Frontend stores tokens securely
4. User redirected to chat

### 3. Token Management
1. Access token used for API requests
2. Automatic token refresh via interceptors
3. Session persistence across browser refreshes
4. Automatic logout on token expiration

### 4. Protected Routes
1. Route guards check authentication
2. Unauthorized users redirected to login
3. Authenticated users access protected content
4. Token validation on each route change

## Security Features

### Token Security
- **Secure Storage**: Tokens stored in localStorage with validation
- **Automatic Refresh**: Transparent token renewal
- **Expiration Handling**: Graceful session termination
- **CSRF Protection**: Secure token transmission

### Authentication Guards
- **Route Protection**: Unauthorized access prevention
- **Token Validation**: Real-time expiration checking
- **Session Management**: Secure user sessions
- **Error Handling**: Graceful authentication failures

### Best Practices
- **Short-lived Access Tokens**: 15-60 minutes
- **Long-lived Refresh Tokens**: 7-30 days
- **Secure Token Storage**: localStorage with validation
- **Automatic Logout**: Session termination on expiration

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Customization

### JWT Configuration
- Modify token expiration times in backend
- Update token claims structure
- Customize token refresh logic
- Add role-based access control

### Authentication Flow
- Update API endpoints in `AuthContext.js`
- Modify token storage strategy
- Customize error handling
- Add additional security measures

### UI/UX
- Update authentication page styles
- Customize token information display
- Modify loading states and animations
- Add additional user feedback

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `build` folder** to your hosting service

3. **Update environment variables** for production

4. **Configure CORS** on your backend for production domain

## Troubleshooting

### Common Issues
- **Token Expiration**: Check token expiration times
- **CORS Errors**: Configure backend CORS settings
- **Network Errors**: Verify API endpoint configuration
- **Storage Issues**: Check localStorage availability

### Debug Tools
- **Token Info Component**: Display token details and status
- **Browser DevTools**: Check localStorage and network requests
- **Console Logs**: Detailed authentication flow logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
