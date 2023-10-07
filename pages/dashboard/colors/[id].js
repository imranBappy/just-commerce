import DefaultErrorPage from "next/error";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useSWR from "swr";
import classes from "~/components/ProductForm/productForm.module.css";
import LoadingButton from "~/components/Ui/Button";
import Spinner from "~/components/Ui/Spinner/index";
import { fetchData, postData } from "~/lib/clientFunctions";

const EditColor = () => {
  const color_name = useRef();
  const color_id = useRef();
  const color_value = useRef();
  const { t } = useTranslation();
  const router = useRouter();
  const url = `/api/colors/edit?id=${router.query.id}`;
  const { data, error } = useSWR(router.query.id ? url : null, fetchData);

  const [colorData, setColorData] = useState({});
  const [buttonState, setButtonState] = useState("");

  useEffect(() => {
    if (data && data.color) {
      setColorData(data.color);
    }
  }, [data]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setButtonState("loading");
    try {
      const formData = new FormData();
      formData.append("id", color_id.current.value);
      formData.append("name", color_name.current.value.trim());
      formData.append("value", color_value.current.value.trim());
      const response = await postData("/api/colors/edit", formData);
      response.success
        ? toast.success("Color Updated Successfully")
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
      ) : !colorData._id ? (
        <DefaultErrorPage statusCode={404} />
      ) : (
        <div>
          <h4 className="text-center pt-3 pb-5">
            {t("Edit Color")} ({colorData.name})
          </h4>
          <form onSubmit={submitHandler}>
            <input type="hidden" ref={color_id} defaultValue={colorData._id} />
            <div className="mb-4">
              <label htmlFor="inp-1" className="form-label">
                {t("name")}*
              </label>
              <input
                type="text"
                id="inp-1"
                ref={color_name}
                defaultValue={colorData.name}
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
                defaultValue={colorData.value}
                className={classes.input + " form-control"}
                placeholder="#ffffff"
                pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
                required
              />
            </div>
            <div className="my-4">
              <LoadingButton
                type="submit"
                text={t("Update Color")}
                state={buttonState}
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

EditColor.requireAuthAdmin = true;
EditColor.dashboard = true;

export default EditColor;
