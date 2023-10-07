import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import classes from "~/components/Checkout/checkout.module.css";
import HeadData from "~/components/Head";
import ImageLoader from "~/components/Image";
import data from "~/data";
import { fetchData, postData } from "~/lib/clientFunctions";
import { resetCart, updateBillingData } from "~/redux/cart.slice";

const CheckoutNav = dynamic(() => import("~/components/Checkout/checkoutNav"));
const PaymentGatewayList = dynamic(() =>
  import("~/components/Checkout/paymentGatewayList")
);

const Checkout = () => {
  const cartData = useSelector((state) => state.cart);
  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;
  const dispatch = useDispatch();
  const router = useRouter();
  const { session, status } = useSelector((state) => state.localSession);
  const [visibleTab, setVisibleTab] = useState(1);
  const [changeTab, setChangeTab] = useState(false);
  const [sameShippingAddressValue, setSameShippingAddressValue] =
    useState(false);
  const [termsAgree, setTermsAgree] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({});
  const [shippingChargeInfo, setShippingChargeInfo] = useState({});
  const [billingInfo, setBillingInfo] = useState({});
  const [shippingInfo, setShippingInfo] = useState({});
  const [preInfo, setPreInfo] = useState({
    billingInfo: {
      fullName: "",
      phone: "",
      email: "",
      house: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    shippingInfo: {
      fullName: "",
      phone: "",
      email: "",
      house: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [country1, setCountry1] = useState("");
  const [country2, setCountry2] = useState("");
  const fullName1 = useRef();
  const phone1 = useRef();
  const email1 = useRef();
  const house1 = useRef();
  const city1 = useRef();
  const state1 = useRef();
  const zip1 = useRef();
  const fullName2 = useRef();
  const phone2 = useRef();
  const email2 = useRef();
  const house2 = useRef();
  const city2 = useRef();
  const state2 = useRef();
  const zip2 = useRef();
  const deliveryLocation = useRef();
  const deliveryArea = useRef();
  const infoForm = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    if (settings.settingsData.security.loginForPurchase) {
      if (status !== "loading" && !session) {
        toast.info("Please Login To Continue");
        router.push("/signin");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, session]);

  useEffect(() => {
    async function fetchShippingCharge() {
      try {
        const response = await fetchData(`/api/home/shipping`);
        if (response.success) {
          setShippingChargeInfo(response.shippingCharge);
          if (response.address) {
            const { name, email, phone, house, city, state, zipCode, country } =
              response.address;
            const data = {
              fullName: name,
              phone,
              email,
              house,
              city,
              state,
              zipCode,
              country,
            };
            const preData = {
              billingInfo: data,
              shippingInfo: data,
            };
            setPreInfo(preData);
            setCountry1(country);
            setCountry2(country);
          } else {
            const { billingInfo, shippingInfo } = cartData;
            setPreInfo({ billingInfo, shippingInfo });
          }
        } else {
          toast.error("something went wrong");
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchShippingCharge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sameShippingAddress = (e) => {
    const isChecked = e.target.checked;
    setSameShippingAddressValue(isChecked);
  };

  const handleBillingInfo = (e) => {
    e.preventDefault();
    const billingAddressValue = {
      fullName: fullName1.current.value,
      phone: phone1.current.value,
      email: email1.current.value,
      house: house1.current.value,
      city: city1.current.value,
      state: state1.current.value,
      zipCode: zip1.current.value,
      country: country1,
    };
    setBillingInfo(billingAddressValue);
    sameShippingAddressValue
      ? (setShippingInfo(billingAddressValue), setVisibleTab(4))
      : setVisibleTab(3);
  };

  const handleSaveInfo = async () => {
    try {
      const report = infoForm.current.reportValidity();
      if (report) {
        const value = {
          phone: phone1.current.value,
          house: house1.current.value,
          city: city1.current.value,
          state: state1.current.value,
          zipCode: zip1.current.value,
          country: country1,
        };
        const resp = await postData("/api/address", value);
        resp.success
          ? toast.success("Address Saved Successfully")
          : toast.error("Something Went Wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something Went Wrong");
    }
  };

  const handleShippingInfo = (e) => {
    e.preventDefault();
    const shippingAddressValue = {
      fullName: fullName2.current.value,
      phone: phone2.current.value,
      email: email2.current.value,
      house: house2.current.value,
      city: city2.current.value,
      state: state2.current.value,
      zipCode: zip2.current.value,
      country: country2,
    };
    setShippingInfo(shippingAddressValue);
    setVisibleTab(4);
  };

  const setDeliveryLocation = () => {
    const loc = deliveryLocation.current.value;
    if (loc.length > 0) {
      if (loc === "International Delivery") {
        const deliveryData = {
          type: "International Delivery",
          cost: shippingChargeInfo.internationalCost,
          area: null,
        };
        setDeliveryInfo(deliveryData);
      } else {
        const deliveryData = {
          type: "Local Delivery",
          cost: 0,
          area: null,
        };
        setDeliveryInfo(deliveryData);
      }
    }
  };

  const setDeliveryArea = () => {
    const area = deliveryArea.current.value;
    const areaInfo = shippingChargeInfo.area.filter((item) =>
      area.includes(item._id)
    );
    if (area.length > 0) {
      const deliveryData = {
        type: "Local Delivery",
        cost: areaInfo[0]?.price,
        area: areaInfo[0]?.name,
      };
      setDeliveryInfo(deliveryData);
    }
  };

  const processDeliveryInfo = () => {
    // if (deliveryInfo.cost || deliveryInfo.area) {
    setVisibleTab(2);
    // }
  };

  const selectPaymentMethodTab = () => {
    setVisibleTab(5);
    setChangeTab(true);
    dispatch(updateBillingData({ billingInfo, shippingInfo, deliveryInfo }));
  };

  const decimalBalance = (num) => Math.round(num * 10) / 10;

  const getTotalPrice = decimalBalance(
    cartData.items.reduce(
      (accumulator, item) => accumulator + item.qty * item.price,
      0
    )
  );

  const discountPrice = decimalBalance(
    getTotalPrice - (cartData.coupon.discount / 100) * getTotalPrice
  );

  const agreeTerms = () => setTermsAgree(!termsAgree);

  const selectPaymentMethod = (e) => setPaymentMethod(e.target.value);
  const submitOrder = async () => {
    try {
      if (paymentMethod === "cod") {
        const data = {
          coupon: cartData.coupon,
          products: cartData.items,
          billingInfo,
          shippingInfo,
          deliveryInfo,
          paymentData: {
            method: "Cash On Delivery",
            id: null,
          },
        };
        const url = `/api/order/new`;
        const formData = new FormData();
        formData.append("checkoutData", JSON.stringify(data));
        const response = await postData(url, formData);
        response && response.success
          ? (dispatch(resetCart()),
            toast.success("Order successfully placed"),
            router.push(`/checkout/success/${response.createdOrder._id}`))
          : toast.error("Something Went Wrong (500)");
      } else {
        router.push(`/checkout/${paymentMethod}`);
      }
    } catch (err) {
      toast.error(`Something Went Wrong ${err}`);
      console.log(err);
    }
  };


  const deliveryFunctionForData = (it) => {
    const deliveryCosts = cartData?.items?.map((item) => {
      const filterDeliveryArea = item?.deliveryPrice?.find((i) => i.name === it);
      const cost = filterDeliveryArea ? parseInt(filterDeliveryArea.cost * item.qty, 10) : 0;
      return cost;
    });


    const sumDeliveryCosts = deliveryCosts.reduce((acc, cost) => acc + cost, 0);

    return sumDeliveryCosts;
  };

  const deliveryFunctionForInternational = (it) => {
    const deliveryCosts = cartData?.items?.map((item) => {
      const cost = item.internationalCost * item.qty
      return cost;
    });


    const sumDeliveryCosts = deliveryCosts.reduce((acc, cost) => acc + cost, 0);

    return sumDeliveryCosts ;
  };


  const [permission, setPermission] = useState('')
  useEffect(() => {
    // Fetch shipping data from the API
    fetch('/api/shipping')
      .then((response) => response.json())
      .then((data) => {

        setPermission(data.shippingCharge.internationalShippingActive);

      }
      )
      .catch((error) => console.error('Error fetching shipping data:', error));
  }, []);



  return (
    <>
      <HeadData title="Checkout" />
      <div className={classes.top}>
        <CheckoutNav
          tab={visibleTab}
          setTab={setVisibleTab}
          changeTab={changeTab}
        />
        <div className={classes.card}>
          <div style={{ display: visibleTab === 1 ? "block" : "none" }}>
            {deliveryTypeJsx()}
          </div>
          <div
            style={{
              display:
                visibleTab === 2 && cartData && cartData.items.length !== 0
                  ? "block"
                  : "none",
            }}
          >
            {billingInfoJsx()}
          </div>
          <div style={{ display: visibleTab === 3 ? "block" : "none" }}>
            {shippingInfoJsx()}
          </div>
          <div style={{ display: visibleTab === 4 ? "block" : "none" }}>
            {reviewJsx()}
          </div>
          <div style={{ display: visibleTab === 5 ? "block" : "none" }}>
            <PaymentGatewayList
              selectPaymentMethod={selectPaymentMethod}
              submitOrder={submitOrder}
              settings={settings.settingsData.paymentGateway}
            />
          </div>
        </div>
      </div>
    </>
  );

  function reviewJsx() {
    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <div className={classes.info}>
              <h6>{t("billing_info")} :</h6>
              <span>
                {t("full_name")}: {billingInfo.fullName}
              </span>
              <span>
                {t("phone")}: {billingInfo.phone}
              </span>
              <span>
                {t("email")}: {billingInfo.email}
              </span>
              <span>
                {t("house")}: {billingInfo.house}
              </span>
              <span>
                {t("city")}: {billingInfo.city}
              </span>
              <span>
                {t("state")}: {billingInfo.state}
              </span>
              <span>
                {t("post_zip_code")}: {billingInfo.zipCode}
              </span>

              <span>
                {t("country")}: {billingInfo.country}
              </span>



            </div>
          </div>
          <div className="col-md-6">
            <div className={classes.info}>
              <h6>{t("shipping_info")} :</h6>
              <span>
                {t("full_name")}: {shippingInfo.fullName}
              </span>
              <span>
                {t("phone")}: {shippingInfo.phone}
              </span>
              <span>
                {t("email")}: {shippingInfo.email}
              </span>
              <span>
                {t("house")}: {shippingInfo.house}
              </span>
              <span>
                {t("city")}: {shippingInfo.city}
              </span>
              <span>
                {t("state")}: {shippingInfo.state}
              </span>
              <span>
                {t("post_zip_code")}: {shippingInfo.zipCode}
              </span>

              <span>
                {t("country")}: {shippingInfo.country}
              </span>

            </div>
          </div>
          <div className="col-md-6">
            <div className={classes.info}>
              <h6>{t("delivery_info")} :</h6>
              <span>
                {t("delivery_type")}: {deliveryInfo.type}
              </span>
              {deliveryInfo.area && (
                <span>
                  {t("delivery_area")}: {deliveryInfo.area}
                </span>
              )}

              {
                permission === "YES" ? (
                  <span>
                    {t("delivery_charge")}: {currencySymbol + deliveryFunctionForInternational(deliveryInfo.area)}
                  </span>
                ) : (
                  <span>
                      {t("delivery_charge")}: {currencySymbol + deliveryFunctionForData(deliveryInfo.area)}
                  </span>
                )
              }

            </div>
          </div>
        </div>
        <h6 className="mt-3">{t("items_in_your_cart")} :</h6>
        <div className={classes.cart_item_list}>
          {cartData.items.map((item, index) => {
            const filterDeliveryArea = item?.deliveryPrice?.filter(i => i.name === deliveryInfo.area)[0]

            return (
              <div className={classes.cart_item} key={index}>
                <div className={classes.cart_container}>
                  <span className={classes.cart_image}>
                    <ImageLoader
                      src={item.image[0]?.url}
                      height={50}
                      width={50}
                      alt={item.name}
                    />
                  </span>
                  <span className={classes.cart_disc}>
                    <b>{item?.name}</b>
                    {/* <b>area : {filterDeliveryArea?.name}</b>
                    <b>per : {filterDeliveryArea?.cost}</b>
                    <b>total :{parseInt(filterDeliveryArea?.cost) * item.qty}</b> */}
                    {item.color.name && <span>Color: {item.color.name}</span>}
                    {item.attribute.name && (
                      <span>{`${item.attribute.for}: ${item.attribute.name}`}</span>
                    )}
                    <span>Qty: {item.qty}</span>
                    <span>
                      Price: {currencySymbol}
                      {item.price}
                    </span>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        <h6 className="mt-3">{t("order_summary")} :</h6>
        <div className={classes.price_description}>
          <span>
            {t("sub_total")}: {currencySymbol}
            {getTotalPrice}
          </span>
          {
            permission === "YES" ? (
              <span>
                {t("delivery_charge")}: {currencySymbol + deliveryFunctionForInternational(deliveryInfo.area)}
              </span>
            ) : (
              <span>
                {t("delivery_charge")}: {currencySymbol + deliveryFunctionForData(deliveryInfo.area)}
              </span>
            )
          }

          <span>
            {t("discount")}: {currencySymbol}
            {decimalBalance(getTotalPrice - discountPrice)}
          </span>
          {/* <span>
            {t("total_incl_vat")}: {currencySymbol}
            {discountPrice + deliveryInfo.cost + deliveryInfo.area}
          </span> */}

          {
            permission === "YES" ? (
              <span>
                {t("total_incl_vat")}: {currencySymbol}
                {discountPrice + deliveryFunctionForInternational(deliveryInfo.area)}
              </span>
            ) : (
                <span>
                  {t("total_incl_vat")}: {currencySymbol}
                  {discountPrice + deliveryInfo.cost + deliveryInfo.area}
                </span>
            )
          }

        </div>
        <div className={classes.terms}>
          <div className="py-2 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="Check2"
              onClick={agreeTerms}
            />
            <label className="form-check-label" htmlFor="Check2">
              {t("i_agree_to_the")}{" "}
              <a href="/terms" target="_blank">
                {t("terms_and_conditions")}
              </a>
              ,{" "}
              <a href="/return" target="_blank">
                {t("return_policy")}
              </a>{" "}
              ,{" "}
              <a href="/privacy" target="_blank">
                {t("privacy_policy")}
              </a>
            </label>
          </div>
        </div>
        <button
          className="mt-3"
          onClick={selectPaymentMethodTab}
          disabled={termsAgree ? false : true}
        >
          {t("continue")}
        </button>
      </div>
    );
  }

  function shippingInfoJsx() {
    return (
      <div>
        <form className={classes.checkout_form} onSubmit={handleShippingInfo}>
          <div className="mb-3">
            <label>{t("shipping_info")}</label>
            <div className={classes.input}>
              <input
                type="text"
                placeholder={`${t("full_name")}*`}
                ref={fullName2}
                required
                defaultValue={preInfo.shippingInfo.fullName}
              />
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className={classes.input}>
                  <input
                    type="tel"
                    placeholder={`${t("phone")}*`}
                    ref={phone2}
                    required
                    defaultValue={preInfo.shippingInfo.phone}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className={classes.input}>
                  <input
                    type="email"
                    placeholder={`${t("email")}*`}
                    ref={email2}
                    required
                    defaultValue={preInfo.shippingInfo.email}
                  />
                </div>
              </div>
            </div>
            <div className={classes.input}>
              <textarea
                className="form-control"
                placeholder={`${t("house_street")}*`}
                ref={house2}
                required
                rows="2"
                defaultValue={preInfo.shippingInfo.house}
              />
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className={classes.input}>
                  <input
                    type="text"
                    placeholder={`${t("city")}*`}
                    ref={city2}
                    required
                    defaultValue={preInfo.shippingInfo.city}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className={classes.input}>
                  <input
                    type="text"
                    placeholder={`${t("state_province")}*`}
                    ref={state2}
                    required
                    defaultValue={preInfo.shippingInfo.state}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className={classes.input}>
                  <input
                    type="text"
                    placeholder={`${t("post_zip_code")}*`}
                    ref={zip2}
                    required
                    defaultValue={preInfo.shippingInfo.zipCode}
                  />
                </div>
              </div>


              {
                permission === 'YES' ? (
                  <div className="col-md-6">
                    <div className={classes.input}>
                      <select
                        className="form-control"
                        onChange={(e) => setCountry2(e.target.value)}
                        required
                        value={country2}
                      >
                        <option value="">{`${t("select_country")}*`}</option>
                        {data.country.map((ct) => (
                          <option value={ct.name} key={ct.name}>
                            {ct.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : ''
              }

            </div>
          </div>
          <button type="submit">{t("continue")}</button>
        </form>
      </div>
    );
  }

  function billingInfoJsx() {
    return (
      <div>
        {session && (
          <button className={classes.updateButton} onClick={handleSaveInfo}>
            {t("save_inforamtion")}
          </button>
        )}
        <form
          className={classes.checkout_form}
          onSubmit={handleBillingInfo}
          ref={infoForm}
        >
          <div className="mb-3">
            <label>{t("billing_info")}</label>
            <div className={classes.input}>
              <input
                type="text"
                placeholder={`${t("full_name")}*`}
                ref={fullName1}
                required
                defaultValue={preInfo.billingInfo.fullName}
              />
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className={classes.input}>
                  <input
                    type="tel"
                    placeholder={`${t("phone")}*`}
                    ref={phone1}
                    required
                    defaultValue={preInfo.billingInfo.phone}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className={classes.input}>
                  <input
                    type="email"
                    placeholder={`${t("email")}*`}
                    ref={email1}
                    required
                    defaultValue={preInfo.billingInfo.email}
                  />
                </div>
              </div>
            </div>
            <div className={classes.input}>
              <textarea
                className="form-control"
                placeholder={`${t("house_street")}*`}
                ref={house1}
                required
                rows="2"
                defaultValue={preInfo.billingInfo.house}
              />
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className={classes.input}>
                  <input
                    type="text"
                    placeholder={`${t("city")}*`}
                    ref={city1}
                    required
                    defaultValue={preInfo.billingInfo.city}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className={classes.input}>
                  <input
                    type="text"
                    placeholder={`${t("state_province")}*`}
                    ref={state1}
                    required
                    defaultValue={preInfo.billingInfo.state}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className={classes.input}>
                  <input
                    type="text"
                    placeholder={`${t("post_zip_code")}*`}
                    ref={zip1}
                    required
                    defaultValue={preInfo.billingInfo.zipCode}
                  />
                </div>
              </div>
              <div className="col-md-6">

                {
                  permission === 'YES' ? (
                    <div className={classes.input}>
                      <select
                        className="form-control"
                        onChange={(e) => setCountry1(e.target.value)}
                        required
                        value={country1}
                      >
                        <option value="" disabled>
                          {`${t("select_country")}*`}
                        </option>
                        {data.country.map((ct) => (
                          <option value={ct.name} key={ct.name}>
                            {ct.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : ''
                }


              </div>
            </div>
            <div className="py-2 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="Check1"
                onClick={sameShippingAddress}
              />
              <label className="form-check-label" htmlFor="Check1">
                {t("shipping_address_same_as_billing_address")}
              </label>
            </div>
          </div>
          <button type="submit">{t("continue")}</button>
        </form>
      </div>
    );
  }

  function deliveryTypeJsx() {
    return (
      <div>
        <div className="mb-3">
          <div className={classes.input}>
            <label>{t("select_delivery_type")}*</label>
            <select
              className="form-control mb-3"
              defaultValue=""
              onChange={setDeliveryLocation}
              ref={deliveryLocation}
            >
              <option value="" disabled>
                {t("select_delivery_type")}*
              </option>

              {
                permission === 'YES' ? (
                  <option value="International Delivery">
                    International Delivery
                  </option>
                ) : ''
              }

              <option value="Local Delivery">Local Delivery</option>
            </select>
            {deliveryInfo.type && deliveryInfo.type === "Local Delivery" && (
              <div>
                <label>{t("select_delivery_area")}*</label>
                <select
                  className="form-control mb-3"
                  defaultValue=""
                  onChange={setDeliveryArea}
                  ref={deliveryArea}
                >
                  <option value="" disabled>
                    {t("select_delivery_area")}*
                  </option>
                  {shippingChargeInfo.area?.map((ct, idx) => (
                    <option value={ct._id} key={idx}>
                      {ct.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={processDeliveryInfo}
        // disabled={deliveryInfo.cost || deliveryInfo.area ? false : true}
        >
          {t("continue")}
        </button>
      </div>
    );
  }
};

export default Checkout;
