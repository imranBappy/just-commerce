import { CardText, ChatLeftDots, StarHalf } from "@styled-icons/bootstrap";
import customId from "custom-id-new";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.min.css";
import { useDispatch, useSelector } from "react-redux";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { toast } from "react-toastify";
import Error404 from "~/components/error/404";
import Error500 from "~/components/error/500";
import HeadData from "~/components/Head";
import ImageLoader from "~/components/Image";
import Question from "~/components/question";
import Review from "~/components/Review";
import Product from "~/components/Shop/Product/product";
import classes from "~/components/Shop/Product/productDetails.module.css";
import { postData, setSettingsData, stockInfo } from "~/lib/clientFunctions";
import productDetailsData from "~/lib/dataLoader/productDetails";
import { addToCart, addVariableProductToCart } from "~/redux/cart.slice";
import { wrapper } from "~/redux/store";

const Carousel = dynamic(() =>
  import("react-responsive-carousel").then((com) => com.Carousel)
);

function ProductDetailsPage({ data, error }) {
  const [selectedColor, setSelectedColor] = useState({
    name: null,
    value: null,
  });
  const [selectedAttribute, setSelectedAttribute] = useState({
    name: null,
    value: null,
    for: null,
  });
  const { session } = useSelector((state) => state.localSession);
  const [price, setPrice] = useState(0);
  const [tabId, setTabId] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const dispatch = useDispatch();
  const quantityAmount = useRef();
  const question = useRef();
  const cartData = useSelector((state) => state.cart);
  const deliveryPrice = data?.product?.deliveryPrice;
  const internationalCost = data?.product?.internationalCost;
  const [permission, setPermission] = useState("");
  useEffect(() => {
    // Fetch shipping data from the API
    fetch("/api/shipping")
      .then((response) => response.json())
      .then((data) => {
        setPermission(data.shippingCharge.internationalShippingActive);
      })
      .catch((error) => console.error("Error fetching shipping data:", error));
  }, []);

  const settings = useSelector((state) => state.settings);
  const router = useRouter();
  const relatedItem =
    data.related &&
    data.related.filter((obj) => {
      return obj._id !== data.product._id;
    });
  const { t } = useTranslation();
  useEffect(() => {
    if (data && data.product) {
      setPrice(data.product.discount);
      if (data.product.type !== "variable") {
        return;
      }
      if (data.product.colors && data.product.colors.length > 0) {
        setSelectedColor({
          name: data.product.colors[0]?.label,
          value: data.product.colors[0]?.value,
        });
      }
      if (data.product.attributes && data.product.attributes.length > 0) {
        setSelectedAttribute({
          name: data.product.attributes[0]?.label,
          value: data.product.attributes[0]?.value,
          for: data.product.attributes[0]?.for,
        });
      }
    }
  }, [data]);

  const checkVariantInfo = (color, attr) => {
    const colorName = color || selectedColor.name;
    const attrName = attr || selectedAttribute.name;
    return data.product.variants.find(
      (item) => item.color === colorName && item.attr === attrName
    );
  };

  const stepUpQty = () => {
    quantityAmount.current.stepUp();
  };

  const stepDownQty = () => {
    quantityAmount.current.stepDown();
  };

  const selectPreviewImage = (vd) => {
    if (vd.imageIndex && vd.imageIndex > 0) {
      setSelectedImage(vd.imageIndex - 1);
    }
  };

  const updatePrice = (color, attr) => {
    const variantData = checkVariantInfo(color, attr);
    if (variantData && variantData.price) {
      const itemPrice = data.product.discount + Number(variantData.price);
      setPrice(itemPrice);
      selectPreviewImage(variantData);
    }
  };

  const changeColor = (e) => {
    try {
      const value = {
        name: e.label,
        value: e.value,
      };
      setSelectedColor(value);
      updatePrice(value.name, null);
    } catch (err) {
      console.log(err);
    }
  };

  const changeVariant = (e) => {
    try {
      const value = {
        name: e.label,
        value: e.value,
        for: e.for,
      };
      setSelectedAttribute(value);
      updatePrice(null, value.name);
    } catch (err) {
      console.log(err);
    }
  };

  const simpleProductCart = (qty) => {
    const { _id, name, image, quantity } = data.product;
    const existed = cartData.items.find((item) => item._id === _id);
    const totalQty = existed ? existed.qty + qty : qty;
    if (quantity === -1 || quantity >= totalQty) {
      const cartItem = {
        _id,
        uid: customId({ randomLength: 6 }),
        name,
        image,
        price: Number(price),
        deliveryPrice: deliveryPrice,
        internationalCost,
        qty,
        quantity,
        color: { name: null, value: null },
        attribute: { name: null, value: null, for: null },
      };
      dispatch(addToCart(cartItem));
      toast.success("Added to Cart");
    } else {
      toast.error("This item is out of stock!");
    }
  };

  const checkQty = (prevQty, currentQty, availableQty) => {
    const avQty = Number(availableQty);
    if (avQty === -1) {
      return true;
    } else {
      return prevQty + currentQty <= avQty;
    }
  };

  const variableProductCart = (qty) => {
    try {
      const { _id, name, image, colors, attributes } = data.product;
      if (colors.length && !selectedColor.name) {
        toast.warning("Please Select Color!");
      } else if (attributes.length && !selectedAttribute.name) {
        toast.warning(`Please Select ${attributes[0]?.for}!`);
      } else {
        const existedProduct = cartData.items.find(
          (item) =>
            item._id === _id &&
            item.color.name == selectedColor.name &&
            item.attribute.name == selectedAttribute.name
        );
        const existedQty = existedProduct ? existedProduct.qty : 0;
        const variantData = checkVariantInfo(
          selectedColor.name,
          selectedAttribute.name
        );
        const qtyAvailable =
          variantData && checkQty(existedQty, qty, variantData.qty);
        if (qtyAvailable) {
          const cartItem = {
            _id,
            uid: customId({ randomLength: 6 }),
            name,
            image,
            price: Number(price),
            qty,
            quantity: Number(variantData.qty),
            sku: variantData.sku,
            color: selectedColor.name
              ? { name: selectedColor.name, value: selectedColor.value }
              : { name: null, value: null },
            attribute: selectedAttribute.name
              ? {
                  name: selectedAttribute.name,
                  value: selectedAttribute.value,
                  for: attributes[0]?.for,
                }
              : { name: null, value: null, for: null },
          };
          dispatch(addVariableProductToCart(cartItem));
          toast.success("Added to Cart");
        } else {
          toast.error("This item is out of stock!");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong");
    }
  };

  const addItemToCart = () => {
    const qty = Number(quantityAmount.current.value);
    if (data.product.type === "simple") {
      simpleProductCart(qty);
    } else {
      variableProductCart(qty);
    }
  };

  const thumbs = () => {
    const thumbList = data.product.gallery.map((item, index) => (
      <ImageLoader
        key={item.name + index}
        src={item.url}
        alt={data.product.name}
        width={67}
        height={67}
        style={{ width: "100%", height: "auto" }}
      />
    ));
    return thumbList;
  };

  const _showTab = (i) => {
    setTabId(i);
  };

  const refreshData = () => router.replace(router.asPath);

  async function postQuestion(e) {
    try {
      e.preventDefault();
      const _data = {
        pid: data.product._id,
        question: question.current.value.trim(),
      };
      const _r = await postData("/api/question", _data);
      _r.success
        ? (toast.success("Question Added Successfully"), refreshData())
        : toast.error("Something Went Wrong 500");
    } catch (err) {
      console.log(err);
      toast.error(`Something Went Wrong - ${err.message}`);
    }
  }

  useEffect(() => {
    if (data.product) {
      const cl = data.product.colors?.length || 0;
      const al = data.product.attributes?.length || 0;
      if (cl > 0 && al > 0) {
        updatePrice(selectedColor.name, selectedAttribute.name);
      }
      if (cl > 0 && al === 0) {
        updatePrice(selectedColor.name, null);
      }
      if (cl === 0 && al > 0) {
        updatePrice(null, selectedAttribute.name);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedColor, selectedAttribute]);

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const createWhatsAppShareLink = () => {
    const phoneNumber = settings.settingsData.footerBanner.support.title; // Use the phone number from your settings
    const productURL = `${process.env.NEXT_PUBLIC_URL}/product/${data.product.slug}`;
    const text = `Link: ${productURL}\nTitle: ${data.product.name}\nPrice: ${settings.settingsData.currency.symbol} *${data.product.price}*`;

    // Encode the text and phone number for the URL
    const encodedText = encodeURIComponent(text);
    const encodedPhoneNumber = encodeURIComponent(phoneNumber);

    // Create the WhatsApp share link
    const whatsappLink = `https://api.whatsapp.com/send?phone=${encodedPhoneNumber}&text=${encodedText}`;

    return whatsappLink;
  };

  if (error) return <Error500 />;
  if (!data.product) return <Error404 />;

  return (
    <>
      <HeadData
        title={data.product.name}
        seo={data.product.seo}
        url={`product/${data.product.slug}`}
      />
      <div className="py-1">
        <div className="custom_container">
          <div className="p-0">
            <div className="bg-white px-2 py-3">
              <div className={classes.container}>
                <div className="row m-0">
                  <div className="col-lg-4 p-0">
                    <div className={classes.slider}>
                      <div className={classes.image_container_main}>
                        <Carousel
                          showArrows={false}
                          showThumbs={true}
                          showIndicators={false}
                          renderThumbs={thumbs}
                          preventMovementUntilSwipeScrollTolerance={true}
                          swipeScrollTolerance={50}
                          emulateTouch={true}
                          selectedItem={selectedImage}
                        >
                          {data.product.gallery.map((item, index) => (
                            <InnerImageZoom
                              key={item.name + index}
                              src={item.url}
                              className={classes.magnifier_container}
                              fullscreenOnMobile={true}
                            />
                          ))}
                        </Carousel>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 p-0">
                    <div className={classes.details}>
                      <div className={classes.category}>
                        {data.product.categories.map((category, index) => {
                          console.log(category);
                          return (
                            <span key={index} className={classes.category_list}>
                              {category}
                            </span>
                          );
                        })}
                      </div>
                      <p className={classes.unit}>
                        {data.product.unitValue} {data.product.unit}
                      </p>
                      <h2 className={classes.heading}>
                        {data.product.name}{" "}
                        {stockInfo(data.product) ? "In Stock" : "Out Of Stock"}{" "}
                        {settings.settingsData.footerBanner.delivery.title}
                      </h2>
                      <p>
                        {data.product.name} from Best Price in Kenya with fast
                        delivery across the country and in-store pickup in
                        Nairobi.
                      </p>
                      <hr />
                      <div>
                        {data.product.discount < data.product.price && (
                          <p className={classes.price_ori}>
                            {settings.settingsData.currency.symbol}
                            <span className="mb-0 pl-1">
                              {data.product.price}
                            </span>
                          </p>
                        )}
                        <p className={classes.price}>
                          {settings.settingsData.currency.symbol}
                          <span className="mb-0 pl-1">{price}</span>
                        </p>
                      </div>
                      <b>Featured specifications for {data.product.name}</b>
                      <p
                        className="hera"
                        dangerouslySetInnerHTML={{
                          __html: data.product.shortDescription,
                        }}
                      />
                      {data.product.type === "variable" && (
                        <div>
                          {data.product.colors.length > 0 && (
                            <div className={classes.color_selector}>
                              <p
                                className={classes.section_heading}
                                style={{ marginBottom: "11px" }}
                              >
                                {t("color")}
                              </p>
                              <div className={classes.color_selector_container}>
                                {data.product.colors.map((color, i) => (
                                  <div
                                    className={classes.circle_outer}
                                    key={i}
                                    onClick={() => changeColor(color)}
                                    title={color.name}
                                  >
                                    <label
                                      data-selected={
                                        color.value === selectedColor.value
                                      }
                                      style={{ backgroundColor: color.value }}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {data.product.attributes.length > 0 && (
                            <div>
                              <p className={classes.section_heading}>
                                {data.product.attributes[0]?.for}
                              </p>
                              <div className={classes.select}>
                                {data.product.attributes.map((attr, i) => (
                                  <span
                                    key={i}
                                    className={classes.attr}
                                    onClick={() => changeVariant(attr)}
                                    data-selected={
                                      attr.label === selectedAttribute.name
                                    }
                                  >
                                    {attr.label}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className={classes.cart_section}>
                        <p className={classes.section_heading}>QTY</p>
                        <div className={classes.number_input}>
                          <button
                            onClick={stepDownQty}
                            className={classes.minus}
                          ></button>
                          <input
                            className={classes.quantity}
                            ref={quantityAmount}
                            min="1"
                            max={
                              data.product.quantity === -1
                                ? 100000
                                : data.product.quantity
                            }
                            defaultValue="1"
                            type="number"
                            disabled
                          />
                          <button
                            onClick={stepUpQty}
                            className={classes.plus}
                          ></button>
                        </div>
                        <div className={classes.button_container}>
                          {stockInfo(data.product) ? (
                            <button
                              className={classes.cart_button}
                              onClick={() => addItemToCart()}
                            >
                              {t("add_to_cart")}
                            </button>
                          ) : (
                            <button className={classes.cart_button} disabled>
                              {t("out_of_stock")}
                            </button>
                          )}
                        </div>
                        <a
                          className={classes.cart_button}
                          href={createWhatsAppShareLink()}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Order on WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-2 p-2">
                    <div>
                      <p
                        className="text-black text-xs"
                        dangerouslySetInnerHTML={{
                          __html:
                            settings.settingsData.footerBanner.security.title,
                        }}
                      />
                      <hr className="my-4" />
                      <div>
                        <div className="d-flex align-items-center">
                          <span>•</span>
                          <p className="mb-0 text-xs pl-1">
                            Quick shipping across Kenya
                          </p>
                        </div>
                        <div className="d-flex align-items-center">
                          <span>•</span>
                          <p className="mb-0 text-xs pl-1">
                            In-store pickup in Nairobi
                          </p>
                        </div>
                        <div className="d-flex align-items-center">
                          <span>•</span>
                          <p className="mb-0 text-xs pl-1">
                            Payment on delivery accepted
                          </p>
                        </div>
                        <div className="d-flex align-items-center">
                          <span>•</span>
                          <p className="mb-0 text-xs pl-1">
                            Top-notch products and services
                          </p>
                        </div>
                      </div>
                      <hr className="my-4" />
                      <h6>Delivery Price :</h6>
                      {data?.product?.deliveryPrice?.map((item) => (
                        <div
                          key={item._id}
                          className="d-flex justify-content-between"
                        >
                          <p className="mb-0">{item?.name}</p>
                          <p className="mb-0">{item?.cost}</p>
                        </div>
                      ))}
                      <hr className="my-4" />
                      {permission === "YES" ? (
                        <div>
                          <div className=" bg-white  d-flex justify-content-between">
                            {t("International  Charge:")}
                            <p>{data?.product.internationalCost}</p>
                          </div>
                          <hr />
                        </div>
                      ) : (
                        ""
                      )}
                      <div className="d-flex align-items-center my-2">
                        <svg
                          stroke="currentColor"
                          fill="none"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          height="50"
                          width="50"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        <p
                          className="text-black mb-0 pl-1"
                          dangerouslySetInnerHTML={{
                            __html: settings.settingsData.address,
                          }}
                        />
                      </div>
                      <div className="d-flex align-items-center my-2">
                        <svg
                          stroke="currentColor"
                          fill="currentColor"
                          strokeWidth="0"
                          t="1569683618210"
                          viewBox="0 0 1024 1024"
                          version="1.1"
                          height="20"
                          width="20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <defs></defs>
                          <path d="M945 412H689c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h256c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM811 548H689c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h122c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM477.3 322.5H434c-6.2 0-11.2 5-11.2 11.2v248c0 3.6 1.7 6.9 4.6 9l148.9 108.6c5 3.6 12 2.6 15.6-2.4l25.7-35.1v-0.1c3.6-5 2.5-12-2.5-15.6l-126.7-91.6V333.7c0.1-6.2-5-11.2-11.1-11.2z"></path>
                          <path d="M804.8 673.9H747c-5.6 0-10.9 2.9-13.9 7.7-12.7 20.1-27.5 38.7-44.5 55.7-29.3 29.3-63.4 52.3-101.3 68.3-39.3 16.6-81 25-124 25-43.1 0-84.8-8.4-124-25-37.9-16-72-39-101.3-68.3s-52.3-63.4-68.3-101.3c-16.6-39.2-25-80.9-25-124 0-43.1 8.4-84.7 25-124 16-37.9 39-72 68.3-101.3 29.3-29.3 63.4-52.3 101.3-68.3 39.2-16.6 81-25 124-25 43.1 0 84.8 8.4 124 25 37.9 16 72 39 101.3 68.3 17 17 31.8 35.6 44.5 55.7 3 4.8 8.3 7.7 13.9 7.7h57.8c6.9 0 11.3-7.2 8.2-13.3-65.2-129.7-197.4-214-345-215.7-216.1-2.7-395.6 174.2-396 390.1C71.6 727.5 246.9 903 463.2 903c149.5 0 283.9-84.6 349.8-215.8 3.1-6.1-1.4-13.3-8.2-13.3z"></path>
                        </svg>
                        <p
                          className="text-black mb-0 pl-1"
                          dangerouslySetInnerHTML={{
                            __html: settings.settingsData.phoneFooter,
                          }}
                        />
                      </div>
                      <hr className="my-4" />
                      <h6>How to pay</h6>
                      <p
                        className="text-black text-xs"
                        dangerouslySetInnerHTML={{
                          __html:
                            settings.settingsData.footerBanner.security
                              .description,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {relatedItem.length > 0 && (
              <div className={classes.related}>
                <div>
                  <h3 className="mb-0">{t("Related_Items")}</h3>
                  <p>{t("Related_Itemss")}</p>
                </div>

                <ul className={classes.related_list}>
                  {relatedItem.map((product, index) => (
                    <Product key={index} product={product} hideLink border />
                  ))}
                </ul>
              </div>
            )}

            <div>
              <>
                <div>
                  <h3 className="mb-0">{t("Specifications")}</h3>
                  <p>
                    {data.product.name} {t("Specificationss")}
                  </p>
                </div>
                {data.product.description &&
                data.product.description.length > 0 ? (
                  <div
                    className="bg-white p-2 hera2 text-left"
                    data-aos="fade-up"
                  >
                    <div
                      className={`overflow-hidden pl-3 ${
                        isOpen ? "h-auto" : "h-96"
                      }`}
                    >
                      <div
                        className="p-2 bg-white hera2"
                        dangerouslySetInnerHTML={{
                          __html: data.product.description,
                        }}
                      />
                    </div>
                    <div
                      className="py-3 px-2 cursor-pointer font-weight-bold text-uppercase"
                      onClick={toggleOpen}
                    >
                      <bottom className={classes.unit}>
                        {isOpen ? "Show Less specs" : "Show More specs"}
                      </bottom>
                    </div>
                  </div>
                ) : (
                  <EmptyContent
                    icon={<CardText width={40} height={40} />}
                    text="This product has no description"
                  />
                )}
              </>

              <>
                {data.product.review && data.product.review.length > 0 ? (
                  <Review review={data.product.review} />
                ) : (
                  <EmptyContent
                    icon={<StarHalf width={40} height={40} />}
                    text="This product has no reviews yet"
                  />
                )}
              </>
              <>
                {session && (
                  <form
                    className="border border-2 rounded p-3 mb-3"
                    onSubmit={postQuestion}
                  >
                    <div className="mb-3">
                      <label className="form-label">Ask a question</label>
                      <textarea
                        className="form-control"
                        maxLength={300}
                        placeholder="Maximum 300 words"
                        ref={question}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className={classes.c_btn}>
                      ASK QUESTION
                    </button>
                  </form>
                )}
                {data.product.question && data.product.question.length > 0 ? (
                  <Question
                    qtn={data.product.question}
                    user={session}
                    pid={data.product._id}
                    refresh={refreshData}
                  />
                ) : (
                  <EmptyContent
                    icon={<ChatLeftDots width={40} height={40} />}
                    text="There are no questions asked yet. Please login or register to ask question"
                  />
                )}
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function EmptyContent({ icon, text }) {
  return (
    <div className={classes.empty_content}>
      <div className={classes.empty_icon}>{icon}</div>
      <div className={classes.empty_text}>{text}</div>
    </div>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res, query }) => {
      if (res) {
        res.setHeader(
          "Cache-Control",
          "public, s-maxage=10800, stale-while-revalidate=59"
        );
      }
      const _data = await productDetailsData(query.name);
      const data = JSON.parse(JSON.stringify(_data));
      if (data.success) {
        setSettingsData(store, data);
      }
      return {
        props: {
          data,
          error: !data.success,
        },
      };
    }
);

export default ProductDetailsPage;
