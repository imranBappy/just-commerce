import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import HeadData from "~/components/Head";
import { postData } from "~/lib/clientFunctions";
import classes from "~/styles/signin.module.css";

export default function SignUpPage() {
  const name = useRef();
  const email = useRef();
  const password = useRef();
  const passwordConfirm = useRef();
  const { t } = useTranslation();
  const settings = useSelector((state) => state.settings);
  const { facebook, google } = settings.settingsData.login;

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      if (password.current.value === passwordConfirm.current.value) {
        const data = new FormData();
        data.append("name", name.current.value);
        data.append("email", email.current.value);
        data.append("password", password.current.value);
        const response = await postData(`/api/auth/signup`, data);
        response.success
          ? (toast.success("New account added successfully"),
            document.querySelector("#signup_form").reset())
          : !response.success && response.duplicate
          ? toast.error("User with the given email is already exists")
          : toast.error("Something went Wrong");
      } else {
        toast.error("Both Password Field Value Not Matched");
        passwordConfirm.current.focus();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <HeadData title="Register" />
      <div className={classes.container}>
        <div className={classes.card}>
          <h1>{t("signup")}</h1>
          <form onSubmit={handleForm} id="signup_form" className={classes.form}>
            <input
              type="text"
              ref={name}
              required
              placeholder={`${t("name")}*`}
              className="form-control"
            />
            <input
              type="email"
              ref={email}
              required
              placeholder={`${t("email")}*`}
              className="form-control"
            />
            <input
              type="password"
              ref={password}
              required
              placeholder={`${t("new_password")}*`}
              className="form-control"
            />
            <input
              type="password"
              ref={passwordConfirm}
              required
              placeholder={`${t("confirm_password")}*`}
              className="form-control"
            />
            <div className={classes.reset_link}>
              <Link href="/signin">
                {t("already_have_an_account?_sign_in")}
              </Link>
            </div>
            <button type="submit">{t("signup")}</button>
          </form>
          {(facebook || google) && <span className={classes.hr} />}
          <div>
            {facebook && (
              <button
                variant="outline"
                onClick={async () => await signIn("facebook")}
                className={classes.facebook}
              >
                {t("signin_with_facebook")}
              </button>
            )}
            {google && (
              <button
                variant="outline"
                onClick={async () => await signIn("google")}
                className={classes.google}
              >
                {t("signin_with_google")}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

SignUpPage.footer = false;
