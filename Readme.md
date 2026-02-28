# 💰 Pricetator - Price Comparison App

A beautiful, modern price comparison web application built with React, Flask, and Framer Motion.

## ✨ Features

- **Dark Theme** - Prussian Blue + Black design
- **Price Comparison** - Compare prices across Amazon, Flipkart, JioMart
- **Google Authentication** - Secure login with Google OAuth
- **Search History** - Track all your searches
- **User Profiles** - Edit profile and view statistics
- **Smooth Animations** - Framer Motion animations throughout
- **Responsive Design** - Works on desktop and mobile

## 🛠️ Tech Stack

**Frontend:**
- React 18
- React Router DOM
- Framer Motion
- CSS3
- Google OAuth

**Backend:**
- Python Flask
- Flask-CORS
- JWT Authentication

## 📋 Prerequisites

- Node.js & npm (v14+)
- Python 3.8+
- Git

## 🚀 Installation

### Frontend Setup
```bash
cd frontend
npm install
npm install react-router-dom framer-motion @react-oauth/google
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
```

## ⚙️ Configuration

### Frontend (.env)
Create `frontend/.env` file:
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### Backend (.env)
Create `backend/.env` file:
```
SECRET_KEY=your_secret_key_12345
GOOGLE_CLIENT_ID=your_google_client_id_here
```

## ▶️ Running the App

### Terminal 1 - Backend
```bash
cd backend
python run.py
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

App will open at: **http://localhost:3000**

## 📁 Project Structure

```
pricetator/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Navbar.js
│   │   │   ├── SearchBar.js
│   │   │   ├── PriceComparison.js
│   │   │   └── TrendingProducts.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Home.js
│   │   │   ├── Profile.js
│   │   │   └── SearchHistory.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── App.css
│   └── package.json
├── backend/
│   ├── run.py
│   └── requirements.txt
├── README.md
└── .gitignore
```

## 🎯 Features Explained

### 1. Google Login
Sign in securely with your Google account for personalized experience.

### 2. Search Products
Enter product name to compare prices across multiple platforms.

### 3. View Prices
See prices from Amazon, Flipkart, JioMart, and more.

### 4. Track Savings
See how much you can save at each platform.

### 5. Search History
View all your previous searches in one place.

### 6. User Profile
Edit your name and view your statistics.

## 🎨 Colors Used

```
Primary: #004e89 (Prussian Blue)
Secondary: #0066b3 (Light Blue)
Background: #0f0f0f (Black)
Cards: #1a1a1a (Dark Gray)
Text: #ffffff (White)
Accent: #51cf66 (Green), #ff6b6b (Red)
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/google` - Login with Google

### Search
- `POST /api/search` - Search for products

### Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### History
- `GET /api/user/search-history` - Get search history
- `DELETE /api/user/search-history/<id>` - Delete specific search
- `DELETE /api/user/search-history/clear` - Clear all history

### Trending
- `GET /api/trending` - Get trending products

## 🚀 Future Enhancements

- [ ] Real-time price tracking
- [ ] Price alert notifications
- [ ] Wishlist feature
- [ ] Mobile app
- [ ] Admin dashboard
- [ ] Real API integration (SerpAPI)
- [ ] Email notifications
- [ ] Price graphs

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👤 Author

**Arihant Jain**
- GitHub: [Arihant Jain](https://github.com/arrieejain3149)
- Email: arihantjain17052007@gmail.com

## 💬 Support

For support,arihantjain17052007@gmail.com or open an issue on GitHub

## 🙏 Acknowledgments

- Built with React, Flask, and Framer Motion
- Icons and emojis for amazing UI
- Open-source community

---

⭐ If you found this project useful, please give it a star!

Made with ❤️ by [Arihant Jain]