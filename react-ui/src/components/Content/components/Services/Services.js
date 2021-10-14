/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-extend-native */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Datatable from 'react-data-table-component';
import { Button, SelectPicker, Alert } from 'rsuite';
import moment from 'moment';
import { SocialIcon } from 'react-social-icons';
import DateRangePicker from '../../../UI/DateRangePicker';
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
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [sourceSite, setSourceSite] = useState('');
  const [provider, setProvider] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [category, setCategory] = useState(null);
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
        return <div data-tag="allowRowEvents">{row.id.split('-')[1]}</div>;
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
      name: 'Kategori',
      selector: 'c',
      width: '200px',
      sortable: true,
      cell: (row) => {
        return (
          <div>
            {row.c && row.c.i && (
              <SocialIcon
                network={row.c.i}
                className="mr-2"
                style={{
                  width: 25,
                  height: 25,
                }}
              />
            )}
            {(row.c && row.c.n) || 'Tanımlı değil'}
          </div>
        );
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

  const getCategories = async () => {
    const getCategoriesResponse = await API.get('/db/categories');
    setCategories(getCategoriesResponse);
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    const getServices = async () => {
      setLoading(true);
      // const categories = await API.get('/db/categories');
      const categoriesArray = await API.get('/db/categories');
      let url = '/db/services?';
      console.log (selectedService)
      if (!selectedService) {
        if (sourceSite && sourceSite !== '') {
          url += `src=${sourceSite}&`;
        } else {
          setServiceCalculation(null);
          // back to old columns
          setVisibleColumns(visibleColumns.slice(0, 4));
        }
        if (provider && provider !== '') {
          url += `prv=${provider}&`;
        }
        if (category && category !== '') {
          url += `c=${category}`;
        }
      } else {
        console.log(selectedService);
        url = `/db/services?id_like=${selectedService}`;
      }
      const getServicesResponse = await API.get(url);
      console.log(categories);
      getServicesResponse.forEach((service) => {
        const categoryIndex = categoriesArray.findIndex(
          (c) => c.id === service.c
        );
        if (categoryIndex > -1) service.c = categoriesArray[categoryIndex];
      });
      setServices(getServicesResponse);
      const activeReportItem = await API.get(
        `/db/reports?t=Service&src=${sourceSite}`
      );
      if (activeReportItem) setServiceCalculation(activeReportItem[0]);
      setLoading(false);
    };
    getServices();
  }, [sourceSite, provider, category, selectedService]);

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
    if (serviceCalculation && visibleColumns.length === 4) {
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
          selector: 'e',
          sortable: true,
          maxWidth: '100px',
        },
        {
          name: 'Toplam Kazanç',
          selector: 'c',
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
          const serviceIndex = o.s;
          if (calculatedServices[serviceIndex]) {
            calculatedServices[serviceIndex].q += 1;
            calculatedServices[serviceIndex].e += o.e;
            calculatedServices[serviceIndex].c += o.c;
          } else {
            calculatedServices[serviceIndex] = {};
            calculatedServices[serviceIndex].q = 1;
            calculatedServices[serviceIndex].e = o.e;
            calculatedServices[serviceIndex].c = o.c;
          }
        });
        const promisesArray = [];
        const updateService = async (serviceId, serviceData) => {
          // console.log(serviceId, serviceData);
          serviceData.e = serviceData.e.round(3);
          serviceData.c = serviceData.c.round(3);
          await API.patch(`/db/services/${serviceId}`, serviceData);
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
              <div className="col-6 d-flex flex-column">
                <SelectPicker
                  data={[
                    { label: 'Measmm', value: '1' },
                    { label: 'Sosyalbayiniz', value: '2' },
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
            <div className="row">
              <div className="col-6">
                <SelectPicker
                  data={categories.map((ct) => ({
                    label: ct.n,
                    value: ct.id,
                    icon: ct.i,
                  }))}
                  style={{ width: 300 }}
                  onChange={(value) => setCategory(value)}
                  placeholder="Kategori"
                  value={category}
                  renderMenuItem={(label, item) => {
                    return (
                      <div>
                        <SocialIcon
                          network={item.icon}
                          className="mr-2"
                          style={{
                            width: 25,
                            height: 25,
                          }}
                        />
                        {label.charAt(0).toLocaleUpperCase() + label.slice(1)}
                      </div>
                    );
                  }}
                  renderValue={(value, item) => {
                    return (
                      <div>
                        <SocialIcon
                          network={item?.icon}
                          className="mr-2"
                          style={{
                            width: 25,
                            height: 25,
                          }}
                        />
                        {item.label.charAt(0).toLocaleUpperCase() +
                          item.label.slice(1)}
                      </div>
                    );
                  }}
                  className="mb-2"
                />
                <SelectPicker
                  data={
                    services.length
                      ? services.map((service) => {
                          return {
                            label: service.id + " " + service.n,
                            value: service.id,
                          };
                        })
                      : []
                  }
                  style={{ width: 300 }}
                  // onChange={(e) => onChangeHandler(e)}
                  value={selectedService}
                  onChange={(value) => setSelectedService(value)}
                  placeholder="Servis seç"
                  className="mb-2"
                />
              </div>
            </div>
            <Datatable
              title="Servisler"
              columns={visibleColumns}
              data={services}
              defaultSortField={datatableDefaultSortField}
              pagination
              responsive={true}
              striped={true}
              highlightOnHover={true}
              pointerOnHover={true}
              defaultSortAsc={false}
              paginationRowsPerPageOptions={[10, 20, 50, 100]}
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
