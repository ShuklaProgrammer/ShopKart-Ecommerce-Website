import React from "react";

//shadcn
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  useDeleteDiscountMutation,
  useGetAllDiscountsQuery,
} from "@/redux/api/discountApiSlice";

//all the icons imported here
import { PiDotsThreeOutline } from "react-icons/pi";
import { Link } from "react-router-dom";
import Loader from "@/components/mycomponents/Loader";

const AllDiscount = () => {
  const { data: discountData, isLoading } = useGetAllDiscountsQuery();
  const discounts = discountData?.data || [];

  const [deleteDiscount] = useDeleteDiscountMutation();

  const handleDeleteDiscount = async (discountId) => {
    await deleteDiscount(discountId);
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
      <main className="w-[90%]">
        <Table>
          <TableCaption>A list of your recent discounts.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Discount Name</TableHead>
              <TableHead>Discount Type</TableHead>
              <TableHead>Discount Value</TableHead>
              <TableHead className="text-right">Discount Expiry</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discounts.map((discount, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {discount.discountName}
                </TableCell>
                <TableCell>{discount.discountType}</TableCell>
                <TableCell>{discount.discountValue}</TableCell>
                <TableCell className="text-right">
                  {new Date(discount.discountExpiry).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <PiDotsThreeOutline className="text-xl" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
                      <div className="flex flex-col">
                        <Link to={`/admin/update-discount/${discount._id}`}>
                          <p className="text-sm p-2 hover:cursor-pointer hover:bg-gray-200">
                            Update Discount
                          </p>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger className="text-sm p-2 hover:bg-gray-200">
                            Delete Discount
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteDiscount(discount._id)
                                }
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </section>
  );
};

export default AllDiscount;
