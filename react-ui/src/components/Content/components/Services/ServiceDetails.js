// import Axios from "axios";
import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
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
  const [filteredAllOrdersOfService, setFilteredAllOrdersOfService] = useState(
    []
  );
  // console.log(selectedService);
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
        `/db/orders?sid=${serviceId}&d_gte=${selectedDate.startDate}&d_lte=${selectedDate.endDate}`
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
            amount: Number(order.chg),
          });
        } else {
          users[userOrderIndex].quantity += 1;
          users[userOrderIndex].amount += Number(order.chg);
        }
      });
      setAllUsersOfService(users);
      console.log(users);
      setDetailsLoading(false);
    };
    getOrders();
  }, [selectedDate, serviceId]);

  // const setOrders = (orders) => {

  //   setFilteredAllOrdersOfService(orders);
  //   let tempUsersOfService = [];
  //   // console.log(tempAllOrdersOfService);
  //   const tempServiceDetails = {
  //       quantity: 0,
  //       amount: 0
  //   }
  //   orders.forEach(order => {
  //       // console.log(order);
  //       const userOrderIndex = tempUsersOfService.findIndex(user => user.user === order.user);
  //       tempServiceDetails.quantity += 1;
  //       tempServiceDetails.amount += Number(order.charge);
  //       if( userOrderIndex === -1) {
  //           tempUsersOfService.push({
  //               user: order.user,
  //               quantity: 1,
  //               amount: Number(order.charge)
  //           })
  //       } else {
  //           tempUsersOfService[userOrderIndex].quantity += 1;
  //           tempUsersOfService[userOrderIndex].amount += Number(order.charge);
  //       }
  //   });
  //   setAllUsersOfService(tempUsersOfService);
  //   setServiceDetails(tempServiceDetails);
  // }

  // useEffect(() => {
  //   setLoading(true);
  //   const getter = async () => {
  //     await getOrders();
  //     initDatatables();
  //     setLoading(false);
  //   };
  //   getter();
  // }, []);

  // useEffect(() => {
  //   setLoading(true);
  //   const getter = async () => {
  //     await getOrders();
  //     setLoading(false);
  //   };
  //   getter();
  // }, [selectedDate]);

  // useEffect(() => {
  //   const tempArray = allOrdersOfService.filter(order =>
  //     moment(order.created).isBetween(moment(selectedDate[0].startDate), moment(selectedDate[0].endDate))
  //   )
  //   console.log(allOrdersOfService);
  //   console.log(tempArray);
  //   setOrders(tempArray);
  //   // setTotalPaymentDetails(tempTotalPaymentObject);
  //   // // const filteredPaymentsByDate = userPayments.filter(payment =>
  //   // //     moment(payment.Created).isBetween(moment(selectedDate[0].startDate), moment(selectedDate[0].endDate), null, "(]")
  //   // // );
  //   // // setUserPayments(filteredPaymentsByDate)
  //   // // console.log(filteredPaymentsByDate);
  //   // setUserPayments(tempArray)
  // }, [selectedDate]);

  const Filters = () => (
    <div className="d-flex justify-content-end mb-3">
      <DateRangePicker
        selectedDateHandler={setSelectedDate}
        selectedDate={selectedDate}
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
            <a href={`/user/${row.u}`} onClick={async (e) => {
              e.preventDefault();
              const getUserIdFromName = await API.get(`/db/users?u=${row.u}`);
              history.push(`/user/${getUserIdFromName[0].id}`);
            }}>{row.u}</a>
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
            title={`${service.id} ID'li Servisin Siparişleri`}
            columns={columnsForOrders}
            data={allOrdersOfService}
            pagination
          />
        </div>
        <div className="mb-3">
          <Datatable
            title={`Servisi en çok kullananlar`}
            columns={columnsForUsers}
            data={allUsersOfService}
            pagination
            defaultSortField="quantity"
            defaultSortAsc={false}
          />
        </div>
      </>
    );
  };

  return (
    <>
      <BackButton />
      <div>{service.n}</div>
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
