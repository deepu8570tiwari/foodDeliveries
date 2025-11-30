# 🚀 Food Delivery App -- Full Project (Backend + Frontend)

This project contains **multiple modules**:\
✔ User Authentication\
✔ Google OAuth\
✔ Password Reset with OTP\
✔ Shops, Categories & Items\
✔ Orders & Delivery Assignment\
✔ Live Delivery Tracking (Socket.io)\
✔ Razorpay Payments\
✔ File Upload using Cloudinary\
✔ Real-time events using Socket.io

------------------------------------------------------------------------

# 🌐 Project URLs

  Service        URL
  -------------- -----------------------
  **Backend**    http://localhost:5000
  **Frontend**   http://localhost:5173

------------------------------------------------------------------------

# 📦 Tech Stack

  Feature              Library
  -------------------- -----------------------------
  Server               Express.js
  DB                   MongoDB + Mongoose
  Auth                 JWT + bcryptjs
  File Upload          multer + cloudinary
  Email                Nodemailer
  Payment              Razorpay
  Real-time Tracking   Socket.io
  Dev Tool             Nodemon
  Utility              dotenv, cors, cookie-parser

------------------------------------------------------------------------

# 📁 API ROUTES

All main routes use prefix:

    /api/v1

------------------------------------------------------------------------

#  AUTH ROUTES (`/api/v1`)

  Method   Endpoint     Description
  -------- ------------ ---------------
  POST     `/signup`    Register user
  POST     `/signin`    Login
  GET      `/signout`   Logout user

------------------------------------------------------------------------

#  GOOGLE AUTH (`/api/v1/google-auth`)

  Method   Endpoint    Description
  -------- ----------- ---------------------
  POST     `/signup`   Google OAuth signup

------------------------------------------------------------------------

#  PASSWORD RESET / OTP (`/api/v1`)

  Method   Endpoint            Description
  -------- ------------------- ----------------
  POST     `/send-otp`         Send OTP
  POST     `/verify-otp`       Verify OTP
  POST     `/reset-password`   Reset password

------------------------------------------------------------------------

#  ORDERS (`/api/v1/orders`)

  Method   Endpoint                            Description
  -------- ----------------------------------- ----------------------
  POST     `/place-order`                      Place new order
  POST     `/verify-payment`                   Razorpay verify
  GET      `/my-orders`                        User orders
  GET      `/get-order-by-id/:orderId`         Order details
  GET      `/get-assignments`                  Delivery assignments
  GET      `/accept-order/:assignmentId`       Delivery boy accepts
  GET      `/current-assigned-order`           Current assignment
  POST     `/update-status/:orderId/:shopId`   Update status
  POST     `/send-delivery-otp`                Send delivery OTP
  POST     `/verify-delivery-otp`              Verify delivery OTP

------------------------------------------------------------------------

#  SHOPS (`/api/v1/shop`)

  Method   Endpoint                Description
  -------- ----------------------- ------------------------
  GET      `/shop-by-city/:city`   Shops in specific city
  POST     `/create`               Create shop
  PUT      `/update`               Update shop
  GET      `/list`                 Get own shop

------------------------------------------------------------------------

#  ITEMS / CATEGORY (`/api/v1/category`)

  Method   Endpoint                      Description
  -------- ----------------------------- ----------------------
  GET      `/search-items`               Search items
  POST     `/create`                     Create item/category
  PUT      `/update/:itemsId`            Update item
  GET      `/get-items-by-city/:city`    Items by city
  GET      `/get-item-by-shop/:shopId`   Items by shop
  GET      `/:itemsId`                   Item details
  DELETE   `/delete/:itemsId`            Delete item

------------------------------------------------------------------------

#  USER ROUTES (`/api/v1/user`)

  Method   Endpoint             Description
  -------- -------------------- -----------------
  GET      `/me`                Logged-in user
  POST     `/update-location`   Update location

------------------------------------------------------------------------

#  SOCKET.IO FEATURES

Used for:

-   New order notifications\
-   Delivery assignment updates\
-   Live delivery boy location tracking

Backend stores `socketId` for each user.

------------------------------------------------------------------------

#  EMAIL SERVICE (Nodemailer)

    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=your-email@gmail.com
    SMTP_PASS=your-app-password

------------------------------------------------------------------------

#  Running Backend

    npm install
    npm run dev

http://localhost:5000

------------------------------------------------------------------------

#  Running Frontend

    npm install
    npm run dev

http://localhost:5173

------------------------------------------------------------------------

#  Required Environment Variables

    PORT=5000
    MONGO_URL=your_mongo_url
    JWT_SECRET=your_secret
    CLOUDINARY_NAME=xxxx
    CLOUDINARY_API_KEY=xxxx
    CLOUDINARY_API_SECRET=xxxx
    RAZORPAY_KEY=xxxx
    RAZORPAY_SECRET=xxxx
    SMTP_USER=xxxx
    SMTP_PASS=xxxx

------------------------------------------------------------------------

#  Dependencies Used

    bcryptjs
    body-parser
    cloudinary
    cookie-parser
    cors
    dotenv
    express
    jsonwebtoken
    mongoose
    multer
    multer-storage
    nodemailer
    nodemon
    razorpay
    socket.io
    streamifier
    validator
