import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Datatable from 'react-data-table-component';
import { Button } from 'rsuite';
import moment from 'moment';
import API from '../../../../api';
import LoadingIndicator from '../../../UI/LoadingIndicator';

const Services = () => {
  console.log('Rendering => Services');
  let history = useHistory();
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [serviceCalculation, setServiceCalculation] = useState(null);
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
        return <div data-tag="allowRowEvents">{row.n}</div>;
      },
    },
    {
      name: 'Sağlayıcı',
      selector: 'prv',
      sortable: true,
      maxWidth: '250px',
    },
  ];

  useEffect(() => {
    const getServices = async () => {
      setLoading(true);
      const getServicesResponse = await API.get(`/db/services`);
      setServices(getServicesResponse);
      setLoading(false);
    };
    getServices();
  }, []);

  if (loading) return <LoadingIndicator />;

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="mb-3 card card-body">
            <div className="d-flex justify-content-end mb-2">
              <Button
                appearance="primary"
                loading={buttonLoading}
                onClick={() => {
                  setButtonLoading(true);
                  setTimeout(() => {
                    setButtonLoading(false);
                  }, 1500);
                }}
              >
                Servis Kullanımlarını Hesapla
              </Button>
            </div>
            {serviceCalculation && (
              <div className="d-flex justify-content-end">
                <span class="text-muted">
                  Son hesaplanma zamanı:{' '}
                  {moment(serviceCalculation.c * 1000).format('DD/MM/YYYY')}
                </span>
              </div>
            )}
            <Datatable
              title="Servisler"
              columns={columns}
              data={services}
              pagination
              responsive={true}
              striped={true}
              highlightOnHover={true}
              pointerOnHover={true}
              onRowClicked={(event) => {
                history.push(`/service/${event.id}`);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
