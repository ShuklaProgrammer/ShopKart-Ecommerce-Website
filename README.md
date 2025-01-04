# ShopKart Ecommerce - E-commerce Platform 🛒  

This repository contains **ShopKart**, a modern and scalable e-commerce platform. The platform is designed to deliver a seamless shopping experience, complete with secure payments, user-friendly interfaces, and admin functionalities.

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
project-root/-> frontend/ and backend/

### Frontend Folder  
1. Everything is added in the src folder.
2. In src folder, there are 6 new folder created by me: assets, components, hooks, lib, pages, redux.
3. In assets folder, I have fonts and images folder.
4. In components folder, I have mycomponents and the ui folder which contains the shadcn components.
5. In pages folder, I have Admin, Auth, Order, User.
6. In redux folder, I have api and features. In features folder I have auth, cart, product, and wishlist.


### Backend Folder  
1. In backend folder, I have public and src folder.
2. In src folder, I have controllers, database, features, middlewares, models, routes, taska, and utils.

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
   git clone https://github.com/ShuklaProgrammer/ShopKart-Ecommerce-Website.git
   cd ShopKart-Ecommerce-Website
   
2. Install frontend dependencies:
   ```bash  
   cd frontend/ShopKart  
   npm install

3. Install backend dependencies:
    ```bash
   cd ../../backend  
   npm install

4. Start the development server with frontend:
   ```bash
   cd frontend/ShopKart
   npm run dev
  
5. Start the development server with backend:
   ```bash
   cd frontend/ShopKart
   npm run dev
   


   

    
     

    



