import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";

const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });

const TextEditor = ({ previousValue = "a", updatedValue, height }) => {
  const handleChange = (content) => {
    updatedValue(content);
  };

  return (
    <SunEditor
      setContents={previousValue}
      onChange={handleChange}
      setOptions={{
        height: height || 500,
        buttonList: [
          ["undo", "redo", "font", "fontSize", "formatBlock", "align"],
          [
            "bold",
            "underline",
            "italic",
            "strike",
            "subscript",
            "superscript",
            "removeFormat",
          ],
          [
            "fontColor",
            "hiliteColor",
            "outdent",
            "indent",
            "align",
            "horizontalRule",
            "list",
            "table",
          ],
          [
            "link",
            "image",
            "video",
            "fullScreen",
            "showBlocks",
            "codeView",
            "preview",
            "print",
            "save",
          ],
        ],
      }}
    />
  );
};

export default TextEditor;
