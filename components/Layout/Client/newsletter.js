import { memo, useRef } from "react";
import { toast } from "react-toastify";
import { postData } from "~/lib/clientFunctions";
import classes from "./newsletter.module.css";
import { useTranslation } from "react-i18next";

const Newsletter = () => {
  const email = useRef("");
  const { t } = useTranslation();
  async function handleSubmit(e) {
    try {
      e.preventDefault();
      const response = await postData("/api/subscribers/new", {
        email: email.current.value.trim(),
      });
      response.success
        ? toast.success("You Have Subscribed Successfully")
        : toast.error("Something Went Wrong");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  }

  return (
    <div className="col-12">
      <div className={classes.content}>
        <h2 className={classes.heading}>{t("join_our_newsletter")}</h2>
        <p className={classes.subheading}>
          {t("be_fast_to_get_the_latest_news_promotions_and_much_more!")}
        </p>
        <form onSubmit={handleSubmit}>
          <input
            className={classes.custom_input}
            type="email"
            name="email"
            placeholder={t("your_email_address")}
            required
            ref={email}
          />
          <button className={classes.button} type="submit">
            {t("join_now")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default memo(Newsletter);
