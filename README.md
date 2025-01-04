# ShopKart Ecommerce - Fully Functional E-commerce Platform 🛒  

This repository contains **ShopKart**, a modern and scalable e-commerce platform. The platform is designed to deliver a seamless shopping experience, complete with secure payments, user-friendly interfaces, and robust admin functionalities.

### Live Demo  
The project is deployed on **Vercel**: [ShopKart E-commerce](https://shopkart-ecommerce.vercel.app/)

---

## Table of Contents  
1. [Folder Structure](#folder-structure)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [Setup and Installation](#setup-and-installation)  
5. [Screenshots](#screenshots)   

---

## Folder Structure 📂  

### Root Directory  
project-root/
├── frontend/
└── backend/

### Frontend Folder  
frontend/
└── ShopKart/
└── src/
├── assets/ # Fonts and images
├── components/
│ ├── mycomponents/
│ └── ui/ # Shadcn components
├── hooks/ # Custom hooks
├── lib/ # Reusable utility functions
├── pages/
│ ├── Admin/
│ ├── Auth/
│ ├── Order/
│ └── User/
└── redux/
├── api/
└── features/ # Redux slices for auth, cart, product, wishlist


### Backend Folder  
backend/
├── public/
└── src/
├── controllers/ # Request handlers
├── database/ # Database connection and setup
├── features/ # Business logic modules
├── middlewares/ # Middleware for authentication, error handling, etc.
├── models/ # Database schemas
├── routes/ # API route definitions
├── tasks/ # Scheduled tasks or cron jobs
└── utils/ # Helper functions

---

## Features 🌟  

### Frontend:  
- **Dynamic UI**: Built with React.js and styled using Tailwind CSS & Shadcn components.  
- **Responsive Design**: Fully mobile-optimized.  

### Backend:  
- **User Authentication & Authorization**: Secure login and registration with JWT.  
- **Product Management**: Full CRUD with media uploads via Cloudinary.  
- **Cart & Checkout**: Dynamic cart with secure order placement.  
- **Wishlist**: Save favorite products for later.  
- **Payment Integration**: Razorpay and COD options for seamless payments.  
- **Order Management**: Real-time status updates (Pending, Processing, Delivered, etc.).  

### Additional Features:  
- **Search & Filters**: Advanced search, sorting, and filtering for products.  
- **Email & SMS**: Mailgun for emails and Twilio for SMS notifications.  
- **Admin Panel**: Role-based access for managing users, products, categories, discounts, brands, and orders.  
- **User Profile**: View and update profile information.  

---

## Tech Stack 💻  
- **Frontend**: React.js, Tailwind CSS, Shadcn  
- **Backend**: Node.js, Express.js, MongoDB  
- **Payment**: Razorpay  
- **Media Management**: Cloudinary  
- **Communication**: Mailgun, Twilio  
- **Deployment**: Vercel (Frontend), Render (Backend)  

---

## Setup and Installation 🛠  

### Prerequisites  
- Node.js  
- MongoDB  

### Steps  
1. Clone the repository:  
   ```bash  
   git clone https://github.com/your-username/shopkart-ecommerce.git  
   cd shopkart-ecommerce
   
2. Install frontend dependencies:
   ```bash  
   cd frontend/ShopKart  
   npm install

3. Install backend dependencies:
    ```bash
   cd ../../backend  
   npm install

4. Start the development servers:
   Frontend:
   ```bash
   cd frontend/ShopKart
   npm run dev
  
  Backend:
   ```bash
   cd frontend/ShopKart
   npm run dev
   


   

    
     

    



