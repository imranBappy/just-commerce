import { Trash3 } from "@styled-icons/bootstrap";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import { deleteData, fetchData } from "~/lib/clientFunctions";
import { updateWishlist } from "~/redux/cart.slice";
import GlobalModal from "../../components/Ui/Modal/modal";
import Spinner from "../../components/Ui/Spinner";
import Product from "../Shop/Product/product";
import ProductDetails from "../Shop/Product/productDetails";

const ManageWishList = (props) => {
  const url = `/api/profile?id=${props.id}`;
  const { data, error, mutate } = useSWR(props.id ? url : null, fetchData);
  const [wishlist, setWishlist] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { wishlist: wishlistState } = useSelector((state) => state.cart);
  const { session } = useSelector((state) => state.localSession);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data && data.user) {
      setWishlist(data.user.favorite);
    }
  }, [data]);

  const handleCloseModal = () => {
    router.push("/profile", undefined, { shallow: true });
    setIsOpen(false);
  };

  useEffect(() => {
    if (router.query.slug) {
      setIsOpen(true);
    }
  }, [router.query.slug]);

  function updateWishlistCount() {
    const __data = wishlistState && wishlistState > 0 ? wishlistState - 1 : 0;
    dispatch(updateWishlist(__data));
  }

  const removeFromWishlist = async (pid) => {
    try {
      const data = {
        pid,
        id: session.user.id,
      };
      const response = await deleteData(`/api/wishlist`, data);
      response.success
        ? (toast.success("Item has been removed from your wishlist"),
          mutate(),
          updateWishlistCount())
        : toast.error("Something went wrong (500)");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <>
      {error ? (
        <div className="text-center text-danger">failed to load</div>
      ) : !data ? (
        <Spinner />
      ) : (
        <div className="row">
          {wishlist.length === 0 && (
            <p className="text-center p-3">
              You have no items on your wishlist
            </p>
          )}
          {wishlist.map((item, idx) => (
            <Product
              product={item}
              key={item._id}
              layout={"col-lg-4 col-md-6 col-sm-6 col-12"}
              link={`/profile?slug=${item.slug}&tab=1`}
              button={true}
              deleteButton={
                <button onClick={() => removeFromWishlist(item._id)}>
                  <Trash3 width={15} height={15} />
                </button>
              }
            />
          ))}
        </div>
      )}
      <GlobalModal
        small={false}
        isOpen={isOpen}
        handleCloseModal={handleCloseModal}
      >
        {router.query.slug && (
          <ProductDetails productSlug={router.query.slug} />
        )}
      </GlobalModal>
    </>
  );
};

export default ManageWishList;
