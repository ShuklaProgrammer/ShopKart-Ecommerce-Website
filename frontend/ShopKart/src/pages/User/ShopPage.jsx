import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

// all the icons are imported here
import { FaRegEye, FaRegHeart, FaShoppingBag } from "react-icons/fa";
import { FiShoppingCart, FiMenu } from "react-icons/fi";

// from shadcn
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { useGetAllProductQuery } from "@/redux/api/productApiSlice";
import { useGetAllCategoryQuery } from "@/redux/api/categoryApiSlice";
import { useGetAllBrandsQuery } from "@/redux/api/brandApiSlice";

import {
  updateBrand,
  updateCategory,
  updateSearch,
  updateTags,
  updatePrice,
} from "@/redux/features/product/productSlice";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { debounce, split } from "lodash";
import Loader from "@/components/mycomponents/Loader";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const ShopPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const query = useQuery();
  const searchTerm = query.get("search") || "";

  const [selectCategory, setSelectCategory] = useState(
    query.get("category")?.split(",") || [],
  );
  const [selectBrand, setSelectBrand] = useState(
    query.get("brand")?.split(",") || [],
  );
  const [tags, setTags] = useState(query.get("tags")?.split(",") || []);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState(
    query.get("priceRanges")?.split(",") || [],
  );
  const [searching, setSearching] = useState(searchTerm);
  const [page, setPage] = useState(1);
  const limit = 10;

  const { filterCategory, filterBrand, search, filterTags, filterPrice } =
    useSelector((state) => state.product);

  const { data: productData, isLoading: isLoadingProducts } =
    useGetAllProductQuery({
      filterCategory: selectCategory.join(","),
      filterBrand: selectBrand.join(","),
      search,
      page,
      limit,
      filterTags: tags.join(","),
      filterPrice:
        selectedPriceRanges.length > 0 ? selectedPriceRanges.join(",") : "",
    });
  const { data: categoryData, isLoading: isLoadingCategories } =
    useGetAllCategoryQuery();
  const { data: brandData, isLoading: isLoadingBrands } =
    useGetAllBrandsQuery();
  const products = productData?.data?.products || [];
  const totalPages = productData?.data?.totalPages || 1;
  const categories = categoryData?.data || [];
  const brands = brandData?.data || [];

  const updateURL = debounce(() => {
    const params = new URLSearchParams();

    if (searching) params.set("search", searching);
    if (selectCategory.length > 0)
      params.set("category", selectCategory.join(","));
    if (selectBrand.length > 0) params.set("brand", selectBrand.join(","));
    if (tags.length > 0) params.set("tags", tags.join(","));
    if (selectedPriceRanges.length > 0) {
      params.set("priceRanges", selectedPriceRanges.join(","));
    }
    navigate({ search: params.toString() });
  }, 500);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setSelectCategory(params.get("category")?.split(",") || []);
    setSelectBrand(params.get("brand")?.split(",") || []);
    setTags(params.get("tags")?.split(",") || []);
    setSelectedPriceRanges(params.get("priceRanges")?.split(",") || []);
    setSearching(params.get("search") || "");

    dispatch(updateCategory(params.get("category")?.split(",") || []));
    dispatch(updateBrand(params.get("brand")?.split(",") || []));
    dispatch(updateSearch(params.get("search") || ""));
    dispatch(updateTags(params.get("tags")?.split(",") || []));
    dispatch(
      updatePrice(
        params.get("priceRanges")?.split(",") ||
          params.get("price")?.split("-") || [0, 10000],
      ),
    );
  }, [location.search]);

  useEffect(() => {
    updateURL();
  }, [selectCategory, selectBrand, tags, selectedPriceRanges, searching]);

  const handleCategoryChange = (categoryName) => {
    setSelectCategory((prevCategory) =>
      prevCategory.includes(categoryName)
        ? prevCategory.filter((cat) => cat !== categoryName)
        : [...prevCategory, categoryName],
    );
  };

  const handleBrandChange = (brandName) => {
    setSelectBrand((prevBrand) =>
      prevBrand.includes(brandName)
        ? prevBrand.filter((br) => br !== brandName)
        : [...prevBrand, brandName],
    );
  };

  const handleTagChange = (tag) => {
    setTags((prevTag) =>
      prevTag.includes(tag)
        ? prevTag.filter((tag) => tag !== tag)
        : [...prevTag, tag],
    );
  };

  const handlePriceRangeChange = (priceRange) => {
    setSelectedPriceRanges((prevPriceRange) =>
      prevPriceRange.includes(priceRange)
        ? prevPriceRange.filter((range) => range !== priceRange)
        : [...prevPriceRange, priceRange],
    );
  };

  const handleSliderChange = (newValue) => {
    setSelectedPriceRanges([]);
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && totalPages <= totalPages) {
      setPage(newPage);
    }
  };

  const isLoading = isLoadingProducts || isLoadingCategories || isLoadingBrands;

  if (isLoading) {
    return (
      <div className="h-96">
        <Loader size="3em" topBorderSize="0.3em" />
      </div>
    );
  }

  return (
    <section className="shop-section flex justify-center my-10">
      <main className="w-[90%]">
        <Sheet>
          <SheetTrigger className="sm:hidden flex items-center gap-2">
            <FiMenu className="text-xl" />
            Filter and Sort
          </SheetTrigger>
          <SheetContent side="left">
            <ScrollArea className="h-full rounded-md">
              <SheetHeader>
                <SheetTitle>
                  <h1 className="text-2xl font-extrabold text-black flex gap-2 select-none">
                    <FaShoppingBag className="text-3xl" />
                    ShopKart
                  </h1>
                  Browse
                </SheetTitle>
                <SheetDescription>
                  <div className="filteration-section mt-4">
                    <div className="space-y-2 border-b-2 pb-10">
                      <h3 className="uppercase text-lg font-semibold">
                        Category
                      </h3>
                      {categories.map((category, index) => (
                        <span key={index} className="flex items-center gap-2">
                          <Checkbox
                            onCheckedChange={() =>
                              handleCategoryChange(category.categoryName)
                            }
                            id={category._id}
                            checked={selectCategory.includes(
                              category.categoryName,
                            )}
                          />
                          <label
                            className="hover:cursor-pointer"
                            htmlFor={category._id}
                          >
                            {category.categoryName}
                          </label>
                        </span>
                      ))}
                    </div>

                    <div className="space-y-2 border-b-2 mt-8 pb-10">
                      <h3 className="uppercase text-lg font-semibold">
                        Price Range
                      </h3>
                      <span className="flex items-center gap-2">
                        <Checkbox
                          id="under_$20"
                          onCheckedChange={() => handlePriceRangeChange("0-20")}
                          checked={selectedPriceRanges.includes("0-20")}
                        />
                        <label htmlFor="under_$20">Under $20</label>
                      </span>
                      <span className="flex items-center gap-2">
                        <Checkbox
                          id="$25_to_$100"
                          onCheckedChange={() =>
                            handlePriceRangeChange("25-100")
                          }
                          checked={selectedPriceRanges.includes("25-100")}
                        />
                        <label htmlFor="$25_to_$100">$25 to $100</label>
                      </span>
                      <span className="flex items-center gap-2">
                        <Checkbox
                          id="$100_to_$300"
                          onCheckedChange={() =>
                            handlePriceRangeChange("100-300")
                          }
                          checked={selectedPriceRanges.includes("100-300")}
                        />
                        <label htmlFor="$100_to_$300">$100 to $300</label>
                      </span>
                      <span className="flex items-center gap-2">
                        <Checkbox
                          id="$300_to_$500"
                          onCheckedChange={() =>
                            handlePriceRangeChange("300-500")
                          }
                          checked={selectedPriceRanges.includes("300-500")}
                        />
                        <label htmlFor="$300_to_$500">$300 to $500</label>
                      </span>
                      <span className="flex items-center gap-2">
                        <Checkbox
                          id="$500_to_$1000"
                          onCheckedChange={() =>
                            handlePriceRangeChange("500-1000")
                          }
                          checked={selectedPriceRanges.includes("500-1000")}
                        />
                        <label htmlFor="$500_to_$1000">$500 to $1,000</label>
                      </span>
                      <span className="flex items-center gap-2">
                        <Checkbox
                          id="$1000_to_10000"
                          onCheckedChange={() =>
                            handlePriceRangeChange("1000-100000")
                          }
                          checked={selectedPriceRanges.includes("1000-100000")}
                        />
                        <label htmlFor="$1000_to_10000">
                          $1,000 to $10,000
                        </label>
                      </span>
                    </div>

                    <div className="mt-8 border-b-2 pb-10">
                      <h3 className="uppercase text-lg font-semibold">
                        Popular Brands
                      </h3>
                      <div className="grid grid-cols-2 space-y-2">
                        {brands.map((brand, index) => (
                          <span key={index} className="flex items-center gap-2">
                            <Checkbox
                              id={brand._id}
                              onCheckedChange={() =>
                                handleBrandChange(brand.brandName)
                              }
                              checked={selectBrand.includes(brand.brandName)}
                            />
                            <label
                              htmlFor={brand._id}
                              className="hover:cursor-pointer"
                            >
                              {brand.brandName}
                            </label>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-black text-sm mt-8">
                      <h2 className="text-black w-full text-lg font-semibold">
                        Popular Tag
                      </h2>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          "phone",
                          "laptop",
                          "dell",
                          "Asus Laptops",
                          "Macbook",
                          "SSD",
                          "Power Bank",
                          "Smart TV",
                          "Speaker",
                          "Tablet",
                          "Microwave",
                          "Samsung",
                        ].map((tag) => (
                          <span
                            key={tag}
                            onClick={() => handleTagChange(tag)}
                            className={`border border-2 px-2 py-1 hover:bg-orange-100 hover:border-orange-400 hover:cursor-pointer ${tags.includes(tag) ? "bg-orange-100 border-orange-400" : "border-gray-300"}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetDescription>
              </SheetHeader>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <div className="mt-5">
          <div className="sm:flex gap-10">
            <div className="filteration-section sm:block hidden w-full">
              <div className="space-y-2 border-b-2 pb-10">
                <h3 className="uppercase text-lg font-semibold">Category</h3>
                {categories.map((category, index) => (
                  <span key={index} className="flex items-center gap-2">
                    <Checkbox
                      onCheckedChange={() =>
                        handleCategoryChange(category.categoryName)
                      }
                      id={category._id}
                      checked={selectCategory.includes(category.categoryName)}
                    />
                    <label
                      className="hover:cursor-pointer"
                      htmlFor={category._id}
                    >
                      {category.categoryName}
                    </label>
                  </span>
                ))}
              </div>

              <div className="space-y-2 border-b-2 mt-8 pb-10">
                <h3 className="uppercase text-lg font-semibold">Price Range</h3>

                <span className="flex items-center gap-2">
                  <Checkbox
                    id="under_$20"
                    onCheckedChange={() => handlePriceRangeChange("0-20")}
                    checked={selectedPriceRanges.includes("0-20")}
                  />
                  <label htmlFor="under_$20">Under $20</label>
                </span>
                <span className="flex items-center gap-2">
                  <Checkbox
                    id="$25_to_$100"
                    onCheckedChange={() => handlePriceRangeChange("25-100")}
                    checked={selectedPriceRanges.includes("25-100")}
                  />
                  <label htmlFor="$25_to_$100">$25 to $100</label>
                </span>
                <span className="flex items-center gap-2">
                  <Checkbox
                    id="$100_to_$300"
                    onCheckedChange={() => handlePriceRangeChange("100-300")}
                    checked={selectedPriceRanges.includes("100-300")}
                  />
                  <label htmlFor="$100_to_$300">$100 to $300</label>
                </span>
                <span className="flex items-center gap-2">
                  <Checkbox
                    id="$300_to_$500"
                    onCheckedChange={() => handlePriceRangeChange("300-500")}
                    checked={selectedPriceRanges.includes("300-500")}
                  />
                  <label htmlFor="$300_to_$500">$300 to $500</label>
                </span>
                <span className="flex items-center gap-2">
                  <Checkbox
                    id="$500_to_$1000"
                    onCheckedChange={() => handlePriceRangeChange("500-1000")}
                    checked={selectedPriceRanges.includes("500-1000")}
                  />
                  <label htmlFor="$500_to_$1000">$500 to $1,000</label>
                </span>
                <span className="flex items-center gap-2">
                  <Checkbox
                    id="$1000_to_10000"
                    onCheckedChange={() =>
                      handlePriceRangeChange("1000-100000")
                    }
                    checked={selectedPriceRanges.includes("1000-100000")}
                  />
                  <label htmlFor="$1000_to_10000">$1,000 to $10,000</label>
                </span>
              </div>

              <div className="mt-8 border-b-2 pb-10">
                <h3 className="uppercase text-lg font-semibold">
                  Popular Brands
                </h3>
                <div className="grid grid-cols-2 space-y-2">
                  {brands.map((brand, index) => (
                    <span key={index} className="flex items-center gap-2">
                      <Checkbox
                        id={brand._id}
                        onCheckedChange={() =>
                          handleBrandChange(brand.brandName)
                        }
                        checked={selectBrand.includes(brand.brandName)}
                      />
                      <label
                        htmlFor={brand._id}
                        className="hover:cursor-pointer"
                      >
                        {brand.brandName}
                      </label>
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-black text-sm mt-8">
                <h2 className="text-black w-full text-lg font-semibold">
                  Popular Tag
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    "SmartPhone",
                    "iPhone",
                    "TV",
                    "Macbook",
                    "SSD",
                    "Graphics Card",
                    "Power Bank",
                    "Smart TV",
                    "Speaker",
                    "Tablet",
                    "Microwave",
                    "Samsung",
                  ].map((tag) => (
                    <span
                      key={tag}
                      onClick={() => handleTagChange(tag.toLowerCase())}
                      className={`border border-2 px-2 py-1 hover:bg-orange-100 hover:border-orange-400 hover:cursor-pointer ${tags.includes(tag) ? "bg-orange-100 border-orange-400" : "border-gray-300"}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <section className="border-2 border border-solid border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-5 divide-x-2 divide-y-2 divide-gray-200">
                {products.map((product, index) => (
                  <Link key={index} to={`/product-details/${product._id}`}>
                    <div className="col-span-1">
                      <div className="flex justify-center">
                        <img
                          src={product.productImage[0]}
                          alt=""
                          className="w-48 h-48 mt-5 mb-3"
                        />
                      </div>
                      <p className="line-clamp-2 w-22 text-sm px-4 mb-2">
                        {product.title}
                      </p>
                      <span className="px-4">${product.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
        <Pagination className="mt-5">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => handlePageChange(page - 1)}
                className={page === 1 ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => handlePageChange(page + 1)}
                className={
                  page === totalPages ? "opacity-50 pointer-events-none" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </main>
    </section>
  );
};

export default ShopPage;
