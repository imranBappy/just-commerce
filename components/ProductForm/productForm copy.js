import { useEffect, useRef, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { toast } from "react-toastify";
import useSWR from "swr";
import { fetchData, postData } from "~/lib/clientFunctions";
import FileUpload from "../FileUpload/fileUpload";
import TextEditor from "../TextEditor";
import LoadingButton from "../Ui/Button";
import Spinner from "../Ui/Spinner";
import classes from "./productForm.module.css";
import ImageLoader from "../Image";
import CustomSelect from "../CustomSelect";
import { useTranslation } from "react-i18next";

const ProductForm = () => {
  const url = `/api/product/create`;
  const { data, error } = useSWR(url, fetchData);
  const product_type = useRef();
  const seo_title = useRef("");
  const seo_desc = useRef("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState([]);
  const [selectedColor, setSelectedColor] = useState([]);
  const [selectedAttr, setSelectedAttr] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [attrItemList, setAttrItemList] = useState([]);
  const [displayImage, setDisplayImage] = useState([]);
  const [galleryImage, setGalleryImage] = useState([]);
  const [seoImage, setSeoImage] = useState([]);
  const [variantInputList, setVariantInputList] = useState([]);
  const [resetImageInput, setResetImageInput] = useState("");
  const [editorState, setEditorState] = useState("");
  const [buttonState, setButtonState] = useState("");
  const { t } = useTranslation();
  useEffect(() => {
    const arrList = [];
    if (selectedColor.length && attrItemList.length) {
      selectedColor.map((color) => {
        attrItemList.map((attr) => {
          const combination = {
            color: color.label,
            attr: attr.label,
            price: "",
            sku: "",
            qty: "",
            imageIndex: 0,
          };
          arrList.push(combination);
        });
      });
    } else if (selectedColor.length && !attrItemList.length) {
      selectedColor.map((color) => {
        const combination = {
          color: color.label,
          attr: null,
          price: "",
          sku: "",
          qty: "",
          imageIndex: 0,
        };
        arrList.push(combination);
      });
    } else if (!selectedColor.length && attrItemList.length) {
      attrItemList.map((attr) => {
        const combination = {
          color: null,
          attr: attr.label,
          price: "",
          sku: "",
          qty: "",
          imageIndex: 0,
        };
        arrList.push(combination);
      });
    }
    setVariantInputList(arrList);
    return () => {
      setVariantInputList([]);
    };
  }, [selectedColor, attrItemList]);

  const updatedValueCb = (data) => {
    setEditorState(data);
  };

  const multiList = (item) => {
    const data = [];
    item.map((x) => data.push(x.value));
    return JSON.stringify(data);
  };

  const changeAttr = (e) => {
    setSelectedAttr(e);
    setAttrItemList([]);
  };

  const updateDisplayImage = (files) => setDisplayImage(files);
  const updateGalleryImage = (files) => setGalleryImage(files);

  const handleInputChange = (e, i) => {
    const { name, value } = e.target;
    const items = [...variantInputList];
    items[i][name] = value;
    setVariantInputList(items);
  };
  console.log(variantInputList);
  const getEditorStateData = (editorData) => {
    const regex = /(<([^>]+)>)/gi;
    const data = !!editorData.replace(regex, "").length ? editorData : "";
    return data;
  };

  const formHandler = async (e) => {
    e.preventDefault();
    if (displayImage.length === 0 || galleryImage.length === 0) {
      return toast.warn("Please fill in all the required fields!");
    }
    setButtonState("loading");
    const form = document.querySelector("#product_form");
    const formData = new FormData(form);
    const displayImg = await JSON.stringify(displayImage);
    const galleryImg = await JSON.stringify(galleryImage);
    const seo = {
      title: seo_title.current.value.trim(),
      description: seo_desc.current.value.trim(),
      image: seoImage,
    };
    formData.append("displayImage", displayImg);
    formData.append("galleryImages", galleryImg);
    formData.append("type", selectedType);
    formData.append("category", multiList(selectedCategory));
    formData.append("subcategory", multiList(selectedSubcategory));
    formData.append("brand", selectedBrand);
    formData.append("color", JSON.stringify(selectedColor));
    formData.append("attribute", JSON.stringify(attrItemList));
    formData.append("selectedAttribute", selectedAttr);
    formData.append("variant", JSON.stringify(variantInputList));
    formData.append("seo", JSON.stringify(seo));
    formData.append("description", getEditorStateData(editorState));

    await postData("/api/product/create", formData)
      .then((status) => {
        status.success
          ? (toast.success("Product Added Successfully"),
            form.reset(),
            setSelectedCategory([]),
            setSelectedSubcategory([]),
            setVariantInputList([]),
            setSelectedType(""),
            setSelectedColor([]),
            setSelectedAttr([]),
            setResetImageInput("reset"),
            setEditorState(""))
          : toast.error("Something Went Wrong");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something Went Wrong");
      });
    setButtonState("");
  };

  if (error) return <div>failed to load</div>;
  if (!data) return <Spinner />;
  if (!data.success) return <div>Something Went Wrong...</div>;

  const categoryOption = [];
  data.category.map((el) =>
    categoryOption.push({ label: el.name, value: el.slug })
  );

  const subcategoryOption = [];
  data.category.map((el) =>
    el.subCategories.map((sub) =>
      subcategoryOption.push({ label: sub.name, value: sub.slug })
    )
  );

  const colorOption = [];
  data.color.map((color) =>
    colorOption.push({ label: color.name, value: color.value })
  );

  const attrItemOption = (index) => {
    const item = [];
    data.attribute[index].values.map((attr) =>
      item.push({
        label: attr.name,
        value: attr.name,
        for: data.attribute[index].name,
      })
    );
    return item;
  };

  function updateBrand(e) {
    setSelectedBrand(e.target.value);
  }

  return (
    <>
      <h4 className="text-center pt-3 pb-5">{t("Create New Product")}</h4>
      <form
        id="product_form"
        encType="multipart/form-data"
        onSubmit={formHandler}
      >
        {imageInput()}
        {productInformation()}
        {productDescription()}
        {productType()}
        {productTypeInput()}
        {seoInput()}
        <div className="my-4">
          <LoadingButton
            type="submit"
            text={t("Add Product")}
            state={buttonState}
          />
        </div>
      </form>
    </>
  );

  function productDescription() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("Product Description")}
        </div>
        <div className="card-body">
          <div className="py-3">
            <label htmlFor="inp-7" className="form-label">
              {t("Short Description")}*
            </label>
            <textarea
              id="inp-7"
              className="form-control"
              name="short_description"
            />
          </div>
          <div className="py-3">
            <label className="form-label">{t("description")}</label>
            <TextEditor
              previousValue={editorState}
              updatedValue={updatedValueCb}
              height={300}
            />
          </div>
        </div>
      </div>
    );
  }

  function productTypeInput() {
    return (
      <div>
        {selectedType === "simple" && (
          <div className="card mb-5 border-0 shadow">
            <div className="card-header bg-white py-3 fw-bold">
              {t("Product Information")}
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <div className="py-3">
                    <label htmlFor="inp-6" className="form-label">
                      {t("Item Quantity")}*({t("Set -1 to make it unlimited")})
                    </label>
                    <input
                      type="number"
                      min="-1"
                      id="inp-6"
                      className="form-control"
                      name="qty"
                      defaultValue={1}
                      required
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="py-3">
                    <label className="form-label">{t("sku")}*</label>
                    <input
                      type="text"
                      className="form-control"
                      name="sku"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {selectedType === "variable" && (
          <div className="card mb-5 border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              {t("Product Variation")}
            </div>
            <div className="card-body">
              <div className="row py-3">
                <label className="form-label">{t("Colors")}</label>
                <MultiSelect
                  options={colorOption}
                  onChange={(e) => {
                    setSelectedColor(e);
                  }}
                  value={selectedColor}
                  labelledBy="Select Color"
                />
              </div>
              <div className="py-3">
                <label className="form-label">{t("Attributes")}</label>
                <select
                  className="form-control"
                  defaultValue=""
                  onChange={(evt) => changeAttr(evt.target.value)}
                >
                  <option value="" disabled>
                    {t("Select Attribute")}
                  </option>
                  {data.attribute.map((attr, idx) => (
                    <option value={idx} key={idx}>
                      {attr.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedAttr.length > 0 && (
                <div className="row py-3">
                  <label className="form-label">
                    {data.attribute[selectedAttr].name}
                  </label>
                  <MultiSelect
                    options={attrItemOption(selectedAttr)}
                    onChange={(e) => {
                      setAttrItemList(e);
                    }}
                    value={attrItemList}
                    labelledBy="Select Item"
                  />
                </div>
              )}
              {variantInputList.length > 0 &&
                variantInputList.map((variant, index) => {
                  return (
                    <div key={index}>
                      <hr />
                      <h6>
                        {t("Variant")}:{" "}
                        {`${variant.color ? variant.color : ""} ${
                          variant.color && variant.attr ? "+" : ""
                        } ${variant.attr ? variant.attr : ""}`}
                      </h6>
                      <div className="row">
                        <div className="col-12 col-md-3">
                          <div className="py-3">
                            <label className="form-label">
                              {t("Additional Price")}*
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="form-control"
                              name="price"
                              required
                              value={variant.price || ""}
                              onChange={(evt) => handleInputChange(evt, index)}
                              onWheel={(e) => e.target.blur()}
                            />
                            <div className="small text-primary">
                              {t("Set 0 to make it free")}
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-3">
                          <div className="py-3">
                            <label className="form-label">{t("sku")}*</label>
                            <input
                              type="text"
                              className="form-control"
                              name="sku"
                              required
                              value={variant.sku || ""}
                              onChange={(evt) => handleInputChange(evt, index)}
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-3">
                          <div className="py-3">
                            <label className="form-label">
                              {t("Item Quantity")}*
                            </label>
                            <input
                              type="number"
                              min="-1"
                              className="form-control"
                              name="qty"
                              required
                              value={variant.qty || ""}
                              onChange={(evt) => handleInputChange(evt, index)}
                              onWheel={(e) => e.target.blur()}
                            />
                            <div className="small text-primary">
                              {t("Set -1 to make it unlimited")}
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-3">
                          <div className="py-3">
                            <CustomSelect
                              list={galleryImage || []}
                              dataChange={handleInputChange}
                              rootIndex={index}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    );
  }

  function productType() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("Product Type")}
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <div className="py-3">
                <label htmlFor="inp-110" className="form-label">
                  {t("new_product")}
                </label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="inp-110"
                    name="new_product"
                  />
                  <label className="form-check-label" htmlFor="inp-110">
                    {t("Status")}
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="py-3">
                <label htmlFor="inp-11" className="form-label">
                  {t("trending_product")}
                </label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="inp-11"
                    name="trending"
                  />
                  <label className="form-check-label" htmlFor="inp-11">
                    {t("Status")}
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="py-3">
                <label htmlFor="inp-111" className="form-label">
                  {t("best_selling_product")}
                </label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="inp-111"
                    name="best_selling"
                  />
                  <label className="form-check-label" htmlFor="inp-111">
                    {t("Status")}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="py-3">
              <label htmlFor="inp-type" className="form-label">
                {t("Product Type")}*
              </label>
              <select
                id="inp-type"
                ref={product_type}
                className="form-control"
                required
                onChange={() => setSelectedType(product_type.current.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  {t("Select Product Type")}
                </option>
                <option value="simple">Simple Product</option>
                <option value="variable">Variable Product</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function productInformation() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("Product Description")}
        </div>
        <div className="card-body">
          <div className="py-3">
            <label htmlFor="inp-1" className="form-label">
              {t("name")}*
            </label>
            <input
              type="text"
              id="inp-1"
              className="form-control"
              name="name"
              required
            />
          </div>
          <div className="row">
            <div className="col-12 col-sm-6">
              <div className="py-3">
                <label htmlFor="inp-2" className="form-label">
                  {t("Unit")}*
                </label>
                <input
                  type="text"
                  id="inp-2"
                  className="form-control"
                  name="unit"
                  required
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="py-3">
                <label htmlFor="inp-3" className="form-label">
                  {t("Unit Value")}*
                </label>
                <input
                  type="text"
                  id="inp-3"
                  className="form-control"
                  name="unit_val"
                  required
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="py-3">
                <label htmlFor="inp-4" className="form-label">
                  {t("price")}*
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="inp-4"
                  className="form-control"
                  name="main_price"
                  required
                  onWheel={(e) => e.target.blur()}
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="py-3">
                <label htmlFor="inp-5" className="form-label">
                  {t("Discount in Percentage")}*
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  id="inp-5"
                  placeholder="0%"
                  className="form-control"
                  name="sale_price"
                  required
                  onWheel={(e) => e.target.blur()}
                />
              </div>
            </div>
            {/* delivery price  */}
            <div className="col-12 col-sm-6">
              <div className="py-3">
                <label htmlFor="inp-4" className="form-label">
                  {t("Delivery Price")}*
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="inp-4"
                  className="form-control"
                  name="delivery_price"
                  required
                  onWheel={(e) => e.target.blur()}
                />
              </div>
            </div>

            {/* delivery price  */}
            <div className="col-12 col-sm-6">
              <div className="py-3">
                <label className="form-label">{t("categories")}*</label>
                <MultiSelect
                  options={categoryOption}
                  onChange={setSelectedCategory}
                  value={selectedCategory}
                  labelledBy="Select"
                />
              </div>
            </div>
            <div className="col-12 col-sm-6">
              <div className="py-3">
                <label className="form-label">{t("Subcategories")}*</label>
                <MultiSelect
                  options={subcategoryOption}
                  onChange={setSelectedSubcategory}
                  value={selectedSubcategory}
                  labelledBy="Select"
                />
              </div>
            </div>
            <div className="py-3">
              <label className="form-label">{t("Brands")}</label>
              <select className="form-control" onChange={updateBrand}>
                <option value="">None</option>
                {data.brand &&
                  data.brand.map((x) => (
                    <option value={x.slug} key={x._id}>
                      {x.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function imageInput() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("Product Image")}
        </div>
        <div className="card-body">
          <FileUpload
            accept=".jpg,.png,.jpeg"
            label={t("Display Image")}
            maxFileSizeInBytes={2000000}
            updateFilesCb={updateDisplayImage}
            resetCb={resetImageInput}
          />

          <FileUpload
            accept=".jpg,.png,.jpeg"
            label={t("Gallery Images")}
            multiple
            maxFileSizeInBytes={2000000}
            updateFilesCb={updateGalleryImage}
            resetCb={resetImageInput}
          />
        </div>
      </div>
    );
  }

  function seoInput() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("SEO Meta Tags")}
        </div>
        <div className="card-body">
          <div className="py-3">
            <label htmlFor="inp-122" className="form-label">
              {t("Meta Title")}
            </label>
            <input
              type="text"
              ref={seo_title}
              id="inp-122"
              className="form-control"
            />
          </div>
          <div className="py-3">
            <label htmlFor="inp-222" className="form-label">
              {t("Meta Description")}
            </label>
            <textarea ref={seo_desc} id="inp-222" className="form-control" />
          </div>
          <FileUpload
            accept=".jpg,.png,.jpeg"
            label={t("Meta Image")}
            maxFileSizeInBytes={2000000}
            updateFilesCb={setSeoImage}
            resetCb={resetImageInput}
          />
        </div>
      </div>
    );
  }
};

export default ProductForm;
