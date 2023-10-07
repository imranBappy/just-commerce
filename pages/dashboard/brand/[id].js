import dynamic from "next/dynamic";
import DefaultErrorPage from "next/error";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useSWR from "swr";
import classes from "~/components/ProductForm/productForm.module.css";
import { fetchData, postData } from "~/lib/clientFunctions";

const Spinner = dynamic(() => import("~/components/Ui/Spinner"));
const FileUpload = dynamic(() => import("~/components/FileUpload/fileUpload"));
const LoadingButton = dynamic(() => import("~/components/Ui/Button"));

const EditCategory = () => {
  const router = useRouter();
  const url = `/api/admin/brand/edit?id=${router.query.id}`;
  const { data, error } = useSWR(router.query.id ? url : null, fetchData);
  const name = useRef(null);
  const [brandData, setBrandData] = useState({});
  const [brandImage, updateBrandImage] = useState([]);
  const [buttonState, setButtonState] = useState("");
  const { t } = useTranslation();
  useEffect(() => {
    if (data && data.brand) {
      setBrandData(data.brand);
      updateBrandImage(data.brand.image);
    }
  }, [data]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!brandImage[0]) {
        return toast.warning("Please add brand icon");
      }
      setButtonState("loading");
      const formData = {
        id: brandData._id,
        name: name.current.value,
        image: brandImage,
      };

      const response = await postData("/api/admin/brand/edit", formData);
      response.success
        ? toast.success("Brand Updated Successfully")
        : toast.error("Something Went Wrong");
      setButtonState("");
    } catch (err) {
      setButtonState("");
      toast.error(`Something Went Wrong ${err.message}`);
    }
  };

  return (
    <>
      {error ? (
        <DefaultErrorPage statusCode={500} />
      ) : !data ? (
        <Spinner />
      ) : !brandData._id ? (
        <DefaultErrorPage statusCode={404} />
      ) : (
        <div>
          <h4 className="text-center pt-3 pb-5">
            {t("Edit Brand")} ({brandData.name})
          </h4>
          <form onSubmit={submitHandler}>
            <input type="hidden" name="id" defaultValue={brandData._id} />
            <div className="mb-5">
              <label htmlFor="inp-1" className="form-label">
                {t("name")}*
              </label>
              <input
                type="text"
                id="inp-1"
                className={classes.input + " form-control"}
                ref={name}
                defaultValue={brandData.name}
                required
              />
            </div>
            <div className="mb-4 pt-2">
              <FileUpload
                accept=".jpg,.png,.jpeg"
                label={t("Replace brand image*")}
                maxFileSizeInBytes={2000000}
                updateFilesCb={updateBrandImage}
                preSelectedFiles={brandData.image}
              />
            </div>
            <div className="mb-4">
              <LoadingButton
                type="submit"
                text={t("Update Brand")}
                state={buttonState}
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

EditCategory.requireAuthAdmin = true;
EditCategory.dashboard = true;

export default EditCategory;
