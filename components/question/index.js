import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { dateFormat, updateData } from "~/lib/clientFunctions";
import cls from "./question.module.css";

export default function Question({ qtn, user, pid, refresh }) {
  const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
  const [isOpen, setIsOpen] = useState(false);
  const [ansId, setAnsId] = useState(null);
  const ans = useRef();
  function answerBox(id) {
    setIsOpen(true);
    setAnsId(id);
  }
  const closeModal = () => {
    setIsOpen(false);
  };

  async function postAns(e) {
    try {
      e.preventDefault();
      const _data = {
        id: ansId,
        pid,
        answer: ans.current.value.trim(),
      };
      const _r = await updateData("/api/question", _data);
      _r.success
        ? (toast.success("Answer Added Successfully"), closeModal(), refresh())
        : toast.error("Something Went Wrong 500");
    } catch (er) {
      toast.error(`Something Went Wrong - ${er.message}`);
    }
  }

  return (
    <div className="bg-white my-4">
      {qtn.map((q) => (
        <div key={q._id} className={cls.wrap}>
          <p className="pl-n4">
            <strong>{q.userName}</strong>&nbsp;-&nbsp;
            <span>{dateFormat(q.date)}</span>
          </p>
          <div className="pl-2">
          <h3>
            <span>Q:</span> {q.question}
          </h3>
          {q.answer && (
            <p className={cls.answer}>
              <span>A:</span> {q.answer}
            </p>
          )}
          </div>
          {user && user.user.a && !q.answer && (
            <button
              className="btn btn-sm btn-success"
              onClick={() => answerBox(q._id)}
            >
              Reply
            </button>
          )}
        </div>
      ))}
      <GlobalModal isOpen={isOpen} handleCloseModal={closeModal} small={true}>
        <form className="p-3 mb-2 mt-3" onSubmit={postAns}>
          <div className="mb-3">
            <label className="form-label">Answer this question</label>
            <textarea
              className="form-control"
              maxLength={300}
              placeholder="Maximum 300 words"
              ref={ans}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-success">
            Post Answer
          </button>
        </form>
      </GlobalModal>
    </div>
  );
}
