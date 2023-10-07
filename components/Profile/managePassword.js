import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { postData } from "~/lib/clientFunctions";
import LoadingButton from "../Ui/Button";
import { useTranslation } from "react-i18next";

const ManagePassword = (props) => {
  const [loading, setLoading] = useState("");
  const { t } = useTranslation();
  const form = useRef();
  const password = useRef();
  const passwordRef = useRef();

  const updateUserInfo = async (e) => {
    try {
      e.preventDefault();
      if (
        password.current.value.length === 0 ||
        password.current.value !== passwordRef.current.value
      ) {
        return toast.error("Passwords in both fields do not match");
      }
      setLoading("loading");
      const userData = {
        password: password.current.value.trim(),
      };
      const response = await postData(
        `/api/profile?scope=password&id=${props.id}`,
        userData
      );
      response.success
        ? (toast.success("Password Updated Successfully"), form.current.reset())
        : toast.error("Something Went Wrong (500)");
      setLoading("");
    } catch (err) {
      setLoading("");
      console.log(err);
      toast.error(`Something Went Wrong (${err.message})`);
    }
  };

  return (
    <div>
      <div className="card mb-5 border-0 shadow-sm">
        <div className="card-header bg-white py-3">{t("change_password")}</div>
        <form onSubmit={updateUserInfo} ref={form}>
          <div className="card-body">
            <div className="py-2">
              <label className="form-label">{t("new_password")}</label>
              <input
                type="password"
                className="form-control"
                ref={password}
                required
              />
            </div>
            <div className="py-2">
              <label className="form-label">{t("confirm_password")}</label>
              <input
                type="password"
                className="form-control"
                ref={passwordRef}
                required
              />
            </div>
            <div className="py-3">
              <LoadingButton
                text="Update Password"
                state={loading}
                type="submit"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagePassword;
