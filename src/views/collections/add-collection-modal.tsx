import { Modal } from 'antd';
import AddCollectionForm from './add-collection-form';


const AddCollectionModal = (props: {isOpen: boolean, onClose: () => void, onCompleted: (collections: string[]) => void}) => {

    const { isOpen, onClose }    =   props;

    return (
        <Modal 
            open        =   {isOpen} 
            title       =   {"Add Collection"}
            onCancel    =   {onClose}
            footer      =   {null}
            destroyOnClose
        >
            {
                isOpen && <AddCollectionForm {...props}/>
            }
        </Modal>
    )
}

export default AddCollectionModal