

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
const TemplatesForm = dynamic(()=>import("~/components/TemplatesForm/TemplatesForm"));
import useSWR from "swr";
import { fetchData } from "~/lib/clientFunctions";

const EditTemplate = () => {
    const router = useRouter();
    const [templateData, setTemplateData] = React.useState({});   
    
    const url = `/api/templates/edit?id=${router.query.id}`;
    const { data, error } = useSWR(router.query.id ? url : null, fetchData);
    React.useEffect(() => { 
        if (data) {
            setTemplateData(data.template)
        }
    }
    ,[data])

    return (
        <TemplatesForm templateData={templateData} />
    );
};

EditTemplate.requireAuthAdmin = true;
EditTemplate.dashboard = true;
export default EditTemplate;