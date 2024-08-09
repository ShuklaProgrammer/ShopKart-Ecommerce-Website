import React, { useEffect, useState } from 'react'


// all icons are imported here
import { RxCrossCircled } from "react-icons/rx";
import { FiUploadCloud } from "react-icons/fi";
import { RiVideoUploadLine } from "react-icons/ri";


//shadcn
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import { useRef } from 'react';

// importing all the rtk query
import { useCreateProductMutation } from '@/redux/api/productApiSlice';
import { useGetAllCategoryQuery } from '@/redux/api/categoryApiSlice';
import { useGetAllBrandsQuery } from '@/redux/api/brandApiSlice';
import { useNavigate } from 'react-router-dom';
import { useGetAllColorsQuery } from '@/redux/api/colorApiSlice';
import Loader from '@/components/mycomponents/Loader';

const AddProduct = () => {

  const navigate = useNavigate()
  const imageInputRef = useRef(null)
  const videoInputRef = useRef(null)

  const [selectedImageIndex, setSelectedImageIndex] = useState(null)


  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [productImage, setProductImage] = useState([])
  const [productVideo, setProductVideo] = useState("")
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("")
  const [color, setColor] = useState("")
  const [sku, setSku] = useState("")
  const [stockQuantity, setStockQuantity] = useState(0)
  const [tags, setTags] = useState([])

  const [tagInput, setTagInput] = useState("")

  const [additionalInformation, setAdditionalInformation] = useState([{ key: "", value: "" }])
  const [specifications, setSpecifications] = useState([{ key: "", value: "" }])
  const [shippingInfo, setShippingInfo] = useState([{ key: "", value: "" }])
  const [feature, setFeature] = useState([""])

  const [createProduct] = useCreateProductMutation()

  const { data: categoryResponse } = useGetAllCategoryQuery()

  const { data: brandResponse } = useGetAllBrandsQuery()

  // console.log(brandResponse)

  if (!categoryResponse || !brandResponse) {
    return <Loader size='3em' speed='0.4s' fullScreen={true} center={true}/>;
  }

  // if (!colorResponse) {
  //   return <div>Loading...</div>
  // }

  const { data: categories } = categoryResponse
  const { data: brands } = brandResponse


  const handleTagInputChange = (e) => {
    setTagInput(e.target.value)
  }

  const handleTagInputPressKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      if (tagInput.trim() !== '') {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  }

  const handleProductFeatureChange = (index, value) => {
    const newProductFeature = [...feature]
    newProductFeature[index] = value
    setFeature(newProductFeature)
  }

  const handleProductAdditionalInfoChange = (index, key, value) => {
    const newProductAdditionalInfo = [...additionalInformation]
    newProductAdditionalInfo[index] = { key, value }
    setAdditionalInformation(newProductAdditionalInfo)
  }

  const handleProductSpecificationsChange = (index, key, value) => {
    const newProductSpecifications = [...specifications]
    newProductSpecifications[index] = { key, value }
    setSpecifications(newProductSpecifications)
  }

  const handleProductShippingInfoChange = (index, key, value) => {
    const newProductShippingInfo = [...shippingInfo]
    newProductShippingInfo[index] = { key, value }
    setShippingInfo(newProductShippingInfo)
  }


  const addProductAdditionalInfoField = (e) => {
    e.preventDefault()
    setAdditionalInformation([...additionalInformation, { key: "", value: "" }])
  }

  const addProductSpecificationsField = (e) => {
    e.preventDefault()
    setSpecifications([...specifications, { key: "", value: "" }])
  }

  const addProductShippingInfoField = (e) => {
    e.preventDefault()
    setShippingInfo([...shippingInfo, { key: "", value: "" }])
  }

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const removeProductFeature = (index) => {
    const newProductFeature = [...feature]
    newProductFeature.splice(index, 1)
    setFeature(newProductFeature)
  }

  const removeProductAdditionalInfoField = (index) => {
    const newProductAdditionalInfo = [...additionalInformation]
    newProductAdditionalInfo.splice(index, 1)
    setAdditionalInformation(newProductAdditionalInfo)
  }

  const removeProductSpecificationsField = (index) => {
    const newProductSpecifications = [...specifications]
    newProductSpecifications.splice(index, 1)
    setSpecifications(newProductSpecifications)
  }

  const removeProductShippingInfoField = (index) => {
    const newProductShippingInfo = [...shippingInfo]
    newProductShippingInfo.splice(index, 1)
    setShippingInfo(newProductShippingInfo)
  }

  const handleImageUploadClick = () => {
    imageInputRef.current.click()
  }

  const handleVideoUploadClick = () => {
    videoInputRef.current.click()
  }

  const handleImageUploadChange = (e) => {
    const uploadImage = Array.from(e.target.files)
    if (productImage.length + uploadImage.length <= 10) {
      setProductImage([...productImage, ...uploadImage])
    } else {
      alert("You can upload only 10 images")
    }

    if (selectedImageIndex === null && uploadImage.length > 0) {
      setSelectedImageIndex(0);
    }
  }

  const handleVideoUploadChange = (e) => {
    const file = e.target.files[0]
    console.log("Selected Video File:", file); 
    if(file){
      setProductVideo(file)
      console.log("Product Video after setting:", file);
    }
  }

  const handleThumbnailUpload = (imageIndex) => {
    setSelectedImageIndex(imageIndex)
  }


  //get the api
  const handleProductSubmit = async (e) => {
    console.log("Product Video on Submit:", productVideo);
    e.preventDefault()
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("price", price)
      // formData.append("productImage", productImage)
      // formData.append("productVideo", productVideo)
      formData.append("brand", brand)
      formData.append("category", category)
      formData.append("sku", sku)
      // formData.append("specifications", specifications)
      // formData.append("additionalInformation", additionalInformation)
      // formData.append("shippingInfo", shippingInfo)
      formData.append("stockQuantity", stockQuantity)
      // formData.append("tags", tags)
      
      if(productVideo){
        formData.append(`productVideo`, productVideo)
      }

      productImage.forEach((image) => {
        formData.append(`productImage`, image)
      })


      tags.forEach((tag) => {
        formData.append(`tags`, tag)
      })


      additionalInformation.filter(info => info.key.trim() !== "" && info.value.trim() !== "").forEach((info, index) => {
        formData.append(`additionalInformation[${index}][key]`, info.key)
        formData.append(`additionalInformation[${index}][value]`, info.value)
      })

      specifications.filter(spec => spec.key.trim() !== "" && spec.value.trim() !== "").forEach((spec, index) => {
        formData.append(`specifications[${index}][key]`, spec.key)
        formData.append(`specifications[${index}][value]`, spec.value)
      })

      shippingInfo.filter(ship => ship.key.trim() !== "" && ship.value.trim() !== "").forEach((ship, index) => {
        formData.append(`shippingInfo[${index}][key]`, ship.key)
        formData.append(`shippingInfo[${index}][value]`, ship.value)
      })

      await createProduct(formData)
      // navigate("/admin/products")
    } catch (error) {
      console.log("Product creation failed", error)
    }
  }



  return (
    <section className="flex flex-grow">
      <main className='pb-10'>
        <h1 className='text-xl my-5 font-semibold'>Product</h1>
        <form action="" className='flex justify-between gap-20'>
          <section className='w-full space-y-4'>
            <div className='space-y-2'>
              <label htmlFor="title">Title</label>
              <Input type="text" className="outline-gray-300 outline outline-1" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className='space-y-2'>
              <label htmlFor="title">Decription</label>
              <Textarea type="text" className="h-36" value={description} onChange={e => setDescription(e.target.value)} />
            </div>
            <div className='space-y-2'>
              <label htmlFor="title">Price</label>
              <Input type="number" className="outline-gray-300 outline outline-1" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            <div className='flex justify-between gap-5'>
              <div className='space-y-2'>
                <label htmlFor="category">Category</label>
                <Select onValueChange={(value) => setCategory(value) }>
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

              </div>
              <div className='space-y-2'>
                <label htmlFor="category">Brand</label>
                <Select onValueChange={(value) =>  setBrand(value) }>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands && brands.length > 0 ? ( brands?.map((brand, index) => (
                      <SelectItem key={index} value={brand._id}>{brand.brandName}</SelectItem>
                    ))
                  ) : (
                    <SelectItem value="notFound">No Brand Available</SelectItem>
                  )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='space-y-2'>
              <label htmlFor="title">Sku</label>
              <Input type="text" className="outline-gray-300 outline outline-1" value={sku} onChange={e => setSku(e.target.value)}/>
            </div>
            <div className='space-y-2'>
              <label htmlFor="title">Stock Quantity</label>
              <Input type="number" className="outline-gray-300 outline outline-1" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} />
            </div>


            <div className='space-y-2'>
              <label htmlFor="title">Tags</label>
              <Input type="text" className="outline-gray-300 outline outline-1" value={tagInput} onChange={handleTagInputChange} onKeyPress={handleTagInputPressKey} placeholder="Enter tags..." />
              <div>
                {tags.map((tag, index) => (
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
                      {additionalInformation.map((info, index) => (
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
            </div>

            <div className='space-y-2'>
              <p>Specifications</p>
              <Dialog>
                <DialogTrigger className='outline-gray-300 outline outline-1 hover:bg-gray-100 w-full py-2 rounded-lg'>Add Specifications</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Specifications</DialogTitle>
                    <DialogDescription>

                      {specifications.map((spec, index) => (
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
            </div>

            <div className='space-y-2'>
              <p>Add Shipping Information</p>

              <Dialog>
                <DialogTrigger className='outline-gray-300 outline outline-1 hover:bg-gray-100 w-full py-2 rounded-lg'>Add Shipping Information</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Shipping Information</DialogTitle>
                    <DialogDescription>
                      {shippingInfo.map((ship, index) => (
                        <div key={index}>
                          {index === 0 && (
                            <label htmlFor="shippingInfo">Shipping Info</label>
                          )}
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center w-full my-2'>
                              <Input type="text" className="outline-gray-300 outline outline-1" value={ship.key} onChange={e => handleProductShippingInfoChange(index, e.target.value, ship.value)} placeholder="Key" />
                              <Input type="text" className="outline-gray-300 outline outline-1" value={ship.value} onChange={e => handleProductShippingInfoChange(index, ship.key, e.target.value)} placeholder="Value" />
                            </div>
                            {index === 0 && (
                              <Button variant="shop" onClick={addProductShippingInfoField}>Add</Button>
                            )}
                            {index !== 0 && (
                              <RxCrossCircled className='text-xl hover:text-red-500 hover:cursor-pointer' onClick={() => removeProductShippingInfoField(index)} />
                            )}
                          </div>
                        </div>
                      ))}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>


          </section>

          <section className='flex flex-col justify-between'>
            <div className='flex flex-col gap-5'>
              <div className='outline-gray-300 outline outline-1 w-[30vw] h-[40vh] hover:cursor-pointer hover:bg-gray-100 flex items-center justify-center' onClick={handleImageUploadClick}>
                <input type="file" accept='image/*' onChange={handleImageUploadChange} ref={imageInputRef} className='hidden' />
                {selectedImageIndex !== null && productImage.length > 0 ? (
                  <img src={URL.createObjectURL(productImage[selectedImageIndex])} alt="" className='w-[60%]' />
                ) : (
                  <>
                    <FiUploadCloud className='text-6xl text-gray-400' />
                    <p className='ml-2 text-gray-500'>Click here to upload image</p>
                  </>
                )}
              </div>
              <div className='overflow-x-auto w-[30vw] whitespace-nowrap'>
                {productImage.map((image, index) => (
                  <div key={index} className='border border-1 border-gray-400 w-14 h-14 inline-block hover:cursor-pointer' onClick={() => handleThumbnailUpload(index)}>
                    <img src={URL.createObjectURL(image)} alt="" className='w-20' />
                  </div>
                ))}
              </div>


              <Button variant="shop" type="button" onClick={handleImageUploadClick}>Upload Image</Button>
            </div>


            <div>
              <div className='outline-gray-300 outline outline-1 w-[30vw] h-[40vh] hover:cursor-pointer hover:bg-gray-100 flex justify-center items-center mb-5' onClick={handleVideoUploadClick}>
                <input type="file" accept='video/*' onChange={handleVideoUploadChange} ref={videoInputRef} className='hidden' />
                {!productVideo && (
                  <>
                    <RiVideoUploadLine className='text-4xl text-gray-400' />
                    <p className='ml-2 text-gray-500'>Click here to upload video</p>
                  </>
                )}
                {productVideo && productVideo instanceof File &&(
                  <div>
                    <video controls width={400} height={340}>
                      <source src={URL.createObjectURL(productVideo)} type={productVideo.type} />
                    </video>
                  </div>
                )}
              </div>
              <Button variant="shop" type="button" onClick={handleVideoUploadClick} className="w-full">Upload Video</Button>
            </div>

            <Button variant="shop" onClick={handleProductSubmit}>Add Product</Button>

          </section>

        </form>
      </main>
    </section>
  )
}

export default AddProduct