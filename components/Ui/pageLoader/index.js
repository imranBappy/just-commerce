import { forwardRef, useEffect, useImperativeHandle } from "react";
import useSWR from "swr";
import Error500 from "~/components/error/500";
import { fetchData } from "~/lib/clientFunctions";
import Spinner from "../Spinner";

// eslint-disable-next-line react/display-name
const PageLoader = forwardRef((props, ref) => {
  const { data, error, mutate } = useSWR(
    props.url ? props.url : null,
    fetchData,
  );

  useImperativeHandle(ref, () => ({
    update: () => {
      mutate();
    },
  }));
  useEffect(() => {
    if (data && data.success) {
      props.setData(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (error) {
    return <Error500 />;
  }
  if (!data) {
    return (
      <div style={{ height: "100vh" }}>
        <Spinner />
      </div>
    );
  }

  if (data && !data.success) {
    return <Error500 />;
  }

  return <> {props.children} </>;
});

export default PageLoader;
