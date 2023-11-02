import React from 'react';

const TemplateItem = ({index, templateState}) => {
    const [templateList, setTemplateList] = templateState;
    const template = templateList[index];
    const { specificationName, specificationList } = template;

    const handleInput = (e) => { 
        setTemplateList((preState) => {
            const newState = [...preState];
            const currentTemplate = newState[index];
            const currentSpecIndex = currentTemplate.specificationList.findIndex(spec => spec.name === e.target.name);
            const currentSpec = currentTemplate.specificationList[currentSpecIndex];
            currentSpec.value = e.target.value;
            return newState;
        })
    }

    return (
        <div>
            <h6 className="mb-3 pb-2 border-bottom">{specificationName}</h6>
            {
                specificationList?.map((spec, i) => (
                    <div key={`key_${i}`} className="d-flex mb-2">
                        <p className="mr-2 mb-0 col-2">{spec.name}</p>
                        <textarea
                            onChange={handleInput}
                            value={spec.value}
                            name={spec.name}
                            placeholder={spec.name}
                            id={`inp-${i}`}
                            className="form-control"
                        />
                    </div>
                ))
            }
        </div>
    );
};

export default TemplateItem;