import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import classes from "~/components/ProductForm/productForm.module.css";
import { postData } from "~/lib/clientFunctions";
const NewAttribute = () => {
  const attr_name = useRef();
  const [inputList, setInputList] = useState([{ name: "", value: "" }]);
  const { t } = useTranslation();
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
      const form = document.getElementById("attr_form");
      const formData = new FormData();
      formData.append("name", attr_name.current.value);
      formData.append("value", JSON.stringify(inputList));
      const response = await postData("/api/attributes", formData);
      response.success
        ? (toast.success("Attribute Added Successfully"), form.reset())
        : toast.error("Something Went Wrong");
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong");
    }
  };
  return (
    <>
      <h4 className="text-center pt-3 pb-5">{t("Create New Attribute")}</h4>
      <form id="attr_form" onSubmit={submitHandler}>
        <div className="mb-4">
          <label htmlFor="inp-1" className="form-label">
            {t("Attribute Name")}*
          </label>
          <input
            type="text"
            id="inp-1"
            ref={attr_name}
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
            value={t("Add Attribute")}
            className="btn btn-lg btn-success"
          />
        </div>
      </form>
    </>
  );
};

NewAttribute.requireAuthAdmin = true;
NewAttribute.dashboard = true;

export default NewAttribute;
