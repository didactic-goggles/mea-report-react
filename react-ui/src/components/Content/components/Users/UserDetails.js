import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../../../api';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import Datatable from 'react-data-table-component';
import DateRangePicker from '../../../UI/DateRangePicker';
import BackButton from '../../../UI/BackButton';
import moment from 'moment';
import LoadingIndicator from '../../../UI/LoadingIndicator';

const UserDetails = (props) => {
  console.log('Rendering => UserDetails');
  let { userId } = useParams();
  const [user, setUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [userPayments, setUserPayments] = useState([]);
  const [userServices, setUserServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().subtract(7, 'days').unix(),
    endDate: moment().unix(),
  });

  const getUserDatas = async (userDetails) => {
    try {
      console.log(userDetails);
      if (!userDetails) return;
      setLoading(true);
      const urls = [
        `/db/orders?u=${userDetails.u}&d_gte=${selectedDate.startDate}&d_lte=${selectedDate.endDate}`,
        `/db/payments?u=${userDetails.u}&c_gte=${selectedDate.startDate}&c_lte=${selectedDate.endDate}`,
      ];
      var promises = urls.map((url) => API.get(url));
      const responses = await Promise.all(promises);
      // console.log(responses);
      // const getUserOrders = await Axios.get(`/db/orders?user=${user.username}`);
      // const response = await Promise.all(Axios.get(`/db/orders?user=${user.username}`), Axios.get(`/db/payments?user=${user.username}`));
      // console.log(response);
      const tempUser = {
        spent: 0,
        quantity: 0,
        services: [],
      };
      const services = [];
      responses[0].forEach((order) => {
        tempUser.spent += Number(order.cost);
        tempUser.quantity += 1;
        const isExistingServiceInUserSpendings = services.findIndex(
          (service) => service.id === order.sid
        );
        if (isExistingServiceInUserSpendings !== -1) {
          const updatedServiceSpent =
            services[isExistingServiceInUserSpendings].spent +
            Number(order.cost);
          services[isExistingServiceInUserSpendings].quantity += 1;
          services[isExistingServiceInUserSpendings].spent =
            updatedServiceSpent;
        } else {
          services.push({
            id: order.sid,
            quantity: 1,
            spent: Number(order.cost),
          });
        }
      });
      console.log(services);
      const servicesPromises = [];
      const getServiceDetails = async (service) => {
        const getService = await API.get(`/db/services/${service.id}`);
        console.log(getService);
        service.name = getService.n;
      };
      services.forEach((service) =>
        servicesPromises.push(getServiceDetails(service))
      );
      await Promise.all(servicesPromises);
      console.log(services);
      setUserOrders(responses[0]);
      setUserServices(services);
      // setUser({
      //   ...user,
      //   ...tempUser,
      //   payments: responses[1]
      // })
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    // console.log()
  };

  //   useEffect(() => {
  //     setLoading(true);
  //     const getter = async () => {
  //         await getUserDetails();
  //         // await getUserPaymentsAndOrders();
  //         setLoading(false);
  //     };
  //     getter();
  //     console.log(selectedUserDetails)
  // }, []);

  useEffect(() => {
    setLoading(true);
    const getUserDetails = async () => {
      const getSelectedUserResponse = await API.get(`/db/users/${userId}`);
      console.log(getSelectedUserResponse);
      setUser(getSelectedUserResponse);
      // console.log(selectedUserDetails);
      // await getUserPaymentsAndOrders(getSelectedUserResponse);
      // setSelectedDate({
      //   startDate: moment().subtract(7, "days").unix(),
      //   endDate: moment().unix(),
      // });
      setLoading(false);
    };
    getUserDetails();
  }, [userId]);

  useEffect(() => {
    getUserDatas(user);
  }, [user, selectedDate]);

  const ChartUsages = () => {
    try {
      if (!userServices || userServices.length === 0) return;

      const chartUsagesArray = userServices.sort((service1, service2) =>
        service1.quantity < service2.quantity ? 1 : -1
      );

      var optionsChartUsages = {
        chart: {
          width: 200,
          type: 'donut',
        },
        title: {
          text: 'En çok kullandığı servisler',
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
          series={chartUsagesArray
            .slice(0, 5)
            .map((service) => service.quantity)}
          options={optionsChartUsages}
          type="donut"
          width="100%"
        />
      );
    } catch (error) {
      console.log(error);
      return;
    }
  };
  const ChartSpents = () => {
    try {
      if (!userServices || userServices.length === 0) return;

      const chartSpentsArray = userServices.sort((service1, service2) =>
        service1.spent < service2.spent ? 1 : -1
      );

      var optionsChartSpents = {
        options: {
          chart: {
            width: 200,
            type: 'donut',
          },
        },
        title: {
          text: 'En çok harcadığı servisler',
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
    let data = user.payments
      .map((payment) => {
        return [moment(payment.created).valueOf(), Number(payment.Amount)];
      })
      .sort((a, b) => (a[0] > b[0] ? 1 : -1));
    console.log(data);
    const [graphicState, setGraphicState] = useState({
      series: [
        {
          data,
        },
      ],
      options: {
        chart: {
          id: 'area-datetime',
          type: 'area',
          height: 350,
          zoom: {
            autoScaleYaxis: true,
          },
        },
        dataLabels: {
          enabled: false,
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
            formatter: undefined,
          },
          y: {
            formatter: undefined,
            title: {
              text: 'Tutar',
            },
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100],
          },
        },
      },
      selection: 'one_month',
    });

    const updateData = (timeline) => {
      setGraphicState({
        selection: timeline,
      });

      switch (timeline) {
        case 'one_month':
          ApexCharts.exec(
            'area-datetime',
            'zoomX',
            moment().subtract(1, 'month').valueOf(),
            moment().valueOf()
          );
          break;
        case 'six_months':
          ApexCharts.exec(
            'area-datetime',
            'zoomX',
            moment().subtract(6, 'month').valueOf(),
            moment().valueOf()
          );
          break;
        case 'one_year':
          ApexCharts.exec(
            'area-datetime',
            'zoomX',
            moment().subtract(1, 'year').valueOf(),
            moment().valueOf()
          );
          break;
        case 'all':
          ApexCharts.exec(
            'area-datetime',
            'zoomX',
            moment().subtract(2, 'years').valueOf(),
            moment().valueOf()
          );
          break;
        default:
      }
    };
    return (
      <div id="chart">
        <div className="toolbar">
          <button
            id="one_month"
            onClick={() => updateData('one_month')}
            className={graphicState.selection === 'one_month' ? 'active' : ''}
          >
            1 Ay
          </button>
          &nbsp;
          <button
            id="six_months"
            onClick={() => updateData('six_months')}
            className={graphicState.selection === 'six_months' ? 'active' : ''}
          >
            6 Ay
          </button>
          &nbsp;
          <button
            id="one_year"
            onClick={() => updateData('one_year')}
            className={graphicState.selection === 'one_year' ? 'active' : ''}
          >
            1 Yıl
          </button>
          &nbsp;
          <button
            id="all"
            onClick={() => updateData('all')}
            className={graphicState.selection === 'all' ? 'active' : ''}
          >
            Hepsi
          </button>
        </div>
        <div id="chart-timeline">
          <Chart
            options={graphicState.options}
            series={graphicState.series}
            type="area"
            height={350}
          />
        </div>
      </div>
    );
  };

  const Filters = () => (
    <div className="d-flex justify-content-end mb-3">
      <DateRangePicker
        selectedDateHandler={setSelectedDate}
        selectedDate={selectedDate}
      />
    </div>
  );

  const columns = React.useMemo(
    () => [
      {
        name: 'Servis',
        selector: 'name',
        sortable: true,
        cell: (row) => <span>{row.name}</span>,
      },
      {
        name: 'Harcama',
        selector: 'spent',
        sortable: true,
        width: '150px',
        cell: (row) => <span>{row.spent.toFixed(2)}</span>,
      },
      {
        name: 'Top. Sipariş',
        selector: 'quantity',
        sortable: true,
        width: '150px',
      },
    ],
    []
  );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!user)
    return (
      <>
        <BackButton />
        <h4 className="text-center">Kullanıcı Verisi Bulunamadı</h4>
      </>
    );

  return (
    <>
      <BackButton />
      <div className="row">
        <div className="col-12">
          <div className="card mb-3 widget-content">
            <div className="widget-content-outer">
              <div className="widget-content-wrapper">
                <div className="widget-content-left">
                  <div className="widget-heading">{user.u}</div>
                  <div className="widget-subheading">Kullanıcıya ait seçtiğin aralıktaki toplam sipariş</div>
                </div>
                <div className="widget-content-right">
                  <div className="widget-numbers text-success">{userOrders.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-lg-6">{ChartSpents()}</div>
        <div className="col-lg-6">{ChartUsages()}</div>
      </div>
      {/* <div>
        <ChartTotalUsagesTimeAxis />
      </div> */}
      <Filters />
      <Datatable
        title="Harcama yaptığı servisler"
        columns={columns}
        data={userServices}
        pagination
        responsive
      />
    </>
  );
};

export default UserDetails;
