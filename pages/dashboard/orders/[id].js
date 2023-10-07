import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useSWR from "swr";
import DefaultError from "~/components/error/default";
import ImageLoader from "~/components/Image";
import { dateFormat, fetchData } from "~/lib/clientFunctions";
import classes from "~/styles/orderDetails.module.css";

const InvoicePrint = dynamic(() => import("~/components/Invoice/print"));
const Spinner = dynamic(() => import("~/components/Ui/Spinner"));

const ViewOrder = () => {
  const router = useRouter();
  const invoiceRef = useRef(null);
  const url = `/api/order/${router.query.id}`;
  const { data, error } = useSWR(router.query.id ? url : null, fetchData);
  const { t } = useTranslation();
  const [orderData, setOrderData] = useState({});

  useEffect(() => {
    if (data && data.order) {
      setOrderData(data.order);
    }
  }, [data]);

  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;

  const decimalBalance = (num) => Math.round(num * 10) / 10;

  const printInvoice = async () => {
    const { printDocument } = await import("~/lib/clientFunctions");
    invoiceRef.current.style.display = "block";
    await printDocument(invoiceRef.current, `Invoice #${orderData.orderId}`);
    invoiceRef.current.style.display = "none";
  };

  return (
    <>
      {error ? (
        <DefaultError statusCode={500} />
      ) : !data ? (
        <Spinner />
      ) : !data.success ? (
        <DefaultError statusCode={404} />
      ) : (
        <div>
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-sm-flex align-items-center justify-content-between">
                <h5 className="mb-0">{t("order_details")}</h5>
                <div>
                  <Link href="/dashboard/orders/" passHref>
                    <button className="btn btn-outline-primary btn-sm m-1">
                      Back
                    </button>
                  </Link>
                  <button
                    onClick={printInvoice}
                    className="btn btn-outline-primary btn-sm m-1"
                  >
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div>
            {orderData.orderId && (
              <div>
                <div className={`${classes.order_details} row`}>
                  <div className="col-md-6">
                    <h6>{t("order_details")} :</h6>
                    {orderData.paymentId && (
                      <p>
                        {t("Transaction Id")} :{" "}
                        <span>{orderData.paymentId}</span>
                      </p>
                    )}
                    <p>
                      {t("order_id")} : <span>{orderData.orderId}</span>
                    </p>
                    <p>
                      {t("order_date")} :{" "}
                      <span>{dateFormat(orderData.orderDate)}</span>
                    </p>
                    <p>
                      {t("payment_status")} :{" "}
                      {orderData.paymentStatus === "Unpaid" ? (
                        <span className="badge bg-danger">Unpaid</span>
                      ) : (
                        <span className="badge bg-success">Paid</span>
                      )}
                    </p>
                    <p>
                      {t("order_status")} :{" "}
                      <span className="badge bg-primary">
                        {orderData.status}
                      </span>
                    </p>
                    <p>
                      {t("payment_method")} :{" "}
                      <span>{orderData.paymentMethod}</span>
                    </p>
                    {orderData.coupon.code && (
                      <p>
                        {t("Applied Coupon")}:{" "}
                        <span>
                          {`${orderData.coupon.code} - ${orderData.coupon.discount}%`}
                        </span>
                      </p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <h6>{t("delivery_information")} :</h6>
                    <p>
                      {t("delivery_type")} :{" "}
                      <span>{orderData.deliveryInfo.type}</span>
                    </p>
                    {orderData.deliveryInfo.area && (
                      <p>
                        {t("delivery_area")} :{" "}
                        <span>{orderData.deliveryInfo.area}</span>
                      </p>
                    )}
                    <p>
                      {t("delivery_cost")} :{" "}
                      <span>
                        {currencySymbol + orderData.deliveryInfo.cost}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6>{t("Billing Address")} :</h6>
                    <p>
                      {t("full_name")} :{" "}
                      <span>{orderData.billingInfo.fullName}</span>
                    </p>
                    <p>
                      {t("phone")} : <span>{orderData.billingInfo.phone}</span>
                    </p>
                    <p>
                      {t("email")} : <span>{orderData.billingInfo.email}</span>
                    </p>
                    <p>
                      {t("house")} : <span>{orderData.billingInfo.house}</span>
                    </p>
                    <p>
                      {t("city")} : <span>{orderData.billingInfo.city}</span>
                    </p>
                    <p>
                      {t("state_province")} :{" "}
                      <span>{orderData.billingInfo.state}</span>
                    </p>
                    <p>
                      {t("post_zip_code")} :{" "}
                      <span>{orderData.billingInfo.zipCode}</span>
                    </p>
                    <p>
                      {t("country")} :{" "}
                      <span>{orderData.billingInfo.country}</span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6>{t("Shipping Address")} :</h6>
                    <p>
                      {t("full_name")}:{" "}
                      <span>{orderData.shippingInfo.fullName}</span>
                    </p>
                    <p>
                      {t("phone")} : <span>{orderData.shippingInfo.phone}</span>
                    </p>
                    <p>
                      {t("email")} : <span>{orderData.shippingInfo.email}</span>
                    </p>
                    <p>
                      {t("house")} : <span>{orderData.shippingInfo.house}</span>
                    </p>
                    <p>
                      {t("city")} : <span>{orderData.shippingInfo.city}</span>
                    </p>
                    <p>
                      {t("state_province")} :{" "}
                      <span>{orderData.shippingInfo.state}</span>
                    </p>
                    <p>
                      {t("post_zip_code")} :{" "}
                      <span>{orderData.shippingInfo.zipCode}</span>
                    </p>
                    <p>
                      {t("country")} :{" "}
                      <span>{orderData.shippingInfo.country}</span>
                    </p>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">{t("products")}</th>
                        <th scope="col">{t("image")}</th>
                        <th scope="col">{t("sku")}</th>
                        <th scope="col">{t("color")}</th>
                        <th scope="col">{t("Attributes")}</th>
                        <th scope="col">{t("quantity")}</th>
                        <th scope="col">{t("price")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.products.map((product, idx) => (
                        <tr key={idx}>
                          <th scope="row">{idx + 1}</th>
                          <td>{product.name}</td>
                          <td>
                            <ImageLoader
                              src={product.image[0]?.url}
                              width={50}
                              height={50}
                              alt={product.name}
                            />
                          </td>
                          <td>{product.sku}</td>
                          <td>
                            {product.color.name ? product.color.name : null}
                          </td>
                          <td>
                            {product.attribute.name
                              ? `${product.attribute.for} : ${product.attribute.name}`
                              : null}
                          </td>
                          <td>{product.qty}</td>
                          <td>{currencySymbol + product.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className={classes.payment_info}>
                  <div>
                    <span>{t("sub_total")}</span>
                    <span>{currencySymbol + orderData.totalPrice}</span>
                  </div>
                  <div>
                    <span>{t("discount")}</span>
                    <span>
                      {currencySymbol +
                        decimalBalance(
                          orderData.totalPrice -
                            (orderData.payAmount - orderData.deliveryInfo.cost)
                        )}
                    </span>
                  </div>
                  <div>
                    <span>{t("delivery_charge")}</span>
                    <span>{currencySymbol + orderData.deliveryInfo.cost}</span>
                  </div>
                  <div>
                    <span>{t("total")}</span>
                    <span>
                      {currencySymbol + decimalBalance(orderData.payAmount)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div
              ref={invoiceRef}
              style={{
                display: "none",
                width: "800px",
                minHeight: "max-content",
              }}
            >
              {orderData.orderId && <InvoicePrint data={orderData} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ViewOrder.requireAuthAdmin = true;
ViewOrder.dashboard = true;

export default ViewOrder;
