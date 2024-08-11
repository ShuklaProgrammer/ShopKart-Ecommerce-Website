import React, { useEffect, useRef, useState } from 'react'
import { useDeleteProductMutation, useGetProductByIdQuery, useUpdateProductMutation } from '@/redux/api/productApiSlice'

//shadcn
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
} from "@/components/ui/alert-dialog"



//all the icons are here
import { PiDotsThreeOutline } from "react-icons/pi";
import { RxCrossCircled } from "react-icons/rx";
// import { FiUploadCloud } from "react-icons/fi";
// import { RiVideoUploadLine } from "react-icons/ri";

//shadcn
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FiUploadCloud } from 'react-icons/fi'
import { Button } from '@/components/ui/button'
import { RiVideoUploadLine } from 'react-icons/ri'
import { useGetAllCategoryQuery } from '@/redux/api/categoryApiSlice'
import { useGetAllBrandsQuery } from '@/redux/api/brandApiSlice'
import { useGetAllColorsQuery } from '@/redux/api/colorApiSlice'
import { useNavigate, useParams } from 'react-router-dom'

import { useFormik } from 'formik'
import * as Yup from "yup"
import Loader from '@/components/mycomponents/Loader'


const UpdateProduct = () => {
    const { productId } = useParams()

    const navigate = useNavigate()
    const imageInputRef = useRef(null)
    const videoInputRef = useRef(null)

    const [selectedImageIndex, setSelectedImageIndex] = useState(null)

    const { data: productDataById } = useGetProductByIdQuery(productId)
    
    console.log(productDataById)


    // const [title, setTitle] = useState("")
    // const [description, setDescription] = useState("")
    // const [price, setPrice] = useState("")
    const [productImage, setProductImage] = useState([])
    const [productVideo, setProductVideo] = useState("")
    // const [brand, setBrand] = useState("")
    // const [category, setCategory] = useState("")
    // const [color, setColor] = useState("")
    // const [sku, setSku] = useState("")
    // const [stockQuantity, setStockQuantity] = useState(0)
    // const [tags, setTags] = useState([])

    const [tagInput, setTagInput] = useState("")

    // const [additionalInformation, setAdditionalInformation] = useState([{ key: "", value: "" }])
    // const [specifications, setSpecifications] = useState([{ key: "", value: "" }])
    // const [shippingInfo, setShippingInfo] = useState([{ key: "", value: "" }])
    // const [feature, setFeature] = useState([""])

    // const [createProduct] = useCreateProductMutation()
    const [updateProduct] = useUpdateProductMutation()


    const { data: getAllCategory } = useGetAllCategoryQuery()

    const { data: getAllBarnds } = useGetAllBrandsQuery()

    const categories = getAllCategory?.data || []
    const brands = getAllBarnds?.data || []

    console.log(categories)

    // if (!categoryResponse || !brandResponse) {
    //   return <Loader size='3em' speed='0.4s' fullScreen={true} center={true} />;
    // }


    const handleTagInputChange = (e) => {
        setTagInput(e.target.value)
    }

    const handleTagInputPressKey = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = e.target.value.trim();
            if (newTag && !formik.values.tags.includes(newTag)) {
                formik.setFieldValue("tags", [...formik.values.tags, newTag]);
                setTagInput("");
            }
        }
    };

    const handleProductAdditionalInfoChange = (index, key, value) => {
        const additionalInfo = [...formik.values.additionalInformation]
        additionalInfo[index] = { key, value }
        formik.setFieldValue("additionalInformation", additionalInfo)
    }

    const handleProductSpecificationsChange = (index, key, value) => {
        const specs = [...formik.values.specifications]
        specs[index] = { key, value }
        formik.setFieldValue("specifications", specs)
    }

    const handleProductDeliveryInfoChange = (index, key, value) => {
        const delivery = [...formik.values.deliveryInfo]
        delivery[index] = { key, value }
        formik.setFieldValue("deliveryInfo", delivery)
    }


    const addProductAdditionalInfoField = (e) => {
        formik.setFieldValue("additionalInformation", [
            ...formik.values.additionalInformation, { key: "", value: "" }
        ])
    }

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
        const additionalInfo = formik.values.additionalInformation.filter((_, i) => i !== index);
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
        imageInputRef.current.click()
    }

    const handleVideoUploadClick = () => {
        videoInputRef.current.click()
    }

    const handleImageUploadChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => URL.createObjectURL(file));
        const updatedImages = [...formik.values.productImage, ...newImages];

        if (updatedImages.length <= 10) {
            formik.setFieldValue('productImage', updatedImages);
            if (selectedImageIndex === null && newImages.length > 0) {
                setSelectedImageIndex(0);
            }
        } else {
            alert("You can upload only 10 images");
        }
    };

    const handleVideoUploadChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            formik.setFieldValue('productVideo', file);
        }
    };

    const handleThumbnailUpload = (imageIndex) => {
        setSelectedImageIndex(imageIndex)
    }


    //get the api
    // const handleProductSubmit = async (e) => {
    //   console.log("Product Video on Submit:", productVideo);
    //   e.preventDefault()
    //   try {
    //     const formData = new FormData()
    //     formData.append("title", title)
    //     formData.append("description", description)
    //     formData.append("price", price)
    //     // formData.append("productImage", productImage)
    //     // formData.append("productVideo", productVideo)
    //     formData.append("brand", brand)
    //     formData.append("category", category)
    //     formData.append("sku", sku)
    //     // formData.append("specifications", specifications)
    //     // formData.append("additionalInformation", additionalInformation)
    //     // formData.append("shippingInfo", shippingInfo)
    //     formData.append("stockQuantity", stockQuantity)
    //     // formData.append("tags", tags)

    //     if (productVideo) {
    //       formData.append(`productVideo`, productVideo)
    //     }

    //     productImage.forEach((image) => {
    //       formData.append(`productImage`, image)
    //     })


    //     tags.forEach((tag) => {
    //       formData.append(`tags`, tag)
    //     })


    //     additionalInformation.filter(info => info.key.trim() !== "" && info.value.trim() !== "").forEach((info, index) => {
    //       formData.append(`additionalInformation[${index}][key]`, info.key)
    //       formData.append(`additionalInformation[${index}][value]`, info.value)
    //     })

    //     specifications.filter(spec => spec.key.trim() !== "" && spec.value.trim() !== "").forEach((spec, index) => {
    //       formData.append(`specifications[${index}][key]`, spec.key)
    //       formData.append(`specifications[${index}][value]`, spec.value)
    //     })

    //     shippingInfo.filter(ship => ship.key.trim() !== "" && ship.value.trim() !== "").forEach((ship, index) => {
    //       formData.append(`shippingInfo[${index}][key]`, ship.key)
    //       formData.append(`shippingInfo[${index}][value]`, ship.value)
    //     })

    //     await createProduct(formData)
    //     // navigate("/admin/products")
    //   } catch (error) {
    //     console.log("Product creation failed", error)
    //   }
    // }

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        price: Yup.number().required("Price is required"),
        // productImage: Yup.array().of(Yup.mixed().required("Product Image is required")),
        productImage: Yup.array()
            .min(1, "At least one product image is required")
            .of(Yup.mixed().required("Product image is required")),
        productVideo: Yup.string().notRequired(),
        brand: Yup.string().required("Brand is required"),
        category: Yup.string().required("Category is required"),
        sku: Yup.string().notRequired(),
        stockQuantity: Yup.number().required("Stock quantity is required"),
        tags: Yup.array().of(Yup.string().required("Tag cannot be empty")).min(1, "At least one tag is required"),
        additionalInformation: Yup.array().of(Yup.object().shape({
            key: Yup.string().notRequired(),
            value: Yup.string().notRequired()
        })),
        specifications: Yup.array().of(Yup.object().shape({
            key: Yup.string().notRequired(),
            value: Yup.string().notRequired()
        })),
        deliveryInfo: Yup.array().of(Yup.object().shape({
            key: Yup.string().notRequired(),
            value: Yup.string().notRequired()
        }))
    })

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
                const formData = new FormData()
                formData.append("title", values.title)
                formData.append("description", values.description)
                formData.append("price", values.price)
                values.productImage.forEach((image) => {
                    formData.append("productImage", image)
                })
                if (values.productVideo) {
                    formData.append("productVideo", values.productVideo)
                }
                formData.append("brand", values.brand)
                formData.append("category", values.category),
                    formData.append("sku", values.sku)
                formData.append("stockQuantity", values.stockQuantity)
                values.tags.forEach((tag) => {
                    formData.append("tags", tag)
                })
                values.additionalInformation.forEach((info, index) => {
                    formData.append(`additionalInformation[${index}][key]`, info.key)
                    formData.append(`additionalInformation[${index}][value]`, info.value)
                })
                values.specifications.forEach((spec, index) => {
                    formData.append(`specifications[${index}][key]`, spec.key)
                    formData.append(`specifications[${index}][value]`, spec.value)
                })
                values.deliveryInfo.forEach((delivery, index) => {
                    formData.append(`deliveryInfo[${index}][key]`, delivery.key)
                    formData.append(`deliveryInfo[${index}][value]`, delivery.value)
                })

                await updateProduct(formData)
            } catch (error) {
                console.log("Product submmision failed", error)
                setSubmitting(false)
            }
        }
    })


    useEffect(() => {
        if (productDataById && productDataById.data._id) {
            formik.setFieldValue("title", productDataById.data.title)
            formik.setFieldValue("description", productDataById.data.description)
            formik.setFieldValue("price", productDataById.data.price)
            if(productDataById.data.productImage.length > 0 && productDataById.data.productImage){
                formik.setFieldValue("productImage", productDataById.data.productImage)
            }
            formik.setFieldValue("category", productDataById.data.category?._id)
            formik.setFieldValue("brand", productDataById.data.brand?._id)
            formik.setFieldValue("sku", productDataById.data.sku)
            formik.setFieldValue("stockQuantity", productDataById.data.stockQuantity)
            formik.setFieldValue("tags", productDataById.data.tags)
            if(productDataById?.data?.additionalInformation.length > 0 && productDataById?.data?.additionalInformation){
                formik.setFieldValue("additionalInformation", productDataById.data.additionalInformation)
            }
            if(productDataById?.data?.specifications.length > 0 && productDataById?.data?.specifications){
                formik.setFieldValue("specifications", productDataById.data.specifications)
            }
            if(productDataById?.data?.deliveryInfo.length > 0 && productDataById?.data?.deliveryInfo){
                formik.setFieldValue("deliveryInfo", productDataById.data.deliveryInfo)
            }
        }
    }, [productDataById])



    return (
        <section className="flex flex-grow">
            <main className='pb-10'>
                <h1 className='text-xl my-5 font-semibold'>Product</h1>
                <form onSubmit={formik.handleSubmit} className='flex justify-between gap-20'>
                    <section className='w-full space-y-4'>
                        <div className='space-y-2'>
                            <label htmlFor="title">Title</label>
                            <Input id="title" type="text" className="outline-gray-300 outline outline-1" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            {formik.touched.title && formik.errors.title ? (
                                <div className='text-red-500 text-sm'>{formik.errors.title}</div>
                            ) : (
                                null
                            )}
                        </div>
                        <div className='space-y-2'>
                            <label htmlFor="description">Decription</label>
                            <Textarea id="description" type="text" className="h-36" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            {formik.touched.description && formik.errors.description ? (
                                <div className='text-red-500 text-sm'>{formik.errors.description}</div>
                            ) : (
                                null
                            )}
                        </div>
                        <div className='space-y-2'>
                            <label htmlFor="price">Price</label>
                            <Input id="price" type="number" className="outline-gray-300 outline outline-1" value={formik.values.price} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            {formik.touched.price && formik.errors.price ? (
                                <div className='text-red-500 text-sm'>{formik.errors.price}</div>
                            ) : (
                                null
                            )}
                        </div>
                        <div className='flex justify-between gap-5'>
                            <div className='space-y-2'>
                                <label htmlFor="category">Category</label>
                                <Select value={formik.values.category} onValueChange={(value) => formik.setFieldValue("category", value)}>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories && categories.length > 0 ? (categories?.map((category, index) => (
                                            <SelectItem key={index} value={category._id}>{category.categoryName}</SelectItem>
                                        ))
                                        ) : (
                                            <SelectItem value="notFound">No Category Available</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                {formik.touched.category && formik.errors.category ? (
                                    <div className='text-red-500 text-sm'>{formik.errors.category}</div>
                                ) : (
                                    null
                                )}

                            </div>
                            <div className='space-y-2'>
                                <label htmlFor="brand">Brand</label>
                                <Select value={formik.values.brand} onValueChange={(value) => formik.setFieldValue("brand", value)}>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Select Brand" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {brands && brands.length > 0 ? (brands?.map((brand, index) => (
                                            <SelectItem key={index} value={brand._id}>{brand.brandName}</SelectItem>
                                        ))
                                        ) : (
                                            <SelectItem value="notFound">No Brand Available</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                                {formik.touched.brand && formik.errors.brand ? (
                                    <div className='text-red-500 text-sm'>{formik.errors.brand}</div>
                                ) : (
                                    null
                                )}
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <label htmlFor="sku">Sku <span className='text-gray-500'>(Optional)</span></label>
                            <Input id="sku" type="text" className="outline-gray-300 outline outline-1" value={formik.values.sku} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            {formik.touched.sku && formik.errors.sku ? (
                                <div className='text-red-500 text-sm'>{formik.errors.sku}</div>
                            ) : (
                                null
                            )}
                        </div>
                        <div className='space-y-2'>
                            <label htmlFor="stockQuantity">Stock Quantity</label>
                            <Input id="stockQuantity" type="number" className="outline-gray-300 outline outline-1" value={formik.values.stockQuantity} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                            {formik.touched.stockQuantity && formik.errors.stockQuantity ? (
                                <div className='text-red-500 text-sm'>{formik.errors.stockQuantity}</div>
                            ) : (
                                null
                            )}
                        </div>


                        <div className='space-y-2'>
                            <label htmlFor="tag">Tags</label>
                            <Input id="tag" type="text" className="outline-gray-300 outline outline-1" value={tagInput} onChange={handleTagInputChange} onBlur={() => formik.setFieldTouched("tags", true)} onKeyPress={handleTagInputPressKey} placeholder="Enter tags..." />
                            {formik.touched.tags && formik.errors.tags ? (
                                <div className='text-red-500 text-sm'>{formik.errors.tags}</div>
                            ) : (
                                null
                            )}
                            <div>
                                {formik.values.tags.map((tag, index) => (
                                    <span key={index} className='tag'>{tag}<button onClick={() => removeTag(index)}>x</button></span>
                                ))}
                            </div>
                        </div>


                        <div className='space-y-2'>
                            <p>Additional Information</p>
                            <Dialog>
                                <DialogTrigger className='outline-gray-300 outline outline-1 hover:bg-gray-100 w-full py-2 rounded-lg'>Add Additional Information</DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add Additional Information</DialogTitle>
                                        <DialogDescription>
                                            {formik.values.additionalInformation.map((info, index) => (
                                                <div key={index}>
                                                    {index === 0 && (
                                                        <label htmlFor="additionalInfo">Additional Info</label>
                                                    )}
                                                    <div className='flex items-center justify-between'>
                                                        <div className='flex items-center w-full gap-2 my-2'>
                                                            <Input type="text" className="outline-gray-300 outline outline-1" value={info.key} onChange={e => handleProductAdditionalInfoChange(index, e.target.value, info.value)} placeholder="Key" />
                                                            <Input type="text" className="outline-gray-300 outline outline-1" value={info.value} onChange={e => handleProductAdditionalInfoChange(index, info.key, e.target.value)} placeholder="Value" />
                                                        </div>
                                                        {index === 0 && (
                                                            <Button variant="shop" onClick={addProductAdditionalInfoField}>Add</Button>
                                                        )}
                                                        {index !== 0 && (
                                                            <RxCrossCircled className='text-xl hover:cursor-pointer hover:text-red-500' onClick={() => removeProductAdditionalInfoField(index)} />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                            {formik.touched.additionalInformation && formik.errors.additionalInformation ? (
                                <div className='text-red-500 text-sm'>{formik.errors.additionalInformation}</div>
                            ) : (
                                null
                            )}
                        </div>

                        <div className='space-y-2'>
                            <p>Specifications</p>
                            <Dialog>
                                <DialogTrigger className='outline-gray-300 outline outline-1 hover:bg-gray-100 w-full py-2 rounded-lg'>Add Specifications</DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add Specifications</DialogTitle>
                                        <DialogDescription>

                                            {formik.values.specifications.map((spec, index) => (
                                                <div key={index}>
                                                    {index === 0 && (
                                                        <label htmlFor="specifications">Specifications</label>
                                                    )}
                                                    <div className='flex items-center justify-between'>
                                                        <div className='flex items-center w-full my-2'>
                                                            <Input type="text" className="outline-gray-300 outline outline-1" value={spec.key} onChange={e => handleProductSpecificationsChange(index, e.target.value, spec.value)} placeholder="Key" />
                                                            <Input type="text" className="outline-gray-300 outline outline-1" value={spec.value} onChange={e => handleProductSpecificationsChange(index, spec.key, e.target.value)} placeholder="Value" />
                                                        </div>
                                                        {index === 0 && (
                                                            <Button variant="shop" onClick={addProductSpecificationsField}>Add</Button>
                                                        )}
                                                        {index !== 0 && (
                                                            <RxCrossCircled className='text-xl hover:text-red-500 hover:cursor-pointer' onClick={() => removeProductSpecificationsField(index)} />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                            {formik.touched.specifications && formik.errors.specifications ? (
                                <div className='text-red-500 text-sm'>{formik.errors.specifications}</div>
                            ) : (
                                null
                            )}
                        </div>

                        <div className='space-y-2'>
                            <p>Add Delivery Information</p>

                            <Dialog>
                                <DialogTrigger className='outline-gray-300 outline outline-1 hover:bg-gray-100 w-full py-2 rounded-lg'>Add Delivery Information</DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add Delivery Information</DialogTitle>
                                        <DialogDescription>
                                            {formik.values.deliveryInfo.map((ship, index) => (
                                                <div key={index}>
                                                    {index === 0 && (
                                                        <label htmlFor="deliveryInfo">Delivery Info</label>
                                                    )}
                                                    <div className='flex items-center justify-between'>
                                                        <div className='flex items-center w-full my-2'>
                                                            <Input type="text" className="outline-gray-300 outline outline-1" value={ship.key} onChange={e => handleProductDeliveryInfoChange(index, e.target.value, ship.value)} placeholder="Key" />
                                                            <Input type="text" className="outline-gray-300 outline outline-1" value={ship.value} onChange={e => handleProductDeliveryInfoChange(index, ship.key, e.target.value)} placeholder="Value" />
                                                        </div>
                                                        {index === 0 && (
                                                            <Button variant="shop" onClick={addProductDeliveryInfoField}>Add</Button>
                                                        )}
                                                        {index !== 0 && (
                                                            <RxCrossCircled className='text-xl hover:text-red-500 hover:cursor-pointer' onClick={() => removeProductDeliveryInfoField(index)} />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>

                            {formik.touched.deliveryInfo && formik.errors.deliveryInfo ? (
                                <div className='text-red-500 text-sm'>{formik.errors.deliveryInfo}</div>
                            ) : (
                                null
                            )}
                        </div>


                    </section>

                    <section className='flex flex-col justify-between'>
                        <div className='flex flex-col gap-5'>
                            <div className='outline-gray-300 outline outline-1 w-[30vw] h-[40vh] hover:cursor-pointer hover:bg-gray-100 flex items-center justify-center' onClick={handleImageUploadClick}>
                                <input type="file" accept='image/*' onChange={handleImageUploadChange} ref={imageInputRef} className='hidden' />
                                {formik.values.productImage.length > 0 ? (
                                    <img src={selectedImageIndex !== null ? formik.values.productImage[selectedImageIndex] : formik.values.productImage[0]} alt="" className='w-[60%]' />
                                ) : (
                                    <>
                                        <FiUploadCloud className='text-6xl text-gray-400' />
                                        <p className='ml-2 text-gray-500'>Click here to upload image</p>
                                    </>
                                )}
                            </div>
                            <div className='overflow-x-auto w-[30vw] whitespace-nowrap'>
                                {formik.values.productImage.map((image, index) => (
                                    <div key={index} className='border border-1 border-gray-400 w-14 h-14 inline-block hover:cursor-pointer' onClick={() => handleThumbnailUpload(index)}>
                                        <img src={image} alt="" className='w-20' />
                                    </div>
                                ))}
                            </div>
                            {formik.touched.productImage && formik.errors.productImage ? (
                                <div className='text-red-500 text-sm'>{formik.errors.productImage}</div>
                            ) : (
                                null
                            )}

                            <Button variant="shop" type="button" onClick={handleImageUploadClick}>Upload Image</Button>
                        </div>


                        <div>
                            <div className='outline-gray-300 outline outline-1 w-[30vw] h-[40vh] hover:cursor-pointer hover:bg-gray-100 flex justify-center items-center mb-5' onClick={handleVideoUploadClick}>
                                <input type="file" accept='video/*' onChange={handleVideoUploadChange} ref={videoInputRef} className='hidden' />
                                {!formik.values.productVideo ? (
                                    <>
                                        <RiVideoUploadLine className='text-4xl text-gray-400' />
                                        <p className='ml-2 text-gray-500'>Click here to upload video</p>
                                    </>
                                ) : (
                                   
                                        <div>
                                            <video controls width={400} height={340}>
                                                <source src={URL.createObjectURL(formik.values.productVideo)} type={formik.values.productVideo.type} />
                                            </video>
                                        </div>
                                )}
                                
                            </div>
                            <Button variant="shop" type="button" onClick={handleVideoUploadClick} className="w-full">Upload Video</Button>
                        </div>

                        <Button type="submit" disabled={formik.isSubmitting} variant="shop">Update Product{formik.isSubmitting ? <Loader size='2em' center={false} fullScreen={false} /> : ""}</Button>

                    </section>

                </form>
            </main>
        </section>
    )
}

// const UpdateProduct = () => {
//     const { productId } = useParams()

//     const navigate = useNavigate()


//     const imageInputRef = useRef(null)
//     const videoInputRef = useRef(null)

//     const [selectedImageIndex, setSelectedImageIndex] = useState(null)


//     const { data: productDataById } = useGetProductByIdQuery(productId)

//     // console.log(productDataById)


//     const [title, setTitle] = useState("")
//     const [description, setDescription] = useState("")
//     const [price, setPrice] = useState("")
//     const [productImage, setProductImage] = useState([])
//     const [productVideo, setProductVideo] = useState([])
//     const [brand, setBrand] = useState("")
//     const [category, setCategory] = useState("")
//     const [color, setColor] = useState("")
//     const [sku, setSku] = useState("")
//     const [stockQuantity, setStockQuantity] = useState("")
//     const [tags, setTags] = useState([])

//     const [tagInput, setTagInput] = useState("")

//     const [additionalInformation, setAdditionalInformation] = useState([{ key: "", value: "" }])
//     const [specifications, setSpecifications] = useState([{ key: "", value: "" }])
//     const [shippingInfo, setShippingInfo] = useState([{ key: "", value: "" }])
//     const [feature, setFeature] = useState([""])

//     useEffect(() => {
//         if (productDataById && productDataById.data._id) {
//             setTitle(productDataById.data.title)
//             setDescription(productDataById.data.description)
//             // setProductImage(productDataById.data.productImage)
//             setPrice(productDataById.data.price)
//             setCategory(productDataById.data.category)
//             setBrand(productDataById.data.brand)
//             setColor(productDataById.data.color)
//             setSku(productDataById.data.sku)
//             setStockQuantity(productDataById.data.stockQuantity)
//             setTags(productDataById.data.tags)
//             setFeature(productDataById.data.feature)

//             const additionalInfo = productDataById.data.additionalInformation
//             setAdditionalInformation(additionalInfo)

//             const specificationInfo = productDataById.data.specifications
//             setSpecifications(specificationInfo)

//             const shippingInfo = productDataById.data.shippingInfo
//             setShippingInfo(shippingInfo)
//         }
//     }, [productDataById])

//     const [updateProduct] = useUpdateProductMutation()


//     const { data: categoryResponse } = useGetAllCategoryQuery()
//     const { data: brandResponse } = useGetAllBrandsQuery()
//     // const { data: colorResponse } = useGetAllColorsQuery()


//     if (!categoryResponse) {
//         return <h1>No response from products</h1>
//     }

//     if (!brandResponse) {
//         return <h1>No response from products</h1>
//     }

//     // if (!colorResponse) {
//     //     return <h1>No response from products</h1>
//     // }

//     const { data: categories } = categoryResponse
//     const { data: brands } = brandResponse
//     // const { data: colors } = colorResponse


//     const handleTagInputChange = (e) => {
//         setTagInput(e.target.value)
//     }

//     const handleTagInputPressKey = (e) => {
//         if (e.key === "Enter" || e.key === ",") {
//             e.preventDefault()
//             if (tagInput.trim() !== '') {
//                 setTags([...tags, tagInput.trim()]);
//                 setTagInput('');
//             }
//         }
//     }

//     const handleProductFeatureChange = (index, value) => {
//         const newProductFeature = [...feature]
//         newProductFeature[index] = value
//         setFeature(newProductFeature)
//     }

//     const handleProductAdditionalInfoChange = (index, key, value) => {
//         const newProductAdditionalInfo = [...additionalInformation]
//         newProductAdditionalInfo[index] = { key, value }
//         setAdditionalInformation(newProductAdditionalInfo)
//     }

//     const handleProductSpecificationsChange = (index, key, value) => {
//         const newProductSpecifications = [...specifications]
//         newProductSpecifications[index] = { key, value }
//         setSpecifications(newProductSpecifications)
//     }

//     const handleProductShippingInfoChange = (index, key, value) => {
//         const newProductShippingInfo = [...shippingInfo]
//         newProductShippingInfo[index] = { key, value }
//         setShippingInfo(newProductShippingInfo)
//     }

//     const addProductFeatureField = (e) => {
//         e.preventDefault()
//         setFeature([...feature, ""])
//     }

//     const addProductAdditionalInfoField = (e) => {
//         e.preventDefault()
//         setAdditionalInformation([...additionalInformation, { key: "", value: "" }])
//     }

//     const addProductSpecificationsField = (e) => {
//         e.preventDefault()
//         setSpecifications([...specifications, { key: "", value: "" }])
//     }

//     const addProductShippingInfoField = (e) => {
//         e.preventDefault()
//         setShippingInfo([...shippingInfo, { key: "", value: "" }])
//     }

//     const removeTag = (indexToRemove) => {
//         setTags(tags.filter((_, index) => index !== indexToRemove));
//     };

//     const removeProductFeature = (index) => {
//         const newProductFeature = [...feature]
//         newProductFeature.splice(index, 1)
//         setFeature(newProductFeature)
//     }

//     const removeProductAdditionalInfoField = (index) => {
//         const newProductAdditionalInfo = [...additionalInformation]
//         newProductAdditionalInfo.splice(index, 1)
//         setAdditionalInformation(newProductAdditionalInfo)
//     }

//     const removeProductSpecificationsField = (index) => {
//         const newProductSpecifications = [...specifications]
//         newProductSpecifications.splice(index, 1)
//         setSpecifications(newProductSpecifications)
//     }

//     const removeProductShippingInfoField = (index) => {
//         const newProductShippingInfo = [...shippingInfo]
//         newProductShippingInfo.splice(index, 1)
//         setShippingInfo(newProductShippingInfo)
//     }

//     const handleImageUploadClick = () => {
//         imageInputRef.current.click()
//     }

//     const handleVideoUploadClick = () => {
//         videoInputRef.current.click()
//     }

//     const handleImageUploadChange = (e) => {
//         const uploadImage = Array.from(e.target.files)
//         if (productImage.length + uploadImage.length <= 10) {
//             setProductImage([...productImage, ...uploadImage])
//         } else {
//             alert("You can upload only 10 images")
//         }

//         if (selectedImageIndex === null && uploadImage.length > 0) {
//             setSelectedImageIndex(0);
//         }
//     }

//     const handleVideoUploadChange = (e) => {
//         const uploadVideo = e.target.files
//         setProductVideo([...productVideo, ...uploadVideo])
//     }

//     const handleThumbnailUpload = (imageIndex) => {
//         setSelectedImageIndex(imageIndex)
//     }

//     const handleUpdateProduct = async (e) => {
//         e.preventDefault()
//         try {
//             const formData = new FormData()
//             formData.append("title", title)
//             formData.append("description", description)
//             formData.append("price", price)
//             // formData.append("productImage", productImage)
//             // formData.append("productVideo", productVideo)
//             formData.append("brand", brand)
//             formData.append("category", category)
//             formData.append("color", color)
//             formData.append("sku", sku)
//             // formData.append("specifications", specifications)
//             // formData.append("additionalInformation", additionalInformation)
//             // formData.append("shippingInfo", shippingInfo)
//             formData.append("stockQuantity", stockQuantity)
//             // formData.append("tags", tags)

//             productImage.forEach((image) => {
//                 formData.append(`productImage`, image)
//             })

//             productVideo.forEach((video) => {
//                 formData.append(`productVideo`, video)
//             })

//             tags.forEach((tag) => {
//                 formData.append(`tags`, tag)
//             })


//             feature.forEach((feat, index) => {
//                 formData.append(`feature[${index}]`, feat)
//             })

//             additionalInformation.forEach((info, index) => {
//                 formData.append(`additionalInformation[${index}][key]`, info.key)
//                 formData.append(`additionalInformation[${index}][value]`, info.value)
//             })

//             specifications.forEach((spec, index) => {
//                 formData.append(`specifications[${index}][key]`, spec.key)
//                 formData.append(`specifications[${index}][value]`, spec.value)
//             })

//             shippingInfo.forEach((ship, index) => {
//                 formData.append(`shippingInfo[${index}][key]`, ship.key)
//                 formData.append(`shippingInfo[${index}][value]`, ship.value)
//             })

//             await updateProduct({ productId, formData })
//             console.log("Product updated successfully!");
//             navigate("/admin/products")
//         } catch (error) {
//             console.log("Product updation failed", error)
//         }
//     }



//     return (
//         <section className='flex flex-grow'>
//             <main className='w-[90%]'>
//                 {productDataById && (
//                     <form action="" className='flex justify-between gap-20'>
//                         <section className='w-full space-y-4'>
//                             <div className='space-y-2'>
//                                 <label htmlFor="title">Title</label>
//                                 <Input type="text" className="outline-gray-300 outline outline-1" defaultValue={title} onChange={e => setTitle(e.target.value)} />
//                             </div>
//                             <div className='space-y-2'>
//                                 <label htmlFor="title">Decription</label>
//                                 <Textarea type="text" className="h-36" defaultValue={description} onChange={e => setDescription(e.target.value)} />
//                             </div>
//                             <div className='space-y-2'>
//                                 <label htmlFor="title">Price</label>
//                                 <Input type="number" className="outline-gray-300 outline outline-1" defaultValue={price} onChange={e => setPrice(e.target.value)} />
//                             </div>
//                             <div className='flex justify-between gap-5'>
//                                 <div className='space-y-2'>
//                                     <label htmlFor="category">Category</label>
//                                     <Select value={category} onValueChange={(value) => { setCategory(value) }}>
//                                         <SelectTrigger className="w-[200px]">
//                                             <SelectValue placeholder="Select Category" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {categories.map((category, index) => (
//                                                 <SelectItem key={index} value={category._id}>{category.categoryName}</SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>

//                                 </div>
//                                 <div className='space-y-2'>
//                                     <label htmlFor="category">Brand</label>
//                                     <Select value={brand} onValueChange={(value) => { setBrand(value) }}>
//                                         <SelectTrigger className="w-[200px]">
//                                             <SelectValue placeholder="Select Brand" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {brands?.map((brand, index) => (
//                                                 <SelectItem key={index} value={brand._id}>{brand.brandName}</SelectItem>
//                                             ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </div>
//                             </div>
//                             <div className='space-y-2'>
//                                 <label htmlFor="title">Sku</label>
//                                 <Input type="text" defaultValue={sku} className="outline-gray-300 outline outline-1" />
//                             </div>
//                             <div className='space-y-2'>
//                                 <label htmlFor="title">Stock Quantity</label>
//                                 <Input type="number" className="outline-gray-300 outline outline-1" defaultValue={stockQuantity} onChange={e => setStockQuantity(e.target.value)} />
//                             </div>


//                             <div className='space-y-2'>
//                                 <label htmlFor="title">Tags</label>
//                                 <Input type="text" className="outline-gray-300 outline outline-1" value={tagInput} onChange={handleTagInputChange} onKeyPress={handleTagInputPressKey} placeholder="Enter tags..." />
//                                 <div>
//                                     {tags.map((tag, index) => (
//                                         <span key={index} className='tag'>{tag}<button onClick={() => removeTag(index)}>x</button></span>
//                                     ))}
//                                 </div>
//                             </div>
//                             {/* <div className='flex items-center justify-between gap-5'>
//                                 <div className='space-y-2'>
//                                     <label htmlFor="selectColor">Select Color</label>
//                                     <Select value={color} onValueChange={(value) => setColor(value)} id="selectColor">
//                                         <SelectTrigger className="w-[200px]">
//                                             <SelectValue placeholder="Theme" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             {colors.map((color, index) => (
//                                             <SelectItem key={index} value={color._id}>{color.colorName}</SelectItem>
//                                          ))}
//                                         </SelectContent>
//                                     </Select>
//                                 </div>
//                                 <div className='space-y-2 w-full'>
//                                     <label htmlFor="addColor">Add Your Color(Optional)</label>
//                                     <Input id="addColor" type="text" className="outline-gray-300 outline outline-1" defaultValue={color} onChange={e => setColor(e.target.value)} />
//                                 </div>
//                             </div> */}

//                             <div className='space-y-2'>
//                                 <p>Feature</p>
//                                 <Dialog>
//                                     <DialogTrigger className='outline-gray-300 outline outline-1 hover:bg-gray-100 w-full py-2 rounded-lg'>Add Feature</DialogTrigger>
//                                     <DialogContent>
//                                         <DialogHeader>
//                                             <DialogTitle>Add Feature</DialogTitle>
//                                             <DialogDescription>
//                                                 {feature.map((feat, index) => (
//                                                     <div key={index}>
//                                                         {index === 0 && (
//                                                             <label htmlFor="title">Feature</label>
//                                                         )}
//                                                         <div className='flex items-center'>
//                                                             <Input type="text" className="my-2 outline-gray-300 outline outline-1" value={feat} onChange={e => handleProductFeatureChange(index, e.target.value)} placeholder="Feature" />
//                                                             {index === 0 && (
//                                                                 <Button variant="shop" className="ml-2 px-6" onClick={addProductFeatureField}>Add</Button>
//                                                             )}
//                                                             {index !== 0 && (
//                                                                 <RxCrossCircled className='hover:cursor-pointer hover:text-red-500 text-xl mx-9' onClick={() => removeProductFeature(index)} />
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </DialogDescription>
//                                         </DialogHeader>
//                                     </DialogContent>
//                                 </Dialog>
//                             </div>

//                             <div className='space-y-2'>
//                                 <p>Additional Information</p>
//                                 <Dialog>
//                                     <DialogTrigger className='outline-gray-300 outline outline-1 hover:bg-gray-100 w-full py-2 rounded-lg'>Add Additional Information</DialogTrigger>
//                                     <DialogContent>
//                                         <DialogHeader>
//                                             <DialogTitle>Add Additional Information</DialogTitle>
//                                             <DialogDescription>
//                                                 {additionalInformation.map((info, index) => (
//                                                     <div key={index}>
//                                                         {index === 0 && (
//                                                             <label htmlFor="additionalInfo">Additional Info</label>
//                                                         )}
//                                                         <div className='flex items-center justify-between'>
//                                                             <div className='flex items-center w-full gap-2 my-2'>
//                                                                 <Input type="text" className="outline-gray-300 outline outline-1" value={info.key} onChange={e => handleProductAdditionalInfoChange(index, e.target.value, info.value)} placeholder="Key" />
//                                                                 <Input type="text" className="outline-gray-300 outline outline-1" value={info.value} onChange={e => handleProductAdditionalInfoChange(index, info.key, e.target.value)} placeholder="Value" />
//                                                             </div>
//                                                             {index === 0 && (
//                                                                 <Button variant="shop" onClick={addProductAdditionalInfoField}>Add</Button>
//                                                             )}
//                                                             {index !== 0 && (
//                                                                 <RxCrossCircled className='text-xl hover:cursor-pointer hover:text-red-500' onClick={() => removeProductAdditionalInfoField(index)} />
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </DialogDescription>
//                                         </DialogHeader>
//                                     </DialogContent>
//                                 </Dialog>
//                             </div>

//                             <div className='space-y-2'>
//                                 <p>Specifications</p>
//                                 <Dialog>
//                                     <DialogTrigger className='outline-gray-300 outline outline-1 hover:bg-gray-100 w-full py-2 rounded-lg'>Add Specifications</DialogTrigger>
//                                     <DialogContent>
//                                         <DialogHeader>
//                                             <DialogTitle>Add Specifications</DialogTitle>
//                                             <DialogDescription>

//                                                 {specifications.map((spec, index) => (
//                                                     <div key={index}>
//                                                         {index === 0 && (
//                                                             <label htmlFor="specifications">Specifications</label>
//                                                         )}
//                                                         <div className='flex items-center justify-between'>
//                                                             <div className='flex items-center w-full my-2'>
//                                                                 <Input type="text" className="outline-gray-300 outline outline-1" value={spec.key} onChange={e => handleProductSpecificationsChange(index, e.target.value, spec.value)} placeholder="Key" />
//                                                                 <Input type="text" className="outline-gray-300 outline outline-1" value={spec.value} onChange={e => handleProductSpecificationsChange(index, spec.key, e.target.value)} placeholder="Value" />
//                                                             </div>
//                                                             {index === 0 && (
//                                                                 <Button variant="shop" onClick={addProductSpecificationsField}>Add</Button>
//                                                             )}
//                                                             {index !== 0 && (
//                                                                 <RxCrossCircled className='text-xl hover:text-red-500 hover:cursor-pointer' onClick={() => removeProductSpecificationsField(index)} />
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </DialogDescription>
//                                         </DialogHeader>
//                                     </DialogContent>
//                                 </Dialog>
//                             </div>

//                             <div className='space-y-2'>
//                                 <p>Add Shipping Information</p>

//                                 <Dialog>
//                                     <DialogTrigger className='outline-gray-300 outline outline-1 hover:bg-gray-100 w-full py-2 rounded-lg'>Add Shipping Information</DialogTrigger>
//                                     <DialogContent>
//                                         <DialogHeader>
//                                             <DialogTitle>Add Shipping Information</DialogTitle>
//                                             <DialogDescription>
//                                                 {shippingInfo.map((ship, index) => (
//                                                     <div key={index}>
//                                                         {index === 0 && (
//                                                             <label htmlFor="shippingInfo">Shipping Info</label>
//                                                         )}
//                                                         <div className='flex items-center justify-between'>
//                                                             <div className='flex items-center w-full my-2'>
//                                                                 <Input type="text" className="outline-gray-300 outline outline-1" value={ship.key} onChange={e => handleProductShippingInfoChange(index, e.target.value, ship.value)} placeholder="Key" />
//                                                                 <Input type="text" className="outline-gray-300 outline outline-1" value={ship.value} onChange={e => handleProductShippingInfoChange(index, ship.key, e.target.value)} placeholder="Value" />
//                                                             </div>
//                                                             {index === 0 && (
//                                                                 <Button variant="shop" onClick={addProductShippingInfoField}>Add</Button>
//                                                             )}
//                                                             {index !== 0 && (
//                                                                 <RxCrossCircled className='text-xl hover:text-red-500 hover:cursor-pointer' onClick={() => removeProductShippingInfoField(index)} />
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 ))}
//                                             </DialogDescription>
//                                         </DialogHeader>
//                                     </DialogContent>
//                                 </Dialog>
//                             </div>


//                         </section>

//                         <section className='flex flex-col justify-between'>
//                             <div className='flex flex-col gap-5'>
//                                 <div className='outline-gray-300 outline outline-1 w-[30vw] h-[40vh] hover:cursor-pointer hover:bg-gray-100 flex items-center justify-center' onClick={handleImageUploadClick}>
//                                     <input type="file" accept='image/*' onChange={handleImageUploadChange} ref={imageInputRef} className='hidden' />
//                                     {selectedImageIndex !== null && productImage.length > 0 ? (
//                                         <img src={URL.createObjectURL(productImage[selectedImageIndex])} alt="" className='w-[60%]' />
//                                     ) : (
//                                         <>
//                                             <FiUploadCloud className='text-6xl text-gray-400' />
//                                             <p className='ml-2 text-gray-500'>Click here to upload image</p>
//                                         </>
//                                     )}
//                                 </div>
//                                 <div className='overflow-x-auto w-[30vw] whitespace-nowrap'>
//                                     {productImage.map((image, index) => (
//                                         <div key={index} className='border border-1 border-gray-400 w-14 h-14 inline-block hover:cursor-pointer' onClick={() => handleThumbnailUpload(index)}>
//                                             <img src={URL.createObjectURL(image)} alt="" className='w-20' />
//                                         </div>
//                                     ))}
//                                 </div>


//                                 <Button variant="shop" type="button" onClick={handleImageUploadClick}>Upload Image</Button>
//                             </div>


//                             <div>
//                                 <div className='outline-gray-300 outline outline-1 w-[30vw] h-[40vh] hover:cursor-pointer hover:bg-gray-100 flex justify-center items-center mb-5' onClick={handleVideoUploadClick}>
//                                     <input type="file" accept='video/*' onChange={handleVideoUploadChange} ref={videoInputRef} className='hidden' />
//                                     {productVideo.length === 0 && (
//                                         <>
//                                             <RiVideoUploadLine className='text-4xl text-gray-400' />
//                                             <p className='ml-2 text-gray-500'>Click here to upload video</p>
//                                         </>
//                                     )}
//                                     {productVideo.map((video, index) => (
//                                         <div key={index}>
//                                             <video controls width={400} height={340}>
//                                                 <source src={URL.createObjectURL(video)} type={video.type} />
//                                             </video>
//                                         </div>
//                                     ))}
//                                 </div>
//                                 <Button variant="shop" type="button" onClick={handleVideoUploadClick} className="w-full">Upload Video</Button>
//                             </div>

//                             <Button variant="shop" onClick={handleUpdateProduct}>Update Product</Button>
//                         </section>
//                     </form>
//                 )}
//             </main>
//         </section>
//     )
// }

export default UpdateProduct