/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-extend-native */
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../../../api';
import Chart from 'react-apexcharts';
import Datatable from 'react-data-table-component';
import moment from 'moment';
import { SocialIcon } from 'react-social-icons';
import DateRangePicker from '../../../UI/DateRangePicker';
import BackButton from '../../../UI/BackButton';
import LoadingIndicator from '../../../UI/LoadingIndicator';

import colors from '../../../../constants/colors';

const UserDetails = (props) => {
  console.log('Rendering => UserDetails');
  let { userId } = useParams();
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  // const [userPayments, setUserPayments] = useState([]);
  const [userServices, setUserServices] = useState([]);
  const [userFavoriteServise, setUserFavouriteService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().subtract(7, 'days').unix(),
    endDate: moment().unix(),
  });
  // const [userTotalSpents, setUserTotalSpents] = useState(0);
  const chartTotalUsages = useRef();

  const getUserDatas = async (userDetails) => {
    try {
      // console.log(userDetails);
      if (!userDetails) return;
      setLoading(true);
      const urls = [
        `/db/orders?u=${userDetails.src}-${userDetails.u}&d_gte=${selectedDate.startDate}&d_lte=${selectedDate.endDate}`,
        // `/db/payments?u=${userDetails.src}-${userDetails.u}&c_gte=${selectedDate.startDate}&c_lte=${selectedDate.endDate}`,
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
        tempUser.spent += Number(order.e);
        tempUser.quantity += 1;
        const isExistingServiceInUserSpendings = services.findIndex(
          (service) => service.id === order.s
        );
        if (isExistingServiceInUserSpendings !== -1) {
          const updatedServiceSpent =
            services[isExistingServiceInUserSpendings].spent + Number(order.e);
          services[isExistingServiceInUserSpendings].quantity += 1;
          services[isExistingServiceInUserSpendings].spent =
            updatedServiceSpent;
        } else {
          services.push({
            id: order.s,
            quantity: 1,
            spent: Number(order.e),
          });
        }
      });
      // console.log(services);
      const servicesPromises = [];
      const getServiceDetails = async (service, i) => {
        console.log(service);
        const getService = await API.get(`/db/services/${service.id}`);
        // console.log(getService);
        service.name = getService.n;
        service.color = colors[i];
        service.c = categories.find(c => c.id === getService.c);
      };
      services.forEach((service, i) =>
        servicesPromises.push(getServiceDetails(service, i))
      );
      await Promise.all(servicesPromises);
      // console.log(services);
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

  const getCategories = async () => {
    const getCategoriesResponse = await API.get('/db/categories');
    setCategories(getCategoriesResponse);
  }

  useEffect(() => getCategories(), []);

  useEffect(() => {
    setLoading(true);
    const getUserDetails = async () => {
      const getSelectedUserResponse = await API.get(`/db/users/${userId}`);
      // console.log(getSelectedUserResponse);
      setUser(getSelectedUserResponse);
      if (getSelectedUserResponse.s) {
        const getServiceDetails = await API.get(
          `/db/services/${getSelectedUserResponse.s}`
        );
        setUserFavouriteService(getServiceDetails);
      }
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
          text: 'Sipariş Sayısı',
        },
        labels: chartUsagesArray.map((service) => service.name),
        dataLabels: {
          enabled: false,
        },
        colors: chartUsagesArray.map((service) => service.color),
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
          series={chartUsagesArray.map((service) => service.quantity.round(3))}
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
          text: 'Harcama',
        },
        labels: chartSpentsArray.map((service) => service.name),
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        colors: chartSpentsArray.map((service) => service.color),
      };

      return (
        <Chart
          series={chartSpentsArray.map((service) => service.spent.round(3))}
          options={optionsChartSpents}
          type="donut"
          width="100%"
        />
      );
    } catch (error) {
      return;
    }
  };

  const ChartCategories = () => {
    try {
      if (!userServices || userServices.length === 0) return;

      const chartCategoriesArray = categories.map((category) => {
        return {
          ...category,
          spent: userServices.filter(s => s.c.id === category.id).reduce((sum, b) => sum + b.spent, 0)
        }
      }).filter(c => c.spent > 0);

      console.log(colors.splice(0, chartCategoriesArray.length), chartCategoriesArray)

      var optionsChartCategories = {
        options: {
          chart: {
            width: 200,
            type: 'donut',
          },
        },
        title: {
          text: 'Kategori Harcama',
        },
        labels: chartCategoriesArray.map((category) => category.n),
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        // colors: colors.splice(0 , chartCategoriesArray.length),
      };

      return (
        <Chart
          series={chartCategoriesArray.map((category) => category.spent.round(3))}
          options={optionsChartCategories}
          type="donut"
          width="100%"
        />
      );
    } catch (error) {
      return;
    }
  };

  const ChartTotalUsagesTimeAxis = () => {
    if (userOrders.length === 0) return null;
    const series = [];
    const dates = [];
    userOrders.forEach((order) => {
      const orderUnixDate = moment(order.d * 1000)
        .startOf('day')
        .unix();
      let orderUnixDateIndex = dates.indexOf(orderUnixDate);
      if (orderUnixDateIndex === -1) {
        dates.push(orderUnixDate);
        orderUnixDateIndex = dates.length - 1;
      }

      const seriesIndex = series.findIndex((s) => s.name === order.s);
      if (seriesIndex === -1) {
        const seriesObject = {};
        seriesObject.name = order.s;
        seriesObject.data = [];
        seriesObject.data[orderUnixDateIndex] = 1;
        series.push(seriesObject);
      } else {
        if (series[seriesIndex].data[orderUnixDateIndex])
          series[seriesIndex].data[orderUnixDateIndex] += 1;
        else series[seriesIndex].data[orderUnixDateIndex] = 1;
      }
    });
    series.forEach((service) => {
      const userServiceEq = userServices.filter(
        (s) => s.id === service.name
      )[0];
      // console.log(userServiceEq);
      if (userServiceEq) service.name = userServiceEq.name;
    });

    const options = {
      series,
      options: {
        chart: {
          events: {
            legendClick: function (chartContext, seriesIndex, config) {
              // series.forEach((s, i) => {
              //   if (i === seriesIndex) {
              //     chartContext.showSeries(s.name);
              //   } else {
              //     chartContext.hideSeries(s.name);
              //   }
              // });
              chartContext.showSeries(series[seriesIndex].name);
            },
          },
          type: 'bar',
          height: 550,
          stacked: true,
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0,
              },
            },
          },
        ],

        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 10,
          },
        },
        xaxis: {
          type: 'date',
          categories: dates.map((d) => moment(d * 1000).format('DD/MM/YYYY')),
        },
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0,
          onItemClick: {
            toggleDataSeries: false,
          },
        },
        fill: {
          opacity: 1,
        },
        colors: colors,
        zoom: {
          enabled: true,
          type: 'x',
          resetIcon: {
              offsetX: -10,
              offsetY: 0,
              fillColor: '#fff',
              strokeColor: '#37474F'
          },
          selection: {
              background: '#90CAF9',
              border: '#0D47A1'
          }    
      }
      },
    };

    return (
      <div id="chart-totalUsages">
        <button
          onClick={(e) => {
            if (e.target.getAttribute('data-toggled') === 'true') {
              e.target.setAttribute('data-toggled', 'false');
              series.forEach((s) => {
                chartTotalUsages.current.chart.showSeries(s.name);
              });
            } else {
              e.target.setAttribute('data-toggled', 'true');
              series.forEach((s) => {
                chartTotalUsages.current.chart.hideSeries(s.name);
              });
            }
          }}
        >
          Hepsini Gizle/Göster
        </button>
        <Chart
          options={options.options}
          series={options.series}
          type="bar"
          ref={chartTotalUsages}
          height={options.options.chart.height}
        />
      </div>
    );
  };

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

  const columns = [
    {
      name: 'Servis',
      selector: 'name',
      sortable: true,
      cell: (row) => {
        return (
          <div>
            <Link to={`/service/${row.id}`}>{row.name}</Link>
          </div>
        );
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
            {row.c && row.c.i && <SocialIcon
              network={row.c.i}
              className="mr-2"
              style={{
                width: 25,
                height: 25,
              }}
            />}
            {(row.c && row.c.n) || 'Tanımlı değil'}
          </div>
        );
      },
    },
    {
      name: 'Harcama',
      selector: 'spent',
      sortable: true,
      width: '150px',
      cell: (row) => <span>{row.spent.round(3)}</span>,
    },
    {
      name: 'Top. Sipariş',
      selector: 'quantity',
      sortable: true,
      width: '150px',
    },
  ];

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
                  {userFavoriteServise ? (
                    <div className="widget-subheading">
                      Favori Servisi:{' '}
                      <Link to={`/service/${userFavoriteServise.id}`}>
                        {userFavoriteServise.n}
                      </Link>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="widget-content-wrapper">
                <div className="widget-content-left">
                  <div className="widget-subheading mb-4">
                    Kullanıcıya ait seçtiğin aralıktaki toplam sipariş
                  </div>
                  <div className="widget-subheading">
                    Kullanıcıya ait seçtiğin aralıktaki toplam harcama
                  </div>
                </div>
                <div className="widget-content-right">
                  <div className="widget-numbers text-success mb-2">
                    {userOrders.length}
                  </div>
                  <div className="widget-numbers text-success">
                    {userOrders.reduce((total, uo) => total + uo.e, 0).round(3)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-4">{ChartSpents()}</div>
        <div className="col-4">{ChartUsages()}</div>
        <div className="col-4">{ChartCategories()}</div>
      </div>
      <div>
        <ChartTotalUsagesTimeAxis />
      </div>
      <Filters />
      <Datatable
        title="Harcama yaptığı servisler"
        columns={columns}
        data={userServices}
        pagination
        responsive={true}
        striped={true}
        highlightOnHover={true}
        pointerOnHover={true}
        defaultSortAsc={false}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
      />
    </>
  );
};

export default UserDetails;

Number.prototype.round = function (places) {
  return +(Math.round(this + 'e+' + places) + 'e-' + places);
};
