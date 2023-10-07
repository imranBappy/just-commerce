import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import classes from "~/components/ProductForm/productForm.module.css";
import LoadingButton from "~/components/Ui/Button";
import { postData } from "~/lib/clientFunctions";
const NewCoupon = () => {
  const [buttonState, setButtonState] = useState("");
  const { t } = useTranslation();
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setButtonState("loading");
      const form = document.querySelector("#coupon_form");
      const formData = new FormData(form);
      const response = await postData("/api/coupons", formData);
      response.success
        ? (toast.success("Coupon Added Successfully"), form.reset())
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
      <h4 className="text-center pt-3 pb-5">{t("Create New Coupon")}</h4>
      <form id="coupon_form" onSubmit={submitHandler}>
        <div className="mb-5">
          <label htmlFor="inp-1" className="form-label">
            {t("Code")}*
          </label>
          <input
            type="text"
            id="inp-1"
            className={classes.input + " form-control"}
            name="code"
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
            className="form-control"
            name="amount"
            placeholder="0%"
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
                name="expire"
                required
              />
            </div>
          </div>
        </div>
        <div className="mb-4 mt-2">
          <LoadingButton
            type="submit"
            text={t("Add Coupon")}
            state={buttonState}
          />
        </div>
      </form>
    </>
  );
};

NewCoupon.requireAuthAdmin = true;
NewCoupon.dashboard = true;

export default NewCoupon;
