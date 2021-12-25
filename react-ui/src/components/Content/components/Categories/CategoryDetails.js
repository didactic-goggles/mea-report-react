// import Axios from "axios";
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import moment from 'moment';
import API from '../../../../api';
import Datatable from 'react-data-table-component';
import {
  Button,
  Modal,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  IconButton,
  Icon,
  SelectPicker,
  Alert
} from 'rsuite';
import { SocialIcon } from 'react-social-icons';
// import Card from '../../../UI/Card';
import BackButton from '../../../UI/BackButton';
import LoadingIndicator from '../../../UI/LoadingIndicator';
import categoryTypes from '../../../../constants/categoryTypes';
import DateRangePicker from '../../../UI/DateRangePicker';

const CategoryDetails = () => {
  console.log('Rendering => CategoryDetails');
  let { categoryId } = useParams();
  categoryId = Number(categoryId);
  const [allServicesOfCategory, setAllServicesOfCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [category, setCategory] = useState();

  const [selectedService, setSelectedService] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [servicesModalShow, setServicesModalShow] = useState(false);
  const [serviceDeleteConfirmModalShow, setServiceDeleteConfirmModalShow] =
    useState(false);
  const [servicesFormSubmitting, setServicesFormSubmitting] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('');
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().subtract(7, 'days').unix(),
    endDate: moment().unix(),
  });
  const [allServicesAndOrdersOfCategory, setAllServicesAndOrdersOfCategory] = useState([]);

  const getCategory = async () => {
    setLoading(true);
    const getCategory = await API.get(`/db/categories/${categoryId}`);
    setCategory(getCategory);
    setCategoryName(getCategory.n);
    setCategoryIcon(getCategory.i);
    setLoading(false);
  };
  // Get Category Details
  useEffect(() => {
    getCategory();
    getServicesOfCategory();
  }, [categoryId]);

  const getServicesOfCategory = async () => {
    setDetailsLoading(true);
    const services = await API.get(`/db/services`);
    setAllServices(services.filter((s) => s.ci !== categoryId));
    setAllServicesOfCategory(services.filter((s) => s.ci === categoryId));
    setDetailsLoading(false);
  };

