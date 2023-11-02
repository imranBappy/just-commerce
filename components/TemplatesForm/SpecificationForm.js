import React from 'react';
import { useTranslation } from 'react-i18next';
import classes from "~/components/ProductForm/productForm.module.css";

const SpecificationForm = ({ inputList, setInputList, index }) => {

    const { specificationList, specificationName } = inputList;
    const { t } = useTranslation();

    const handleAddClick = () => {
        setInputList((preState) => {
            const currState = [...preState][index];
            currState.specificationList.push("");
            preState[index] = currState;
            return [...preState];
        });
    }

    const handleRemoveClick = (removeIndex) => {
        setInputList((preState) => {
            const currState = [...preState][index];
            currState.specificationList.splice(removeIndex, 1);
            preState[index] = currState;
            return [...preState];
        });
    }


    const handleInputChange = (evt, i) => {
        setInputList((preState) => {
            const currState = [...preState][index];
            const { value } = evt.target;
            currState.specificationList[i] = value;
            preState[index] = currState;
            return [...preState];
        });
    }

    const handleSpecificationNameChange = (evt) => {
        setInputList((preState) => {
            const currState = [...preState][index];
            const { value } = evt.target;
            currState.specificationName = value;
            preState[index] = currState;
            return [...preState];
        });
    }


    const handleSpecificationRemoveClick = () => { 
        setInputList((preState) => {
            const currState = [...preState];
            currState.splice(index, 1)
            return [...currState];
        });

    }




    return (
        <div className="card mb-3"
        >
            <div className="card-header ">
                <div style={{
                    display: 'flex',
                    justifyContent:'space-between'
                }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {t("Attribute Value")}
                    </div>
                    <div >
                        <button
                            className="btn btn-danger"
                            type="button"
                            onClick={handleSpecificationRemoveClick}
                        >
                            {t("Specification Remove")}
                        </button>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div className="mb-4  col-5 ">
                    <label htmlFor="inp-1" className="form-label">
                        {t("Specification Name")}*
                    </label>
                    <input
                        type="text"
                        id="inp-1"
                        className={classes.input + " form-control"}
                        required
                        value={specificationName}
                        onChange={handleSpecificationNameChange}
                    />
                </div>
                {specificationList.map((x, i) => {
                    return (
                        <div className="row mb-4" key={i}>
                            <div className="col-12 col-sm-5">
                                <label className="form-label">{t("name")}</label>
                                <input
                                    type="text"
                                    className={classes.input + " form-control"}
                                    name="name"
                                    value={x}
                                    onChange={(evt) => handleInputChange(evt, i)}
                                    required
                                />
                            </div>
                            <div className="col-12 col-sm-2 d-flex align-items-end">
                                <button
                                    className="btn btn-danger"
                                    type="button"
                                    onClick={() => handleRemoveClick(i)}
                                >
                                    {t("Remove")}
                                </button>
                            </div>
                        </div>
                    );
                })}
                <button
                    type="button"
                    className="btn btn-success my-2"
                    onClick={handleAddClick}
                >
                    {t("Add Value")}
                </button>
            </div>

        </div>
    );
};

export default SpecificationForm;