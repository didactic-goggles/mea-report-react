import React, { useState } from "react";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import { Row, Col, ProgressBar } from "react-bootstrap";
import {Uploader, Alert, Button} from 'rsuite';

import Order from '../../../../models/order';
import Payment from '../../../../models/payment';
import Service from '../../../../models/service';
import User from '../../../../models/user';

const Upload = () => {
    const [isFileUploading, setIsFileUploading] = useState(false);
    const [fileUploadProgress, setFileUplaodProgress] = useState(0);
  const [formFields, setFormFields] = useState({});
  const submitHandler = async (event) => {
    event.preventDefault();
    setIsFileUploading(true);
    console.log("submit");
    console.log(formFields);
    try {
      if ('BackgroundFetchManager' in window.self) {
        console.log('supported');
      }
        // const config = {
        //     onUploadProgress: function (progressEvent) {
        //         console.log(Math.round((progressEvent.loaded * 100) / progressEvent.total))
        //         setFileUplaodProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        //     }
        // }
        const uploadedJSON = await readFile(formFields.uploadedFile);
        const postURL = `db/${formFields.fileType || "orders"}`;
        const promiseArray = [];
        uploadedJSON.map((item, index) => {
          let formattedItem;
          switch (formFields.fileType) {
            case 'orders':
              formattedItem = new Order(...Object.values(item))
              break;
            case 'payments':
                formattedItem = new Payment(...Object.values(item))
                break;
            case 'services':
              formattedItem = new Service(...Object.values(item))
              break;
            case 'users':
                formattedItem = new User(...Object.values(item))
                break;
            default:
              break;
          }
          // console.log(formattedItem)
          promiseArray.push(Axios.post(postURL, formattedItem).then(result => setFileUplaodProgress(Math.round((index/uploadedJSON.length) * 100 ))));
        });
        await Promise.all(promiseArray);
        Axios.post('db/files', {
          name: formFields.uploadedFile.name,
          ext: formFields.uploadedFile.name.split('.').pop(),
          fileType: formFields.fileType,
          created: new Date,
          size: formFields.uploadedFile.size
        });
        Alert.success('Dosya Yükleme başarılı', 5000);
        // await Axios.post(postURL, uploadedJSON[0], {
        //   headers:  { 
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json'
        //   }
        // });
        // const uploadedJSON = 
        // const uploadFormData = new FormData();
        // uploadFormData.append("file", formFields.uploadedFile);
        // uploadFormData.append("fileType", formFields.fileType || "orders");
        // const uploadFileResponse = await Axios.post("upload", uploadFormData, config);
        // if (uploadFileResponse) {
        //   Alert.success('Dosya Yükleme başarılı', 5000);
        //   // alert("successful");
        // }
    } catch ( error ) {
        console.log(error);
        // Alert.error(`Dosya Yükeleme başarısız. Hata mesajı: ${error.response.data}`, 5000);
    }

    setIsFileUploading(false);
    setFileUplaodProgress(0);
  };

  const onFileChange = (files) => {
    const uploadedFile = files[0];
    console.log(files);
    if (uploadedFile) {
      if (uploadedFile.blobFile.type == "application/json") {
        setFormFields({
          ...formFields,
          uploadedFile: uploadedFile.blobFile,
        });
      }
    }
    console.log(files);
  };

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      var fr = new FileReader();  
      fr.onload = () => {
        try {
          resolve(JSON.parse(fr.result))
        }catch(error) {
          reject(error);
        }
      };
      fr.readAsText(file);
    });
  }

  const FileProgress = () => {
    return <>
      <ProgressBar now={fileUploadProgress} label={`${fileUploadProgress}%`}/>
      {/* {fileUploadProgress == 100 ? <h5 className="text-center my-3">Dosya karşıya yüklendi. Kontrol ediliyor...</h5> : ""} */}
    </>
    
  }
  return (
    <Row className="justify-content-center">
      <Col sm={12} lg={8}>
        <h3>Dosya Yükle</h3>
        <Form onSubmit={(event) => submitHandler(event)}>
          <Form.Group controlId="exampleForm.SelectCustom">
            <Form.Label>Dosya Tipi</Form.Label>
            <Form.Control as="select" custom defaultValue="" onChange={(event) =>
              setFormFields({ ...formFields, fileType: event.target.value })
            }>
            <option disabled value="">
              Dosya tipi seç
            </option>
            <option value="orders">Sipariş</option>
            <option value="payments">Ödeme</option>
            <option value="users">Kullanıcılar</option>
            <option value="services">Servisler</option>
            </Form.Control>
          </Form.Group>
          <Uploader
            autoUpload={false}
            action=""
            onChange={(files) => onFileChange(files)}
            multiple={false}
            accept='application/json'
            // ref={ref => {
            //   this.uploader = ref;
            // }}
          ><Button>Dosya Seç</Button>
          </Uploader>
          {/* <Form.File id="custom-file" label="Sadece JSON" custom name="sampleFile" onChange={(files) => onFileChange(files)}/> */}
            <div className="d-flex justify-content-end my-3">
                <Button appearance="primary" type="submit" loading={isFileUploading}>Yükle</Button>
                {/* <Button variant="primary" type="submit">Yükle</Button> */}
            </div>
            { isFileUploading ? <FileProgress /> : null}
        </Form>
      </Col>
    </Row>
  );
};

export default Upload;