// Get Orders Of Service
useEffect(() => {
  const getOrders = async () => {
    try {
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
        const tempAllServicesOfCategory = [...allServicesOfCategory];
        Object.keys(calculatedServices).forEach(serviceId => {
          const categoryService = tempAllServicesOfCategory.find(s => s.id === serviceId)
          if (categoryService) {
            categoryService.calculatedData = {
              ...calculatedServices[serviceId]
            }
          }
        })
        setAllServicesOfCategory(tempAllServicesOfCategory)
      }
    } catch (error) {
      Alert.error(error.message, 3000);
    }
  };
  getOrders();
}, [selectedDate]);
  const handleServiceSelectionForDelete = (service) => {
    setSelectedService(service);
    setServiceDeleteConfirmModalShow(true);
  };

  const handleDeleteService = async () => {
    await API.patch(`/db/services/${selectedService.id}`, { ci: '' });
    setSelectedService(null);
    setServiceDeleteConfirmModalShow(false);
    await getServicesOfCategory();
  };

  const handleUpdateCategory = async () => {
    setFormSubmitting(true);
    await API.patch(`/db/categories/${categoryId}`, {
      n: categoryName,
      i: categoryIcon,
    });
    setFormSubmitting(false);
    setModalShow(false);
    getCategory();
  };

  const handleAddService = async () => {
    setServicesFormSubmitting(true);
    const servicePromises = [];
    const updateService = async (serviceId) =>
      await API.patch(`/db/services/${serviceId}`, { ci: categoryId });
    selectedRows.forEach((service) =>
      servicePromises.push(updateService(service.id))
    );
    await Promise.all(servicePromises);
    await getServicesOfCategory();
    setServicesFormSubmitting(true);
    setServicesModalShow(false);
  };

  const handleRowSelected = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };

  const columnsForServices = [
    {
      name: 'ID',
      selector: 'id',
      sortable: true,
      maxWidth: '120px',
    },
    {
      name: 'Servis',
      selector: 'n',
      sortable: true,
      cell: (row) => {
        return (
          <div>
            <Link to={`/service/${row.id}`}>{row.n}</Link>
          </div>
        );
      },
    },
    {
      name: 'Toplam Sipariş',
      selector: 'calculatedData.q',
      sortable: true,
      cell: (row) => row.calculatedData ? <span>{row.calculatedData.q}</span> : <div></div>,
    },
    {
      name: 'Toplam Tutar',
      selector: 'calculatedData.c',
      sortable: true,
      cell: (row) => row.calculatedData ? <span>{row.calculatedData.c.round(3)}</span> : <div></div>,
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
          onClick={() => handleServiceSelectionForDelete(row)}
        />
      ),
    },
  ];

  const Filters = () => (
    <div className="d-flex justify-content-end mb-3">
      <DateRangePicker
        selectedDateHandler={setSelectedDate}
        selectedDate={selectedDate}
        style={{ width: 230 }}
        placement="bottomEnd"
        className="mb-2"
      />
    </div>
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!category) {
    return (
      <>
        <BackButton />
        <h4 className="text-center">Kategori Verisi Bulunamadı</h4>
      </>
    );
  }

  const Details = () => {
    if (detailsLoading) return <LoadingIndicator />;
    return (
      <>
        <div className="text-right">
          <Button appearance="link" onClick={() => setServicesModalShow(true)}>
            Servis Ekle
          </Button>
        </div>
        <Filters />
        <div className="mb-3">
          <Datatable
            title={`${category.n} Kategorinin Servisleri`}
            columns={columnsForServices}
            data={allServicesOfCategory}
            pagination
            responsive={true}
            striped={true}
            highlightOnHover={true}
            pointerOnHover={true}
            defaultSortAsc={false}
            paginationRowsPerPageOptions={[10, 20, 50, 100]}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <BackButton />
      <div className="row">
        <div className="col-12">
          <div className="card mb-3 widget-content">
            <div className="widget-content-outer">
              <div className="widget-content-wrapper">
                <div className="widget-content-left">
                  <div className="widget-heading d-flex align-items-center">
                    <span className="mr-2">
                      <SocialIcon
                        network={category.i}
                        className="mr-2"
                        style={{
                          width: 25,
                          height: 25,
                        }}
                      />
                      {category.n}
                    </span>
                    <Button
                      appearance="link"
                      onClick={() => setModalShow(true)}
                    >
                      Düzenle
                    </Button>
                  </div>
                  <div className="widget-subheading">
                    Kategoriye ait seçtiğin aralıktaki toplam sipariş
                  </div>
                </div>
                <div className="widget-content-right">
                  <div className="widget-numbers text-success">
                    {allServicesOfCategory.length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Details />
      <Modal show={modalShow}>
        <Form fluid onSubmit={handleUpdateCategory}>
          <Modal.Header>
            <Modal.Title>Kategori Düzenle</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup>
              <ControlLabel>Kategori Adı</ControlLabel>
              <FormControl
                rows={5}
                name="textarea"
                componentClass="textarea"
                value={categoryName}
                onChange={(e) => setCategoryName(e)}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Kategori Simgesi</ControlLabel>
              <SelectPicker
                data={categoryTypes.map((ct) => ({
                  label: ct,
                  value: ct,
                }))}
                style={{ width: '100%' }}
                onChange={(value) => setCategoryIcon(value)}
                placeholder="Kategori simgesi"
                value={categoryIcon}
                renderMenuItem={(label, item) => {
                  return (
                    <div>
                      <SocialIcon
                        network={label}
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
                        network={value}
                        className="mr-2"
                        style={{
                          width: 25,
                          height: 25,
                        }}
                      />
                      {value.charAt(0).toLocaleUpperCase() + value.slice(1)}
                    </div>
                  );
                }}
              />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" appearance="primary" loading={formSubmitting}>
              Ok
            </Button>
            <Button
              onClick={() => setModalShow(false)}
              appearance="subtle"
              disabled={formSubmitting}
            >
              İptal
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={servicesModalShow}>
        <Form fluid onSubmit={handleAddService}>
          <Modal.Header>
            <Modal.Title>Servis Ekle</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Datatable
              title="Servis Ekle"
              columns={columnsForServices.slice(0, -1)}
              data={allServices}
              pagination
              responsive={true}
              striped={true}
              highlightOnHover={true}
              pointerOnHover={true}
              onSelectedRowsChange={handleRowSelected}
              selectableRows
              paginationRowsPerPageOptions={[10, 20, 50, 100]}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              appearance="primary"
              loading={servicesFormSubmitting}
            >
              Ok
            </Button>
            <Button
              onClick={() => setServicesModalShow(false)}
              appearance="subtle"
              disabled={servicesFormSubmitting}
            >
              İptal
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal backdrop="static" show={serviceDeleteConfirmModalShow} size="xs">
        <Modal.Body>
          <Icon
            icon="remind"
            className="mr-2"
            style={{
              color: '#ffb300',
              fontSize: 20,
            }}
          />
          {'  '}
          <b>{selectedService?.n}</b> isimli servisi <b>{category.n}</b>' den
          kaldırmak istediğine emin misin?
          <div>Not: Bu işlem seçilen servisi tamamen kaldırmaz!!!</div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleDeleteService} appearance="primary">
            Kaldır
          </Button>
          <Button
            onClick={() => setServiceDeleteConfirmModalShow(false)}
            appearance="subtle"
          >
            İptal
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CategoryDetails;
