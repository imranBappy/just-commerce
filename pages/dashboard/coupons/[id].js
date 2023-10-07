import DefaultErrorPage from "next/error";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useSWR from "swr";
import classes from "~/components/ProductForm/productForm.module.css";
import LoadingButton from "~/components/Ui/Button";
import Spinner from "~/components/Ui/Spinner/index";
import { fetchData, postData } from "~/lib/clientFunctions";

const EditCoupon = () => {
  const router = useRouter();
  const url = `/api/coupons/edit?id=${router.query.id}`;
  const { data, error } = useSWR(router.query.id ? url : null, fetchData);

  const [couponData, setCouponData] = useState({});
  const [buttonState, setButtonState] = useState("");
  const { t } = useTranslation();
  useEffect(() => {
    if (data && data.coupon) {
      setCouponData(data.coupon);
    }
  }, [data]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setButtonState("loading");
      const form = document.querySelector("#coupon_form");
      const formData = new FormData(form);
      const response = await postData("/api/coupons/edit", formData);
      response.success
        ? toast.success("Coupon Updated Successfully")
        : response.dup
        ? toast.error("Coupons with the same name already exists")
        : toast.error("Something Went Wrong");
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong");
    }
    setButtonState("");
  };

  return (
    <>
      {error ? (
        <DefaultErrorPage statusCode={500} />
      ) : !data ? (
        <Spinner />
      ) : !couponData._id ? (
        <DefaultErrorPage statusCode={404} />
      ) : (
        <div>
          <h4 className="text-center pt-3 pb-5">{t("Edit Coupon")}</h4>
          <form id="coupon_form" onSubmit={submitHandler}>
            <input type="hidden" name="id" defaultValue={couponData._id} />
            <div className="mb-5">
              <label htmlFor="inp-1" className="form-label">
                {t("Code")}*
              </label>
              <input
                type="text"
                id="inp-1"
                className="form-control"
                name="code"
                defaultValue={couponData.code}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="inp-2" className="form-label">
                {t("Amount in Percentage")}*
              </label>
              <input
                type="number"
                id="inp-2"
                step="0.1"
                max="100"
                className={classes.input + " form-control"}
                name="amount"
                defaultValue={couponData.amount}
                required
              />
            </div>
            <div className="row">
              <div className="col-12 col-sm-6">
                <div className="mb-4">
                  <label htmlFor="inp-3" className="form-label">
                    {t("Active From")}*
                  </label>
                  <input
                    type="date"
                    id="inp-3"
                    className={classes.input + " form-control"}
                    name="active"
                    defaultValue={
                      new Date(couponData.active).toISOString().split("T")[0]
                    }
                    required
                  />
                </div>
              </div>
              <div className="col-12 col-sm-6">
                <div className="mb-4">
                  <label htmlFor="inp-4" className="form-label">
                    {t("Will Expire")}*
                  </label>
                  <input
                    type="date"
                    id="inp-4"
                    className={classes.input + " form-control"}
                    name="expired"
                    defaultValue={
                      new Date(couponData.expired).toISOString().split("T")[0]
                    }
                    required
                  />
                </div>
              </div>
            </div>
            <div className="mb-4 mt-2">
              <LoadingButton
                type="submit"
                text={t("Update Coupon")}
                state={buttonState}
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

EditCoupon.requireAuthAdmin = true;
EditCoupon.dashboard = true;

export default EditCoupon;
