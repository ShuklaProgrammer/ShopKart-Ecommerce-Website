import React, { useState } from "react";

// shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// all the icons are imported here
import { GrEdit } from "react-icons/gr";
import { MdDeleteOutline } from "react-icons/md";

import {
  useCreateCategoryMutation,
  useGetAllCategoryQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "@/redux/api/categoryApiSlice";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from "@/components/mycomponents/Loader";
import { useToast } from "@/hooks/use-toast";

const AddCategory = () => {
  const { toast } = useToast();

  const [addCategory] = useCreateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const [updatedCategoryName, setUpdatedCategoryName] = useState("");

  const { data: getAllCategory, isLoading } = useGetAllCategoryQuery();

  const categories = getAllCategory?.data || [];

  const handleUpdateCategory = async (categoryId, updatedName) => {
    try {
      await updateCategory({ categoryId, categoryName: updatedName });
      toast({
        title: "Category added!",
        description: "The category was added successfully.",
      });
    } catch (error) {
      toast({
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      console.log("cannot update the category", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    await deleteCategory(categoryId);
  };

  const validationSchema = Yup.object().shape({
    categoryName: Yup.string().required("The category name is required"),
  });

  const formik = useFormik({
    initialValues: {
      categoryName: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await addCategory({ categoryName: values.categoryName }).unwrap();
        toast({
          title: "Category added!",
          description: "The category was added successfully.",
        });
      } catch (error) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
        console.log("Cannot add the category", error);
        setSubmitting(false);
      }
    },
  });

  if (isLoading) {
    return (
      <div className="h-96">
        <Loader size="3em" topBorderSize="0.3em" />
      </div>
    );
  }

  return (
    <section className="flex flex-grow">
      <main className="w-[50%]">
        <form
          onSubmit={formik.handleSubmit}
          className="flex items-center gap-2"
        >
          <Input
            id="categoryName"
            type="text"
            value={formik.values.categoryName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your category name..."
            className="outline outline-1 outline-gray-300 w-[50%]"
          />
          <Button variant="shop" type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? (
              <span className="flex items-center gap-2">
                Adding Category...
                <Loader
                  size="2em"
                  topBorderSize="0.2em"
                  center={false}
                  fullScreen={false}
                />
              </span>
            ) : (
              "Add Category"
            )}
          </Button>
        </form>
        {formik.touched.categoryName && formik.errors.categoryName ? (
          <div className="text-red-500 text-sm">
            {formik.errors.categoryName}
          </div>
        ) : null}

        <div className="border-2 mt-5">
          <Table>
            <TableCaption>A list of your recent categories.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>All Categories</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {category.categoryName}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger>
                        <GrEdit className="text-xl" />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Catgeory</DialogTitle>
                          <DialogDescription>
                            <Input
                              type="text"
                              defaultValue={category.categoryName}
                              onChange={(e) =>
                                setUpdatedCategoryName(e.target.value)
                              }
                              placeholder="Enter your category name..."
                              className="outline outline-1 outline-gray-300 w-[50%]"
                            />
                            <Button
                              variant="shop"
                              onClick={() =>
                                handleUpdateCategory(
                                  category._id,
                                  updatedCategoryName
                                )
                              }
                            >
                              Update Category
                            </Button>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <MdDeleteOutline className="text-xl" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your category and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCategory(category._id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </section>
  );
};

export default AddCategory;
