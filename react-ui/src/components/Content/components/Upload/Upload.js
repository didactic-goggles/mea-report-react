import React, {useState} from 'react';
import Axios from 'axios';

const Upload = () => {
    const [formFields, setFormFields] = useState({})
    const submitHandler = async (event) => {
        event.preventDefault();
        console.log('submit');
        console.log(formFields);
        const uploadFormData = new FormData();
        uploadFormData.append('file', formFields.uploadedFile);
        uploadFormData.append('fileType', formFields.fileType || 'orders');
        const uploadFileResponse = await Axios.post('upload', uploadFormData);
        if(uploadFileResponse) {
            alert('successful');
        }
    }

    const onFileChange = event => {
        const uploadedFile = event.target.files[0];

        if(uploadedFile) {
            if(uploadedFile.type == 'application/json') {
                setFormFields({
                    ...formFields,
                    uploadedFile
                })
            }
        }
        console.log(event.target.files);

    }
    return (
        <form onSubmit={(event) => submitHandler(event)}>
            <label>Dosya Yükle</label>
            <select onChange={event => setFormFields({...formFields, fileType: event.target.value})}>
                <option selected disabled>Dosya tipi seç</option>
                <option value="orders">Sipariş</option>
                <option value="payments">Ödeme</option>
                <option value="users">Kullanıcılar</option>
                <option value="services">Servisler</option>
            </select>
            <input type="file" name="sampleFile" onChange={(event) => onFileChange(event)}/>
            <button>Yükle</button>
        </form>
    )
}

export default Upload
