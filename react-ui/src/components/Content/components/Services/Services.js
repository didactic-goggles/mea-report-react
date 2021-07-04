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
  const [datatableDefaultSortField, setDatatableDefaultSortField] = useState('n');
  const [services, setServices] = useState([]);
  const [serviceCalculation, setServiceCalculation] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState([
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
  ]);

  const setReportItem = async () => {
    // check if there is an item and delete
    const activeReportItem = await API.get('/db/reports?type=Service');
    if (activeReportItem[0]) await API.delete(`/db/reports/${activeReportItem[0].id}`);
    const newReportItem = await API.post('/db/reports', {
      type: 'Service',
      created: moment().unix()
    });
    setServiceCalculation(newReportItem);
  }

  useEffect(() => {
    const getServices = async () => {
      setLoading(true);
      const getServicesResponse = await API.get(`/db/services`);
      setServices(getServicesResponse);
      const activeReportItem = await API.get('/db/reports?type=Service');
      if (activeReportItem) setServiceCalculation(activeReportItem[0]);
      setLoading(false);
    };
    getServices();
  }, []);

  useEffect(() => {
    if (serviceCalculation && visibleColumns.length === 3) {
      setVisibleColumns(activeColumns => ([...activeColumns, {
        name: 'Toplam Sipariş',
        selector: 'q',
        sortable: true,
        maxWidth: '100px',
      },    {
        name: 'Toplam Tutar',
        selector: 'chg',
        sortable: true,
        maxWidth: '100px',
      },    {
        name: 'Toplam Kazanç',
        selector: 'cost',
        sortable: true,
        maxWidth: '100px',
      }]));
      setDatatableDefaultSortField('q');
    }
  }, [serviceCalculation, visibleColumns.length]);

  const calculateServicesStats = async () => {
    setButtonLoading(true);
    const allOrders = await API.get('/db/orders');
    if (allOrders.length > 0) {
      const calculatedServices = {};
      allOrders.forEach(o => {
        if(calculatedServices[o.sid]) {
          calculatedServices[o.sid].q += 1;
          calculatedServices[o.sid].chg += o.chg;
          calculatedServices[o.sid].cost += o.cost;

        } else {
          calculatedServices[o.sid] = {};
          calculatedServices[o.sid].q = 1;
          calculatedServices[o.sid].chg = o.chg;
          calculatedServices[o.sid].cost = o.cost;
        }
      });
      const promisesArray = [];
      const updateService = async (serviceId, serviceData) => {
        const updateServiceResponse = await API.patch(`/db/services/${serviceId}`, serviceData);
        console.log(updateServiceResponse);
      }
      Object.keys(calculatedServices).forEach(serviceId => {
        promisesArray.push(updateService(serviceId, calculatedServices[serviceId]));
      });
      await Promise.all(promisesArray);
      const getServicesResponse = await API.get(`/db/services`);
      await setReportItem();
      setServices(getServicesResponse);
    }
    setButtonLoading(false);
  } 

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
                onClick={calculateServicesStats}
              >
                Servis Kullanımlarını Hesapla
              </Button>
            </div>
            {serviceCalculation && (
              <div className="d-flex justify-content-end">
                <span className="text-muted">
                  Son hesaplanma zamanı:{' '}
                  {moment(serviceCalculation.created * 1000).format('DD/MM/YYYY')}
                </span>
              </div>
            )}
            <Datatable
              title="Servisler"
              columns={visibleColumns}
              data={services}
              pagination
              responsive={true}
              striped={true}
              highlightOnHover={true}
              pointerOnHover={true}
              defaultSortField={datatableDefaultSortField}
              defaultSortAsc={false}
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
