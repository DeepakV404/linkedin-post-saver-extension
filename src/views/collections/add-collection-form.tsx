import { useEffect, useRef } from 'react';
import { Button, Form, Input, Space } from 'antd';
import { AppBroker } from '../../query/AppBroker';

const { useForm }   =   Form;

const AddCollectionForm = (props: {isOpen: boolean, onClose: () => void, onCompleted: (collections: string[]) => void}) => {

    const { onClose, onCompleted }   =   props;  
    
    const [form]    =   useForm();
    const inputRef  =   useRef<any>(null);

    useEffect(() => {
        inputRef?.current?.focus()
    }, [])

    const onFinish = (values: {collection: string}) => {
        AppBroker.createCollection({
            collection: values.collection,
            onSuccess: (data: any) => {
                onCompleted(data)
                onClose();
            },
            onError:() => {
                onClose()
            }
        })
    }

    return (
        <Form 
            form        =   {form}
            onFinish    =   {onFinish}
            className   =   'bs-form j-bookmark-form bs-margin-top-20'
            layout      =   'vertical'
        >
            <Form.Item name={"collection"} label={<div className='bs-label-text'>Collection Name</div>} rules={[{required: true, message: "Enter a name for your collection"}]}>
                <Input size='large' ref={inputRef} placeholder='Eg: Marketing posts' autoFocus/>
            </Form.Item>
            <Space className='bs-flex-align-center' style={{justifyContent: "flex-end"}}>
                <Form.Item noStyle>
                    <Button onClick={onClose}>Cancel</Button>
                </Form.Item>
                <Form.Item noStyle>
                    <Button htmlType='submit' type='primary'>Create</Button>
                </Form.Item>
            </Space>
        </Form>
    )
}

export default AddCollectionForm