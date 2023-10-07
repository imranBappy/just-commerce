import dynamic from "next/dynamic";
import DefaultErrorPage from "next/error";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import { cpf, fetchData, postData } from "~/lib/clientFunctions";

const Spinner = dynamic(() => import("~/components/Ui/Spinner"));
const TextEditor = dynamic(() => import("~/components/TextEditor"));
const LoadingButton = dynamic(() => import("~/components/Ui/Button"));

const TermsPageSetup = () => {
  const [editorState, setEditorState] = useState("");
  const [buttonState, setButtonState] = useState("");
  const { t } = useTranslation();

  const url = `/api/page`;
  const { data, error } = useSWR(url, fetchData);

  useEffect(() => {
    if (data && data.page) {
      setEditorState(data.page.termsPage.content);
    }
  }, [data]);

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setPermissions(cpf(session, "pageSettings"));
  }, [session]);

  const updatedValueCb = (data) => {
    setEditorState(data);
  };

  const handleSubmit = async () => {
    setButtonState("loading");
    try {
      const response = await postData(`/api/page?scope=terms`, {
        content: editorState,
      });
      response.success
        ? toast.success("Page updated successfully!")
        : toast.error("Something went wrong 500");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong ", err.message);
    }
    setButtonState("");
  };

  return (
    <>
      {error ? (
        <DefaultErrorPage statusCode={500} />
      ) : !data ? (
        <Spinner />
      ) : (
        <div>
          <div className="py-3">
          <h1 className="h3 text-center pb-3">{t("terms_and_conditions")}</h1>
            <TextEditor
              previousValue={editorState}
              updatedValue={updatedValueCb}
            />
          </div>
          {permissions.edit && (
            <div className="py-3">
              <LoadingButton
                text={t("UPDATE")}
                state={buttonState}
                clickEvent={handleSubmit}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

TermsPageSetup.requireAuthAdmin = true;
TermsPageSetup.dashboard = true;

export default TermsPageSetup;
