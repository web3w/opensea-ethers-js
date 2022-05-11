import React, {useEffect, useState} from 'react';
import {Modal, Button} from 'antd';

export function CreateOrderForm(props) {
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        console.log('CreateOrderForm', props)
        setIsModalVisible(props.visible)
    }, [props])


    const handleOk = () => {
        console.log('handleOk')
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        console.log('handleCancel')
        setIsModalVisible(false);
    };

    return (
        <>
            <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
        </>
    );
};
