import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";
import { Badge } from "react-bootstrap";
import API from "../../../../api";
import Datatable from "react-data-table-component";

import Card from "../../../UI/Card";
import DateRangePicker from "../../../UI/DateRangePicker";
import BackButton from "../../../UI/BackButton";
import LoadingIndicator from "../../../UI/LoadingIndicator";

const PaymentDetails = (props) => {
  console.log("Rendering => PaymentDetails");
  const [selectedPayment, setSelectedPayment] = useState(props.selectedPayment);
  let { id } = useParams();

  const [userPayments, setUserPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPaymentDetails, setTotalPaymentDetails] = useState();
  console.log(selectedPayment);
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().subtract(7, "days").unix(),
    endDate: moment().unix(),
  });

  const getPayments = async () => {
    const tempPayments = [];

    if (!selectedPayment) {
      const getSelectedPaymentResponse = await API.get(`/db/payments/${id}`);
      if (getSelectedPaymentResponse)
        setSelectedPayment(getSelectedPaymentResponse);
    }
    if(selectedPayment) {
        const getPaymentsResponse = await API.get(
          `/db/payments?User=${selectedPayment.User}&Status=Completed&Created_gte=${selectedDate.startDate}&Created_lte=${selectedDate.endDate}`
        );

        if (getPaymentsResponse) tempPayments.push(...getPaymentsResponse);
        const tempTotalPaymentObject = {
          totalPayment: 0,
          numberOfPayment: 0,
        };
        tempPayments.forEach((payment) => {
          tempTotalPaymentObject.totalPayment += Number(payment.Amount);
          tempTotalPaymentObject.numberOfPayment++;
        });

        setUserPayments(tempPayments);
        setTotalPaymentDetails(tempTotalPaymentObject);
    } else {
        throw false;
    }
  };

  useEffect(() => {
    setLoading(true);
    const getter = async () => {
      await getPayments();
      setLoading(false);
    };
    getter();
  }, [selectedDate, selectedPayment]);

  const Filters = () => (
    <div className="d-flex justify-content-end mb-3">
      <DateRangePicker
        selectedDateHandler={setSelectedDate}
        selectedDate={selectedDate}
      />
    </div>
  );

  // const TotalUsagesGraphic = () => {
  //     var options = {
  //         series: [{
  //         name: 'Website Blog',
  //         type: 'column',
  //         data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
  //       }, {
  //         name: 'Social Media',
  //         type: 'line',
  //         data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
  //       }],
  //         chart: {
  //         height: 350,
  //         type: 'line',
  //       },
  //       stroke: {
  //         width: [0, 4]
  //       },
  //       title: {
  //         text: 'Traffic Sources'
  //       },
  //       dataLabels: {
  //         enabled: true,
  //         enabledOnSeries: [1]
  //       },
  //       labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
  //       xaxis: {
  //         type: 'datetime'
  //       },
  //       yaxis: [{
  //         title: {
  //           text: 'Website Blog',
  //         },

  //       }, {
  //         opposite: true,
  //         title: {
  //           text: 'Social Media'
  //         }
  //       }]
  //       };
  //       return <Chart options={options} series={options.series}/>
  // }

  // const TotalUsagesTimeAxisGraphic = () => {
  //     let data = userPayments.map(payment => {
  //         return [moment(payment.Created).valueOf(), Number(payment.Amount)]
  //     }).sort((a,b) => a[0] > b[0] ? 1 : -1);
  //     console.log(data);
  //     const [graphicState, setGraphicState] = useState({
  //         series: [{
  //             data
  //         }],
  //         options: {
  //             chart: {
  //             id: 'area-datetime',
  //             type: 'area',
  //             height: 350,
  //             zoom: {
  //                 autoScaleYaxis: true
  //             }
  //         },
  //         dataLabels: {
  //             enabled: false
  //         },
  //         markers: {
  //             size: 0,
  //             style: 'hollow',
  //         },
  //         xaxis: {
  //             type: 'datetime',
  //             min: moment().subtract(1, 'year').valueOf(),
  //             tickAmount: 6,
  //         },
  //         tooltip: {
  //             x: {
  //                 show: true,
  //                 format: 'dd MMM',
  //                 formatter: undefined
  //             },
  //             y: {
  //                 formatter: undefined,
  //                 title: {
  //                     text: 'Tutar',
  //                 }
  //             }
  //         },
  //         fill: {
  //             type: 'gradient',
  //             gradient: {
  //                 shadeIntensity: 1,
  //                 opacityFrom: 0.7,
  //                 opacityTo: 0.9,
  //                 stops: [0, 100]
  //             }
  //         },
  //     },
  //         selection: 'one_month',
  //     })

  //   const updateData = (timeline) => {
  //     setGraphicState({
  //       selection: timeline
  //     })

  //     switch (timeline) {
  //       case 'one_month':
  //         ApexCharts.exec(
  //           'area-datetime',
  //           'zoomX',
  //           moment().subtract(1, 'month').valueOf(),
  //           moment().valueOf()
  //         )
  //         break
  //       case 'six_months':
  //         ApexCharts.exec(
  //           'area-datetime',
  //           'zoomX',
  //           moment().subtract(6, 'month').valueOf(),
  //           moment().valueOf()
  //         )
  //         break
  //       case 'one_year':
  //         ApexCharts.exec(
  //           'area-datetime',
  //           'zoomX',
  //           moment().subtract(1, 'year').valueOf(),
  //           moment().valueOf()
  //         )
  //         break
  //       case 'all':
  //         ApexCharts.exec(
  //           'area-datetime',
  //           'zoomX',
  //           moment().subtract(2, 'years').valueOf(),
  //           moment().valueOf()
  //         )
  //         break
  //       default:
  //     }
  //   }
  //     return (
  //         <div id="chart">
  //             <div class="toolbar">
  //                 <button id="one_month"
  //                     onClick={()=>updateData('one_month')} className={ (graphicState.selection==='one_month' ? 'active' : '')}>
  //                     1 Ay
  //                 </button>
  //                 &nbsp;
  //                 <button id="six_months"
  //                     onClick={()=>updateData('six_months')} className={ (graphicState.selection==='six_months' ? 'active' : '')}>
  //                     6 Ay
  //                 </button>
  //                 &nbsp;
  //                 <button id="one_year"
  //                     onClick={()=>updateData('one_year')} className={ (graphicState.selection==='one_year' ? 'active' : '')}>
  //                     1 Yıl
  //                 </button>
  //                 &nbsp;
  //                 <button id="all"
  //                     onClick={()=>updateData('all')} className={ (graphicState.selection==='all' ? 'active' : '')}>
  //                     Hepsi
  //                 </button>
  //             </div>
  //             <div id="chart-timeline">
  //                 <Chart options={graphicState.options} series={graphicState.series} type="area" height={350} />
  //             </div>
  //         </div>
  //     );
  // }

  const columns = React.useMemo(
    () => [
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
        cell: (row) => moment(row.Created * 1000).format("DD/MM/YYYY"),
      },
      {
        name: "Durum",
        selector: "Status",
        sortable: true,
        cell: (row) => {
          let statusObject = {};
          if (row.Status == "Completed") {
            statusObject.variant = "success";
            statusObject.text = "Tamamlandı";
          } else if (row.Status == "Pending") {
            statusObject.variant = "warning";
            statusObject.text = "Beklemede";
          }
          return (
            <Badge pill variant={statusObject.variant}>
              {statusObject.text}
            </Badge>
          );
        },
      },
    ],
    []
  );
  if (loading) {
    return <LoadingIndicator />
  }
  return (
    <>
      <BackButton />
      <Filters />
      {/* <div>
            <TotalUsagesGraphic />
        </div> */}
      {/* <div>
            <TotalUsagesTimeAxisGraphic />
        </div> */}
      <div className="row mb-3">
        {totalPaymentDetails.totalPayment ? (
          <div className="col-md-6 col-xl-4">
            <Card
              variant="bg-midnight-bloom"
              details={{
                number: totalPaymentDetails.totalPayment,
                title: "Bu dönemki toplam ödeme",
              }}
            />
          </div>
        ) : null}
        {totalPaymentDetails.numberOfPayment ? (
          <div className="col-md-6 col-xl-4">
            <Card
              variant="bg-arielle-smile"
              details={{
                number: totalPaymentDetails.numberOfPayment,
                title: "Bu dönemki toplam ödeme sayısı",
              }}
            />
          </div>
        ) : null}
      </div>
      <Datatable
        title={`${selectedPayment.User} - Diğer Ödemeler`}
        columns={columns}
        data={userPayments.filter((payment) => payment.visible !== false)}
        pagination
      />
    </>
  );
};

export default PaymentDetails;
