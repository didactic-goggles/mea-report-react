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
        if(row.fileType === 'services')
          content = 'Servis'
        else if(row.fileType === 'users')
          content = 'Kullanıcı'
        else if(row.fileType === 'orders')
          content = 'Sipariş'
        else if(row.fileType === 'payments')
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

  if (loading) {
    return <LoadingIndicator />;
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
