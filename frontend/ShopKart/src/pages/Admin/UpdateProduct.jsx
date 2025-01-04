import React, { useEffect, useRef, useState } from "react";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "@/redux/api/productApiSlice";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

//all the icons are here
import { RxCrossCircled } from "react-icons/rx";

//shadcn
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiUploadCloud } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { RiVideoUploadLine } from "react-icons/ri";
import { useGetAllCategoryQuery } from "@/redux/api/categoryApiSlice";
import { useGetAllBrandsQuery } from "@/redux/api/brandApiSlice";
import { useNavigate, useParams } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from "@/components/mycomponents/Loader";
import { useToast } from "@/hooks/use-toast";

const UpdateProduct = () => {
  const { productId } = useParams();

  const { toast } = useToast();

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const { data: productDataById, isLoading: productLoading } =
    useGetProductByIdQuery(productId);

  const [tagInput, setTagInput] = useState("");

  const [updateProduct] = useUpdateProductMutation();

  const { data: getAllCategory, isLoading: categoryLoading } =
    useGetAllCategoryQuery();

  const { data: getAllBarnds, isLoading: brandLoading } =
    useGetAllBrandsQuery();

  const categories = getAllCategory?.data || [];
  const brands = getAllBarnds?.data || [];

  // console.log(categories)

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputPressKey = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (newTag && !formik.values.tags.includes(newTag)) {
        formik.setFieldValue("tags", [...formik.values.tags, newTag]);
        setTagInput("");
      }
    }
  };

  const handleProductAdditionalInfoChange = (index, key, value) => {
    const additionalInfo = [...formik.values.additionalInformation];
    additionalInfo[index] = { key, value };
    formik.setFieldValue("additionalInformation", additionalInfo);
  };

  const handleProductSpecificationsChange = (index, key, value) => {
    const specs = [...formik.values.specifications];
    specs[index] = { key, value };
    formik.setFieldValue("specifications", specs);
  };

  const handleProductDeliveryInfoChange = (index, key, value) => {
    const delivery = [...formik.values.deliveryInfo];
    delivery[index] = { key, value };
    formik.setFieldValue("deliveryInfo", delivery);
  };

  const addProductAdditionalInfoField = (e) => {
    formik.setFieldValue("additionalInformation", [
      ...formik.values.additionalInformation,
      { key: "", value: "" },
    ]);
  };

  const addProductSpecificationsField = () => {
    formik.setFieldValue("specifications", [
      ...formik.values.specifications,
      { key: "", value: "" },
    ]);
  };

  const addProductDeliveryInfoField = () => {
    formik.setFieldValue("deliveryInfo", [
      ...formik.values.deliveryInfo,
      { key: "", value: "" },
    ]);
  };

  const removeTag = (index) => {
    const updatedTags = formik.values.tags.filter((_, i) => i !== index);
    formik.setFieldValue("tags", updatedTags);
  };

  const removeProductAdditionalInfoField = (index) => {
    const additionalInfo = formik.values.additionalInformation.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("additionalInformation", additionalInfo);
  };

  const removeProductSpecificationsField = (index) => {
    const specs = formik.values.specifications.filter((_, i) => i !== index);
    formik.setFieldValue("specifications", specs);
  };

  const removeProductDeliveryInfoField = (index) => {
    const delivery = formik.values.deliveryInfo.filter((_, i) => i !== index);
    formik.setFieldValue("deliveryInfo", delivery);
  };

  const handleImageUploadClick = () => {
    imageInputRef.current.click();
  };

  const handleVideoUploadClick = () => {
    videoInputRef.current.click();
  };

  const handleImageUploadChange = (e) => {
    const files = Array.from(e.target.files);

    if (formik.values.productImage.length + files.length <= 10) {
      // Set actual file objects for Formik
      formik.setFieldValue("productImage", [
        ...formik.values.productImage,
        ...files,
      ]);

      if (selectedImageIndex === null && files.length > 0) {
        setSelectedImageIndex(0);
      }
    } else {
      alert("You can upload only 10 images");
    }
  };

  const handleVideoUploadChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue("productVideo", file);
      console.log("File set in Formik:", file);
    }
  };

  const handleThumbnailUpload = (imageIndex) => {
    setSelectedImageIndex(imageIndex);
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().required("Price is required"),
    productImage: Yup.array()
      .min(1, "At least one product image is required")
      .of(Yup.mixed().required("Product image is required")),
    productVideo: Yup.string().notRequired(),
    brand: Yup.string().required("Brand is required"),
    category: Yup.string().required("Category is required"),
    sku: Yup.string().notRequired(),
    stockQuantity: Yup.number().required("Stock quantity is required"),
    tags: Yup.array()
      .of(Yup.string().required("Tag cannot be empty"))
      .min(1, "At least one tag is required"),
    additionalInformation: Yup.array().of(
      Yup.object().shape({
        key: Yup.string().notRequired(),
        value: Yup.string().notRequired(),
      })
    ),
    specifications: Yup.array().of(
      Yup.object().shape({
        key: Yup.string().notRequired(),
        value: Yup.string().notRequired(),
      })
    ),
    deliveryInfo: Yup.array().of(
      Yup.object().shape({
        key: Yup.string().notRequired(),
        value: Yup.string().notRequired(),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      productImage: [],
      productVideo: "",
      brand: "",
      category: "",
      sku: "",
      stockQuantity: "",
      tags: [],
      additionalInformation: [{ key: "", value: "" }],
      specifications: [{ key: "", value: "" }],
      deliveryInfo: [{ key: "", value: "" }],
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("price", values.price);
        values.productImage.forEach((image) => {
          formData.append("productImage", image);
        });
        if (values.productVideo) {
          formData.append("productVideo", values.productVideo);
        }
        formData.append("brand", values.brand);
        formData.append("category", values.category),
          formData.append("sku", values.sku);
        formData.append("stockQuantity", values.stockQuantity);
        values.tags.forEach((tag) => {
          formData.append("tags", tag);
        });
        values.additionalInformation.forEach((info, index) => {
          formData.append(`additionalInformation[${index}][key]`, info.key);
          formData.append(`additionalInformation[${index}][value]`, info.value);
        });
        values.specifications.forEach((spec, index) => {
          formData.append(`specifications[${index}][key]`, spec.key);
          formData.append(`specifications[${index}][value]`, spec.value);
        });
        values.deliveryInfo.forEach((delivery, index) => {
          formData.append(`deliveryInfo[${index}][key]`, delivery.key);
          formData.append(`deliveryInfo[${index}][value]`, delivery.value);
        });

        await updateProduct({ productId, formData });
        toast({
          title: "Product updated!",
          description: "The product was updated successfully.",
        });
      } catch (error) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
        console.log("Product submmision failed", error);
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (productDataById && productDataById.data._id) {
      formik.setFieldValue("title", productDataById.data.title);
      formik.setFieldValue("description", productDataById.data.description);
      formik.setFieldValue("price", productDataById.data.price);
      if (productDataById.data.productImage.length > 0) {
        formik.setFieldValue("productImage", productDataById.data.productImage);
      }
      if (productDataById.data.productVideo) {
        formik.setFieldValue("productVideo", productDataById.data.productVideo);
      }
      formik.setFieldValue("category", productDataById.data.category?._id);
      formik.setFieldValue("brand", productDataById.data.brand?._id);
      formik.setFieldValue("sku", productDataById.data.sku);
      formik.setFieldValue("stockQuantity", productDataById.data.stockQuantity);
      formik.setFieldValue("tags", productDataById.data.tags);
      if (
        productDataById?.data?.additionalInformation.length > 0 &&
        productDataById?.data?.additionalInformation
      ) {
        formik.setFieldValue(
          "additionalInformation",
          productDataById.data.additionalInformation
        );
      }
      if (
        productDataById?.data?.specifications.length > 0 &&
        productDataById?.data?.specifications
      ) {
        formik.setFieldValue(
          "specifications",
          productDataById.data.specifications
        );
      }
      if (
        productDataById?.data?.deliveryInfo.length > 0 &&
        productDataById?.data?.deliveryInfo
      ) {
        formik.setFieldValue("deliveryInfo", productDataById.data.deliveryInfo);
      }
    }
  }, [productDataById]);

  const isLoading = productLoading || categoryLoading || brandLoading;

  if (isLoading) {
    return (
      <div className="h-96">
        <Loader size="3em" topBorderSize="0.3em" />
      </div>
    );
  }

  return (
    <section className="flex flex-grow">
      <main className="pb-10">
        <h1 className="text-xl my-5 font-semibold">Product</h1>
        <form
          onSubmit={formik.handleSubmit}
          className="flex justify-between gap-20"
        >
          <section className="w-full space-y-4">
            <div className="space-y-2">
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                type="text"
                className="outline-gray-300 outline outline-1"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.title && formik.errors.title ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.title}
                </div>
              ) : null}
            </div>
            <div className="space-y-2">
              <label htmlFor="description">Decription</label>
              <Textarea
                id="description"
                type="text"
                className="h-36"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.description}
                </div>
              ) : null}
            </div>
            <div className="space-y-2">
              <label htmlFor="price">Price</label>
              <Input
                id="price"
                type="number"
                className="outline-gray-300 outline outline-1"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.price && formik.errors.price ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.price}
                </div>
              ) : null}
            </div>
            <div className="flex justify-between gap-5">
              <div className="space-y-2">
                <label htmlFor="category">Category</label>
                <Select
                  value={formik.values.category}
                  onValueChange={(value) =>
                    formik.setFieldValue("category", value)
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories && categories.length > 0 ? (
                      categories?.map((category, index) => (
                        <SelectItem key={index} value={category._id}>
                          {category.categoryName}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="notFound">
                        No Category Available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formik.touched.category && formik.errors.category ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.category}
                  </div>
                ) : null}
              </div>
              <div className="space-y-2">
                <label htmlFor="brand">Brand</label>
                <Select
                  value={formik.values.brand}
                  onValueChange={(value) =>
                    formik.setFieldValue("brand", value)
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands && brands.length > 0 ? (
                      brands?.map((brand, index) => (
                        <SelectItem key={index} value={brand._id}>
                          {brand.brandName}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="notFound">
                        No Brand Available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formik.touched.brand && formik.errors.brand ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.brand}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="sku">
                Sku <span className="text-gray-500">(Optional)</span>
              </label>
              <Input
                id="sku"
                type="text"
                className="outline-gray-300 outline outline-1"
                value={formik.values.sku}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.sku && formik.errors.sku ? (
                <div className="text-red-500 text-sm">{formik.errors.sku}</div>
              ) : null}
            </div>
            <div className="space-y-2">
              <label htmlFor="stockQuantity">Stock Quantity</label>
              <Input
                id="stockQuantity"
                type="number"
                className="outline-gray-300 outline outline-1"
                value={formik.values.stockQuantity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.stockQuantity && formik.errors.stockQuantity ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.stockQuantity}
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <label htmlFor="tag">Tags</label>
              <Input
                id="tag"
                type="text"
                className="outline-gray-300 outline outline-1"
                value={tagInput}
                onChange={handleTagInputChange}
                onBlur={() => formik.setFieldTouched("tags", true)}
                onKeyPress={handleTagInputPressKey}
                placeholder="Enter tags..."
              />
              {formik.touched.tags && formik.errors.tags ? (
                <div className="text-red-500 text-sm">{formik.errors.tags}</div>
              ) : null}
              <div>
                {formik.values.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button onClick={() => removeTag(index)}>x</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p>Additional Information</p>
              <Dialog>
                <DialogTrigger className="outline-gray-300 outline outline-1 hover:bg-gray-100 w-full py-2 rounded-lg">
                  Add Additional Information
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Additional Information</DialogTitle>
                    <DialogDescription>
                      {formik.values.additionalInformation.map(
                        (info, index) => (
                          <div key={index}>
                            {index === 0 && (
                              <label htmlFor="additionalInfo">
                                Additional Info
                              </label>
                            )}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center w-full gap-2 my-2">
                                <Input
                                  type="text"
                                  className="outline-gray-300 outline outline-1"
                                  value={info.key}
                                  onChange={(e) =>
                                    handleProductAdditionalInfoChange(
                                      index,
                                      e.target.value,
                                      info.value
                                    )
                                  }
                                  placeholder="Key"
                                />
                                <Input
                                  type="text"
                                  className="outline-gray-300 outline outline-1"
                                  value={info.value}
                                  onChange={(e) =>
                                    handleProductAdditionalInfoChange(
                                      index,
                                      info.key,
                                      e.target.value
                                    )
                                  }
                                  placeholder="Value"
                                />
                              </div>
                              {index === 0 && (
                                <Button
                                  variant="shop"
                                  onClick={addProductAdditionalInfoField}
                                >
                                  Add
                                </Button>
                              )}
                              {index !== 0 && (
                                <RxCrossCircled
                                  className="text-xl hover:cursor-pointer hover:text-red-500"
                                  onClick={() =>
                                    removeProductAdditionalInfoField(index)
                                  }
                                />
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              {formik.touched.additionalInformation &&
              formik.errors.additionalInformation ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.additionalInformation}
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <p>Specifications</p>
              <Dialog>
                <DialogTrigger className="outline-gray-300 outline outline-1 hover:bg-gray-100 w-full py-2 rounded-lg">
                  Add Specifications
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Specifications</DialogTitle>
                    <DialogDescription>
                      {formik.values.specifications.map((spec, index) => (
                        <div key={index}>
                          {index === 0 && (
                            <label htmlFor="specifications">
                              Specifications
                            </label>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center w-full my-2">
                              <Input
                                type="text"
                                className="outline-gray-300 outline outline-1"
                                value={spec.key}
                                onChange={(e) =>
                                  handleProductSpecificationsChange(
                                    index,
                                    e.target.value,
                                    spec.value
                                  )
                                }
                                placeholder="Key"
                              />
                              <Input
                                type="text"
                                className="outline-gray-300 outline outline-1"
                                value={spec.value}
                                onChange={(e) =>
                                  handleProductSpecificationsChange(
                                    index,
                                    spec.key,
                                    e.target.value
                                  )
                                }
                                placeholder="Value"
                              />
                            </div>
                            {index === 0 && (
                              <Button
                                variant="shop"
                                onClick={addProductSpecificationsField}
                              >
                                Add
                              </Button>
                            )}
                            {index !== 0 && (
                              <RxCrossCircled
                                className="text-xl hover:text-red-500 hover:cursor-pointer"
                                onClick={() =>
                                  removeProductSpecificationsField(index)
                                }
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              {formik.touched.specifications && formik.errors.specifications ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.specifications}
                </div>
              ) : null}
            </div>

            <div className="space-y-2">
              <p>Add Delivery Information</p>

              <Dialog>
                <DialogTrigger className="outline-gray-300 outline outline-1 hover:bg-gray-100 w-full py-2 rounded-lg">
                  Add Delivery Information
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Delivery Information</DialogTitle>
                    <DialogDescription>
                      {formik.values.deliveryInfo.map((ship, index) => (
                        <div key={index}>
                          {index === 0 && (
                            <label htmlFor="deliveryInfo">Delivery Info</label>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center w-full my-2">
                              <Input
                                type="text"
                                className="outline-gray-300 outline outline-1"
                                value={ship.key}
                                onChange={(e) =>
                                  handleProductDeliveryInfoChange(
                                    index,
                                    e.target.value,
                                    ship.value
                                  )
                                }
                                placeholder="Key"
                              />
                              <Input
                                type="text"
                                className="outline-gray-300 outline outline-1"
                                value={ship.value}
                                onChange={(e) =>
                                  handleProductDeliveryInfoChange(
                                    index,
                                    ship.key,
                                    e.target.value
                                  )
                                }
                                placeholder="Value"
                              />
                            </div>
                            {index === 0 && (
                              <Button
                                variant="shop"
                                onClick={addProductDeliveryInfoField}
                              >
                                Add
                              </Button>
                            )}
                            {index !== 0 && (
                              <RxCrossCircled
                                className="text-xl hover:text-red-500 hover:cursor-pointer"
                                onClick={() =>
                                  removeProductDeliveryInfoField(index)
                                }
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>

              {formik.touched.deliveryInfo && formik.errors.deliveryInfo ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.deliveryInfo}
                </div>
              ) : null}
            </div>
          </section>

          <section className="flex flex-col justify-between">
            <div className="flex flex-col gap-5">
              <div
                className="outline-gray-300 outline outline-1 w-[30vw] h-[40vh] hover:cursor-pointer hover:bg-gray-100 flex items-center justify-center"
                onClick={handleImageUploadClick}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUploadChange}
                  ref={imageInputRef}
                  className="hidden"
                />
                {formik.values.productImage.length > 0 ? (
                  <img
                    src={
                      selectedImageIndex !== null
                        ? formik.values.productImage[
                            selectedImageIndex
                          ] instanceof File
                          ? URL.createObjectURL(
                              formik.values.productImage[selectedImageIndex]
                            )
                          : formik.values.productImage[selectedImageIndex]
                        : formik.values.productImage[0] instanceof File
                        ? URL.createObjectURL(formik.values.productImage[0])
                        : formik.values.productImage[0]
                    }
                    alt=""
                    className="w-[60%]"
                  />
                ) : (
                  <>
                    <FiUploadCloud className="text-6xl text-gray-400" />
                    <p className="ml-2 text-gray-500">
                      Click here to upload image
                    </p>
                  </>
                )}
              </div>
              <div className="overflow-x-auto w-[30vw] whitespace-nowrap">
                {formik.values.productImage.map((image, index) => (
                  <div
                    key={index}
                    className="border border-1 border-gray-400 w-14 h-14 inline-block hover:cursor-pointer"
                    onClick={() => handleThumbnailUpload(index)}
                  >
                    <img
                      src={
                        image instanceof File
                          ? URL.createObjectURL(image)
                          : image
                      }
                      alt=""
                      className="w-20"
                    />
                  </div>
                ))}
              </div>
              {formik.touched.productImage && formik.errors.productImage ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.productImage}
                </div>
              ) : null}

              <Button
                variant="shop"
                type="button"
                onClick={handleImageUploadClick}
              >
                Upload Image
              </Button>
            </div>

            <div>
              <div
                className="outline-gray-300 outline outline-1 w-[30vw] h-[40vh] hover:cursor-pointer hover:bg-gray-100 flex justify-center items-center mb-5"
                onClick={handleVideoUploadClick}
              >
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUploadChange}
                  ref={videoInputRef}
                  className="hidden"
                />
                {!formik.values.productVideo ? (
                  <>
                    <RiVideoUploadLine className="text-4xl text-gray-400" />
                    <p className="ml-2 text-gray-500">
                      Click here to upload video
                    </p>
                  </>
                ) : (
                  formik.values.productVideo && (
                    <div>
                      <video controls width={400} height={340}>
                        <source
                          src={
                            formik.values.productVideo instanceof File
                              ? URL.createObjectURL(formik.values.productVideo)
                              : formik.values.productVideo
                          }
                          type={formik.values.productVideo.type}
                        />
                      </video>
                    </div>
                  )
                )}
              </div>
              <Button
                variant="shop"
                type="button"
                onClick={handleVideoUploadClick}
                className="w-full"
              >
                Upload Video
              </Button>
            </div>

            <Button type="submit" disabled={formik.isSubmitting} variant="shop">
              {formik.isSubmitting ? (
                <span className="flex items-center gap-2">
                  Updating Product...
                  <Loader
                    size="2em"
                    topBorderSize="0.2em"
                    center={false}
                    fullScreen={false}
                  />
                </span>
              ) : (
                "Update Product"
              )}
            </Button>
          </section>
        </form>
      </main>
    </section>
  );
};

export default UpdateProduct;
