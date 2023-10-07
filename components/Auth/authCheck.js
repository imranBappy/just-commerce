import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "~/lib/clientFunctions";
import { updateCart, updateWishlist } from "~/redux/cart.slice";
import { updateSession } from "~/redux/session.slice";
import { updateSettings } from "~/redux/settings.slice";
import { getStorageData } from "~/utils/useLocalStorage";
import Error403 from "../error/403";
import Preloader from "../Ui/Preloader";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const CheckAuth = ({ auth, authAdmin, children }) => {
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();
  const settings = useSelector((state) => state.settings);
  const _cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { ready } = useTranslation();

  useEffect(() => {
    if (status !== "loading") {
      dispatch(updateSession({ session, status }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function loadSettings() {
    try {
      const response = await fetchData(`/api/home/settings`);
      if (response.success) {
        dispatch(updateSettings(response.settings));
      } else {
        throw new Error(response.err || "Something Went Wrong");
      }
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!settings.settingsData.loaded) {
      loadSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  async function loadWishList() {
    try {
      const response = await fetchData(`/api/home/wishlist`);
      if (response.success) {
        dispatch(updateWishlist(response.wishlist));
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    if (session) {
      loadWishList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    if (status !== "loading" && settings.settingsData.loaded && ready) {
      setLoading(false);
    }
  }, [status, settings.settingsData.loaded, ready]);

  useEffect(() => {
    async function updateStoreData() {
      if (_cart.items.length === 0) {
        const cartData = await getStorageData("CART");
        dispatch(updateCart(cartData));
      }
    }
    updateStoreData();
    return () => {
      dispatch(updateCart([]));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading && <Preloader />}
      {auth && !session ? (
        <Error403 />
      ) : authAdmin &&
        (!session || (!session.user.s.status && !session.user.a)) ? (
        <Error403 />
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default CheckAuth;
