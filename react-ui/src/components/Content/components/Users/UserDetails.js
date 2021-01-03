import Axios from "axios";
import React, {useState, useEffect} from "react";
import {useHistory, useParams } from 'react-router-dom';
import Chart from "react-apexcharts";
import ApexCharts from 'apexcharts';
import Datatable from "react-data-table-component";
import { Spinner, Badge, Button, OverlayTrigger, Popover, Form } from "react-bootstrap";
import { DateRangePicker } from "rsuite";
import moment from 'moment';
import { Locale } from "../../../../constants/daterangepicker";

const UserDetails = (props) => {
  console.log("Rendering => UserDetails");
  let history = useHistory();
  let { id } = useParams();
  const [selectedUserDetails, setSelectedUserDetails ] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().subtract(7, "days").unix(),
    endDate: moment().unix(),
  });
  
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
    // console.log()
    if(user.username) {
      const urls = [`/db/orders?user=${user.username}`, `/db/payments?User=${user.username}`];
      var promises = urls.map(url => Axios.get(url));
      const responses = await Promise.all(promises);
      // console.log(responses);
      // const getUserOrders = await Axios.get(`/db/orders?user=${user.username}`);
      // const response = await Promise.all(Axios.get(`/db/orders?user=${user.username}`), Axios.get(`/db/payments?user=${user.username}`));
      // console.log(response);
      const tempUser = {
        spent: 0,
        quantity: 0,
        services: []
      };
      responses[0].data.forEach((order) => {
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
        ...user,
        ...tempUser,
        payments: responses[1].data
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

useEffect(() => {
  const getter = async () => {
    // setPending(true);
    console.log(selectedUserDetails);
    const getPaymentsResponse = await Axios.get(
      `/db/payments?Created_gte=${selectedDate.startDate}&Created_lte=${selectedDate.endDate}&User=${selectedUserDetails.username}`
    );
    setSelectedUserDetails({
      ...selectedUserDetails,
      payments: getPaymentsResponse.data
    })
    // setPending(false);
  }
  getter();
}, [selectedDate]);
  const ChartUsages = () => {
    try {
      if(!selectedUserDetails.services.length) return;

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
      if(!selectedUserDetails.services.length) return;
      
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

  const ChartTotalUsagesTimeAxis = () => {
    let data = selectedUserDetails.payments.map(payment => {
        return [moment(payment.Created).valueOf(), Number(payment.Amount)]
    }).sort((a,b) => a[0] > b[0] ? 1 : -1);
    console.log(data);
    const [graphicState, setGraphicState] = useState({
        series: [{
            data
        }],
        options: {
            chart: {
            id: 'area-datetime',
            type: 'area',
            height: 350,
            zoom: {
                autoScaleYaxis: true
            }
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 0,
            style: 'hollow',
        },
        xaxis: {
            type: 'datetime',
            min: moment().subtract(1, 'year').valueOf(),
            tickAmount: 6,
        },
        tooltip: {
            x: {
                show: true,
                format: 'dd MMM',
                formatter: undefined
            },
            y: {
                formatter: undefined,
                title: {
                    text: 'Tutar',
                }
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.7,
                opacityTo: 0.9,
                stops: [0, 100]
            }
        },
    },
        selection: 'one_month',
    })


  const updateData = (timeline) => {
    setGraphicState({
      selection: timeline
    })
  
    switch (timeline) {
      case 'one_month':
        ApexCharts.exec(
          'area-datetime',
          'zoomX',
          moment().subtract(1, 'month').valueOf(),
          moment().valueOf()
        )
        break
      case 'six_months':
        ApexCharts.exec(
          'area-datetime',
          'zoomX',
          moment().subtract(6, 'month').valueOf(),
          moment().valueOf()
        )
        break
      case 'one_year':
        ApexCharts.exec(
          'area-datetime',
          'zoomX',
          moment().subtract(1, 'year').valueOf(),
          moment().valueOf()
        )
        break
      case 'all':
        ApexCharts.exec(
          'area-datetime',
          'zoomX',
          moment().subtract(2, 'years').valueOf(),
          moment().valueOf()
        )
        break
      default:
    }
  }
    return (
        <div id="chart">
            <div class="toolbar">
                <button id="one_month"
                    onClick={()=>updateData('one_month')} className={ (graphicState.selection==='one_month' ? 'active' : '')}>
                    1 Ay
                </button>
                &nbsp;
                <button id="six_months"
                    onClick={()=>updateData('six_months')} className={ (graphicState.selection==='six_months' ? 'active' : '')}>
                    6 Ay
                </button>
                &nbsp;
                <button id="one_year"
                    onClick={()=>updateData('one_year')} className={ (graphicState.selection==='one_year' ? 'active' : '')}>
                    1 Yıl
                </button>
                &nbsp;
                <button id="all"
                    onClick={()=>updateData('all')} className={ (graphicState.selection==='all' ? 'active' : '')}>
                    Hepsi
                </button>
            </div>
            <div id="chart-timeline">
                <Chart options={graphicState.options} series={graphicState.series} type="area" height={350} />
            </div>
        </div>
    );
  }

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
      <div className="row mb-3">
        <div className="col-lg-6">{ChartSpents()}</div>
        <div className="col-lg-6">{ChartUsages()}</div>
      </div>
      <div>
        <ChartTotalUsagesTimeAxis />
      </div>
      <div className="row justify-content-end">
        <div>
          <DateRangePicker
            placement={"bottomEnd"}
            locale={Locale}
            onChange={async (value) => {
              const selectedDateObject = {
                startDate: moment(value[0]).unix(),
                endDate: moment(value[1]).unix(),
              };
              setSelectedDate(selectedDateObject);
            }}
            value={[
              moment(selectedDate.startDate * 1000)._d,
              moment(selectedDate.endDate * 1000)._d,
            ]}
          />
        </div>
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
