import React from 'react';

const Template = ({ template }) => {
    const { specificationName, specificationList } = template;
    return (
        <div>
            <h1 className="p-2">{specificationName}</h1>
            {
                specificationList.map((specification, index) => (
                    <div
                        key={index}
                        className="p-2"
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            background: "#e6ecee",
                            color: "#333333",
                            fontWeight: "bold",
                        }}
                    >
                        <p>
                            {specification.name}
                        </p>
                        <p>
                                   {specification.value}
                        </p>
                    </div>
                ))
            }

        </div>
    );
};

export default Template;