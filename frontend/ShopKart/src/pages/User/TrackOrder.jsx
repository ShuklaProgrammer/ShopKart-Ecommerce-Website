import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

// icon
import { IoMdArrowForward } from "react-icons/io";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { useTrackOrderMutation } from "@/redux/api/orderApiSlice";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/mycomponents/Loader";
import { useFormik } from "formik";
import * as Yup from "yup";

const TrackOrder = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [orderId, setOrderId] = useState("");
  const [deliveryEmail, setDeliveryEmail] = useState("");

  const [trackOrder] = useTrackOrderMutation();

  const handleTrackOrder = async () => {
    setIsLoading(true);

    setIsLoading(false);
  };

  const validationSchema = Yup.object().shape({
    orderId: Yup.string().required("OrderId is required"),
    deliveryEmail: Yup.string().required("Delivery email is required"),
  });

  const formik = useFormik({
    initialValues: {
      orderId: "",
      deliveryEmail: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const trackOrderData = {
          orderId: values.orderId,
          deliveryEmail: values.deliveryEmail,
        };
        const response = await trackOrder({ trackOrderData });
        const orderID = response.data?.data._id;
        navigate("/track-order-details", { state: { orderID } });
      } catch (error) {
        console.log("Error while tracking order", error);
        setSubmitting(false);
      }
    },
  });

  return (
    <section className="flex justify-center sm:mx-10 my-10">
      <form onSubmit={formik.handleSubmit} className="w-[90%] space-y-4">
        <h1 className="text-2xl font-semibold">Track Order</h1>
        <p className="text-gray-500">
          To track your order please enter your order ID in the input field
          below and press the “Track Order” button. this was given to you on
          your receipt and in the confirmation email you should have received.
        </p>
        <div className="sm:flex items-center gap-10 space-y-4 sm:space-y-0">
          <div className="space-y-2">
            <span>Order ID</span>
            <Input
              id="orderId"
              value={formik.values.orderId}
              onChange={formik.handleChange}
              className="border-2 sm:w-[30vw]"
              placeholder="ID..."
            />
            {formik.touched.orderId && formik.errors.orderId ? (
              <div className="text-red-500 text-sm">
                {formik.errors.orderId}
              </div>
            ) : null}
          </div>
          <div className="space-y-2">
            <span>Delivery Email</span>
            <Input
              id="deliveryEmail"
              value={formik.values.deliveryEmail}
              onChange={formik.handleChange}
              className="border-2 sm:w-[30vw]"
              placeholder="Email address"
            />
            {formik.touched.deliveryEmail && formik.errors.deliveryEmail ? (
              <div className="text-red-500 text-sm">
                {formik.errors.deliveryEmail}
              </div>
            ) : null}
          </div>
        </div>
        <p className="flex items-center gap-2">
          <AiOutlineInfoCircle className="text-2xl" />
          Order ID that we sended to your in your email address.
        </p>
        <Button
          type="submit"
          onClick={handleTrackOrder}
          disabled={formik.isSubmitting}
          variant="shop"
          className="px-5 py-3 rounded"
        >
          {formik.isSubmitting ? (
            <span className="flex items-center gap-2">
              Tracking...
              <Loader
                size="2em"
                topBorderSize="0.2em"
                center={false}
                fullScreen={false}
              />
              <IoMdArrowForward className="text-lg" />
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Track Order
              <IoMdArrowForward className="text-lg" />
            </span>
          )}
        </Button>
      </form>
    </section>
  );
};

export default TrackOrder;
