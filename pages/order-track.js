import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import HeadData from "~/components/Head";
import { dateFormat, fetchData } from "~/lib/clientFunctions";
import classes from "~/styles/orderTrack.module.css";

const OrderTrack = () => {
  const orderId = useRef("");
  const [orderData, setOrderData] = useState({});
  const { t } = useTranslation();
  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;

  const decimalBalance = (num) => Math.round(num * 10) / 10;

  const trackOrder = async () => {
    try {
      const id = orderId.current.value.trim();
      if (id.length > 0) {
        const response = await fetchData(`/api/home/order-track?id=${id}`);
        if (response.order) {
          setOrderData(response.order);
        } else {
          toast.error("Invalid Reference");
        }
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      <HeadData title="Track Your Order" />
      <div className={classes.top}>
        <div className={classes.input}>
          <h1>{t("track_your_order")}</h1>
          <hr />
          <input
            className="form-control"
            type="text"
            placeholder={t("your_order_reference_no")}
            ref={orderId}
          />
          <button onClick={trackOrder}>{t("track_your_order")}</button>
        </div>
        {orderData.orderId && detailsViewer()}
      </div>
    </>
  );

  function detailsViewer() {
    return (
      <div className="custom_container">
        <div className="card mb-5 border-0 shadow">
          <div className="card-header bg-white py-3 fw-bold">Order Details</div>
          <div className="card-body">
            <div className={classes.body}>
              <div className={`${classes.order_details} row`}>
                <div className="col-md-6">
                  <h6>Order Details :</h6>
                  <p>
                    Order Id: <span>{orderData.orderId}</span>
                  </p>
                  <p>
                    Order Date : <span>{dateFormat(orderData.orderDate)}</span>
                  </p>
                  <p>
                    Payment Status :{" "}
                    {orderData.paymentStatus === "Unpaid" ? (
                      <span className="badge bg-danger">Unpaid</span>
                    ) : (
                      <span className="badge bg-success">Paid</span>
                    )}
                  </p>
                  <p>
                    Order Status:{" "}
                    <span className="badge bg-primary">{orderData.status}</span>
                  </p>
                  <p>
                    Payment Method: <span>{orderData.paymentMethod}</span>
                  </p>
                </div>
                <div className="col-md-6">
                  <h6>Delivery Information :</h6>
                  <p>
                    Delivery Type: <span>{orderData.deliveryInfo.type}</span>
                  </p>
                  {orderData.deliveryInfo.area && (
                    <p>
                      Delivery Area: <span>{orderData.deliveryInfo.area}</span>
                    </p>
                  )}
                  <p>
                    Delivery Cost :{" "}
                    <span>{currencySymbol + orderData.deliveryInfo.cost}</span>
                  </p>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Products</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData.products.map((product, idx) => (
                      <tr key={idx + product._id}>
                        <th scope="row">{idx + 1}</th>
                        <td>{product.name}</td>
                        <td>{product.qty}</td>
                        <td>{currencySymbol + product.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={classes.payment_info}>
                <div>
                  <span>Sub Total</span>
                  <span>{currencySymbol + orderData.totalPrice}</span>
                </div>
                <div>
                  <span>Discount</span>
                  <span>
                    {currencySymbol +
                      decimalBalance(
                        orderData.totalPrice -
                          (orderData.payAmount - orderData.deliveryInfo.cost)
                      )}
                  </span>
                </div>
                <div>
                  <span>Delivery Charge</span>
                  <span>{currencySymbol + orderData.deliveryInfo.cost}</span>
                </div>
                <div>
                  <span>Total</span>
                  <span>{currencySymbol + orderData.payAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default OrderTrack;
