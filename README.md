# TryIt - AI Chatbot with JWT Authentication

A modern React-based AI chatbot application with secure JWT token authentication and real-time chat capabilities.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16+)
- **npm** or **yarn**
- **Backend API** with JWT authentication

### Setup
```bash
# Clone & install
git clone <repository-url>
cd tryitweb-main
npm install

# Environment setup
# Create .env file:
REACT_APP_API_LINK=http://localhost:3001/api
REACT_APP_API_KEY=your_api_key_here

# Start development
npm start
```

### Available Scripts
| Command | Description |
|---------|-------------|
| `npm start` | Development server |
| `npm test` | Run tests |
| `npm run build` | Production build |

## 🏗️ Architecture

### System Overview
```mermaid
graph TB
    subgraph "Frontend (React)"
        A[App.tsx] --> B[AuthContext]
        A --> C[Router]
        C --> D[Login/Signup]
        C --> E[Chat Interface]
        E --> F[Chat Components]
    end
    
    subgraph "Backend API"
        G[Auth Service]
        H[Chat Service]
    end
    
    subgraph "External"
        I[OpenAI GPT-4o]
    end
    
    B --> G
    E --> H
    H --> I
    
    style A fill:#61dafb
    style B fill:#ff6b6b
    style E fill:#4ecdc4
```

### Authentication Flow
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    
    U->>F: Access protected route
    F->>B: Check authentication
    alt Authenticated
        F->>U: Allow access
    else Not authenticated
        F->>U: Redirect to login
        U->>F: Enter credentials
        F->>B: POST /auth/login
        B->>F: Return JWT tokens
        F->>U: Redirect to chat
    end
```

## 📱 Screenshots

### Authentication
<!-- Add screenshots here -->
- **Login Page**: Modern authentication interface
  ![Login Page](assets/login-page.png "Login Interface")
- **Signup Page**: User registration form
  ![Signup Page](assets/signup-page.png "Signup Form")

### Chat Interface
<!-- Add screenshots here -->
- **Main Chat**: Clean chat interface
  ![Main Chat](assets/chat-interface.png "Chat Interface")
- **Mobile View**: Responsive design
  ![Mobile View](assets/mobile-view.png "Mobile Responsive")
- **Theme Toggle**: Dark/light mode
  ![Theme Toggle](assets/theme-toggle.png "Dark/Light Theme")

<!-- Alternative: Centered layout -->
<div align="center">
  <h3>Application Screenshots</h3>
  <img src="assets/login-page.png" alt="Login Page" width="300">
  <img src="assets/chat-interface.png" alt="Chat Interface" width="300">
  <img src="assets/mobile-view.png" alt="Mobile View" width="200">
</div>

## 🔐 Features

### Authentication
- JWT access & refresh tokens
- Automatic token refresh
- Protected routes
- Session persistence

### Chat
- GPT-4o integration
- Real-time streaming
- Markdown support
- Message history

### UI/UX
- Responsive design
- Modern gradients
- Smooth animations
- Form validation

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, TypeScript |
| **Routing** | React Router DOM |
| **Auth** | JWT, jwt-decode |
| **HTTP** | Axios |
| **Styling** | Tailwind CSS |
| **UI** | React Markdown |

## 📁 Project Structure
```
src/
├── components/
│   ├── auth/          # Login, Signup
│   ├── ChatHeader.tsx
│   ├── ChatInput.tsx
│   └── ChatMessage.tsx
├── contexts/          # Auth, Theme
├── hooks/            # useChat
├── utils/            # JWT utils
├── App.tsx           # Main app
└── TryIt.tsx         # Chat interface
```

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/signup` | POST | User registration |
| `/auth/login` | POST | User login |
| `/auth/refresh` | POST | Token refresh |
| `/chat` | POST | Send messages |

### Example Login
```json
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "user": { "id": "user_id", "name": "John Doe" }
}
```

## 🔒 Security

- **Token Management**: Short-lived access tokens (15-60 min)
- **Auto Refresh**: Transparent token renewal
- **Secure Storage**: localStorage with validation
- **Route Protection**: Authentication guards
- **CSRF Protection**: Secure token transmission

## 🚀 Deployment

```bash
# Build for production
npm run build

# Deploy build folder to:
# - Netlify
# - Vercel  
# - AWS S3
# - Docker
```

### Environment Variables
```env
REACT_APP_API_LINK=https://your-api-domain.com/api
REACT_APP_API_KEY=your_production_api_key
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Token Expiration | Check backend token expiry |
| CORS Errors | Configure backend CORS |
| Network Errors | Verify API endpoints |
| Storage Issues | Check localStorage |

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Submit pull request

##📄 License

This project is licensed under the MIT License.

---

**Made with ❤️ using React and JWT Authentication**
