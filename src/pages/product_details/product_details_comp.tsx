import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ImageViewer from "./image_viewer";
import { Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import CustomerReviews from "./customer_reviews_section";
import { TheProductType } from "../admin_account/admin_product_item";
import { cartSliceActions } from "../../slices/cart-slice";
import toast from "react-hot-toast";

const ProductDetailsComp: React.FC<{ product: TheProductType }> = (props) => {
  const [isFixed, setIsFixed] = useState(true);
  const navigate = useNavigate();

  const themeState = useAppSelector((state) => {
    return state.theme;
  });

  const darkMode = themeState.darkMode;
  const errorTextColor = themeState.errorTextColor;
  const dispatch = useAppDispatch();

  const authState = useAppSelector((state) => {
    return state.auth;
  });

  const user = authState.user;

  useEffect(() => {
    function isElementInViewport(el: any) {
      var rect = el.getBoundingClientRect();

      return (
        rect.bottom - 90 > 0 &&
        rect.top - 90 <=
          (window.innerHeight || document.documentElement.clientHeight)
      );
    }

    const handleScroll = () => {
      const redDivElement = document.getElementById("div-red");

      if (isElementInViewport(redDivElement)) {
        console.log("Element is in the viewport");
        setIsFixed(true);
      } else {
        console.log("Element is not in the viewport");
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="flex flex-col w-full my-8">
      <p className="text-lg tracking-wider font-semibold text-zinc-500 mb-5">
        {" "}
        <span
          className="hover:text-purple-400 hover:cursor-pointer"
          onClick={() => {
            navigate("/home");
          }}
        >
          Home
        </span>{" "}
        / {props.product.name}
      </p>
      <div className="flex flex-col md:flex-row w-full gap-y-5 gap-x-5">
        <div className="w-full md:w-2/5 ">
          <ImageViewer
            isFixed={isFixed}
            images={props.product.images}
          ></ImageViewer>
        </div>
        <div className="w-full md:w-3/5 mt-5">
          <div
            id="div-red"
            className="flex flex-col lg:flex-row lg:items-start w-full gap-x-3 gap-y-7"
          >
            {/* mid - component */}
            <div className="flex flex-col w-full lg:w-3/5">
              <p className="text-3xl tracking-wider font-semibold">
                {" "}
                {props.product.name}
              </p>
              <Rating
                className="mt-3"
                name="simple-controlled"
                value={props.product.rating}
                readOnly
                size="medium"
              />
              <p className="text-sm"> 16 reviews </p>
              <p className="text-xl font-semibold mt-5"> Description:</p>
              <p className="text-sm mt-2">{props.product.description}</p>
              <CustomerReviews product={props.product}></CustomerReviews>
            </div>
            {/* the end component */}
            <div
              className={`${
                isFixed ? "sticky top-44" : "static"
              } px-5 py-6 flex flex-col w-full justify-start h-auto lg:w-2/5 ${
                darkMode
                  ? "bg-zinc-800 shadow-sm shadow-gray-500"
                  : "bg-purple-50 shadow-sm shadow-gray-700"
              }`}
            >
              <p className="tracking-wide font-semibold text-xl"> {props.product.brand} </p>
              <p className="tracking-normal font-bold text-2xl mt-5">
                Rs. {props.product.price}
              </p>
              <div
                onClick={() => {
                  if (!user) {
                    toast.error('Please login to add items to cart.')
                    return;
                  } else if (user.status === 'admin') {
                    toast.error('Action denied.');
                    return;
                  }
                  dispatch(
                    cartSliceActions.addItemToCart({
                      item: {
                        productItem: {
                          id: props.product.id,
                          type: props.product.category,
                          image: props.product.images[0],
                          name: props.product.name,
                          price: props.product.price,
                        },
                        count: 1,
                        price: props.product.price,
                      },
                    })
                  );
                  toast.success("Item added to your cart.");
                }}
                className="relative w-full mt-7"
              >
                <button
                  className={` w-full rounded-xl bg-gray-300 text-gray-300 px-5 py-3 font-semibold tracking-wider transition-all ease-in-out `}
                >
                  Add to Cart
                </button>
                <button
                  className={`diagonal-translate w-full absolute rounded-xl -top-2 -left-2 font-semibold tracking-wider  ${
                    darkMode ? "bg-purple-500" : "bg-black"
                  } ${errorTextColor} px-5 py-3 transition-all ease-in-out rounded-sm`}
                >
                  {" "}
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsComp;
