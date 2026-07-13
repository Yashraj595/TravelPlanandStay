# 🌍 Travel and Stay Plan

### An Airbnb-inspired full-stack accommodation booking platform

**Status:** 🚧 Actively under development (Mini-scale project with a major-project scope)

---

## 📌 About the Project

**Travel and Stay Plan** is a full-stack web application inspired by **Airbnb**, built to let users list, discover, and manage travel stays. It's a mini version of a large-scale booking platform — smaller in feature scope, but built on a real, production-style architecture (MVC pattern, cloud image storage, authentication, ownership-based access control).

The goal of this project is to replicate the core experience of a modern accommodation platform:

- Hosts can list their properties with images, pricing, and location details
- Users can browse, search, and view listings
- Authenticated users can create, edit, and delete their own listings
- A review and rating system for guest feedback
- Secure login/session-based authentication

This repository reflects the **current, working state** of the project and will keep evolving as more features (booking, payments, maps) are added.

---

## 🚀 Current Development Status

### ✅ Completed

- Project setup with proper **MVC folder structure**
- Express.js server configuration
- MongoDB database connection using Mongoose
- **Listing model** with schema validation (Joi)
- **Full CRUD** for listings (Create, Read, Update, Delete)
- **Image upload** via Multer + **Cloudinary** cloud storage (no local upload folder needed)
- **User authentication** using Passport.js (Local Strategy)
- Secure session & cookie management (`express-session`)
- **Authorization middleware** — `isLoggedIn`, `isOwner` (only listing owners can edit/delete)
- Flash messages for success/error feedback
- Custom error handling (`ExpressError` + centralized error middleware)
- **Reviews system** — users can post & delete reviews on listings
- Dynamic EJS rendering with `ejs-mate` layouts
- Responsive navbar and listing cards UI
- Database seeding script with sample listing data (`init/`)

### 🔨 Currently Working On

- UI/UX polishing across pages (navbar, forms, cards)
- Search & filter bar functionality
- Route and validation refinements
- Edit/update listing image handling
- Mobile responsiveness

### 📅 Upcoming Features

- 🔍 Search & category-based filtering
- 🗺️ Interactive maps for listing locations
- 📅 Booking & availability system
- ⭐ Enhanced reviews & ratings UI
- 👤 User profile pages
- 🛠️ Admin dashboard
- 🔒 Additional security hardening (rate limiting, sanitization)
- ⚡ Performance optimization

---

## 🛠 Tech Stack

**Frontend**
- HTML5, CSS3, JavaScript
- EJS + EJS-Mate (templating & layouts)
- Bootstrap 5

**Backend**
- Node.js
- Express.js
- Passport.js (Authentication)
- Multer + Cloudinary (Image uploads)
- Joi (Schema validation)

**Database**
- MongoDB
- Mongoose (ODM)

---

## 📂 Project Structure

```
TravelPlanandStay/
│
├── controllers/       # Route logic (listings, reviews, users)
├── init/              # DB seed scripts + sample data
├── models/            # Mongoose schemas (Listing, Review, User)
├── public/            # Static assets (CSS, JS, images)
├── routes/            # Express route definitions
├── utils/             # Helper utilities (ExpressError, wrapAsync)
├── views/             # EJS templates (pages, partials, layouts)
├── app.js             # App entry point
├── cloudConfig.js     # Cloudinary + Multer storage config
├── middleware.js       # Auth & ownership middleware
├── schema.js           # Joi validation schemas
├── package.json
└── README.md
```

---

## ⚙️ Getting Started (Local Setup)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yashraj595/TravelPlanandStay.git
   cd TravelPlanandStay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with:
   ```
   CLOUD_NAME=your_cloudinary_name
   CLOUD_API_KEY=your_cloudinary_key
   CLOUD_API_SECRET=your_cloudinary_secret
   SECRET=your_session_secret
   ```

4. **Start MongoDB** (locally or via Atlas connection string)

5. **Run the app**
   ```bash
   node app.js
   ```
   Visit `http://localhost:5000`

---

## 📈 Development Progress

| Module                     | Status         |
|-----------------------------|----------------|
| Backend Foundation           | ✅ Complete    |
| Database Setup                | ✅ Complete    |
| Routing                       | ✅ Complete    |
| Authentication & Authorization | ✅ Complete    |
| Listings CRUD                 | ✅ Complete    |
| Image Upload (Cloudinary)     | ✅ Complete    |
| Reviews System                | ✅ Complete    |
| Search & Filters              | 🚧 In Progress |
| Booking System                 | 📅 Planned     |
| Maps Integration               | 📅 Planned     |

**Overall Progress:** ~45–50%

---

## 🔄 Repository Updates

This repository is actively maintained. New commits, UI improvements, and feature additions are pushed regularly as development continues.

---

## 👨‍💻 Author

**Yashraj Singh Thakur**

---

⭐ Thank you for checking out this project — feedback and suggestions are always welcome!
