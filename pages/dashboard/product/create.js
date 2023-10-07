import dynamic from "next/dynamic";
const ProductForm = dynamic(() =>
  import("~/components/ProductForm/productForm"),
);

const NewProduct = () => {
  return <ProductForm />;
};

NewProduct.requireAuthAdmin = true;
NewProduct.dashboard = true;

export default NewProduct;
