ShopKart Ecommerce - Fully Functional E-commerce Platform 🛒

This repository contains ShopKart, an easy-to-use and scalable e-commerce platform. It offers a smooth shopping experience with secure payments, simple interfaces, and a powerful admin panel.

Live Demo
The project is deployed on Vercel: ShopKart E-commerce

Table of Contents
1. Folder Structure
2. Features
3. Tech Stack
4. Setup and Installation
5. Screenshots
6. Contributing
7. License

Folder Structure 📂

Root Directory
project-root/  
├── frontend/  
└── backend/  

Frontend Folder
frontend/  
└── ShopKart/  
    └── src/  
        ├── assets/          # Fonts and images  
        ├── components/  
        │   ├── mycomponents/  
        │   └── ui/          # Shadcn components  
        ├── hooks/           # toast
        ├── lib/             # Reusable utility function  
        ├── pages/  
        │   ├── Admin/  
        │   ├── Auth/  
        │   ├── Order/  
        │   └── User/  
        └── redux/  
            ├── api/  
            └── features/    # Redux slices for auth, cart, product, wishlist  
 

Backend Folder
backend/  
├── public/  
└── src/  
    ├── controllers/     # Request handlers  
    ├── database/        # Database connection and setup  
    ├── features/        # Business logic modules  
    ├── middlewares/     # Middleware for authentication, error handling, etc.  
    ├── models/          # Database schemas  
    ├── routes/          # API route definitions  
    ├── tasks/           # Scheduled tasks or cron jobs  
    └── utils/           # Helper functions  

Features 🌟
>User Authentication & Authorization: Secure login/registration using JWT.
>Product Management: Developed CRUD functionalities with image and video uploads via
 Cloudinary.
>Cart & Checkout System: Built a dynamic cart with order management and a secure
 checkout process.
>Wishlist Feature: Enabled users to save products to a wishlist.
>Payment Integration: Integrated Razorpay for online payments and Cash on Delivery
 options.
>Order Management: Added order status updates (Pending, Processing, Completed,
 Delivered).
>Search & Filters: Added search, filtering, sorting, and pagination for efficient product
 discovery.
>Styling & Components: Used Tailwind CSS and Shadcn to create a modern and visually
 appealing UI.
>Media Management: Integrated Cloudinary for efficient image and video uploading of
 products.
>Email & SMS: Integrated Mailgun for email verification and order confirmations and Twilio
 for mobile verification.
>Admin Panel: Built an admin panel for managing users, products, categories, discounts,
 brands and orders with role-based access.
>User Profile: Added functionality for users to view and update their profile information.
>Deployment: Deployed front-end on Vercel and back-end on Render

Tech Stack 💻
Frontend: React.js, Tailwind CSS, Shadcn
Backend: Node.js, Express.js, MongoDB
Payment: Razorpay
Media Management: Cloudinary
Communication: Mailgun, Twilio
Deployment: Vercel (Frontend), Render (Backend)

Setup and Installation 🛠
Prerequisites: Node.js, MongoDB

Steps:-
Clone the repository:
Copy code: git clone https://github.com/your-username/shopkart-ecommerce.git  
cd shopkart-ecommerce  

Install frontend dependencies:
Copy code: cd frontend/ShopKart  
           npm install  

Install backend dependencies:
Copy code: cd ../../backend  
           npm install  

Start the development servers:

Frontend:
Copy code: cd frontend/ShopKart  
           npm run dev 

Backend:
Copy code: cd ../../backend  
           npm run dev  
