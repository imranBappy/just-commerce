import { PencilSquare, Trash } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import ImageLoader from "~/components/Image";
import classes from "~/components/tableFilter/table.module.css";
import { cpf, deleteData, fetchData, postData } from "~/lib/clientFunctions";

const Spinner = dynamic(() => import("~/components/Ui/Spinner"));
const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
const LoadingButton = dynamic(() => import("~/components/Ui/Button"));
const Accordion = dynamic(() => import("~/components/Ui/Accordion"));
const FileUpload = dynamic(() => import("~/components/FileUpload/fileUpload"));

const HomePageSetting = () => {
  const url = `/api/page`;
  const { data, error, mutate } = useSWR(url, fetchData);

  const [homePageData, setHomePageData] = useState({});
  const [carouselImage, updateCarouselImage] = useState([]);
  const [carouselBackgroundImage, updateCarouselBackgroundImage] = useState([]);
  const [resetCarouselImageInput, setResetCarouselImageInput] = useState("");
  const [buttonState, setButtonState] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const carouselForm = useRef();
  const carouselTitle = useRef();
  const carouselSubTitle = useRef();
  const carouselDesc = useRef();
  const carouselUrl = useRef();

  const [bannerImage, updateBannerImage] = useState([]);
  const bannerTitle = useRef();
  const bannerSubTitle = useRef();
  const bannerDesc = useRef();
  const bannerUrl = useRef();

  const [collectionImage, updateCollectionImage] = useState([]);
  const [collectionData, setCollectionData] = useState({
    title: "",
    url: "",
  });
  const [collectionScope, setCollectionScope] = useState("");
  const collectionTitle = useRef();
  const collectionUrl = useRef();
  const { t } = useTranslation();
  useEffect(() => {
    if (data && data.page) {
      setHomePageData(data.page.homePage);
      updateCarouselBackgroundImage(data.page.homePage.carousel.background);
      updateBannerImage(data.page.homePage.banner.image);
    }
  }, [data]);

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setPermissions(cpf(session, "pageSettings"));
  }, [session]);

  const openModal = (id) => {
    setSelectedId(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const deleteCarouselItem = async () => {
    setIsOpen(false);
    await deleteData(`/api/page/home?id=${selectedId}&scope=carousel`)
      .then((data) =>
        data.success
          ? (toast.success("Item Deleted Successfully"), mutate())
          : toast.error("Something Went Wrong")
      )
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const handleCarouselAdd = async (e) => {
    e.preventDefault();
    try {
      if (!carouselImage[0]) {
        return toast.warn("Please add image");
      }
      setButtonState("loading");
      const data = {
        title: carouselTitle.current.value.trim(),
        subTitle: carouselSubTitle.current.value.trim(),
        description: carouselDesc.current.value.trim(),
        url: carouselUrl.current.value.trim(),
        image: carouselImage,
      };
      const { success, err } = await postData(
        `/api/page/home?scope=carousel`,
        data
      );

      success
        ? (toast.success("Item Added Successfully"),
          setResetCarouselImageInput("reset"),
          carouselForm.current.reset(),
          mutate())
        : toast.error(err);
      setButtonState("");
    } catch (err) {
      setButtonState("");
      toast.error(err.message);
    }
  };

  const handleCarouselBackground = async () => {
    try {
      if (!carouselBackgroundImage[0]) {
        return toast.warn("Please add image");
      }
      setButtonState("loading");
      const { success, err } = await postData(
        `/api/page/home?scope=background`,
        { background: carouselBackgroundImage }
      );
      success
        ? toast.success("Background Image Added Successfully")
        : toast.error(err);
      setButtonState("");
    } catch (err) {
      setButtonState("");
      toast.error(err.message);
    }
  };

  const handleBannerAdd = async (e) => {
    e.preventDefault();
    try {
      if (!bannerImage[0]) {
        return toast.warn("Please add image");
      }
      setButtonState("loading");
      const data = {
        title: bannerTitle.current.value.trim(),
        subTitle: bannerSubTitle.current.value.trim(),
        description: bannerDesc.current.value.trim(),
        url: bannerUrl.current.value.trim(),
        image: bannerImage,
      };
      const { success, err } = await postData(
        `/api/page/home?scope=banner`,
        data
      );
      success ? toast.success("Item Updated Successfully") : toast.error(err);
      setButtonState("");
    } catch (err) {
      setButtonState("");
      toast.error(err.message);
    }
  };
  const editCollection = (scope) => {
    setCollectionScope("");
    setTimeout(() => {
      const { title, url, image } = homePageData.collection[scope];
      updateCollectionImage(image);
      setCollectionData({ title, url });
      setCollectionScope(scope);
    }, 100);
  };
  const handleCollectionAdd = async (e) => {
    e.preventDefault();
    try {
      setButtonState("loading");
      const data = {
        title: collectionTitle.current.value.trim(),
        url: collectionUrl.current.value.trim(),
        image: collectionImage,
      };
      const { success, err } = await postData(
        `/api/page/home?scope=collection&dataScope=${collectionScope}`,
        data
      );
      success
        ? (toast.success("Item Updated Successfully"),
          updateCollectionImage([]),
          setCollectionData({ title: "", url: "" }),
          setCollectionScope(""),
          mutate())
        : toast.error(err);
      setButtonState("");
    } catch (err) {
      setButtonState("");
      toast.error(err.message);
    }
  };

  const columns = [
    {
      name: t("Title"),
      selector: (row) => row.title,
    },
    {
      name: t("URL"),
      selector: (row) => row.url,
      sortable: true,
    },
    {
      name: t("SN"),
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: t("image"),
      selector: (row) => (
        <ImageLoader
          src={row.image[0]?.url}
          alt={row.title}
          width={50}
          height={50}
        />
      ),
    },
    {
      name: t("action"),
      selector: (row) =>
        permissions.delete && (
          <div className={classes.button} onClick={() => openModal(row.id)}>
            <Trash width={22} height={22} title="DELETE" />
          </div>
        ),
    },
  ];

  return (
    <>
      {error ? (
        <div className="text-center text-danger">failed to load</div>
      ) : !homePageData.carousel ? (
        <Spinner />
      ) : (
        <>
          {headerCarousel()}
          {banner()}
          {bannerTwo()}
        </>
      )}
      <GlobalModal isOpen={isOpen} handleCloseModal={closeModal} small={true}>
        <div className={classes.modal_icon}>
          <Trash width={90} height={90} />
          <p className="mb-1">Are you sure, you want to delete?</p>
          <div>
            <button
              className={classes.danger_button}
              onClick={() => deleteCarouselItem()}
            >
              Delete
            </button>
            <button
              className={classes.success_button}
              onClick={() => closeModal()}
            >
              Cancel
            </button>
          </div>
        </div>
      </GlobalModal>
    </>
  );

  function bannerTwo() {
    return (
      <div className="card border-0 shadow mb-5">
        <div className="card-header bg-white py-3 fw-bold">
          {t("Product Review Card")}
        </div>
        <div className="card-body">
          <div className="table-responsive mb-4">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">{t("image")}</th>
                  <th scope="col">{t("Title")}</th>
                  <th scope="col">{t("Link")}</th>
                  <th scope="col">{t("action")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>
                    {homePageData.collection["scopeA"].image[0] && (
                      <ImageLoader
                        src={homePageData.collection["scopeA"].image[0]?.url}
                        width={40}
                        height={40}
                        alt={homePageData.collection["scopeA"].title}
                      />
                    )}
                  </td>
                  <td>{homePageData.collection["scopeA"].title}</td>
                  <td>{homePageData.collection["scopeA"].url}</td>
                  {permissions.edit && (
                    <td>
                      <div
                        className={classes.button}
                        onClick={() => editCollection("scopeA")}
                      >
                        <PencilSquare width={22} height={22} title="Edit" />
                      </div>
                    </td>
                  )}
                </tr>
                <tr>
                  <th scope="row">2</th>
                  <td>
                    {homePageData.collection["scopeB"].image[0] && (
                      <ImageLoader
                        src={homePageData.collection["scopeB"].image[0]?.url}
                        width={40}
                        height={40}
                        alt={homePageData.collection["scopeB"].title}
                      />
                    )}
                  </td>
                  <td>{homePageData.collection["scopeB"].title}</td>
                  <td>{homePageData.collection["scopeB"].url}</td>
                  {permissions.edit && (
                    <td>
                      <div
                        className={classes.button}
                        onClick={() => editCollection("scopeB")}
                      >
                        <PencilSquare width={22} height={22} title="Edit" />
                      </div>
                    </td>
                  )}
                </tr>
                <tr>
                  <th scope="row">3</th>
                  <td>
                    {homePageData.collection["scopeC"].image[0] && (
                      <ImageLoader
                        src={homePageData.collection["scopeC"].image[0]?.url}
                        width={40}
                        height={40}
                        alt={homePageData.collection["scopeC"].title}
                      />
                    )}
                  </td>
                  <td>{homePageData.collection["scopeC"].title}</td>
                  <td>{homePageData.collection["scopeC"].url}</td>
                  {permissions.edit && (
                    <td>
                      <div
                        className={classes.button}
                        onClick={() => editCollection("scopeC")}
                      >
                        <PencilSquare width={22} height={22} title="Edit" />
                      </div>
                    </td>
                  )}
                </tr>
                <tr>
                  <th scope="row">4</th>
                  <td>
                    {homePageData.collection["scopeD"].image[0] && (
                      <ImageLoader
                        src={homePageData.collection["scopeD"].image[0]?.url}
                        width={40}
                        height={40}
                        alt={homePageData.collection["scopeD"].title}
                      />
                    )}
                  </td>
                  <td>{homePageData.collection["scopeD"].title}</td>
                  <td>{homePageData.collection["scopeD"].url}</td>
                  {permissions.edit && (
                    <td>
                      <div
                        className={classes.button}
                        onClick={() => editCollection("scopeD")}
                      >
                        <PencilSquare width={22} height={22} title="Edit" />
                      </div>
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </div>
          {collectionScope.length > 0 && (
            <div className="p-2 border">
              <form onSubmit={handleCollectionAdd}>
                <div className="pb-0">
                  <FileUpload
                    accept=".jpg,.png,.jpeg"
                    label={`${t("image")}*`}
                    maxFileSizeInBytes={2000000}
                    updateFilesCb={updateCollectionImage}
                    preSelectedFiles={collectionImage}
                  />
                </div>
                <div className="pb-3">
                  <label htmlFor="banner-title" className="form-label">
                    {t("Title")}*
                  </label>
                  <input
                    type="text"
                    id="banner-title"
                    className="form-control"
                    required
                    ref={collectionTitle}
                    defaultValue={collectionData.title}
                  />
                </div>
                <div className="pb-5">
                  <label htmlFor="banner-url" className="form-label">
                    {t("URL")}*
                  </label>
                  <input
                    type="text"
                    id="banner-url"
                    className="form-control"
                    required
                    ref={collectionUrl}
                    defaultValue={collectionData.url}
                  />
                </div>
                <div className="pb-0">
                  <LoadingButton
                    text={t("UPDATE")}
                    type="submit"
                    state={buttonState}
                  />
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  function banner() {
    return (
      <div className="card border-0 shadow mb-5">
        <div className="card-header bg-white py-3 fw-bold">{t("Banner")}</div>
        <div className="card-body">
          <form onSubmit={handleBannerAdd}>
            <div className="pb-0">
              <FileUpload
                accept=".jpg,.png,.jpeg"
                label={`${t("image")}(1920px x 750px)*`}
                maxFileSizeInBytes={2000000}
                updateFilesCb={updateBannerImage}
                preSelectedFiles={bannerImage}
              />
            </div>
            <div className="pb-3">
              <label htmlFor="banner-title" className="form-label">
                {t("Title")}*
              </label>
              <input
                type="text"
                id="banner-title"
                className="form-control"
                required
                ref={bannerTitle}
                defaultValue={homePageData.banner.title}
              />
            </div>
            <div className="pb-3">
              <label htmlFor="banner-subtitle" className="form-label">
                {t("Subtitle")}*
              </label>
              <input
                type="text"
                id="banner-subtitle"
                className="form-control"
                required
                ref={bannerSubTitle}
                defaultValue={homePageData.banner.subTitle}
              />
            </div>
            <div className="pb-3">
              <label htmlFor="banner-desc" className="form-label">
                {t("description")}*
              </label>
              <textarea
                id="banner-desc"
                className="form-control"
                required
                ref={bannerDesc}
                defaultValue={homePageData.banner.description}
              />
            </div>
            <div className="pb-5">
              <label htmlFor="banner-url" className="form-label">
                {t("URL")}*
              </label>
              <input
                type="text"
                id="banner-url"
                className="form-control"
                required
                ref={bannerUrl}
                defaultValue={homePageData.banner.url}
              />
            </div>
            {permissions.edit && (
              <div className="pb-0">
                <LoadingButton
                  text={t("UPDATE")}
                  type="submit"
                  state={buttonState}
                />
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  function headerCarousel() {
    return (
      <div className="card border-0 shadow mb-5">
        <div className="card-header bg-white py-3 fw-bold">
          {t("Header carousel")}
        </div>
        <div className="card-body">
          <DataTable
            columns={columns}
            data={homePageData.carousel.carouselData}
            pagination
          />
          {permissions.edit && (
            <>
              <Accordion title={t("Add new header carousel item")}>
                <form onSubmit={handleCarouselAdd} ref={carouselForm}>
                  <div className="pb-0">
                    <FileUpload
                      accept=".jpg,.png,.jpeg"
                      label={`${t("image")}(any size)*`}
                      maxFileSizeInBytes={2000000}
                      updateFilesCb={updateCarouselImage}
                      resetCb={resetCarouselImageInput}
                    />
                  </div>
                  <div className="pb-3">
                    <label htmlFor="header-title" className="form-label">
                      {t("title")}*
                    </label>
                    <input
                      type="text"
                      id="header-title"
                      className="form-control"
                      required
                      ref={carouselTitle}
                    />
                  </div>
                  <div className="pb-3">
                    <label htmlFor="header-subtitle" className="form-label">
                      {t("col-md-* col-*")}
                    </label>
                    <input
                      type="text"
                      id="header-subtitle"
                      className="form-control"
                      required
                      ref={carouselSubTitle}
                      defaultValue="col-6 col-md-2 ph-3"
                    />
                  </div>
                  <div className="pb-3">
                    <label htmlFor="header-desc" className="form-label">
                      <p className="mb-0">slider right 2</p>
                      <p className="mb-0">category up 3</p>
                      <p className="mb-0">category down 4</p>
                      <p className="mb-0">product 5,6,7</p>
                    </label>
                    <input
                      type="number"
                      id="header-desc"
                      className="form-control"
                      required
                      ref={carouselDesc}
                      defaultValue="1"
                    />
                  </div>
                  <div className="pb-5">
                    <label htmlFor="header-url" className="form-label">
                      {t("URL")}*
                    </label>
                    <input
                      type="text"
                      id="header-url"
                      className="form-control"
                      required
                      ref={carouselUrl}
                      defaultValue="#"
                    />
                  </div>
                  <div className="pb-0">
                    <LoadingButton
                      text={t("Add Item")}
                      type="submit"
                      state={buttonState}
                    />
                  </div>
                </form>
              </Accordion>
              <Accordion title={t("Header carousel background")}>
                <div className="pb-0">
                  <FileUpload
                    accept=".jpg,.png,.jpeg"
                    label={`${t("image")}(1920px x 800px)*`}
                    maxFileSizeInBytes={2000000}
                    updateFilesCb={updateCarouselBackgroundImage}
                    preSelectedFiles={carouselBackgroundImage}
                  />
                </div>
                <div>
                  <LoadingButton
                    text={t("Add Background Image")}
                    state={buttonState}
                    clickEvent={handleCarouselBackground}
                  />
                </div>
              </Accordion>
            </>
          )}
        </div>
      </div>
    );
  }
};

HomePageSetting.requireAuthAdmin = true;
HomePageSetting.dashboard = true;

export default HomePageSetting;
