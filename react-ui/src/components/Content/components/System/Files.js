import React, { useEffect, useState } from 'react';
import { IconButton, Icon } from 'rsuite';
import { useDispatch } from 'react-redux';
// import { addNewJob } from '../../../../store/reducers/upload';
import Datatable from 'react-data-table-component';
import moment from 'moment';
import API from '../../../../api';
import LoadingIndicator from '../../../UI/LoadingIndicator';

const Files = () => {
  console.log('Rendering => Files');
  // const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);

  const getFiles = async () => {
    const getFilesResponse = await API.get(`/db/files`);
    setFiles(getFilesResponse);
  };

  const handleFileClick = async (fileId) => {
    // const getAllOrdersFromFile = await API.get(`/db/orders?f=${id}`);
    await API.delete(`/db/files/${fileId}`);
    await API.delete(`/multiple/ordersCollection/${fileId}`);
    getFiles();
    // dispatch(
    //   addNewJob({
    //     url: '/db/orders',
    //     items: getAllOrdersFromFile,
    //     name: 'Siliniyor...',
    //     id,
    //     fileType: 'orders',
    //     fileTypeTR: 'Siparişler',
    //     method: 'delete',
    //   })
    // ).then(async () => {
    //   API.delete(`/db/files/${id}`);
    // });
  };

  const columns = [
    {
      name: 'ID',
      selector: 'id',
      sortable: true,
      width: '80px',
    },
    {
      name: 'Servis Adı',
      selector: 'n',
      sortable: true,
      cell: (row) => {
        return <div>{row.n}</div>;
      },
    },
    {
      name: 'Tür',
      selector: 'fileType',
      sortable: true,
      maxWidth: '100px',
      cell: (row) => {
        let content;
        if (row.ft === 'services') content = 'Servis';
        else if (row.ft === 'users') content = 'Kullanıcı';
        else if (row.ft === 'orders') content = 'Sipariş';
        else if (row.ft === 'payments') content = 'Ödeme';
        return <span>{content}</span>;
      },
    },
    {
      name: 'Uzantı',
      selector: 'e',
      sortable: true,
      maxWidth: '80px',
    },
    {
      name: 'Yükl. Tarihi',
      selector: 'c',
      sortable: true,
      maxWidth: '150px',
      cell: (row) => <span>{moment(row.c).format('DD/MM/YYYY HH:mm:ss')}</span>,
    },
    {
      name: 'İlk Öğe Tarihi',
      selector: 'fi',
      sortable: true,
      maxWidth: '150px',
      cell: (row) => (
        <span>{moment(row.fi * 1000).format('DD/MM/YYYY HH:mm:ss')}</span>
      ),
    },
    {
      name: 'Son Öğe Tarihi',
      selector: 'li',
      sortable: true,
      maxWidth: '200px',
      cell: (row) => (
        <span>{moment(row.li * 1000).format('DD/MM/YYYY HH:mm:ss')}</span>
      ),
    },
    {
      name: '',
      sortable: false,
      maxWidth: '30px',
      cell: (row) => (
        <IconButton
          icon={<Icon icon="trash2" />}
          color="red"
          appearance="link"
          onClick={() => handleFileClick(row.id)}
        />
      ),
    },
  ];

  useEffect(() => {
    setLoading(true);
    const getter = async () => {
      await getFiles();
      setLoading(false);
    };
    getter();
  }, []);

  if (loading) {
    return <LoadingIndicator />;
  }
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="mb-3 card">
            <div className="card-body">
              <Datatable
                title="Dosyalar"
                columns={columns}
                data={files}
                pagination
                responsive={true}
                striped={true}
                highlightOnHover={true}
                pointerOnHover={true}
                defaultSortAsc={false}
                paginationRowsPerPageOptions={[10, 20, 50, 100]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Files;
