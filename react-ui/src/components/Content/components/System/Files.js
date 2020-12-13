import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import Datatable from "react-data-table-component";
import Axios from "axios";


const Files = () => {
  console.log("Rendering => Files");
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const getFiles = async () => {
    const getFilesResponse = await Axios.get(`/db/files`);
    console.log(getFilesResponse.data);
    setFiles(getFilesResponse.data);
  };

  const columns = React.useMemo(() => [
    {
      name: "ID",
      selector: "id",
      sortable: true,
      width: "80px",
    },
    {
      name: "Servis Adı",
      selector: "name",
      sortable: true,
      cell: row => {
      return <div>{row.name}</div>
      }
    },
    {
      name: "Tür",
      selector: 'fileType',
      sortable: true,
      maxWidth: '100px',
      cell: row => {
        let content;
        if(row.fileType == 'services')
          content = 'Servis'
        else if(row.fileType == 'users')
          content = 'Kullanıcı'
        else if(row.fileType == 'orders')
          content = 'Sipariş'
        else if(row.fileType == 'payments')
          content = 'Ödeme'
      return <span>{content}</span>
      }
    },
    {
      name: "Uzantı",
      selector: "ext",
      sortable: true,
      maxWidth: '100px'
    },
    {
      name: "Yükl. Tarihi",
      selector: "created",
      sortable: true,
      maxWidth: '200px'
    },
  ]);

  useEffect(() => {
    setLoading(true);
    const getter = async () => {
      await getFiles();
      setLoading(false);
    };
    getter();
  }, []);

  const loadingComponent = (
    <div
      className="d-flex align-items-center w-100 justify-content-center mt-auto"
      style={{ height: "100%" }}
    >
      <Spinner animation="border" role="status" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
      <h3 className="ml-2">Loading</h3>
    </div>
  );

  if (loading) {
    return loadingComponent;
  }
  return (
    <>
          <div class="row">
            <div class="col-lg-12">
              <div class="mb-3 card">
                <div class="card-body">
                  <Datatable
                    title="Dosyalar"
                    columns={columns}
                    data={files}
                    pagination
                    responsive={true}
                    striped={true}
                    highlightOnHover={true}
                  />
                </div>
              </div>
            </div>
          </div>
    </>
  );
};

export default Files;
