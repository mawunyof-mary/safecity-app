# 🛡️ SafeCity - Community Safety Platform

A full-stack MERN application that allows community members to report local incidents and visualize them on interactive heatmaps to improve neighborhood safety.

## 🚀 Live Demo

**Live Application:** https://safecity-app-frontend.onrender.com  
**API Documentation:** https://safecity-app-backend.onrender.com

## ✨ Features

- **🗺️ Interactive Live Map** with incident visualization
- **🔥 Heatmap Overlays** showing incident density patterns  
- **🔔 Real-time Notifications** with Socket.io
- **👑 Admin Dashboard** with advanced analytics
- **📱 Mobile-Responsive Design**
- **🔐 JWT Authentication**
- **🚨 Incident Reporting System**
- **📊 Data-driven Insights**

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- React Router DOM
- Leaflet Maps + Heatmaps
- Socket.io Client
- Axios for API calls
- CSS3 with Grid/Flexbox

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Socket.io for real-time features
- Express Validator
- Bcrypt.js for password hashing

### Deployment
- **Frontend:** Render (Static Site)
- **Backend:** Render (Web Service)
- **Database:** MongoDB Atlas
- **Domain:** Render CDN

## 📸 Application Preview

### Dashboard
![Dashboard](https://via.placeholder.com/800x400/667eea/white?text=SafeCity+Dashboard)

### Interactive Map
![Map](https://via.placeholder.com/800x400/38a169/white?text=Live+Incident+Map)

### Admin Panel
![Admin](https://via.placeholder.com/800x400/ed8936/white?text=Admin+Dashboard)

## 🚀 Quick Start

### Local Development
bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend  
npm install
npm run dev

### Production URLs
- **Frontend:** https://safecity-app-frontend.onrender.com
- **Backend API:** https://safecity-app-backend.onrender.com

## 📁 Project Structure

safecity-app/
├── backend/
│   ├── models/          # MongoDB models (User, Incident)
│   ├── routes/          # API routes (auth, incidents)
│   ├── middleware/      # Auth & validation
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # Auth context
│   │   └── App.jsx      # Main app
│   └── package.json
└── README.md

## 🌐 API Endpoints

### Authentication
- \`POST /api/auth/register\` - User registration
- \`POST /api/auth/login\` - User login  
- \`GET /api/auth/me\` - Get current user

### Incidents
- \`GET /api/incidents\` - Get all incidents
- \`POST /api/incidents\` - Create new incident
- \`PATCH /api/incidents/:id/status\` - Update status (admin)

## 🔧 Environment Variables

### Backend (.env)
\`env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=production
\`

### Frontend (.env)
\`env
VITE_API_URL=https://safecity-app-backend.onrender.com/api
\`

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

- **Mary Mawunyof** 
- GitHub: [@mawunyof-mary](https://github.com/mawunyof-mary) (https://github.com/mawunyof-mary/safecity-app/)

## 🙏 Acknowledgments

- MERN Stack community
- SDG initiatives for inspiration
- OpenStreetMap for map data
- Leaflet.js for mapping library
- Render for hosting platform
