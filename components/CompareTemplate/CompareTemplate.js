import React, { useEffect, useState } from 'react';
const CompareTemplate = ({
    item,
    _key
}) => {
    const [list, setList] = useState({});
    useEffect(() => {
        const newKeys = { ...list };
        if (item.template.length > 0) {
            item.template.forEach((template) => {
                template.specificationList.forEach((specification) => {
                    if (!newKeys[specification.name]) {
                        newKeys[specification.name] = specification.value;
                    }
                });
            });
        }
        setList(newKeys);
    }, [item])
    return (
        <ul >

            <li>{list[_key] || "-"}</li>
        </ul>
    );
};

export default CompareTemplate;