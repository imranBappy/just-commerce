import { useRouter } from "next/router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import HeadData from "~/components/Head";
import LoadingButton from "~/components/Ui/Button";
import { postData } from "~/lib/clientFunctions";

const ResetPage = () => {
  const [buttonState, setButtonState] = useState("");
  const email = useRef(null);
  const { session } = useSelector((state) => state.localSession);
  const router = useRouter();
  const { t } = useTranslation();
  if (session && session.user) {
    router.push("/");
  }

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      setButtonState("loading");
      const { success, err } = await postData(`/api/reset`, {
        email: email.current.value.trim(),
      });
      success
        ? toast.success(
            `An email has been sent to ${email.current.value} with further instructions.`
          )
        : toast.error(err);
    } catch (err) {
      toast.error(err.message);
    }
    setButtonState("");
  };
  return (
    <>
      <HeadData title="Reset Password" />
      <div className="layout_top text-center mb-5">
        <div className="col-md-6 mx-auto py-5">
          <h1 className="py-4">{t("reset_password")}</h1>
          <form onSubmit={handleForm}>
            <div className="mb-4">
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="Email Address"
                ref={email}
                required
              />
            </div>
            <LoadingButton
              type="submit"
              state={buttonState}
              text={t("send_password_reset_link")}
            />
            <br />
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPage;
