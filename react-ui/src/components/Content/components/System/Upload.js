import React, { useState } from "react";
import Axios from "axios";
import Form from "react-bootstrap/Form";
import { Row, Col, Button, ProgressBar } from "react-bootstrap";
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
          alert("successful");
        }
    } catch ( error ) {
        console.log(error);
    }

    setIsFileUploading(false);
  };

  const onFileChange = (event) => {
    const uploadedFile = event.target.files[0];

    if (uploadedFile) {
      if (uploadedFile.type == "application/json") {
        setFormFields({
          ...formFields,
          uploadedFile,
        });
      }
    }
    console.log(event.target.files);
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
          <Form.File id="custom-file" label="Sadece JSON" custom name="sampleFile" onChange={(event) => onFileChange(event)}/>
            <div className="d-flex justify-content-end my-3">
                <Button variant="primary" type="submit">Yükle</Button>
            </div>
            { isFileUploading ? <FileProgress /> : null}
        </Form>
      </Col>
    </Row>
  );
};

export default Upload;
