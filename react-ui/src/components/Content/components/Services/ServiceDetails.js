// import Axios from "axios";
import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import moment from 'moment';
import API from '../../../../api';
// import Chart from "react-apexcharts";
// import ApexCharts from 'apexcharts';
import Datatable from 'react-data-table-component';
// import Card from '../../../UI/Card';
import DateRangePicker from '../../../UI/DateRangePicker';
import BackButton from '../../../UI/BackButton';
import LoadingIndicator from '../../../UI/LoadingIndicator';

const ServiceDetails = () => {
  console.log('Rendering => PaymentDetails');
  let history = useHistory();
  // let { selectedService } = props;
  let { serviceId } = useParams();

  const [allOrdersOfService, setAllOrdersOfService] = useState([]);
  const [allUsersOfService, setAllUsersOfService] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [service, setService] = useState();

  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().subtract(7, 'days').unix(),
    endDate: moment().unix(),
  });

  // Get Service Details
  useEffect(() => {
    const getService = async () => {
      setLoading(true);
      const getService = await API.get(`/db/services/${serviceId}`);
      setService(getService);
      setLoading(false);
    };
    getService();
  }, [serviceId]);

  // Get Orders Of Service
  useEffect(() => {
    const getOrders = async () => {
      setDetailsLoading(true);
      const orders = await API.get(
        `/db/orders?s=${serviceId}&d_gte=${selectedDate.startDate}&d_lte=${selectedDate.endDate}`
      );
      setAllOrdersOfService(orders);
      const users = [];
      orders.forEach((order) => {
        // console.log(order);
        const userOrderIndex = users.findIndex(
          (user) => user.user === order.u
        );
        if (userOrderIndex === -1) {
          users.push({
            user: order.u,
            quantity: 1,
            amount: Number(order.e),
          });
        } else {
          users[userOrderIndex].quantity += 1;
          users[userOrderIndex].amount += Number(order.e);
        }
      });
      setAllUsersOfService(users);
      console.log(users);
      setDetailsLoading(false);
    };
    getOrders();
  }, [selectedDate, serviceId]);

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

  const columnsForOrders = [
    {
      name: 'ID',
      selector: 'id',
      sortable: true,
      maxWidth: '120px',
    },
    {
      name: 'Kullanıcı',
      selector: 'u',
      sortable: true,
      cell: (row) => {
        return (
          <div>
            <Link to={`/user/${row.u}`}>{row.u}</Link>
          </div>
        );
      },
    },
    {
      name: 'Tarih',
      selector: 'd',
      sortable: true,
      cell: (row) => <span>{moment(row.d * 1000).format('DD/MM/YYYY')}</span>,
    },
  ];

  const columnsForUsers = [
    {
      name: 'Kullanıcı',
      selector: 'user',
      sortable: true,
      cell: (row) => {
        return (
          <div>
            <Link to={`/user/${row.user}`}>{row.user}</Link>
          </div>
        );
      },
    },
    {
      name: 'Toplam Sipariş',
      selector: 'quantity',
      sortable: true,
    },
    {
      name: 'Toplam Tutar',
      selector: 'amount',
      sortable: true,
    },
  ];

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!service) {
    return (
      <>
        <BackButton />
        <h4 className="text-center">Servis Verisi Bulunamadı</h4>
      </>
    );
  }

  const Details = () => {
    if (detailsLoading) return <LoadingIndicator />;
    return (
      <>
        <Filters />
        <div className="mb-3">
          <Datatable
            title={`${service.id.split('-')[1]} ID'li Servisin Siparişleri`}
            columns={columnsForOrders}
            data={allOrdersOfService}
            pagination
            responsive={true}
            striped={true}
            highlightOnHover={true}
            pointerOnHover={true}
            defaultSortAsc={false}
            paginationRowsPerPageOptions={[10, 20, 50, 100]}
          />
        </div>
        <div className="mb-3">
          <Datatable
            title={`Servisi en çok kullananlar`}
            columns={columnsForUsers}
            data={allUsersOfService}
            defaultSortField="quantity"
            defaultSortAsc={false}
            pagination
            responsive={true}
            striped={true}
            highlightOnHover={true}
            pointerOnHover={true}
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
                  <div className="widget-heading">{service.n}</div>
                  <div className="widget-subheading">Servise ait seçtiğin aralıktaki toplam sipariş</div>
                </div>
                <div className="widget-content-right">
                  <div className="widget-numbers text-success">{allOrdersOfService.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div>
            <TotalUsagesGraphic />
        </div>
        <div>
            <TotalUsagesTimeAxisGraphic />
        </div> */}
      {/* <div className="row mb-3">
            {serviceDetails.qt ? 
                <div className="col-md-6 col-xl-4">
                    <Card variant="bg-midnight-bloom" details={{number: serviceDetails.qt, title: 'Bu dönemki toplam sipariş adedi'}} />
                </div>
            : null}
            {serviceDetails.amount ? 
                <div className="col-md-6 col-xl-4">
                    <Card variant="bg-arielle-smile" details={{number: serviceDetails.amount.toFixed(2), title: 'Bu dönemki toplam tutar'}} />
                </div>
            : null}
      </div> */}
      <Details />
    </>
  );
};

export default ServiceDetails;
