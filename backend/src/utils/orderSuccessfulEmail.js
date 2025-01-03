import Mailgun from "mailgun.js";
import formData from "form-data";
import asyncHandler from "./asyncHandler.js";
import ApiResponse from "./apiResponse.js";
import { Order } from "../models/order.model.js";

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

const sendOrderSuccessfulEmail = async (email, orderId) => {
  const order = await Order.findById(orderId).populate(
    "orderItems.productId",
    "title",
  );

  const data = {
    from: `ShopKart <mailgun@${process.env.MAILGUN_DOMAIN}>`,
    to: email,
    subject: "Order Successful",
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; text-align: center; padding: 20px;">
        <!-- Logo and Company Name, Centered -->
            <span style="font-size: 28px; font-weight: bold; margin-left: 10px;">ShopKart</span>

        <!-- Email Header -->
        <h2 style="font-size: 24px; color: #0056b3;">Your Order Was Successful!</h2>
        <p style="font-size: 16px; margin: 10px 0;">Dear Customer,</p>
        <p style="font-size: 16px; margin: 10px 0;">
            Thank you for shopping with us! We are pleased to inform you that your order has been successfully placed.
        </p>
        <p style="font-size: 16px; margin: 10px 0;">
            <strong>Order ID:</strong> ${orderId}
        </p>
         <p style="font-size: 16px; margin: 10px 0;">
            You can use your <strong>Order ID</strong> to track your order status at any time by logging into your account on our website or using our order tracking tool.
        </p>

        <!-- Order Details Table -->
        <h3 style="font-size: 20px; color: #0056b3;">Order Details:</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
                <tr style="background-color: #f4f4f4;">
                    <th style="padding: 10px; text-align: left;">Product</th>
                    <th style="padding: 10px; text-align: center;">Quantity</th>
                    <th style="padding: 10px; text-align: right;">Price</th>
                </tr>
            </thead>
            <tbody>
                ${order.orderItems
                  .map(
                    (item) => `
                    <tr>
                        <td style="padding: 10px; text-align: left; word-wrap: break-word; max-width: 200px;">
                            <div style="display: flex; align-items: center;">
                                <img src="${item.productId.image}" alt="" style="width: 100px; height: auto; line-height: 1.5em; margin-right: 10px;" />
                                <span style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; max-height: 3em">${item.productId.title}</span>
                            </div>
                        </td>
                        <td style="padding: 10px; text-align: center;">${item.quantity}</td>
                        <td style="padding: 10px; text-align: right;">$${item.price.toFixed(2)}</td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>

        <!-- Order Summary and Support Info -->
        <p style="font-size: 16px; margin: 10px 0;">
            You can track your order status and view details by logging into your account on our website.
        </p>
        <p style="font-size: 16px; margin: 10px 0;">
            If you have any questions or need assistance, please do not hesitate to contact our support team.
        </p>
        <p style="font-size: 16px; margin: 20px 0;">
            Thank you for choosing ShopKart!
        </p>
        <p style="font-size: 16px; margin: 20px 0;">
            Best regards,<br>
            The ShopKart Team
        </p>

        <!-- Footer with Contact Info -->
        <p style="font-size: 12px; color: #888; text-align: center; margin-top: 20px;">
            <small>If you received this email in error or wish to unsubscribe, please contact us at support@shopkart.com.</small>
        </p>
    </div>
`,
  };

  await mg.messages.create(process.env.MAILGUN_DOMAIN, data);
};

export { sendOrderSuccessfulEmail };
