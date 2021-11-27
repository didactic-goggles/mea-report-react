import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Modal,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  SelectPicker,
} from 'rsuite';
import Datatable from 'react-data-table-component';
import { SocialIcon } from 'react-social-icons';
import API from '../../../../api';
import categoryTypes from '../../../../constants/categoryTypes';
import LoadingIndicator from '../../../UI/LoadingIndicator';

const Categories = () => {
  console.log('Rendering => Categories');
  // categoryTypes.push("like", "beğeni", "follower", "takipçi");
  let history = useHistory();

  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('');

  const [modalServicesShow, setModalServicesShow] = useState(false);
  const [
    formMultipleCategoryUpdateSubmitting,
    setFormMultipleCategoryUpdateSubmitting,
  ] = useState(false);
  const [services, setServices] = useState([]);
  const [updatedServices, setUpdatedServices] = useState([]);

  const getCategories = async () => {
    setLoading(true);
    const getCategoriesResponse = await API.get(`/db/categories`);
    setCategories(getCategoriesResponse);
    setLoading(false);
  };

  const getServices = async () => {
    const getCategoriesResponse = await API.get(`/db/services`);
    setServices(getCategoriesResponse);
    setUpdatedServices(getCategoriesResponse);
  };

  const columns = [
    {
      name: 'ID',
      selector: 'id',
      sortable: true,
      width: '80px',
    },
    {
      name: 'Kategori Adı',
      selector: 'n',
      sortable: true,
      cell: (row) => {
        return (
          <div>
            <SocialIcon
              network={row.i}
              className="mr-2"
              style={{
                width: 25,
                height: 25,
              }}
            />
            {row.n}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getCategories();
    getServices();
  }, []);

  const handleCreateCategory = async () => {
    setFormSubmitting(true);
    await API.post('/db/categories', {
      n: categoryName,
      i: categoryIcon,
    });
    setFormSubmitting(false);
    setModalShow(false);
    setCategoryName('');
    getCategories();
  };

  const handleSetMultipleCategoryUpdateButtonClick = async () => {
    // await getServices();
    const tempUpdatedServices = [...updatedServices];
    console.log(updatedServices);
    tempUpdatedServices.forEach((service) => {
      try {
        if (
          service.n.toLocaleLowerCase().indexOf('nstagram') > -1
        ) {
          if (
            service.n.toLocaleLowerCase().indexOf('like') > -1 ||
            service.n.toLocaleLowerCase().indexOf('beğeni') > -1
          ) {
            service.c = categories.filter(
              (c) =>
                c.n.toLocaleLowerCase().indexOf('nstagram') > -1 &&
                (c.n.toLocaleLowerCase().indexOf('like') > -1 ||
                  c.n.toLocaleLowerCase().indexOf('beğeni') > -1)
            )[0].id;
            console.log(service);
          } else if (
            service.n.toLocaleLowerCase().indexOf('follower') > -1 ||
            service.n.toLocaleLowerCase().indexOf('takipçi') > -1
          ) {
            service.c = categories.filter(
              (c) =>
                c.n.toLocaleLowerCase().indexOf('nstagram') > -1 &&
                (c.n.toLocaleLowerCase().indexOf('follower') > -1 ||
                  c.n.toLocaleLowerCase().indexOf('takipçi') > -1)
            )[0].id;
          } else {
            service.c = categories.filter(
              (c) => c.n.toLocaleLowerCase().includes('diğer')
            )[0].id;
          }
        } else {
          console.log(service.n);

          service.c = categories.filter(
            (c) =>
              service.n.toLocaleLowerCase().indexOf(c.n.toLocaleLowerCase()) >
              -1
          )[0].id;
        }
      } catch (error) {
        service.c = categories.filter(
          (c) => c.n.toLocaleLowerCase().includes('diğer')
        )[0].id;
      }
    });
    setUpdatedServices(tempUpdatedServices);
    setModalServicesShow(true);
  };

  const handleMultipleCategoryUpdate = async () => {
    setFormMultipleCategoryUpdateSubmitting(true);
    const servicePromises = [];
    const updateService = async (s) =>
      await API.patch(`/db/services/${s.id}`, { c: s.c });
    updatedServices.forEach((s) => servicePromises.push(updateService(s)));
    await Promise.all(servicePromises);
    setFormMultipleCategoryUpdateSubmitting(false);
  };

  const handleChangeCategoryOfService = (serviceId, newCategory) => {
    console.log(serviceId, newCategory);
    const tempUpdatedServices = [...updatedServices];
    const serviceIndex = tempUpdatedServices.findIndex(
      (s) => s.id === serviceId
    );
    if (serviceIndex > -1) {
      tempUpdatedServices[serviceIndex].c = newCategory;
      setUpdatedServices(tempUpdatedServices);
    }
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
    },
    {
      name: '',
      sortable: false,
      maxWidth: '300px',
      cell: (row) => (
        <SelectPicker
          data={categories.map((c) => ({
            label: c.n,
            value: c.id,
          }))}
          style={{ width: '100%' }}
          onChange={(value) => handleChangeCategoryOfService(row.id, value)}
          placeholder="Kategori"
          value={row.c !== '' ? row.c : null}
          renderMenuItem={(label, item) => {
            return (
              <div>
                <SocialIcon
                  network={categories.filter((c) => c.id === item.value)[0].i}
                  className="mr-2"
                  style={{
                    width: 25,
                    height: 25,
                  }}
                />
                {label}
              </div>
            );
          }}
          renderValue={(value, item) => {
            const selectedCategory = categories.filter(
              (c) => c.id === Number(value)
            )[0];
            return (
              <div>
                <SocialIcon
                  network={selectedCategory.i}
                  className="mr-2"
                  style={{
                    width: 25,
                    height: 25,
                  }}
                />
                {selectedCategory.n}
              </div>
            );
          }}
        />
      ),
    },
  ];

  if (loading) {
    return <LoadingIndicator />;
  }
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="mb-3 card">
            <div className="card-body">
              <div className="text-right">
                <Button
                  color="cyan"
                  className="mr-2"
                  onClick={handleSetMultipleCategoryUpdateButtonClick}
                >
                  Servisleri Eşleştir
                </Button>
                <Button appearance="primary" onClick={() => setModalShow(true)}>
                  Kategori Ekle
                </Button>
              </div>
              <Datatable
                title="Kategoriler"
                columns={columns}
                data={categories}
                pagination
                responsive={true}
                striped={true}
                highlightOnHover={true}
                pointerOnHover={true}
                defaultSortAsc={false}
                paginationRowsPerPageOptions={[10, 20, 50, 100]}
                onRowClicked={(event) => {
                  history.push(`/category/${event.id}`);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <Modal show={modalShow}>
        <Form fluid onSubmit={handleCreateCategory}>
          <Modal.Header>
            <Modal.Title>Kategori Yarat</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup>
              <ControlLabel>Kategori Adı</ControlLabel>
              <FormControl
                rows={5}
                name="textarea"
                componentClass="textarea"
                placeholder="Kategori adı"
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
      <Modal full show={modalServicesShow}>
        <Form fluid onSubmit={handleMultipleCategoryUpdate}>
          <Modal.Header>
            <Modal.Title>Servisleri Güncelle</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Datatable
              title="Servisleri Güncelle"
              columns={columnsForServices}
              data={updatedServices}
              pagination
              responsive={true}
              striped={true}
              highlightOnHover={true}
              pointerOnHover={true}
              paginationRowsPerPageOptions={[10, 20, 50, 100]}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              appearance="primary"
              loading={formMultipleCategoryUpdateSubmitting}
            >
              Ok
            </Button>
            <Button
              onClick={() => setModalServicesShow(false)}
              appearance="subtle"
              disabled={formMultipleCategoryUpdateSubmitting}
            >
              İptal
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default Categories;
