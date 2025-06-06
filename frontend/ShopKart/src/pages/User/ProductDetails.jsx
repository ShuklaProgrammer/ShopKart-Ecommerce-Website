import React, { useEffect, useState } from "react";

// all the icons are imported here
import { FiShoppingCart } from "react-icons/fi";
import { FaEnvelope, FaRegHeart, FaStar } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";

//shadcn
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

// all the images are imported here
import masterCardImg from "../../assets/images/mastercardImg.png";
import visaImg from "../../assets/images/visaImg.png";
import paypalImg from "../../assets/images/paypalImg.png";
import {
  useAddProductReviewMutation,
  useDeleteUserReviewMutation,
  useGetProductByIdQuery,
} from "@/redux/api/productApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCart } from "@/redux/features/cart/cartSlice";
import {
  useAddToCartApiMutation,
} from "@/redux/api/cartApiSlice";
import { useAddWishlistMutation } from "@/redux/api/wishlistApiSlice";
import { setWishlist } from "@/redux/features/wishlist/wishlistSlice";
import { useCreateOrderMutation } from "@/redux/api/orderApiSlice";
import Loader from "@/components/mycomponents/Loader";
import { useToast } from "@/hooks/use-toast";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(null);

  const [isSelectProductInfo, setIsSelectProductInfo] = useState("description");
  const [rating, setRating] = useState(0);
  const [hoverStar, setHoverStar] = useState(null);
  const [comment, setComment] = useState("");
  const [selectedMedia, setSelectedMedia] = useState("");

  const cart = useSelector((state) => state.cart);
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: productDataById,
    isLoading: loadingProduct,
    isFetching,
    isError,
  } = useGetProductByIdQuery(productId);
  const product = productDataById?.data || [];

  useEffect(() => {
    // Set the default image to the first image in the list when productImages changes
    if (product.productImage?.length > 0) {
      setSelectedMedia(product.productImage[0]);
    } else if (product.productVideo) {
      setSelectedMedia(product.productVideo);
    }
  }, [product.productImage, product.productVideo]);

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top when the component mounts
  }, []);

  const [addToCartApi] = useAddToCartApiMutation();
  const [addToWishlist] = useAddWishlistMutation();
  const [createOrder] = useCreateOrderMutation();
  const [addReview] = useAddProductReviewMutation();
  const [deleteReview] = useDeleteUserReviewMutation();

  const handleAddToCart = async (productName) => {
    try {
      if (userInfo) {
        setIsLoading("addToCart");
        const response = await addToCartApi({
          userId: userInfo._id,
          productId,
        });
        const cartData = response.data.data;
        // console.log(cartData)
        dispatch(setCart(cartData));
        toast({
          title: "Product added to cart",
          description: `${productName} has been added to your cart.`,
        });
        setIsLoading(null);
      } else {
        toast({
          title: "Login required",
          description: "You need to log in to add products to the cart.",
        });
        navigate("/auth");
        setIsLoading(null);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      console.log("Cannot add the product to wishlist", error);
      setIsLoading(null);
    }
  };

  const handleAddToWishlist = async (productId, productName) => {
    try {
      if (userInfo) {
        const response = await addToWishlist({
          userId: userInfo._id,
          productId,
        });
        const wishlistData = response.data.data;
        dispatch(setWishlist(wishlistData));
        toast({
          title: "Product added to wishlist",
          description: `${productName} has been added to your wishlist.`,
        });
      } else {
        toast({
          title: "Login required",
          description: "You need to log in to add products to the wishlist.",
        });
        navigate("/auth");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Product added to cart",
        description: "There was a problem with your request.",
      });
      console.log("Cannot add the product to the wishlist", error);
    }
  };

  const copyUrlToClipBoard = (productName) => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied to clipboard!",
      description: `${productName} have been copied.`,
      position: "top-left",
    });
  };

  const shareOnFacebook = () => {
    if (product) {
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
      window.open(facebookShareUrl, "_blank");
    }
  };

  const shareOnTwitter = () => {
    if (product) {
      const twitterShareUrl = `https://twitter.com/intent/tweet?text=Check%20out%20this%20product!&url=${encodeURIComponent(window.location.href)}`;
      window.open(twitterShareUrl, "_blank");
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(
      `Check out this product: ${product.title}`,
    );
    const body = encodeURIComponent(
      `I found this product and thought you might like it: ${window.location.href}`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    setIsLoading("buyNow");
    try {
      if (userInfo?._id) {
        const orderData = {
          orderedBy: userInfo._id,
          orderItems: [
            {
              productId: product._id,
              price: product.price,
              quantity: 1,
            },
          ],
        };
        const response = await createOrder(orderData);
        const orderId = response.data.data._id;
        navigate("/order", { state: { orderId } });
        setIsLoading(null);
      } else {
        navigate("/auth");
        setIsLoading(null);
        toast({
          title: "Login required",
          description: "You need to log in order to buy product.",
        });
      }
    } catch (error) {
      console.log("The order cannot be created", error);
    }
  };

  const handleAddReview = async () => {
    try {
      const reviewData = {
        userId: userInfo._id,
        productId,
        rating,
        comment,
      };
      await addReview({ reviewData });
      setComment("");
      setRating(0);
      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      console.log("Cannot add the review to the product", error);
      setComment("");
      setRating(0);
    }
  };

  const deleteUserReview = async (reviewId) => {
    await deleteReview({ userId: userInfo._id, reviewId });
  };

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleStarHoverOnMouseEnter = (index) => {
    setHoverStar(index + 1);
  };

  const handleStarMouseLeave = () => {
    setHoverStar(null);
  };

  const generateStars = (count) => {
    let stars = [];
    for (let i = 0; i < count; i++) {
      stars.push(
        <FaStar
          className={`text-lg hover:cursor-pointer ${(hoverStar || rating) > i ? "text-orange-400" : "text-gray-300"}`}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHoverOnMouseEnter(i)}
          onMouseLeave={handleStarMouseLeave}
          key={i}
        />,
      );
    }
    return stars;
  };

  const handleMediaIndexClick = (media) => {
    setSelectedMedia(media);
  };

  const isVideo = (url) =>
    url.endsWith(".mp4") || url.endsWith(".mov") || url.includes("video");

  if (loadingProduct) {
    return (
      <div className="h-96">
        <Loader size="3em" topBorderSize="0.3em" />
      </div>
    );
  }

  if (isError) {
    return <span>No Product</span>;
  }

  return (
    <section className="flex justify-center sm:my-10 my-6">
      {product && (
        <main className="w-[90%] ">
          <section className="sm:flex justify-between sm:py-5">
            <div className="flex flex-col sm:w-[50%]">
              <div className="flex justify-center">
                <div className="flex justify-center items-center">
                  {isVideo(selectedMedia) ? (
                    <video
                      src={selectedMedia}
                      controls
                      className="w-full h-full"
                    />
                  ) : (
                    <img
                      src={selectedMedia}
                      alt="Selected Product"
                      className="w-96"
                    />
                  )}
                </div>
              </div>
              {(product.productImage?.length > 1 || product.productVideo) && (
                <div className="flex justify-center gap-2 mt-5">
                  {product.productImage?.map((image, index) => (
                    <div
                      onClick={() => handleMediaIndexClick(image)}
                      key={index}
                      className={`w-[10vh] h-[10vh] border-2 hover:border-orange-400 hover:cursor-pointer ${selectedMedia === image ? "border-orange-400" : ""}`}
                    >
                      <img src={image} alt={`Product Thumbnail ${index + 1}`} />
                    </div>
                  ))}
                  {product.productVideo && (
                    <div
                      className={`w-20 h-20 border-2 cursor-pointer ${
                        selectedMedia === product.productVideo
                          ? "border-orange-400"
                          : ""
                      }`}
                      onClick={() =>
                        handleMediaIndexClick(product.productVideo)
                      }
                    >
                      <video
                        src={product.productVideo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="sm:w-[50%] sm:mt-0 mt-4 space-y-2">
              <div className="flex gap-2">
                <span className="bg-green-600 rounded-sm font-semibold text-sm px-2 py-0.5 text-white flex items-center">
                  5
                  <FaStar className="" />
                </span>
              </div>
              <h2 className="sm:text-lg font-semibold">{product.title}</h2>
              <div className="flex justify-between items-center mt-3">
                <div className="space-y-1">
                  <p className="text-sm">
                    Sku: <span className="font-semibold">{product.sku}</span>
                  </p>
                  <p className="text-sm">
                    Brand:{" "}
                    <span className="font-semibold">
                      {product.brand?.brandName}
                    </span>
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm">
                    Availability:{" "}
                    {product.stockQuantity > 0 ? (
                      <span className="font-semibold text-green-500">
                        In Stock
                      </span>
                    ) : (
                      <span className="font-semibold text-red-500">
                        Out Of Stock
                      </span>
                    )}
                  </p>
                  <p className="text-sm">
                    Category:{" "}
                    <span className="font-semibold">
                      {product.category?.categoryName}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-lg text-blue-400 font-semibold">
                  $
                  {product.discountedPrice > 0
                    ? product.discountedPrice
                    : product.price}
                </span>
                {product.discountedPrice > 0 && (
                  <>
                    <p className="line-through text-lg">${product.price}</p>
                    <p className="bg-yellow-300 rounded-sm px-2 py-1">
                      21% OFF
                    </p>
                  </>
                )}
              </div>

              <div className="flex justify-between pt-5 items-center gap-4 sm:gap-10">
                <Button
                  onClick={() => handleAddToCart(product.title)}
                  disabled={isLoading === "addToCart"}
                  variant="shop"
                  className="w-full py-6"
                >
                  {isLoading === "addToCart" ? (
                    <span className="flex items-center gap-2">
                      Adding To Cart...
                      <FiShoppingCart className="text-xl ml-2" />
                      <Loader
                        size="2em"
                        topBorderSize="0.2em"
                        center={false}
                        fullScreen={false}
                      />
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Add TO Cart
                      <FiShoppingCart className="text-xl ml-2" />
                    </span>
                  )}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={isLoading === "buyNow"}
                  variant="shop"
                  className="w-full py-6"
                >
                  {isLoading === "buyNow" ? (
                    <span className="flex items-center gap-2">
                      {" "}
                      Buy Now
                      <Loader
                        size="2em"
                        topBorderSize="0.2em"
                        center={false}
                        fullScreen={false}
                      />
                    </span>
                  ) : (
                    "Buy Now"
                  )}
                </Button>
              </div>

              <div className="flex justify-between pt-5 gap-2">
                <div className="hover:cursor-pointer">
                  {wishlist?.wishlistItems?.some(
                    (item) => item.productId === product._id,
                  ) ? (
                    <div className="flex items-center sm:gap-2 pointer-events-none">
                      <FaHeart className="text-red-500" />
                      <p>Added to Wishlist</p>
                    </div>
                  ) : (
                    <div
                      onClick={() =>
                        handleAddToWishlist(product._id, product.title)
                      }
                      className="flex items-center sm:gap-2 gap-1 hover:text-orange-500"
                    >
                      <FaRegHeart />
                      <p>Add to Wishlist</p>
                    </div>
                  )}
                </div>
                {/* <div className='flex items-center gap-2 hover:cursor-pointer'>
                                    <FiRefreshCcw />
                                    <p>Add to Compare</p>
                                </div> */}
                <div className="flex items-center sm:gap-2 gap-1">
                  <p className="hidden sm:block">Share product:</p>
                  <p className="block sm:hidden">Share:</p>
                  <FaRegCopy
                    onClick={() => copyUrlToClipBoard(product.title)}
                    className="hover:text-orange-400 hover:cursor-pointer text-lg"
                  />
                  <FaFacebook
                    onClick={shareOnFacebook}
                    className="hover:text-orange-400 hover:cursor-pointer text-lg"
                  />
                  <FaTwitter
                    onClick={shareOnTwitter}
                    className="hover:text-orange-400 hover:cursor-pointer text-lg"
                  />
                  <FaEnvelope
                    onClick={shareViaEmail}
                    className="hover:text-orange-400 hover:cursor-pointer text-lg"
                  />
                </div>
              </div>

              <div className="pt-4">
                <p>100% Guarantee Safe Checkout</p>
                <div className="flex items-center gap-5">
                  <img src={visaImg} alt="" className="w-10 h-10" />
                  <img src={masterCardImg} alt="" className="w-10 h-10" />
                  <img src={paypalImg} alt="" className="w-20 h-20" />
                </div>
              </div>
            </div>
          </section>

          <section className="border-2 sm:mt-10 mt-2 sm:block hidden">
            <div className="flex justify-evenly border-b-2 px-32">
              <h2
                onClick={() => setIsSelectProductInfo("description")}
                className={`text-base uppercase text-gray-500 hover:cursor-pointer px-5 py-2 ${isSelectProductInfo === "description" ? "border-b-4 border-orange-400" : ""}`}
              >
                Description
              </h2>
              <h2
                onClick={() => setIsSelectProductInfo("additionalInfo")}
                className={`text-base uppercase text-gray-500 hover:cursor-pointer px-5 py-2 ${isSelectProductInfo === "additionalInfo" ? "border-b-4 border-orange-400" : ""}`}
              >
                Additional information
              </h2>
              <h2
                onClick={() => setIsSelectProductInfo("specification")}
                className={`text-base uppercase text-gray-500 hover:cursor-pointer px-5 py-2 ${isSelectProductInfo === "specification" ? "border-b-4 border-orange-400" : ""}`}
              >
                Specification
              </h2>
              <h2
                onClick={() => setIsSelectProductInfo("review")}
                className={`text-base uppercase text-gray-500 hover:cursor-pointer px-5 py-2 ${isSelectProductInfo === "review" ? "border-b-4 border-orange-400" : ""}`}
              >
                Review
              </h2>
            </div>
            {isSelectProductInfo === "description" && (
              <>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader
                      size="2em"
                      topBorderSize="0.2em"
                      fullScreen={false}
                      center={false}
                    />
                  </div>
                ) : (
                  <div className="p-10">
                    <p>{product.description}</p>
                  </div>
                )}
              </>
            )}
            {isSelectProductInfo === "additionalInfo" && (
              <>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader
                      size="2em"
                      topBorderSize="0.2em"
                      fullScreen={false}
                      center={false}
                    />
                  </div>
                ) : (
                  <div className="p-10">
                    {product.additionalInformation.length > 0 ? (
                      <p className="flex flex-col">
                        {product.additionalInformation.map((info, index) => (
                          <span key={index}>
                            {info.key}: {info.value}
                          </span>
                        ))}
                      </p>
                    ) : (
                      <p>No Additional Information</p>
                    )}
                  </div>
                )}
              </>
            )}
            {isSelectProductInfo === "specification" && (
              <>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader
                      size="2em"
                      topBorderSize="0.2em"
                      fullScreen={false}
                      center={false}
                    />
                  </div>
                ) : (
                  <div className="p-10">
                    {product.specifications.length > 0 ? (
                      <p className="flex flex-col">
                        {product.specifications.map((spec, index) => (
                          <span key={index}>
                            {spec.key}: {spec.value}
                          </span>
                        ))}
                      </p>
                    ) : (
                      <p>No Specifications</p>
                    )}
                  </div>
                )}
              </>
            )}
            {isSelectProductInfo === "review" && (
              <>
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader
                      size="2em"
                      topBorderSize="0.2em"
                      fullScreen={false}
                      center={false}
                    />
                  </div>
                ) : (
                  <div className="p-5">
                    {userInfo?._id && (
                      <div className="flex flex-col gap-4 mb-4">
                        <h2 className="text-xl font-semibold">Add Review</h2>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-red-300">
                            <img src="" alt="" />
                          </div>
                          <h3 className="font-black">
                            {userInfo.username ? userInfo.username : "Anoymous"}
                          </h3>
                          {generateStars(5)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="outline outline-1 outline-gray-300"
                          />
                          <Button onClick={handleAddReview} variant="shop">
                            Send <IoSendSharp className="text-xl ml-2" />
                          </Button>
                        </div>
                      </div>
                    )}
                    {product.reviews && product.reviews.length > 0 ? (
                      <h2 className="text-xl font-semibold">All Reviews</h2>
                    ) : (
                      <h2 className="text-xl font-semibold">
                        No Reviews Added
                      </h2>
                    )}
                    {product.reviews?.map((review, index) => (
                      <div key={index} className="border-2 p-2 my-4">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full h-10 w-10 bg-red-300">
                            <img src="" alt="" />
                          </div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">
                              {review.commenterName}
                            </h3>
                            <span className="bg-green-600 rounded-sm font-semibold text-sm px-2 py-0.5 text-white flex items-center">
                              {review.rating}
                              <FaStar className="" />
                            </span>
                          </div>
                          {review.userId === userInfo?._id ? (
                            <AlertDialog>
                              <AlertDialogTrigger>
                                <RiDeleteBin6Line className="text-lg" />
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you absolutely sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Do you want to delete you review. This
                                    action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteUserReview(review._id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            ""
                          )}
                        </div>
                        <p>{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </section>

          <section className="block sm:hidden space-y-4">
            <div>
              <h2 className="uppercase text-lg font-semibold">Description</h2>
              <p>{product.description}</p>
            </div>
            <div>
              <h2 className="uppercase text-lg font-semibold">
                Additional Information
              </h2>
              <p className="flex flex-col">
                {product.additionalInformation.map((spec, index) => (
                  <span key={index}>
                    {spec.key}: {spec.value}
                  </span>
                ))}
              </p>
            </div>
            <div>
              <h2 className="uppercase text-lg font-semibold">
                Specifications
              </h2>
              <p className="flex flex-col">
                {product.specifications.map((spec, index) => (
                  <span key={index}>
                    {spec.key}: {spec.value}
                  </span>
                ))}
              </p>
            </div>
            <div className="">
              {userInfo?._id && (
                <div className="flex flex-col gap-4 mb-4">
                  <h2 className="text-xl font-semibold">Add Review</h2>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-red-300">
                      <img src="" alt="" />
                    </div>
                    <h3 className="font-black">
                      {userInfo.username ? userInfo.username : "Anoymous"}
                    </h3>
                    {generateStars(5)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="outline outline-1 outline-gray-300"
                    />
                    <Button onClick={handleAddReview} variant="shop">
                      <span className="hidden sm:block">Send</span>
                      <IoSendSharp className="text-xl sm:ml-2" />
                    </Button>
                  </div>
                </div>
              )}
              {product.reviews && product.length > 0 ? (
                <h2 className="text-xl font-semibold">All Reviews</h2>
              ) : (
                <h2 className="text-xl font-semibold">No Reviews Added</h2>
              )}
              {product.reviews?.map((review, index) => (
                <div key={index} className="border-2 p-2 my-4">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full h-10 w-10 bg-red-300">
                      <img src="" alt="" />
                    </div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{review.commenterName}</h3>
                      <span className="bg-green-600 rounded-sm font-semibold text-sm px-2 py-0.5 text-white flex items-center">
                        {review.rating}
                        <FaStar className="" />
                      </span>
                    </div>
                    {review.userId === userInfo?._id ? (
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <RiDeleteBin6Line className="text-lg" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Do you want to delete you review. This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteUserReview(review._id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      ""
                    )}
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}
    </section>
  );
};

export default ProductDetails;
