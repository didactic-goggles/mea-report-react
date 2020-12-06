import React, { useState, useEffect } from "react";
import moment from 'moment';
import Chart from "react-apexcharts";
import { Spinner, Badge } from "react-bootstrap";
import Axios from "axios";
import Datatable from "react-data-table-component";
const PaymentDetails = (props) => {
    console.log("Rendering => PaymentDetails");
    const { selectedPayment } = props;
    const [userPayments, setUserPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log(selectedPayment);
    const getPayments = async () => {
        const getPaymentsResponse = await Axios.get(
            "/data/payments/payments.json"
        );
        console.log(getPaymentsResponse.data);
        const userPaymentsArray = getPaymentsResponse.data.filter(payment => payment.User == selectedPayment.User);
        // setLoading(false);
        setUserPayments(userPaymentsArray);
    };

    useEffect(() => {
        setLoading(true);
        const getter = async () => {
            await getPayments();
            setLoading(false);
        };
        getter();
    }, []);
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
    //   const ChartUsages = () => {
    //     const chartUsagesArray = selectedUser.services.sort((service1, service2) =>
    //       service1.quantity < service2.quantity ? 1 : -1
    //     );

    //     var optionsChartUsages = {
    //       chart: {
    //         width: "100%",
    //         type: "donut",
    //       },
    //       title: {
    //         text: "En çok kullandığı servisler",
    //       },
    //       labels: chartUsagesArray.slice(0, 5).map((service) => service.name),
    //       dataLabels: {
    //         enabled: false,
    //       },
    //     //   responsive: [
    //     //     {
    //     //       breakpoint: 480,
    //     //       options: {
    //     //         chart: {
    //     //           width: "100%",
    //     //           height: 350,
    //     //         },
    //     //         legend: {
    //     //           show: false,
    //     //         },
    //     //       },
    //     //     },
    //     //   ],
    //       legend: {
    //         show: false,
    //         // position: 'right',
    //         // offsetY: 0,
    //         // height: 230,
    //       },
    //     };

    //     return (
    //       <Chart
    //         series={chartUsagesArray.slice(0, 5).map((service) => service.quantity)}
    //         options={optionsChartUsages}
    //         type="donut"
    //       />
    //     );
    //   };
    //   const ChartSpents = () => {
    //     const chartSpentsArray = selectedUser.services.sort(
    //       (service1, service2) => (service1.spent < service2.spent ? 1 : -1)
    //     );

    //     var optionsChartSpents = {
    //       chart: {
    //         width: "100%",
    //         type: "donut",
    //       },
    //       title: {
    //         text: "En çok harcadığı servisler",
    //       },
    //       labels: chartSpentsArray.slice(0, 5).map((service) => service.name),
    //       dataLabels: {
    //         enabled: false,
    //       },
    //     //   responsive: [
    //     //     {
    //     //       breakpoint: 480,
    //     //       options: {
    //     //         chart: {
    //     //           width: "100%",
    //     //           height: 350,
    //     //         },
    //     //         legend: {
    //     //           show: false,
    //     //         },
    //     //       },
    //     //     },
    //     //   ],
    //       legend: {
    //         show: false,
    //         // position: 'right',
    //         // offsetY: 0,
    //         // height: 230,
    //       },
    //     };

    //     return (
    //       <Chart
    //         series={chartSpentsArray.slice(0, 5).map((service) => service.spent)}
    //         options={optionsChartSpents}
    //         type="donut"
    //       />
    //     );
    //   };

    const columns = React.useMemo(
        () => [
            // {
            //     name: "Servis",
            //     selector: "name",
            //     sortable: true,
            // },
            {
                name: "Metod",
                selector: "Method",
                sortable: true,
            },
            {
                name: "Tutar",
                selector: "Amount",
                sortable: true,
            },
            {
                name: "Tarih",
                selector: "Created",
                sortable: true,
                cell: row => moment(row.Created).format('DD/MM/YYYY')
            },
            {
                name: 'Durum',
                selector: 'Status',
                sortable: true,
                cell: row => {
                    let statusObject = {};
                    if(row.Status == 'Completed') {
                        statusObject.variant = 'success';
                        statusObject.text = 'Tamamlandı'
                    } else if(row.Status == 'Pending') {
                        statusObject.variant = 'warning';
                        statusObject.text = 'Beklemede'
                    }
                    return <Badge pill variant={statusObject.variant}>
                        {statusObject.text}
                    </Badge>
                }
            }
        ],
        []
    );
    if (loading) {
        return loadingComponent;
      }
    return (
        <>
            {/* <div className="row">
        <div className="col-lg-6">{ChartSpents()}</div>
        <div className="col-lg-6">{ChartUsages()}</div>
      </div> */}
            <Datatable
                title={`${selectedPayment.User} - Diğer Ödemeler`}
                columns={columns}
                data={userPayments}
                pagination
            />
        </>
    );
};

export default PaymentDetails;
