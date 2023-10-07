import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import classes from "~/styles/profile.module.css";

const HeadData = dynamic(() => import("~/components/Head"));
const PurchaseHistory = dynamic(() =>
  import("~/components/Profile/PurchaseHistory")
);
const ManageWishList = dynamic(() => import("~/components/Profile/wishlist"));
const ManageProfile = dynamic(() =>
  import("~/components/Profile/manageProfile")
);
const ManagePassword = dynamic(() =>
  import("~/components/Profile/managePassword")
);

const ProfilePage = () => {
  const { session } = useSelector((state) => state.localSession);
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();
  const { t } = useTranslation();
  const updateTab = (tabId) => setActiveTab(tabId);

  useEffect(() => {
    if (router.query.tab === "1") {
      setActiveTab(1);
    }
  }, [router.query]);

  return (
    <>
      <HeadData title="User Profile" />
      <div className="layout_top">
        <div className="custom_container py-5">
          <div className="row m-0">
            <div className="col-md-3">
              <div className={classes.menu}>
                <div className={classes.user_info}>
                  <h4>{session && session.user.name}</h4>
                  <span>{session && session.user.email}</span>
                </div>
                <div className={classes.menu_list}>
                  <div className={classes.menu_item}>
                    <button
                      className={activeTab === 0 ? classes.active : null}
                      onClick={() => updateTab(0)}
                    >
                      {t("purchase_history")}
                    </button>
                  </div>
                  <div className={classes.menu_item}>
                    <button
                      className={activeTab === 1 ? classes.active : null}
                      onClick={() => updateTab(1)}
                    >
                      {t("wishlist")}
                    </button>
                  </div>
                  <div className={classes.menu_item}>
                    <button
                      className={activeTab === 2 ? classes.active : null}
                      onClick={() => updateTab(2)}
                    >
                      {t("manage_profile")}
                    </button>
                  </div>
                  <div className={classes.menu_item}>
                    <button
                      className={activeTab === 3 ? classes.active : null}
                      onClick={() => updateTab(3)}
                    >
                      {t("manage_password")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-9">
              <div className={classes.viewer}>
                {activeTab === 0 && (
                  <PurchaseHistory id={session && session.user.id} />
                )}
                {activeTab === 1 && (
                  <ManageWishList id={session && session.user.id} />
                )}
                {activeTab === 2 && (
                  <ManageProfile id={session && session.user.id} />
                )}
                {activeTab === 3 && (
                  <ManagePassword id={session && session.user.id} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

ProfilePage.requireAuth = true;

export default ProfilePage;
