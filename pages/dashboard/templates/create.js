import dynamic from "next/dynamic";

const TemplatesForm = dynamic(()=>import("~/components/TemplatesForm/TemplatesForm"));


const NewAttribute = () => {
    return (<TemplatesForm/>);
};

NewAttribute.requireAuthAdmin = true;
NewAttribute.dashboard = true;

export default NewAttribute;
