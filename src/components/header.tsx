import {
  faBars,
  faMicrophone,
  faMoon,
  faSearch,
  faShoppingBag,
  faSun,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { themeSliceActions } from "../slices/theme_slice";
import ThePulseLoader from "./pulse-loader";
import SearchItem from "../pages/home/search_item";
import HeaderAuthPopUp from "./header_auth_popup";
import { useNavigate } from "react-router-dom";
import useSpeechRecognition from "../hooks/speech_recognition_hook";
import GeneralCategories from "./general_categories";

const TheHeader: React.FC = () => {
  const themeState = useAppSelector((state) => {
    return state.theme;
  });
  const darkMode = themeState.darkMode;
  const primaryColor = themeState.primaryColor;
  const primaryTextColor = themeState.primaryTextColor;

  const cartState = useAppSelector((state) => {
    return state.cart;
  });

  let totalItemCount = cartState.totalItemCount;
  let totalPrice = cartState.totalPrice;

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showAuthPopup, setShowAuthPopup] = useState<boolean>(false);

  const toggleSearchBar = () => {
    setShowSearchBar(!showSearchBar);
  };

  const toggleAuthPopup = () => {
    setShowAuthPopup(!showAuthPopup);
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const {
    isLoading,
    error,
    data,
    text,
    startListening,
    isListening,
    hasRecognitionSupport,
    setTextValue,
  } = useSpeechRecognition();

  const [showSearchBar, setShowSearchBar] = useState<boolean>(text.length > 0);

  // const searchBarRef = useRef<HTMLDivElement>(null);
  const authPopupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowSearchBar(text.length > 0);
  }, [text]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      authPopupRef.current &&
      !authPopupRef.current.contains(event.target as Node)
    ) {
      setShowAuthPopup(false);
    } else {
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col sticky top-0 z-30">
      {(showSearchBar || showAuthPopup) && (
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(5px)",
          }}
          className="fixed top-24 right-0 h-full w-screen bg-black bg-opacity-80 z-20"
          onClick={() => {
            setShowSearchBar(false);
            setShowAuthPopup(false);
            setTextValue("");
          }}
        ></div>
      )}
      <div
        onClick={() => {
          setShowSearchBar(false);
        }}
        className="w-full flex flex-row items-center justify-between px-10 py-8 bg-zinc-950 text-white gap-x-6"
      >
        <div className="flex lg:hidden mt-1.5 pr-4 ">
          <FontAwesomeIcon
            icon={faBars}
            className="text-2xl cursor-pointer transition-transform duration-500 ease-in-out"
            style={{
              transform: showMenu ? "rotate(90deg) " : "rotate(0deg)",
            }}
            onClick={toggleMenu}
          />
        </div>
        <p
          onClick={() => {
            navigate("/home");
          }}
          style={{
            textShadow: "2px 2px purple",
          }}
          className="font-semibold text-xl tracking-wider cursor-pointer"
        >
          {" "}
          GLAMOURGLOW
        </p>
        <div className="relative hidden lg:flex w-2/4">
          <input
            onChange={(e) => {
              setTextValue(e.target.value);
            }}
            value={text}
            placeholder="What are you looking for ?"
            className="px-3 py-2 rounded-3xl  bg-zinc-900  w-full pl-10 pr-14"
          />
          <FontAwesomeIcon
            onClick={() => {}}
            className="absolute top-3 left-3"
            icon={faSearch}
          ></FontAwesomeIcon>
          <p
            className="absolute top-1.5 right-12 cursor-pointer "
            onClick={() => {
              setTextValue("");
              setShowSearchBar(false);
            }}
          >
            {" "}
            Clear{" "}
          </p>
          <FontAwesomeIcon
            onClick={() => {
              if (isListening) {
                return;
              }
              startListening();
            }}
            className="absolute top-3 right-5 cursor-pointer"
            icon={faMicrophone}
          ></FontAwesomeIcon>
          {showSearchBar && (
            <div
              style={{
                scrollbarWidth: "none",
              }}
              className={`z-30 max-h-96 rounded-xl absolute overflow-y-scroll top-11 left-0 right-0 py-10 shadow-md shadow-black ${primaryColor} ${primaryTextColor}`}
            >
              {isLoading && (
                <div className="flex flex-row justify-center">
                  <ThePulseLoader color="purple" />
                </div>
              )}
              {error && (
                <p className="text-center font-semibold tracking-wider">
                  {" "}
                  {error.message}{" "}
                </p>
              )}
              {text.length === 0 && (
                <p className="text-center font-semibold tracking-wider">
                  {" "}
                  Search for products.{" "}
                </p>
              )}
              {text.length > 0 && data && data.products.length > 0 && (
                <div className="flex flex-col px-6">
                  <p className="mb-3 text-sm font-semibold tracking-wider">
                    Products
                  </p>
                  <div className=" grid grid-cols-1 md:grid-cols-2  gap-3">
                    {data.products.map((product: any) => (
                      <SearchItem
                        key={product.id}
                        toggleShow={toggleSearchBar}
                        toggleText={() => {
                          setTextValue("");
                        }}
                        product={{
                          id: product._id,
                          brand: product.brand,
                          category: product.category,
                          name: product.name,
                          images: product.images,
                          price: product.price,
                          description: product.description,
                          availableQuantity: product.quantityAvailable,
                          rating: product.rating,
                          totalReviews: product.totalReviews,
                        }}
                      ></SearchItem>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-row gap-x-5 items-center">
          <FontAwesomeIcon
            className="cursor-pointer text-lg hidden lg:flex"
            onClick={() => {
              dispatch(themeSliceActions.toggleDarkMode());
              setShowSearchBar(false);
            }}
            icon={darkMode ? faSun : faMoon}
          ></FontAwesomeIcon>
          <FontAwesomeIcon
            className="cursor-pointer text-2xl flex lg:hidden"
            onClick={() => {
              setShowSearchBar(!showSearchBar);
            }}
            icon={faSearch}
          ></FontAwesomeIcon>
          <div className="relative">
            <FontAwesomeIcon
              onClick={() => {
                setShowAuthPopup(!showAuthPopup);
                setShowSearchBar(false);
              }}
              className="cursor-pointer  text-lg hidden lg:flex"
              icon={faUser}
            ></FontAwesomeIcon>
            <div ref={authPopupRef}>
              {" "}
              <HeaderAuthPopUp
                show={showAuthPopup}
                setShow={toggleAuthPopup}
              ></HeaderAuthPopUp>
            </div>
          </div>
          <div
            onClick={() => {
              navigate("/my-cart");
            }}
            className="relative w-full flex flex-row items-center gap-x-3 border border-solid border-white px-4 py-2 rounded-md shadow-md shadow-white cursor-pointer"
          >
            <FontAwesomeIcon
              className="text-lg"
              icon={faShoppingBag}
            ></FontAwesomeIcon>
            {totalItemCount > 0 && (
              <p className="font-semibold tracking-widest hidden md:flex">
                {" "}
                Rs. {totalPrice}
              </p>
            )}
            {totalItemCount > 0 && (
              <p
                style={{
                  fontSize: "11px",
                }}
                className="text-white shadow-sm shadow-white absolute -top-2 -right-2 bg-purple-500 rounded-full flex py-0.5 px-1.5"
              >
                {totalItemCount}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* search results */}
      {showSearchBar && (
        <div
          className={`${primaryColor} max-h-96 z-30 overflow-y-scroll fixed flex lg:hidden flex-col top-28 right-0 left-0 py-10 rounded-b-2xl shadow-sm shadow-black mb-20 `}
          style={{
            scrollbarWidth: "none",
          }}
        >
          <div className="relative shadow-md shadow-black my-7 mx-6">
            <input
              value={text}
              onChange={(e) => {
                setTextValue(e.target.value);
              }}
              placeholder="What are you looking for ?"
              className={`px-3 py-3 rounded-sm  w-full pl-10 pr-16  ${primaryColor} ${primaryTextColor}`}
            />
            <FontAwesomeIcon
              className="absolute top-4 left-3"
              icon={faSearch}
            />

            <p
              onClick={() => {
                setTextValue("");
                setShowSearchBar(false);
              }}
              className="absolute top-3 right-12 hover:cursor-pointer"
            >
              {" "}
              Clear{" "}
            </p>
            <FontAwesomeIcon
              onClick={() => {
                if (isListening) {
                  return;
                }
                startListening();
              }}
              className="absolute top-4 right-5 cursor-pointer"
              icon={faMicrophone}
            ></FontAwesomeIcon>
          </div>
          {isLoading && (
            <div className="flex flex-row justify-center">
              <ThePulseLoader color="purple" />
            </div>
          )}
          {error && (
            <p className="text-center font-semibold tracking-wider">
              {" "}
              {error.message}{" "}
            </p>
          )}
          {text.length === 0 && (
            <p className="text-center font-semibold tracking-wider">
              {" "}
              Search for products.{" "}
            </p>
          )}
          {text.length > 0 && data && data.products.length > 0 && (
            <div className="flex flex-col px-6">
              <p className="mb-3 text-sm font-semibold tracking-wider">
                Products
              </p>
              <div className=" grid grid-cols-1 md:grid-cols-2  gap-3">
                {data.products.map((product: any) => (
                  <SearchItem
                    key={product.id}
                    toggleShow={toggleSearchBar}
                    toggleText={() => {
                      setTextValue("");
                    }}
                    product={{
                      id: product._id,
                      brand: product.brand,
                      category: product.category,
                      name: product.name,
                      images: product.images,
                      price: product.price,
                      description: product.description,
                      availableQuantity: product.quantityAvailable,
                      rating: product.rating,
                      totalReviews: product.totalReviews,
                    }}
                  ></SearchItem>
                ))}
              </div>
            </div>
          )}
          <div className="h-10"></div>
        </div>
      )}

      {/* general categories */}
      <GeneralCategories></GeneralCategories>
    </div>
  );
};

export default TheHeader;
