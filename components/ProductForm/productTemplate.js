import axios from 'axios';
import React, { use, useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import TemplateItem from './templateItem';
const ProductTemplate = ({templateListState, isEdit}) => {
    const [allCategories, setAllCategories] = useState([]);
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);
    const [templateList, setTemplateList] = templateListState;

console.log({templateList});
    const { t } = useTranslation();


    useEffect(() => {
        axios.get("/api/templates/create").then((res) => {
            setAllCategories(res.data.category);
        });
    }, []);




    useEffect(() => {
        if (category) {
            setLoading(true);
            axios.get(`/api/templates?id=${category}`).then((res) => {
                const templates = res.data.templates;
                if (templates.length > 0) {
                    const inputTemplates = templates.map(template => ({
                        specificationName: template.specificationName,
                        specificationList: template.specificationList.map(spec => ({
                            name: spec,
                            value: ""
                        }))
                    }))
                    setTemplateList(inputTemplates)
                }
                setLoading(false);
            });
        }

    }, [category]);



  

    return (
        loading ? <h6  className='card p-5 border-0 shadow'>Loadding...</h6> :
            <div className="card mb-5 border-0 shadow">
                <div className="card-header bg-white py-3 fw-bold">
                    {t("Template")}
                </div>
                {!isEdit &&<div className="my-4 mx-2 ">
                    <div>
                        <label htmlFor="inp-type" className="form-label">
                            {t("Template Type")}*
                        </label>
                        <select
                            id="inp-type"
                            // ref={product_type}
                            className="form-control"
                            required
                            onChange={(e) => setCategory(e.target.value)}
                            defaultValue={category}
                            value={category}
                        >
                            <option value="" disabled>
                                {t("Template Type")}
                            </option>
                            {
                                allCategories?.map((category, index) => <option   key={`key_${index}`} value={category._id}>{category.name}</option>)
                            }
                        </select>
                    </div>
                </div>
                
                }
                
                <div className="p-3">
                    {
                        templateList?.map((template, index) => <TemplateItem
                            key={`key_${index}`}
                            templateState={[templateList, setTemplateList]}
                            index={index}
                             />)
                    }
                </div>
            </div>
    );
};

export default ProductTemplate;