import DefaultErrorPage from "next/error";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import HeadData from "~/components/Head";
import LoadingButton from "~/components/Ui/Button";
import { appUrl, fetchData, updateData } from "~/lib/clientFunctions";

const PasswordReset = ({ data, error }) => {
  const [buttonState, setButtonState] = useState("");
  const password = useRef("");
  const confirmPassword = useRef("");

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      if (password.current.value !== confirmPassword.current.value) {
        return toast.error("Both Password Field Value Not Matched");
      }
      const formData = {
        pass: password.current.value,
        token: data.token,
      };
      const { success, err } = await updateData(`/api/reset`, formData);
      success
        ? toast.success("Success! Your password has been changed.")
        : toast.error(err);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (error) return <DefaultErrorPage statusCode={500} />;

  return (
    <>
      <HeadData title="Reset Password" />
      <div className="layout_top text-center mb-5">
        {data.err && <h3 className="py-5 my-5 text-danger">{data.err}</h3>}
        {data.success && (
          <div className="col-md-6 mx-auto py-5">
            <h1 className="py-4">Reset Password</h1>
            <form onSubmit={handleForm}>
              <div className="mb-4">
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="New Password"
                  required
                  ref={password}
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  className="form-control form-control-lg"
                  placeholder="Confirm Password"
                  required
                  ref={confirmPassword}
                />
              </div>
              <LoadingButton
                type="submit"
                state={buttonState}
                text="Update Password"
              />
              <br />
            </form>
          </div>
        )}
      </div>
    </>
  );
};

PasswordReset.getInitialProps = async (ctx) => {
  try {
    const { origin } = appUrl(ctx.req);
    const url = `${process.env.NEXT_PUBLIC_URL}/api/reset?token=${ctx.query.token}`;
    const { success, token, err } = await fetchData(url);
    return { data: { success, token, err }, error: null };
  } catch (error) {
    console.log(error);
    return {
      data: null,
      error,
    };
  }
};

export default PasswordReset;
