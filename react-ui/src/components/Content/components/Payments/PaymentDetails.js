import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import React, { useState, useEffect } from "react";
import {useHistory, useParams } from 'react-router-dom';
import moment from 'moment';
import { DateRange } from 'react-date-range';
import Chart from "react-apexcharts";
import ApexCharts from 'apexcharts';
import { Spinner, Badge, Button, OverlayTrigger, Popover, Form } from "react-bootstrap";
import Axios from "axios";
import Datatable from "react-data-table-component";
import Card from '../../../UI/Card';

const PaymentDetails = (props) => {
    console.log("Rendering => PaymentDetails");
    let history = useHistory();
    let { selectedPayment } = props;
    let { id } = useParams();

    const [userPayments, setUserPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPaymentDetails, setTotalPaymentDetails] = useState();
    console.log(selectedPayment);
    const [selectedDate, setSelectedDate] = useState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection'
        }
      ]);

      console.log(selectedDate);
      

    const getPayments = async () => {
        const tempPayments = [];
        // const promiseArray = [];
        // for(let i = 0; i < 7 ; i++) {
        //     const getPaymentsResponse = await Axios.get(
        //         `/data/payments/payments${i}.json`
        //     );
        //     tempPayments.push(...getPaymentsResponse.data);
        // }
        
        if(!selectedPayment) {
            const getSelectedPaymentResponse = await Axios.get(
                `/db/payments/${id}`
            );
            selectedPayment = getSelectedPaymentResponse.data;
        }

        const getPaymentsResponse = await Axios.get(
            `/db/payments?User=${selectedPayment.User}&Status=Completed`
        );
        tempPayments.push(...getPaymentsResponse.data);
        // const getPaymentsResponse = await Axios.get(
        //     "/data/payments/payments.json"
        // );
        // console.log(getPaymentsResponse.data);
        // const userPaymentsArray = tempPayments.filter(payment => payment.User == selectedPayment.User && payment.Status == 'Completed');
        const tempTotalPaymentObject = {
            totalPayment: 0,
            numberOfPayment: 0
        }
        tempPayments.forEach(payment => {
            tempTotalPaymentObject.totalPayment += Number(payment.Amount);
            tempTotalPaymentObject.numberOfPayment++;
        })
        // setLoading(false);
        setUserPayments(tempPayments);
        setTotalPaymentDetails(tempTotalPaymentObject);
    };

    useEffect(() => {
        setLoading(true);
        const getter = async () => {
            await getPayments();
            setLoading(false);
        };
        getter();
    }, []);

    useEffect(() => {
        const tempTotalPaymentObject = {
            totalPayment: 0,
            numberOfPayment: 0
        }
        const tempArray = userPayments.map(payment => {
            if(moment(payment.Created).isBetween(moment(selectedDate[0].startDate), moment(selectedDate[0].endDate), null, "[]")) {
                payment.visible = true;
                tempTotalPaymentObject.totalPayment += Number(payment.Amount);
                tempTotalPaymentObject.numberOfPayment++;
            } else
                payment.visible = false;
            return payment;
        })
        setTotalPaymentDetails(tempTotalPaymentObject);
        // const filteredPaymentsByDate = userPayments.filter(payment => 
        //     moment(payment.Created).isBetween(moment(selectedDate[0].startDate), moment(selectedDate[0].endDate), null, "(]")
        // );
        // setUserPayments(filteredPaymentsByDate)
        // console.log(filteredPaymentsByDate);
        setUserPayments(tempArray)
    }, [selectedDate])

    const onDateChangeHandler = () => {

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

    const popover = (
        <Popover id="popover-basic">
          <Popover.Content>
            <DateRange
                editableDateInputs={true}
                onChange={item => setSelectedDate([item.selection])}
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
                value={`${moment(selectedDate[0].startDate).format('DD-MM')}/${moment(selectedDate[0].endDate).format('DD-MM')} ${moment(selectedDate[0].endDate).format('YYYY')}`}/>
        </Form.Group>
        </OverlayTrigger>
      );

      const Filters = () => 
          <div>
                <ToggleCalendar />
          </div>
    
    const TotalUsagesGraphic = () => {
        var options = {
            series: [{
            name: 'Website Blog',
            type: 'column',
            data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
          }, {
            name: 'Social Media',
            type: 'line',
            data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
          }],
            chart: {
            height: 350,
            type: 'line',
          },
          stroke: {
            width: [0, 4]
          },
          title: {
            text: 'Traffic Sources'
          },
          dataLabels: {
            enabled: true,
            enabledOnSeries: [1]
          },
          labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
          xaxis: {
            type: 'datetime'
          },
          yaxis: [{
            title: {
              text: 'Website Blog',
            },
          
          }, {
            opposite: true,
            title: {
              text: 'Social Media'
            }
          }]
          };
          return <Chart options={options} series={options.series}/>
    }

    const TotalUsagesTimeAxisGraphic = () => {
        let data = userPayments.map(payment => {
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
        <div className="row mb-3">
            <div className="col-12">
                <Button variant="light" onClick={() => history.goBack()}>Geri</Button>
            </div>
        </div>
        <div>
            <TotalUsagesGraphic />
        </div>
        <div>
            <TotalUsagesTimeAxisGraphic />
        </div>
        <div className="row mb-3">
            {totalPaymentDetails.totalPayment ? 
                <div className="col-md-6 col-xl-4">
                    <Card variant="bg-midnight-bloom" details={{number: totalPaymentDetails.totalPayment, title: 'Bu dönemki toplam ödeme'}} />
                </div>
            : null}
            {totalPaymentDetails.numberOfPayment ? 
                <div className="col-md-6 col-xl-4">
                    <Card variant="bg-arielle-smile" details={{number: totalPaymentDetails.numberOfPayment, title: 'Bu dönemki toplam ödeme sayısı'}} />
                </div>
            : null}
        </div>
        <Datatable
            title={`${selectedPayment.User} - Diğer Ödemeler`}
            columns={columns}
            data={userPayments.filter(payment => payment.visible !== false)}
            pagination
            subHeader
            subHeaderComponent={<Filters />}
        />
        </>
    );
};

export default PaymentDetails;
