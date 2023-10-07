import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import classes from "~/components/ProductForm/productForm.module.css";
import LoadingButton from "~/components/Ui/Button";
import { postData } from "~/lib/clientFunctions";
const NewColor = () => {
  const color_name = useRef();
  const color_value = useRef();
  const [buttonState, setButtonState] = useState("");
  const { t } = useTranslation();
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setButtonState("loading");
      const form = document.getElementById("color_form");
      const formData = new FormData();
      formData.append("name", color_name.current.value);
      formData.append("value", color_value.current.value);
      const response = await postData("/api/colors", formData);
      response.success
        ? (toast.success("Color Added Successfully"), form.reset())
        : toast.error("Something Went Wrong");
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong");
    }
    setButtonState("");
  };
  return (
    <>
      <h4 className="text-center pt-3 pb-5">{t("Create New Color")}</h4>
      <form id="color_form" onSubmit={submitHandler}>
        <div className="mb-4">
          <label htmlFor="inp-1" className="form-label">
            {t("name")}*
          </label>
          <input
            type="text"
            id="inp-1"
            ref={color_name}
            className={classes.input + " form-control"}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="inp-2" className="form-label">
            {t("Color Value")}*
          </label>
          <input
            type="text"
            id="inp-2"
            ref={color_value}
            className={classes.input + " form-control"}
            placeholder="#ffffff"
            pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
            required
          />
        </div>
        <div className="my-4">
          <LoadingButton
            type="submit"
            text={t("Add Color")}
            state={buttonState}
          />
        </div>
      </form>
    </>
  );
};

NewColor.requireAuthAdmin = true;
NewColor.dashboard = true;

export default NewColor;
