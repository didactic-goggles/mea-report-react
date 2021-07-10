/* eslint-disable no-extend-native */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Datatable from 'react-data-table-component';
import { Button, SelectPicker, Alert } from 'rsuite';
import DateRangePicker from '../../../UI/DateRangePicker';
import moment from 'moment';
import API from '../../../../api';
import LoadingIndicator from '../../../UI/LoadingIndicator';

const Services = () => {
  console.log('Rendering => Services');
  let history = useHistory();
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [datatableDefaultSortField, setDatatableDefaultSortField] =
    useState('n');
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [sourceSite, setSourceSite] = useState('');
  const [provider, setProvider] = useState('');
  const [serviceCalculation, setServiceCalculation] = useState(null);
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().subtract(7, 'days').unix(),
    endDate: moment().unix(),
  });
  const [visibleColumns, setVisibleColumns] = useState([
    {
      name: 'ID',
      selector: 'id',
      sortable: true,
      width: '80px',
      cell: (row) => {
        return <div>{row.id.split('-')[1]}</div>;
      },
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
    const activeReportItem = await API.get('/db/reports?t=Service');
    if (activeReportItem[0])
      await API.delete(`/db/reports/${activeReportItem[0].id}`);
    const newReportItem = await API.post('/db/reports', {
      t: 'Service',
      c: moment().unix(),
      src: sourceSite,
      sd: selectedDate.startDate,
      ed: selectedDate.endDate,
    });
    setServiceCalculation(newReportItem);
  };

  useEffect(() => {
    const getServices = async () => {
      setLoading(true);
      let url = '/db/services';
      if (sourceSite && sourceSite !== '') {
        url += `?src=${sourceSite}&`;
      } else {
        setServiceCalculation(null);
        // back to old columns 
        setVisibleColumns(visibleColumns.slice(0,3));
      }
      if (provider && provider !== '') {
        url += `?prv=${provider}`;
      }
      const getServicesResponse = await API.get(url);
      setServices(getServicesResponse);
      const activeReportItem = await API.get(
        `/db/reports?t=Service&src=${sourceSite}`
      );
      if (activeReportItem) setServiceCalculation(activeReportItem[0]);
      setLoading(false);
    };
    getServices();
  }, [sourceSite, provider]);

  // useEffect(() => {
  //   const getServices = async () => {
  //     setLoading(true);
  //     const getServicesResponse = await API.get(`/db/services`);
  //     setServices(getServicesResponse);
  //     setLoading(false);
  //   };
  //   getServices();
  // }, []);

  useEffect(() => {
    const tempProviders = [];
    if (services.length > 0) {
      services.forEach(
        (s) => !tempProviders.includes(s.prv) && tempProviders.push(s.prv)
      );
    }
    setProviders(tempProviders);
  }, [services]);

  useEffect(() => {
    if (serviceCalculation && visibleColumns.length === 3) {
      setVisibleColumns((activeColumns) => [
        ...activeColumns,
        {
          name: 'Toplam Sipariş',
          selector: 'q',
          sortable: true,
          maxWidth: '100px',
        },
        {
          name: 'Toplam Tutar',
          selector: 'chg',
          sortable: true,
          maxWidth: '100px',
        },
        {
          name: 'Toplam Kazanç',
          selector: 'cost',
          sortable: true,
          maxWidth: '100px',
        },
      ]);
      setDatatableDefaultSortField('q');
    }
  }, [serviceCalculation, visibleColumns.length]);

  const calculateServicesStats = async () => {
    setButtonLoading(true);
    try {
      if (!sourceSite || sourceSite === '') {
        throw new Error('Lütfen kaynak seç');
      }
      if (!selectedDate.startDate || !selectedDate.endDate) {
        throw new Error('Geçersiz tarih');
      }
      const allOrders = await API.get(
        `/db/orders?d_gte=${selectedDate.startDate}&d_lte=${selectedDate.endDate}`
      );
      if (!allOrders || allOrders.length === 0) {
        throw new Error('Sipariş bulunamadı');
      }
      if (allOrders.length > 0) {
        const calculatedServices = {};
        allOrders.forEach((o) => {
          const serviceIndex = o.sid;
          if (calculatedServices[serviceIndex]) {
            calculatedServices[serviceIndex].q += 1;
            calculatedServices[serviceIndex].chg += o.chg;
            calculatedServices[serviceIndex].cost += o.cost;
          } else {
            calculatedServices[serviceIndex] = {};
            calculatedServices[serviceIndex].q = 1;
            calculatedServices[serviceIndex].chg = o.chg;
            calculatedServices[serviceIndex].cost = o.cost;
          }
        });
        const promisesArray = [];
        const updateService = async (serviceId, serviceData) => {
          // console.log(serviceId, serviceData);
          serviceData.chg = serviceData.chg.round(3);
          serviceData.cost = serviceData.cost.round(3);
          await API.patch(
            `/db/services/${serviceId}`,
            serviceData
          );
        };
        Object.keys(calculatedServices).forEach((serviceId) => {
          promisesArray.push(
            updateService(serviceId, calculatedServices[serviceId])
          );
        });
        await Promise.all(promisesArray);
        const getServicesResponse = await API.get(`/db/services`);
        await setReportItem();
        setServices(getServicesResponse);
      }
    } catch (error) {
      Alert.error(error.message, 3000);
    }
    setButtonLoading(false);
  };

  if (loading) return <LoadingIndicator />;

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="mb-3 card card-body">
            <div className="row">
              <div className="col-6">
                <SelectPicker
                  data={[
                    { label: 'Measmm', value: 'measmm' },
                    { label: 'Sosyalbayiniz', value: 'sb' },
                  ]}
                  style={{ width: 300 }}
                  value={sourceSite}
                  onChange={(sourceSiteValue) => setSourceSite(sourceSiteValue)}
                  placeholder="Kaynak seç"
                  className="mb-2"
                />
                <SelectPicker
                  data={providers.map((p) => ({ label: p, value: p }))}
                  style={{ width: 300 }}
                  value={provider}
                  onChange={(providerValue) => setProvider(providerValue)}
                  placeholder="Sağlayıcı seç"
                  className="mb-2"
                />
              </div>
              <div className="col-6 text-right d-flex flex-column align-items-end">
                <DateRangePicker
                  selectedDateHandler={setSelectedDate}
                  selectedDate={selectedDate}
                  style={{ width: 230 }}
                  placement="bottomEnd"
                  className="mb-2"
                />
                <Button
                  appearance="primary"
                  loading={buttonLoading}
                  onClick={calculateServicesStats}
                >
                  Servis Toplam Verileri Hesapla
                </Button>
              </div>
            </div>
            {serviceCalculation && (
              <div className="d-flex justify-content-end flex-column align-items-end">
                <span className="text-muted">
                  Son hesaplanma zamanı:{' '}
                  {moment(serviceCalculation.c * 1000).format(
                    'DD/MM/YYYY HH:mm:ss'
                  )}
                </span>
                <span className="text-muted">
                  Şu kaynak için: {serviceCalculation.src}
                </span>
                <span className="text-muted">
                  Şu aralıkta:{' '}
                  {moment(serviceCalculation.sd * 1000).format('DD/MM/YYYY')} -
                  {moment(serviceCalculation.ed * 1000).format('DD/MM/YYYY')}
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

Number.prototype.round = function (places) {
  return +(Math.round(this + 'e+' + places) + 'e-' + places);
};
