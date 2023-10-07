import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "~/lib/clientFunctions";
import { updateCart } from "~/redux/cart.slice";
import { updateSettings } from "~/redux/settings.slice";
import { getStorageData } from "~/utils/useLocalStorage";
import Preloader from "../Ui/Preloader";

export default function LoadInitialData() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  async function loadSettings() {
    try {
      const response = await fetchData(`/api/home/settings`);
      if (!response.settings) {
        stopLoader();
      }
      dispatch(updateSettings(response.settings));
    } catch (err) {
      console.log(err);
    }
  }

  function stopLoader() {
    setTimeout(() => {
      setLoading(false);
    }, 30);
  }

  useEffect(() => {
    if (
      settings &&
      settings.settingsData &&
      settings.settingsData._id === null
    ) {
      loadSettings();
    } else {
      stopLoader();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  useEffect(() => {
    async function updateStoreData() {
      dispatch(updateCart(await getStorageData("CART")));
    }
    updateStoreData();
    return () => {
      dispatch(updateCart([]));
    };
  }, [dispatch]);

  return <>{loading && <Preloader />}</>;
}
