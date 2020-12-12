import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";
import { DateRange } from "react-date-range";
// import Chart from "react-apexcharts";
// import ApexCharts from 'apexcharts';
import {
  Spinner,
  Badge,
  Button,
  OverlayTrigger,
  Popover,
  Form,
} from "react-bootstrap";
import Datatable from "react-data-table-component";
import Card from '../../../UI/Card';

const ServiceDetails = (props) => {
  console.log("Rendering => PaymentDetails");
  let history = useHistory();
  let { selectedService } = props;
  let { id } = useParams();

  const [allOrdersOfService, setAllOrdersOfService] = useState([]);
  const [allUsersOfService, setAllUsersOfService] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serviceDetails, setServiceDetails] = useState();
  const [filteredAllOrdersOfService, setFilteredAllOrdersOfService] = useState([]);
  console.log(selectedService);
  const [selectedDate, setSelectedDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  console.log(selectedDate);

  const getOrders = async () => {
    const tempOrders = [];
    // const promiseArray = [];
    const getOrdersResponse = await Axios.get(`/db/orders?service_id=${id}`);
    tempOrders.push(...getOrdersResponse.data);
    if (!selectedService) {
      const getServideDetails = await Axios.get(`/db/services/${id}`);
      selectedService = getServideDetails.data;
    }
    // const tempAllOrdersOfService2 = tempOrders.filter((order) => order.service_id == selectedService.id);
    // console.log(tempAllOrdersOfService2);
    const tempAllOrdersOfService = tempOrders.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);
    setAllOrdersOfService(tempAllOrdersOfService);

    setOrders(tempAllOrdersOfService);
    // console.log(tempOrders);
    // const getPaymentsResponse = await Axios.get(
    //     "/data/payments/payments.json"
    // );
    // console.log(getPaymentsResponse.data);
    // aynı id li siparişleri silmek için

    // const userPaymentsArray = tempPayments.filter(payment => payment.User == selectedPayment.User && payment.Status == 'Completed');
    // const tempTotalPaymentObject = {
    //     totalPayment: 0,
    //     numberOfPayment: 0
    // }
    // userPaymentsArray.forEach(payment => {
    //     tempTotalPaymentObject.totalPayment += Number(payment.Amount);
    //     tempTotalPaymentObject.numberOfPayment++;
    // })
    // setLoading(false);
    // setUserPayments(userPaymentsArray);
    // setTotalPaymentDetails(tempTotalPaymentObject);
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
        if( userOrderIndex == -1) {
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

  useEffect(() => {
    setLoading(true);
    const getter = async () => {
      await getOrders();
      initDatatables();
      setLoading(false);
    };
    getter();
  }, []);

  useEffect(() => {
    const tempArray = allOrdersOfService.filter(order => 
      moment(order.created).isBetween(moment(selectedDate[0].startDate), moment(selectedDate[0].endDate))
    )
    console.log(allOrdersOfService);
    console.log(tempArray);
    setOrders(tempArray);
    // setTotalPaymentDetails(tempTotalPaymentObject);
    // // const filteredPaymentsByDate = userPayments.filter(payment =>
    // //     moment(payment.Created).isBetween(moment(selectedDate[0].startDate), moment(selectedDate[0].endDate), null, "(]")
    // // );
    // // setUserPayments(filteredPaymentsByDate)
    // // console.log(filteredPaymentsByDate);
    // setUserPayments(tempArray)
  }, [selectedDate]);

  const initDatatables = () => {

  }

  const onDateChangeHandler = () => {};

  const loadingComponent = (
    <div
      className="d-flex align-items-center w-100 justify-content-center mt-auto"
      style={{ height: "100%" }}
    >
      <Spinner animation="border" role="status" variant="primary">
        <span className="sr-only">Loading...</span>
      </Spinner>
      <h3 className="ml-2">Loading</h3>
    </div>
  );

  const popover = (
    <Popover id="popover-basic">
      <Popover.Content>
        <DateRange
          editableDateInputs={true}
          onChange={(item) => setSelectedDate([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={selectedDate}
        />
      </Popover.Content>
    </Popover>
  );

  const ToggleCalendar = () => (
    <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Tarih</Form.Label>
        <Form.Control
          type="text"
          placeholder="başl.tar/bit.tar"
          onChange={() => onDateChangeHandler()}
          value={`${moment(selectedDate[0].startDate).format("DD-MM")}/${moment(
            selectedDate[0].endDate
          ).format("DD-MM")} ${moment(selectedDate[0].endDate).format("YYYY")}`}
        />
      </Form.Group>
    </OverlayTrigger>
  );

  const Filters = () => (
    <div>
      <ToggleCalendar />
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
      cell: (row) => <span>{moment(row.created).format('DD/MM/YYYY')}</span>
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
        selector: "quantity",
        sortable: true
      },
      {
        name: "Toplam Tutar",
        selector: "amount",
        sortable: true
      }
  ]);

  if (loading) {
    return loadingComponent;
  }
  return (
    <>
      <div className="row mb-3">
        <div className="col-12">
          <Button variant="light" onClick={() => history.goBack()}>
            Geri
          </Button>
        </div>
      </div>
      {/* <div>
            <TotalUsagesGraphic />
        </div>
        <div>
            <TotalUsagesTimeAxisGraphic />
        </div> */}
      <div className="row mb-3">
            {serviceDetails.quantity ? 
                <div className="col-md-6 col-xl-4">
                    <Card variant="bg-midnight-bloom" details={{number: serviceDetails.quantity, title: 'Bu dönemki toplam sipariş adedi'}} />
                </div>
            : null}
            {serviceDetails.amount ? 
                <div className="col-md-6 col-xl-4">
                    <Card variant="bg-arielle-smile" details={{number: serviceDetails.amount.toFixed(2), title: 'Bu dönemki toplam tutar'}} />
                </div>
            : null}
      </div>

      <div className="mb-3">
        <Datatable
            title={`${selectedService.id} ID'li Servisin Siparişleri`}
            columns={columnsForOrders}
            data={filteredAllOrdersOfService}
            pagination
            subHeader
            subHeaderComponent={<Filters />}
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
