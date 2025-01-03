// This controller is specially for the discount removal from the product after expiartion.

import cron from "cron";
import { updateExpireDiscounts } from "../controllers/product.controller.js";

const job = new cron.CronJob("0 * * * * *", () => {
  console.log("Checking for expired discounts...");
  updateExpireDiscounts();
});

export default job;
