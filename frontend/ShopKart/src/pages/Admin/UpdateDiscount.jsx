import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";

//shadcn
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetDiscountByIdQuery,
  useUpdateDiscountMutation,
} from "@/redux/api/discountApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "@/components/mycomponents/Loader";
import { useToast } from "@/hooks/use-toast";

const UpdateDiscount = () => {
  const { discountId } = useParams();
  const navigate = useNavigate();

  const { toast } = useToast();

  const [discountName, setDiscountName] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [discountExpiry, setDiscountExpiry] = useState("");

  const [updateDiscount] = useUpdateDiscountMutation();
  const { data: discounts, isLoading } = useGetDiscountByIdQuery(discountId);

  useEffect(() => {
    if (discounts && discounts.data._id) {
      setDiscountName(discounts.data.discountName);
      setDiscountType(discounts.data.discountType);
      setDiscountValue(discounts.data.discountValue);
      const expiryDate = discounts.data.discountExpiry.replace("Z", "");
      setDiscountExpiry(expiryDate);
    }
  }, [discounts]);

  const handleDiscountUpdate = async () => {
    try {
      const discountData = {
        discountName,
        discountType,
        discountValue,
        discountExpiry,
      };
      await updateDiscount(discountData);
      toast({
        title: "Discount updated!",
        description: "The brand was updated successfully.",
      });
      navigate("/admin/discounts");
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      console.log("Failed to update", error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-96">
        <Loader size="3em" topBorderSize="0.3em" />
      </div>
    );
  }
  return (
    <section className="w-full">
      <main className="">
        <form action="" className="space-y-4">
          <div className="space-y-2 w-full">
            <label htmlFor="discountName">Discount Name</label>
            <Input
              type="text"
              id="discountName"
              value={discountName}
              onChange={(e) => setDiscountName(e.target.value)}
              placeholder="Discount Name"
              className="outline outline-1 outline-gray-300 w-[50%]"
            />
          </div>
          <div className="space-y-2 w-full">
            <label htmlFor="discountType">Discount Type</label>
            <Select
              value={discountType}
              onValueChange={(value) => setDiscountType(value)}
            >
              <SelectTrigger className="w-[520px]">
                <SelectValue placeholder="Select Discount Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Percentage">Percentage</SelectItem>
                <SelectItem value="Fixed">Fixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 w-full">
            <label htmlFor="discountValue">Discount Value</label>
            <Input
              type="number"
              id="discountValue"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder="Discount Value"
              className="outline outline-1 outline-gray-300 w-[50%]"
            />
          </div>
          <div className="space-y-2 w-full">
            <label htmlFor="discountExpiry">Discount Expiry</label>
            <Input
              type="datetime-local"
              id="discountExpiry"
              value={discountExpiry}
              onChange={(e) => setDiscountExpiry(e.target.value)}
              placeholder="Discount Expiry"
              className="outline outline-1 outline-gray-300 w-[50%] block"
            />
          </div>
          <Button variant="shop" onClick={handleDiscountUpdate}>
            Update Discount
          </Button>
        </form>
      </main>
    </section>
  );
};

export default UpdateDiscount;
