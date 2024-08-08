import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cors({
    origin: "https://shopkart-ecommerce-n2f6j4f6e-shukla-programmers-projects.vercel.app",
    credentials: true,
}))
app.use(cookieParser())


// all the imported routes are here
import userRoutes from "./routes/user.routes.js"
import profileRoutes from "./routes/profile.routes.js"
import categoryRoutes from "./routes/category.routes.js"
import brandRoutes from "./routes/brand.routes.js"
import colorRoutes from "./routes/color.routes.js"
import discountRoutes from "./routes/discount.routes.js"
import couponRoutes from "./routes/coupon.routes.js"
import productRoutes from "./routes/product.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import wishlistRoutes from "./routes/wishlist.route.js"
import reviewRoutes from "./routes/review.routes.js"
import orderRoutes from "./routes/order.routes.js"
import paymentRoutes from "./routes/payment.routes.js"

// all the main routes are here
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/profiles", profileRoutes)
app.use("/api/v1/products", productRoutes)
app.use("/api/v1/carts", cartRoutes)
app.use("/api/v1/wishlists", wishlistRoutes)
app.use("/api/v1/reviews", reviewRoutes)
app.use("/api/v1/categories", categoryRoutes)
app.use("/api/v1/brands", brandRoutes)
app.use("/api/v1/colors", colorRoutes)
app.use("/api/v1/discounts", discountRoutes)
app.use("/api/v1/coupons", couponRoutes)
app.use("/api/v1/orders", orderRoutes)
app.use("/api/v1/payments", paymentRoutes)

export default app