import React, { useState } from 'react';
import moment from 'moment';
import Form from 'react-bootstrap/Form';
import { Row, Col, ProgressBar, Card } from 'react-bootstrap';
import { Uploader, Alert, Button } from 'rsuite';

import { useDispatch } from 'react-redux';
import { addNewJob } from '../../../../store/reducers/upload';

import Order from '../../../../models/order';
import Payment from '../../../../models/payment';
import Service from '../../../../models/service';
import User from '../../../../models/user';

const Upload = () => {
  const dispatch = useDispatch();

  const [isFileUploading, setIsFileUploading] = useState(false);
  const [fileUploadProgress, setFileUplaodProgress] = useState(0);
  const [fileType, setFileType] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const submitHandler = async (event) => {
    event.preventDefault();
    setIsFileUploading(true);
    try {
      // const config = {
      //     onUploadProgress: function (progressEvent) {
      //         console.log(Math.round((progressEvent.loaded * 100) / progressEvent.total))
      //         setFileUplaodProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
      //     }
      // }
      uploadedFiles.forEach(async (uploadedFile, index) => {
        console.log(uploadedFile);
        const id = moment().unix() + index;
        const uploadedJSON = await readFile(uploadedFile.file.blobFile);
        const url = `db/${uploadedFile.fileType || 'orders'}`;
        const items = [];
        uploadedJSON.forEach((item) => {
          let formattedItem;
          switch (uploadedFile.fileType) {
            case 'orders':
              formattedItem = new Order(...Object.values(item));
              break;
            case 'payments':
              formattedItem = new Payment(...Object.values(item));
              break;
            case 'services':
              formattedItem = new Service(...Object.values(item));
              break;
            case 'users':
              formattedItem = new User(...Object.values(item));
              break;
            default:
              break;
          }
          // console.log(formattedItem)
          // promiseArray.push(Axios.post(postURL, formattedItem).then(result => setFileUplaodProgress(Math.round((index/uploadedJSON.length) * 100 ))));
          items.push(formattedItem);
        });
        console.log(id);
        await dispatch(
          addNewJob({
            url,
            items,
            name: uploadedFile.file.name,
            id,
            fileType: uploadedFile.fileType,
            fileTypeTR: uploadedFile.fileTypeTR
          })
        );
      });

      // dispatch(
      //   actions.upload({
      //     postURL,
      //     items,
      //   })
      // );
      // Axios.post('db/files', {
      //   name: formFields.uploadedFile.name,
      //   ext: formFields.uploadedFile.name.split('.').pop(),
      //   fileType: formFields.fileType,
      //   created: new Date,
      //   size: formFields.uploadedFile.size
      // });
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
    } catch (error) {
      console.log(error);
      // Alert.error(`Dosya Yükeleme başarısız. Hata mesajı: ${error.response.data}`, 5000);
    }

    setIsFileUploading(false);
    setFileUplaodProgress(0);
  };

  const onFileChange = (files) => {
    const convertedFileType =
      fileType === 'orders'
        ? 'Sipariş'
        : fileType === 'payments'
        ? 'Ödeme'
        : fileType === 'users'
        ? 'Kullanıcı'
        : fileType === 'services'
        ? 'Servis'
        : 'Tanımsız';
    console.log(convertedFileType);
    const selectedFiles = files.filter((file) => !file.fileType);
    // const uploadedFile = files[files.length - 1];
    selectedFiles.forEach((uploadedFile, index) => {
      if (uploadedFile.blobFile.type === 'application/json') {
        const tempUploadedFiles = uploadedFiles;
        tempUploadedFiles.push({
          file: uploadedFile,
          fileTypeTR: convertedFileType,
          fileType,
          id: moment().unix() + index,
        });
        setUploadedFiles(tempUploadedFiles);
      }
    });
  };
  const onFileRemove = (file) =>
    setUploadedFiles(
      uploadedFiles.filter((uploadedFile) => uploadedFile.id !== file.id)
    );
  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      var fr = new FileReader();
      fr.onload = () => {
        try {
          resolve(JSON.parse(fr.result));
        } catch (error) {
          reject(error);
        }
      };
      fr.readAsText(file);
    });
  };

  const FileProgress = () => {
    return (
      <>
        <ProgressBar
          now={fileUploadProgress}
          label={`${fileUploadProgress}%`}
        />
        {/* {fileUploadProgress == 100 ? <h5 className="text-center my-3">Dosya karşıya yüklendi. Kontrol ediliyor...</h5> : ""} */}
      </>
    );
  };
  return (
    <Row className="justify-content-center">
      <Col sm={12} lg={8}>
        <h3>Dosya Yükle</h3>
        <Form onSubmit={(event) => submitHandler(event)}>
          <Form.Group controlId="exampleForm.SelectCustom">
            <Form.Label>Dosya Tipi</Form.Label>
            <Form.Control
              as="select"
              custom
              defaultValue=""
              onChange={(event) => setFileType(event.target.value)}
            >
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
            disabled={fileType === ''}
            onChange={(files) => onFileChange(files)}
            // onRemove={(file) => onFileRemove(file)}
            multiple={true}
            fileList={uploadedFiles}
            removable={false}
            accept="application/json"
            renderFileInfo={(fileObject) => {
              return (
                <Card
                  style={{
                    width: '100%'
                  }}
                  onClick={() => onFileRemove(fileObject)}
                >
                  <Card.Body>
                    <span>
                      Dosya Adı: <b>{fileObject.file.name}</b>
                    </span>
                    <p>
                      Dosya Tipi: <b>{fileObject.fileTypeTR}</b>
                    </p>
                  </Card.Body>
                </Card>
              );
            }}
          >
            <Button>Dosya Seç</Button>
          </Uploader>
          <div className="d-flex justify-content-end my-3">
            <Button
              appearance="primary"
              type="submit"
              loading={isFileUploading}
            >
              Başlat
            </Button>
            {/* <Button variant="primary" type="submit">Yükle</Button> */}
          </div>
          {isFileUploading ? <FileProgress /> : null}
        </Form>
      </Col>
    </Row>
  );
};

export default Upload;
