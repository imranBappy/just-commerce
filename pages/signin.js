import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import HeadData from "~/components/Head";
import LoadingButton from "~/components/Ui/Button";
import { formField } from "~/lib/clientFunctions";
import classes from "~/styles/signin.module.css";
export default function SignIn() {
  const [state, setState] = useState("");
  const router = useRouter();
  const settings = useSelector((state) => state.settings);
  const { t } = useTranslation();
  const errors = {
    Signin: "Try signing with a different account.",
    OAuthSignin: "Try signing with a different account.",
    OAuthCallback: "Try signing with a different account.",
    OAuthCreateAccount: "Try signing with a different account.",
    EmailCreateAccount: "Try signing with a different account.",
    Callback: "Try signing with a different account.",
    OAuthAccountNotLinked:
      "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "Check your email address.",
    CredentialsSignin:
      "Sign in failed. Check the details you provided are correct.",
    default: "Unable to sign in.",
  };

  const { facebook, google } = settings.settingsData.login;

  async function signinProcess(e) {
    setState("loading");
    try {
      e.preventDefault();
      const { username, password } = formField(e.target.elements);
      const res = await signIn("credentials", {
        redirect: false,
        password,
        username,
      });
      if (res.error) {
        const errorMessage = res.error && (errors[res.error] ?? errors.default);
        toast.error(errorMessage);
      }
      if (res.ok) {
        toast.success("Login successful");
        router.push("/");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
    setState("");
  }

  return (
    <>
      <HeadData title="Sign in" />
      <div className={classes.container}>
        <div className={classes.card}>
          <h1>{t("signin")}</h1>
          <form className={classes.form} onSubmit={signinProcess}>
            <input
              type="email"
              className="form-control"
              name="username"
              placeholder={t("email")}
              required
            />
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder={t("password")}
              required
            />
            <div className={classes.reset_link}>
              <Link href="/reset">{t("forget_your_password?")}</Link> |
              <Link href="/signup"> {t("create_an_account!")}</Link>
            </div>
            <LoadingButton text={t("signin")} type="submit" state={state} />
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

SignIn.footer = false;
