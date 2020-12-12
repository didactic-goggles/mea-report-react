import React from "react";
import Chart from "react-apexcharts";
import Datatable from "react-data-table-component";
const UserDetails = (props) => {
  console.log("Rendering => UserDetails");
  const { selectedUser } = props;
  const ChartUsages = () => {
    const chartUsagesArray = selectedUser.services.sort((service1, service2) =>
      service1.quantity < service2.quantity ? 1 : -1
    );

    var optionsChartUsages = {
      chart: {
        width: "100%",
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
      />
    );
  };
  const ChartSpents = () => {
    const chartSpentsArray = selectedUser.services.sort(
      (service1, service2) => (service1.spent < service2.spent ? 1 : -1)
    );

    var optionsChartSpents = {
      chart: {
        width: "100%",
        type: "donut",
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
      />
    );
  };

  const columns = React.useMemo(
    () => [
      {
        name: "Servis",
        selector: "name",
        sortable: true,
      },
      {
        name: "Harcama",
        selector: "spent",
        sortable: true,
      },
      {
        name: "Harcama",
        selector: "quantity",
        sortable: true,
      },
    ],
    []
  );
  return (
    <>
      <div className="row">
        <div className="col-lg-6">{ChartSpents()}</div>
        <div className="col-lg-6">{ChartUsages()}</div>
      </div>
      <Datatable
        title="Harcama yaptığı servisler"
        columns={columns}
        data={selectedUser.services}
        pagination
      />
    </>
  );
};

export default UserDetails;
