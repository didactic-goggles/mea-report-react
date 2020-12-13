import Axios from "axios";
import React, {useState, useEffect} from "react";
import {useHistory, useParams } from 'react-router-dom';
import Chart from "react-apexcharts";
import Datatable from "react-data-table-component";
import { Spinner, Badge, Button, OverlayTrigger, Popover, Form } from "react-bootstrap";

const UserDetails = (props) => {
  console.log("Rendering => UserDetails");
  let history = useHistory();
  let { id } = useParams();
  const [selectedUserDetails, setSelectedUserDetails ] = useState({});
  const [loading, setLoading] = useState(true);

  const getUserDetails = async () => {
    const getSelectedUserResponse = await Axios.get(
        `/db/users/${id}`
    );
    console.log(getSelectedUserResponse.data);
    
    setSelectedUserDetails(getSelectedUserResponse.data);
    console.log(selectedUserDetails);
    await getUserPaymentsAndOrders(getSelectedUserResponse.data);
  }

  const getUserPaymentsAndOrders = async (user) => {
    console.log()
    if(user.username) {
      const getUserOrders = await Axios.get(`/db/orders?user=${user.username}`);
      const tempUser = {
        spent: 0,
        quantity: 0,
        services: []
      };
      getUserOrders.data.forEach((order) => {
        tempUser.spent += Number(order.cost);
        tempUser.quantity += 1;
        const isExistingServiceInUserSpendings = tempUser.services.findIndex(service => service.id == order.service_id)
        if(isExistingServiceInUserSpendings != -1) {
          const updatedServiceSpent = tempUser.services[isExistingServiceInUserSpendings].spent + Number(order.cost)
          tempUser.services[isExistingServiceInUserSpendings].quantity += 1;
          tempUser.services[isExistingServiceInUserSpendings].spent = updatedServiceSpent;
        } else {
          tempUser.services.push({
            id: order.service_id,
            name: order.service_name,
            quantity: 1,
            spent: Number(order.cost)
          })
        }
      })
      setSelectedUserDetails({
        ...selectedUserDetails,
        ...tempUser
      })
    }
  }

  useEffect(() => {
    setLoading(true);
    const getter = async () => {
        await getUserDetails();
        // await getUserPaymentsAndOrders();
        setLoading(false);
    };
    getter();
    console.log(selectedUserDetails)
}, []);
  const ChartUsages = () => {
    try {
      
      const chartUsagesArray = selectedUserDetails.services.sort((service1, service2) =>
        service1.quantity < service2.quantity ? 1 : -1
      );
  
      var optionsChartUsages = {
        chart: {
          width: 200,
          type: "donut",
        },
        title: {
          text: "En çok kullandığı servisler",
        },
        labels: chartUsagesArray.slice(0, 5).map((service) => service.name),
        dataLabels: {
          enabled: false,
        },
      //   responsive: [
      //     {
      //       breakpoint: 480,
      //       options: {
      //         chart: {
      //           width: "100%",
      //           height: 350,
      //         },
      //         legend: {
      //           show: false,
      //         },
      //       },
      //     },
      //   ],
        legend: {
          show: false,
          // position: 'right',
          // offsetY: 0,
          // height: 230,
        },
      };
  
      return (
        <Chart
          series={chartUsagesArray.slice(0, 5).map((service) => service.quantity)}
          options={optionsChartUsages}
          type="donut"
          width="100%"
        />
      );
    } catch (error) {
      console.log(error);
      return ;
    }
  };
  const ChartSpents = () => {
    try {
      
      const chartSpentsArray = selectedUserDetails.services.sort(
        (service1, service2) => (service1.spent < service2.spent ? 1 : -1)
      );
  
      var optionsChartSpents = {
        options: {
          chart: {
            width: 200,
            type: "donut",
          }
        },
        title: {
          text: "En çok harcadığı servisler",
        },
        labels: chartSpentsArray.slice(0, 5).map((service) => service.name),
        dataLabels: {
          enabled: false,
        },
      //   responsive: [
      //     {
      //       breakpoint: 480,
      //       options: {
      //         chart: {
      //           width: "100%",
      //           height: 350,
      //         },
      //         legend: {
      //           show: false,
      //         },
      //       },
      //     },
      //   ],
        legend: {
          show: false,
          // position: 'right',
          // offsetY: 0,
          // height: 230,
        },
      };
  
      return (
        <Chart
          series={chartSpentsArray.slice(0, 5).map((service) => service.spent)}
          options={optionsChartSpents}
          type="donut"
          width="100%"
        />
      );
    } catch (error) {
      return;
    }
  };

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

  const columns = React.useMemo(
    () => [
      {
        name: "Servis",
        selector: "name",
        sortable: true,
        cell: row => <span>{row.name}</span>
      },
      {
        name: "Harcama",
        selector: "spent",
        sortable: true,
        width: '150px',
        cell: row => <span>{row.spent.toFixed(2)}</span>
      },
      {
        name: "Harcama",
        selector: "quantity",
        sortable: true,
        width: '150px'
      },
    ],
    []
  );

  if (loading) {
    return loadingComponent;
  }

  return (
    <>
      <div className="row mb-3">
        <div className="col-12">
          <Button variant="light" onClick={() => history.goBack()}>Geri</Button>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6">{ChartSpents()}</div>
        <div className="col-lg-6">{ChartUsages()}</div>
      </div>
      <Datatable
        title="Harcama yaptığı servisler"
        columns={columns}
        data={selectedUserDetails.services}
        pagination
        responsive
      />
    </>
  );
};

export default UserDetails;
