import React, { useState } from 'react';
import moment from 'moment';
import { Row, Col, ProgressBar, Card } from 'react-bootstrap';
import { Uploader, Alert, Button, SelectPicker } from 'rsuite';

import API from '../../../../api';
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
  const [fileSource, setFileSource] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      // const config = {
      //     onUploadProgress: function (progressEvent) {
      //         console.log(Math.round((progressEvent.loaded * 100) / progressEvent.total))
      //         setFileUplaodProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
      //     }
      // }
      if (uploadedFiles.length === 0) {
        Alert.error('Lütfen dosya seç', 3000);
        return;
      }
      setIsFileUploading(true);
      const services = [];
      const users = [];
      uploadedFiles.forEach(async (uploadedFile, index) => {
        const fileId = moment().unix() + 1;
        let firstItemDate, lastItemDate;
        // console.log(uploadedFile);
        const id = moment().unix() + index;
        const uploadedJSON = await readFile(uploadedFile.file.blobFile);
        const url = `db/${uploadedFile.fileType || 'orders'}`;
        const items = [];
        uploadedJSON.forEach((item, i) => {
          let formattedItem;
          switch (uploadedFile.fileType) {
            case 'orders': {
              item.fileId = fileId;
              formattedItem = new Order(item, fileSource);
              if (i === 0) {
                firstItemDate = formattedItem.d;
              }
              if (i === uploadedJSON.length - 1) {
                lastItemDate = formattedItem.d;
              }
              const serviceItem = new Service({
                id: `${fileSource}-${item.service_id}`,
                name: item.service_name,
                provider: item.Provider,
                src: fileSource,
              });
              services.push(serviceItem);
              const userItem = new User({
                id: `${fileSource}-${item.user}`,
                name: item.user,
                src: fileSource,
              });
              users.push(userItem);
              break;
            }
            case 'payments': {
              formattedItem = new Payment(item, fileSource);
              break;
              // case 'services':
              //   formattedItem = new Service(...Object.values(item));
              //   break;
            }
            // case 'users': {
            //   formattedItem = new User(item);
            //   break;
            // }
            default: {
              break;
            }
          }
          items.push(formattedItem);
        });
        API.post('db/files', {
          id: fileId,
          n: uploadedFile.file.name,
          e: uploadedFile.file.name.split('.').pop(),
          ft: uploadedFile.fileType,
          c: new Date(),
          s: uploadedFile.file.blobFile.size,
          fi: firstItemDate,
          li: lastItemDate,
        });
        await dispatch(
          addNewJob({
            url,
            items,
            name: uploadedFile.file.name,
            id,
            fileType: uploadedFile.fileType,
            fileTypeTR: uploadedFile.fileTypeTR,
          })
        );
        if (services.length > 0) {
          await dispatch(
            addNewJob({
              url: `db/services`,
              items: services.filter(
                (v, i, a) => a.findIndex((t) => t.id === v.id) === i
              ),
              name: 'services',
              id: id + 1,
              fileType: 'services',
              fileTypeTR: 'Siparişler',
            })
          );
        }
        if (users.length > 0) {
          await dispatch(
            addNewJob({
              url: `db/users`,
              items: users.filter(
                (v, i, a) => a.findIndex((t) => t.u === v.u) === i
              ),
              name: 'users',
              id: id + 2,
              fileType: 'users',
              fileTypeTR: 'Kullanıcılar',
            })
          );
        }
      });

      Alert.success('Dosya Yükleme başarılı', 5000);
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
        : // : fileType === 'users'
          // ? 'Kullanıcı'
          // : fileType === 'services'
          // ? 'Servis'
          'Tanımsız';
    // console.log(convertedFileType);
    // console.log(files);
    const selectedFiles = files.filter((file) => !file.fileType);
    // const uploadedFile = files[files.length - 1];
    // console.log(selectedFiles);
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
        <form onSubmit={(event) => submitHandler(event)} className="py-3">
          <SelectPicker
            placeholder="Dosya tipi seç"
            searchable={false}
            data={[
              { label: 'Sipariş', value: 'orders' },
              { label: 'Ödeme', value: 'payments' },
            ]}
            onChange={(event) => setFileType(event)}
            block
            className="mb-3"
          />
          <SelectPicker
            placeholder="Dosya kaynağı seç"
            searchable={false}
            data={[
              { label: 'Measmm', value: 'measmm' },
              { label: 'Sosyalbayiniz', value: 'sb' },
            ]}
            onChange={(event) => setFileSource(event)}
            block
            className="mb-3"
          />
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
                    width: '100%',
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
        </form>
      </Col>
    </Row>
  );
};

export default Upload;
