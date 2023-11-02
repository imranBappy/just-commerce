import React, { useEffect, useState } from 'react';
import useSWR from "swr";
import { fetchData, postData } from '~/lib/clientFunctions';
import SpecificationForm from './SpecificationForm';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';


const TemplatesForm = ({templateData}) => {
    const router = useRouter();
    const url = `/api/templates/create`;
    const editUrl = `/api/templates/edit?id=${router.query.id}`;

    const { data, error } = useSWR(url, fetchData);

    const [inputList, setInputList] = useState([
        {
            specificationName: "",
            specificationList: [""]
        }
    ]);
    const [category, setCategory] = useState("");

    const { t } = useTranslation();
   

    const handleAddSpecClick = () => {
        setInputList([...inputList, {
            specificationName: "",
            specificationList: [ "" ]
        }
        ]);
    };



    useEffect(() => { 
        if (templateData?.templates) {
            setCategory(templateData?.category)
        }
        if (templateData?.templates) {
            setInputList(templateData.templates)
        }
    },[templateData])

    const submitHandler = async (e) => {
        e.preventDefault();

        // check duplicate specificationName
        const specName = inputList.map(spec => spec.specificationName);
        const duplicate = specName.some((val, i) => specName.indexOf(val) !== i);

        if (duplicate) {
            toast.error("Duplicate Specification Name");
            return;
        }
        
        // check duplicate specificationList item
        for (let i = 0; i < inputList.length; i++) {
            const element = inputList[i];
            const specList = element.specificationList;
            const duplicate = specList.some((val, i) => specList.indexOf(val) !== i);
            if (duplicate) {
                toast.error("Duplicate Specification List Item");
                return;
            }
        }    
    
        
        try {
            const newTemplate = {
                category,
                templates: inputList
            }

            if (router.query.id) {
                newTemplate.id = router.query.id;
                const response = await postData(editUrl, newTemplate);
                response.success
                    ? (toast.success("Attribute Updated Successfully"))
                    : toast.error("Something Went Wrong");
                return;
                
            }
            const response = await postData("/api/templates/create", newTemplate);
            response.success
                ? (toast.success("Attribute Added Successfully"))
                : toast.error("Something Went Wrong");
        } catch (err) {
            console.log(err);
            toast.error("Something Went Wrong");
        }
    };


    
    return (
        <>
            <h4 className="text-center pt-3 pb-5">{t(router.query.id ? "Update Template" : "Create New Template")}</h4>
            <form id="attr_form" onSubmit={submitHandler}>
                    <div className="mb-4 ">
                        <div>
                            <label htmlFor="inp-type" className="form-label">
                                {t("Product Type")}*
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
                                    {t("Select Product Type")}
                                </option>
                                {
                                    data?.category?.map(category => <option value={category._id}>{ category.name}</option>)
                                }
                            </select>
                        </div>
                    </div>
                {
                    inputList.map((x, i) => {
                        return (
                            <SpecificationForm
                                setInputList={setInputList}
                                key={i}
                                inputList={x}
                                index={i}
                            />
                        )
                    })
                }


                <div className="my-4">
                    <input
                        onClick={handleAddSpecClick}
                        type="button"
                        value={t("Add Specification")}
                        className="btn btn-lg btn-success"
                    />
                </div>

                <div className="my-4">
                    <input
                        type="submit"
                        value={t(router.query.id ? "Update Template" : "Add Template")}
                        className="btn btn-lg btn-success"
                    />
                </div>
            </form>
        </>
    );
};

export default TemplatesForm;