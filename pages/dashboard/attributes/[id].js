import DefaultErrorPage from "next/error";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useSWR from "swr";
import classes from "~/components/ProductForm/productForm.module.css";
import Spinner from "~/components/Ui/Spinner/index";
import { fetchData, postData } from "~/lib/clientFunctions";

const EditAttribute = (props) => {
  const router = useRouter();
  const url = `/api/attributes/edit?id=${router.query.id}`;
  const { data, error } = useSWR(router.query.id ? url : null, fetchData);

  const attr_name = useRef();
  const attr_id = useRef();
  const [attrData, setAttrData] = useState({});
  const [inputList, setInputList] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (data && data.attr) {
      const attr_value = data.attr.values
        ? data.attr.values
        : [{ name: "", value: "" }];
      setAttrData(data.attr);
      setInputList(attr_value);
    }
  }, [data]);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  const handleAddClick = () => {
    setInputList([...inputList, { name: "", value: "" }]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("id", attr_id.current.value);
      formData.append("name", attr_name.current.value);
      formData.append("value", JSON.stringify(inputList));
      const response = await postData("/api/attributes/edit", formData);
      response.success
        ? toast.success("Attribute Updated Successfully")
        : toast.error("Something Went Wrong");
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong");
    }
  };

  return (
    <>
      {error ? (
        <DefaultErrorPage statusCode={500} />
      ) : !data ? (
        <Spinner />
      ) : !attrData._id ? (
        <DefaultErrorPage statusCode={404} />
      ) : (
        <div>
          <h4 className="text-center pt-3 pb-5">{t("Edit Attribute")}</h4>
          <form onSubmit={submitHandler}>
            <input type="hidden" ref={attr_id} defaultValue={attrData._id} />
            <div className="mb-4">
              <label htmlFor="inp-1" className="form-label">
                {t("Attribute Name")}*
              </label>
              <input
                type="text"
                id="inp-1"
                ref={attr_name}
                defaultValue={attrData.name}
                className={classes.input + " form-control"}
                required
              />
            </div>
            <div className="card">
              <div className="card-header">{t("Attribute Value")}</div>
              <div className="card-body">
                {inputList.map((x, i) => {
                  return (
                    <div className="row mb-4" key={i}>
                      <div className="col-12 col-sm-5">
                        <label className="form-label">{t("name")}</label>
                        <input
                          type="text"
                          className={classes.input + " form-control"}
                          name="name"
                          value={x.name}
                          onChange={(evt) => handleInputChange(evt, i)}
                        />
                      </div>
                      <div className="col-12 col-sm-5">
                        <label className="form-label">{t("Value")}</label>
                        <input
                          type="text"
                          className={classes.input + " form-control"}
                          name="value"
                          value={x.value}
                          onChange={(evt) => handleInputChange(evt, i)}
                        />
                      </div>
                      <div className="col-12 col-sm-2 d-flex align-items-end">
                        <button
                          className="btn btn-danger"
                          type="button"
                          onClick={() => handleRemoveClick(i)}
                        >
                          {t("Remove")}
                        </button>
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  className="btn btn-success my-2"
                  onClick={handleAddClick}
                >
                  {t("Add Value")}
                </button>
              </div>
            </div>
            <div className="my-4">
              <input
                type="submit"
                value={t("Update Attribute")}
                className="btn btn-lg btn-success"
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

EditAttribute.requireAuthAdmin = true;
EditAttribute.dashboard = true;

export default EditAttribute;
