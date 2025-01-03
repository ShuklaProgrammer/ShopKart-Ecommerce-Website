import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateDiscountMutation } from "@/redux/api/discountApiSlice";
import React, { useRef, useState } from "react";

//shadcn
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddDiscountToAProductMutation,
  useGetProductByIdQuery,
} from "@/redux/api/productApiSlice";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from "@/components/mycomponents/Loader";
import { useToast } from "@/hooks/use-toast";

const AddDiscount = () => {
  const { toast } = useToast();

  const { productId } = useParams();

  const navigate = useNavigate();

  const [actionType, setActionType] = useState("");

  const [createDiscount] = useCreateDiscountMutation();
  const [addDiscountToProduct] = useAddDiscountToAProductMutation(productId);
  const { data: productData } = useGetProductByIdQuery(productId, {
    skip: !productId,
  });

  const product = productData?.data || [];

  const handleDiscountSubmit = async (e) => {
    e.preventDefault();
    try {
      const discountData = {
        discountName,
        discountType,
        discountValue,
        discountExpiry,
      };

      await createDiscount(discountData);
      navigate("/admin/discounts");
      console.log("Discount created successfully");
    } catch (error) {
      console.log("Discount creation failed", error);
    }
  };

  const handleAddDiscountToAProduct = async (e) => {
    e.preventDefault();
    try {
      const discountData = {
        discountName,
        discountType,
        discountValue,
        discountExpiry,
      };
      await addDiscountToProduct({ productId, discountData });
      console.log("The discount added to the product successfully");
    } catch (error) {
      console.log("The error while adding discount to the product", error);
    }
  };

  const validationSchema = Yup.object().shape({
    discountName: Yup.string().required("Discount name is required"),
    discountType: Yup.string().required("Discount type is required"),
    discountValue: Yup.number().required("Discount value is required"),
    discountExpiry: Yup.date().required("Discount expiry is required"),
  });

  const formik = useFormik({
    initialValues: {
      discountName: "",
      discountType: "",
      discountValue: "",
      discountExpiry: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const discountData = {
          discountName: values.discountName,
          discountType: values.discountType,
          discountValue: values.discountValue,
          discountExpiry: values.discountExpiry,
        };
        if (actionType === "addDiscountToProduct") {
          await addDiscountToProduct({ productId, discountData });
          toast({
            title: "Discount added!",
            description: "The discount was added to product successfully.",
          });
        } else if (actionType === "createDiscount") {
          await createDiscount(discountData);
          toast({
            title: "Discount added!",
            description: "The discount was added successfully.",
          });
        }
      } catch (error) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
        console.log("Cannot add the discount", error);
        setSubmitting(false);
      }
    },
  });

  return (
    <section className="w-full">
      <main className="flex justify-between gap-5">
        <form onSubmit={formik.handleSubmit} className="space-y-4 w-full">
          <div className="space-y-2 w-full">
            <label htmlFor="discountName">Discount Name</label>
            <Input
              id="discountName"
              name="discountName"
              type="text"
              value={formik.values.discountName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Discount Name"
              className="outline outline-1 outline-gray-300 w-[50%]"
            />
            {formik.touched.discountName && formik.errors.discountName ? (
              <div className="text-red-500 text-sm">
                {formik.errors.discountName}
              </div>
            ) : null}
          </div>
          <div className="space-y-2 w-full">
            <label htmlFor="discountType">Discount Type</label>
            <Select
              onValueChange={(value) =>
                formik.setFieldValue("discountType", value)
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Discount Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Percentage">Percentage</SelectItem>
                <SelectItem value="Fixed">Fixed</SelectItem>
              </SelectContent>
            </Select>
            {formik.touched.discountType && formik.errors.discountType ? (
              <div className="text-red-500 text-sm">
                {formik.errors.discountType}
              </div>
            ) : null}
          </div>
          <div className="space-y-2 w-full">
            <label htmlFor="discountValue">Discount Value</label>
            <Input
              name="discountValue"
              type="number"
              id="discountValue"
              value={formik.values.discountValue}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Discount Value"
              className="outline outline-1 outline-gray-300 w-[50%]"
            />
            {formik.touched.discountValue && formik.errors.discountValue ? (
              <div className="text-red-500 text-sm">
                {formik.errors.discountValue}
              </div>
            ) : null}
          </div>
          <div className="space-y-2 w-full">
            <label htmlFor="discountExpiry">Discount Expiry</label>
            <Input
              name="discountExpiry"
              type="datetime-local"
              id="discountExpiry"
              value={formik.values.discountExpiry}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Discount Expiry"
              className="outline outline-1 outline-gray-300 w-[50%] block"
            />
            {formik.touched.discountExpiry && formik.errors.discountExpiry ? (
              <div className="text-red-500 text-sm">
                {formik.errors.discountExpiry}
              </div>
            ) : null}
          </div>
          {productId ? (
            <Button
              variant="shop"
              type="submit"
              onClick={() => setActionType("addDiscountToProduct")}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <span className="flex items-center gap-2">
                  Adding Discount To Product...
                  <Loader
                    size="2em"
                    topBorderSize="0.2em"
                    center={false}
                    fullScreen={false}
                  />
                </span>
              ) : (
                "Add Discount To Product"
              )}
            </Button>
          ) : (
            <Button
              variant="shop"
              type="submit"
              onClick={() => setActionType("createDiscount")}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <span className="flex items-center gap-2">
                  Adding Discount...
                  <Loader
                    size="2em"
                    topBorderSize="0.2em"
                    center={false}
                    fullScreen={false}
                  />
                </span>
              ) : (
                "Add Discount"
              )}
            </Button>
          )}
        </form>

        <Table className="w-[60%]">
          <TableCaption>A list of your recent discounts.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Discount on Product</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product && (
              <TableRow>
                <TableCell className="font-medium">
                  {product.discount}
                </TableCell>
                {/* <TableCell></TableCell> */}
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </main>
    </section>
  );
};

export default AddDiscount;
