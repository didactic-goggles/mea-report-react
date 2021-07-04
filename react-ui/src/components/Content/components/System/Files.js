import React, { useEffect, useState } from "react";
import Datatable from "react-data-table-component";
import API from "../../../../api";
import LoadingIndicator from "../../../UI/LoadingIndicator";

const Files = () => {
  console.log("Rendering => Files");
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);

  const getFiles = async () => {
    const getFilesResponse = await API.get(`/db/files`);
    setFiles(getFilesResponse);
  };

  const columns = [
    {
      name: "ID",
      selector: "id",
      sortable: true,
      width: "80px",
    },
    {
      name: "Servis Adı",
      selector: "n",
      sortable: true,
      cell: row => {
      return <div>{row.n}</div>
      }
    },
    {
      name: "Tür",
      selector: 'fileType',
      sortable: true,
      maxWidth: '100px',
      cell: row => {
        let content;
        if(row.ft === 'services')
          content = 'Servis'
        else if(row.ft === 'users')
          content = 'Kullanıcı'
        else if(row.ft === 'orders')
          content = 'Sipariş'
        else if(row.ft === 'payments')
          content = 'Ödeme'
      return <span>{content}</span>
      }
    },
    {
      name: "Uzantı",
      selector: "e",
      sortable: true,
      maxWidth: '100px'
    },
    {
      name: "Yükl. Tarihi",
      selector: "c",
      sortable: true,
      maxWidth: '200px'
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
                  />
                </div>
              </div>
            </div>
          </div>
    </>
  );
};

export default Files;
