// import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import API from "../../../../api";
// import Chart from "react-apexcharts";
// import ApexCharts from 'apexcharts';
import Datatable from "react-data-table-component";
import Card from '../../../UI/Card';
import DateRangePicker from '../../../UI/DateRangePicker';
import BackButton from '../../../UI/BackButton';
import LoadingIndicator from "../../../UI/LoadingIndicator";

const ServiceDetails = (props) => {
  console.log("Rendering => PaymentDetails");
  // let history = useHistory();
  let { selectedService } = props;
  let { id } = useParams();

  const [allOrdersOfService, setAllOrdersOfService] = useState([]);
  const [allUsersOfService, setAllUsersOfService] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceDetails, setServiceDetails] = useState();
  const [filteredAllOrdersOfService, setFilteredAllOrdersOfService] = useState([]);
  console.log(selectedService);
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().subtract(7, "days").unix(),
    endDate: moment().unix(),
  });

  console.log(selectedDate);

  const getOrders = async () => {
    const tempOrders = [];
    const getOrdersResponse = await API.get(`/db/orders?service_id=${id}&created_gte=${selectedDate.startDate}&created_lte=${selectedDate.endDate}`);
    tempOrders.push(...getOrdersResponse);
    if (!selectedService) {
      const getServideDetails = await API.get(`/db/services/${id}`);
      selectedService = getServideDetails;
    }
    const tempAllOrdersOfService = tempOrders.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id)) ===i);
    setAllOrdersOfService(tempAllOrdersOfService);

    setOrders(tempAllOrdersOfService);
  };

  const setOrders = (orders) => {
    
    setFilteredAllOrdersOfService(orders);
    let tempUsersOfService = [];
    // console.log(tempAllOrdersOfService);
    const tempServiceDetails = {
        quantity: 0,
        amount: 0
    }
    orders.forEach(order => {
        // console.log(order);
        const userOrderIndex = tempUsersOfService.findIndex(user => user.user === order.user);
        tempServiceDetails.quantity += 1;
        tempServiceDetails.amount += Number(order.charge);
        if( userOrderIndex === -1) {
            tempUsersOfService.push({
                user: order.user,
                quantity: 1,
                amount: Number(order.charge)
            })
        } else {
            tempUsersOfService[userOrderIndex].quantity += 1;
            tempUsersOfService[userOrderIndex].amount += Number(order.charge);
        }
    });
    setAllUsersOfService(tempUsersOfService);
    setServiceDetails(tempServiceDetails);
  }

  // useEffect(() => {
  //   setLoading(true);
  //   const getter = async () => {
  //     await getOrders();
  //     initDatatables();
  //     setLoading(false);
  //   };
  //   getter();
  // }, []);

  useEffect(() => {
    setLoading(true);
    const getter = async () => {
      await getOrders();
      setLoading(false);
    };
    getter();
  }, [selectedDate]);

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

  const columnsForOrders = React.useMemo(() => [
    {
      name: "ID",
      selector: "id",
      sortable: true,
      maxWidth: "120px",
    },
    {
      name: "Kullanıcı",
      selector: "name",
      sortable: true,
      cell: (row) => {
        return <div>{row.user}</div>;
      },
    },
    {
        name: "Link",
        selector: "link",
        sortable: true,
        cell: (row) => {
          return <a href={row.link}>{row.link}</a>;
        },
      },
    {
      name: "Tarih",
      selector: "created",
      sortable: true,
      cell: (row) => <span>{moment(row.created * 1000).format('DD/MM/YYYY')}</span>
    },
  ]);

  const columnsForUsers = React.useMemo(() => [
    {
      name: "Kullanıcı",
      selector: "user",
      sortable: true
    },
    {
        name: "Toplam Sipariş",
        selector: "qt",
        sortable: true
      },
      {
        name: "Toplam Tutar",
        selector: "amount",
        sortable: true
      }
  ]);

  if (loading) {
    return <LoadingIndicator />;
  }
  return (
    <>
      <BackButton />
      {/* <div>
            <TotalUsagesGraphic />
        </div>
        <div>
            <TotalUsagesTimeAxisGraphic />
        </div> */}
      <div className="row mb-3">
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
      </div>
      <Filters />
      <div className="mb-3">
        <Datatable
            title={`${selectedService.id} ID'li Servisin Siparişleri`}
            columns={columnsForOrders}
            data={filteredAllOrdersOfService}
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

export default ServiceDetails;
