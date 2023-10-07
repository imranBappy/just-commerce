import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import { cpf, fetchData, postData } from "~/lib/clientFunctions";

const Spinner = dynamic(() => import("~/components/Ui/Spinner"));
const LoadingButton = dynamic(() => import("~/components/Ui/Button"));
const FileUpload = dynamic(() => import("~/components/FileUpload/fileUpload"));

const SettingsPageSeo = () => {
  const url = `/api/settings`;
  const { data, error } = useSWR(url, fetchData);
  const [settings, setSettings] = useState([]);
  const [seoImage, setSeoImage] = useState([]);
  const [buttonState, setButtonState] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (data && data.settings) {
      setSettings(data.settings);
      setSeoImage(data.settings.seo.image);
    }
  }, [data]);

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setPermissions(cpf(session, "settings"));
  }, [session]);

  const title = useRef();
  const keyword = useRef();
  const description = useRef();
  const sitemap = useRef();
  const robot = useRef();

  const handleForm = async (e) => {
    e.preventDefault();
    setButtonState("loading");
    try {
      const data = {
        title: title.current.value.trim(),
        description: description.current.value.trim(),
        keyword: keyword.current.value.trim(),
        image: JSON.stringify(seoImage),
      };
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }
      const response = await postData(`/api/settings?scope=seo`, formData);
      response.success
        ? toast.success("Setting Updated Successfully")
        : toast.error(`Something Went Wrong (500)`);
    } catch (err) {
      toast.error(`Something Went Wrong (${err.message})`);
    }
    setButtonState("");
  };

  const handleSitemapForm = async (e) => {
    try {
      e.preventDefault();
      setButtonState("loading");
      const formData = new FormData();
      formData.append("sitemap", sitemap.current.value);
      const response = await postData("/api/settings?scope=sitemap", formData);
      response.success
        ? toast.success("Sitemap Updated Successfully")
        : toast.error(`Something Went Wrong (500)`);
    } catch (err) {
      toast.error(`Something Went Wrong (${err.message})`);
    }
    setButtonState("");
  };

  const handleRobotForm = async (e) => {
    try {
      e.preventDefault();
      setButtonState("loading");
      const formData = new FormData();
      formData.append("robots", robot.current.value);
      const response = await postData("/api/settings?scope=robot", formData);
      response.success
        ? toast.success("Robots.txt Updated Successfully")
        : toast.error(`Something Went Wrong (${response.err})`);
    } catch (err) {
      toast.error(`Something Went Wrong (${err.message})`);
    }
    setButtonState("");
  };

  return (
    <>
      {error ? (
        <div className="text-center text-danger">failed to load</div>
      ) : !settings._id ? (
        <Spinner />
      ) : (
        <>
          <form onSubmit={handleForm}>
            <div className="card mb-5 border-0 shadow">
              <div className="card-header bg-white py-3 fw-bold">
                {t("Global Seo Settings")}
              </div>
              <div className="card-body">
                <div className="py-3">
                  <label htmlFor="inp-1" className="form-label">
                    {t("Meta Title")}
                  </label>
                  <input
                    type="text"
                    ref={title}
                    id="inp-1"
                    defaultValue={settings.seo.title}
                    className="form-control"
                  />
                </div>
                <div className="py-3">
                  <label htmlFor="inp-2" className="form-label">
                    {t("Meta Description")}
                  </label>
                  <textarea
                    ref={description}
                    id="inp-2"
                    defaultValue={settings.seo.description}
                    className="form-control"
                  />
                </div>
                <div className="py-3">
                  <label htmlFor="inp-3" className="form-label">
                    {t("Keywords")}
                  </label>
                  <textarea
                    ref={keyword}
                    id="inp-3"
                    defaultValue={settings.seo.keyword}
                    className="form-control"
                  />
                  <small className="text-muted">Separate with coma</small>
                </div>
                <FileUpload
                  accept=".jpg,.png,.jpeg"
                  label={t("Meta Image")}
                  multiple
                  maxFileSizeInBytes={2000000}
                  updateFilesCb={setSeoImage}
                  preSelectedFiles={seoImage}
                />
                {permissions.edit && (
                  <div className="py-3">
                    <LoadingButton
                      type="submit"
                      text={t("UPDATE")}
                      state={buttonState}
                    />
                  </div>
                )}
              </div>
            </div>
          </form>
          <form onSubmit={handleSitemapForm}>
            <div className="card mb-5 border-0 shadow">
              <div className="card-header bg-white py-3 fw-bold">
                Sitemap.xml
              </div>
              <div className="card-body">
                <div className="py-3">
                  <textarea
                    ref={sitemap}
                    id="inp-2"
                    rows="4"
                    className="form-control"
                  />
                  <small className="text-muted">
                    {t("Insert your sitemap.xml file content")}
                  </small>
                </div>
                {permissions.edit && (
                  <div className="py-3">
                    <LoadingButton
                      type="submit"
                      text={t("UPDATE")}
                      state={buttonState}
                    />
                  </div>
                )}
              </div>
            </div>
          </form>
          <form onSubmit={handleRobotForm}>
            <div className="card mb-5 border-0 shadow">
              <div className="card-header bg-white py-3 fw-bold">
                Robots.txt
              </div>
              <div className="card-body">
                <div className="py-3">
                  <textarea
                    ref={robot}
                    id="inp-2"
                    rows="4"
                    className="form-control"
                  />
                  <small className="text-muted">
                    {t("Insert your robots.txt file content")}
                  </small>
                </div>
                {permissions.edit && (
                  <div className="py-3">
                    <LoadingButton
                      type="submit"
                      text={t("UPDATE")}
                      state={buttonState}
                    />
                  </div>
                )}
              </div>
            </div>
          </form>
        </>
      )}
    </>
  );
};

SettingsPageSeo.requireAuthAdmin = true;
SettingsPageSeo.dashboard = true;

export default SettingsPageSeo;
