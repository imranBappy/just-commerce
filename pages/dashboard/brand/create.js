import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import classes from "~/components/ProductForm/productForm.module.css";
import { postData } from "~/lib/clientFunctions";

const FileUpload = dynamic(() => import("~/components/FileUpload/fileUpload"));
const LoadingButton = dynamic(() => import("~/components/Ui/Button"));

const NewBrand = (props) => {
  const [brandImage, updateBrandImage] = useState([]);
  const [buttonState, setButtonState] = useState("");
  const name = useRef(null);
  const router = useRouter();
  const { t } = useTranslation();
  const redirectToPage = (url, waitingTime) => {
    setTimeout(() => {
      router.push(url);
    }, waitingTime);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!brandImage[0]) {
        return toast.warning("Please add brand image");
      }
      setButtonState("loading");
      const formData = {
        name: name.current.value,
        categoryImage: brandImage,
      };
      const response = await postData("/api/admin/brand", formData);
      response.success
        ? (toast.success("Brand Added Successfully"),
          redirectToPage("/dashboard/brand", 2000))
        : toast.error("Something Went Wrong");
      setButtonState("");
    } catch (err) {
      setButtonState("");
      toast.error(`Something Went Wrong ${err.message}`);
    }
  };
  return (
    <>
      <h4 className="text-center pt-3 pb-5">Create New Brand</h4>
      <form onSubmit={submitHandler}>
        <div className="mb-5">
          <label htmlFor="inp-1" className="form-label">
            {t('name')}*
          </label>
          <input
            type="text"
            id="inp-1"
            className={classes.input + " form-control"}
            ref={name}
            required
          />
        </div>
        <div className="mb-4 pt-2">
          <FileUpload
            accept=".jpg,.png,.jpeg"
            label={t("Upload your brand icon here* (120px x 80px)")}
            maxFileSizeInBytes={2000000}
            updateFilesCb={updateBrandImage}
          />
        </div>
        <div className="mb-4">
          <LoadingButton type="submit" text={t("Add Brand")} state={buttonState} />
        </div>
      </form>
    </>
  );
};

NewBrand.requireAuthAdmin = true;
NewBrand.dashboard = true;

export default NewBrand;
