import dynamic from "next/dynamic";
import { useRouter } from "next/router";
const ProductEditForm = dynamic(() =>
  import("~/components/ProductForm/productEditForm"),
);

const EditProduct = (props) => {
  const router = useRouter();
  if (router.query.slug) {
    return <ProductEditForm slug={router.query.slug} />;
  } else {
    return null;
  }
};

EditProduct.requireAuthAdmin = true;
EditProduct.dashboard = true;

export default EditProduct;
