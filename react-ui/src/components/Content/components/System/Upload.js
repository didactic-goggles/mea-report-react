import React, { useState } from "react";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import { Row, Col, ProgressBar } from "react-bootstrap";
import {Uploader, Alert, Button} from 'rsuite';
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
        const config = {
            onUploadProgress: function (progressEvent) {
                console.log(Math.round((progressEvent.loaded * 100) / progressEvent.total))
                setFileUplaodProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
            }
        }
        const uploadFormData = new FormData();
        uploadFormData.append("file", formFields.uploadedFile);
        uploadFormData.append("fileType", formFields.fileType || "orders");
        const uploadFileResponse = await Axios.post("upload", uploadFormData, config);
        if (uploadFileResponse) {
          Alert.success('Dosya Yükleme başarılı', 5000);
          // alert("successful");
        }
    } catch ( error ) {
        console.log(error);
        Alert.error(`Dosya Yükeleme başarısız. Hata mesajı: ${error.response.data}`, 5000);
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

  const FileProgress = () => {
    return <>
      <ProgressBar now={fileUploadProgress} label={`${fileUploadProgress}%`}/>
      {fileUploadProgress == 100 ? <h5 className="text-center my-3">Dosya karşıya yüklendi. Kontrol ediliyor...</h5> : ""}
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
