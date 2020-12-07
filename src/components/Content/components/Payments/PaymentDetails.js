import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import React, { useState, useEffect } from "react";
import {useHistory, useParams } from 'react-router-dom';
import moment from 'moment';
import { DateRange } from 'react-date-range';
// import Chart from "react-apexcharts";
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
        for(let i = 0; i < 7 ; i++) {
            const getPaymentsResponse = await Axios.get(
                `/data/payments/payments${i}.json`
            );
            tempPayments.push(...getPaymentsResponse.data);
        }
        if(!selectedPayment) {
            selectedPayment = tempPayments[tempPayments.findIndex(payment => payment.ID == id)];
        }
        // const getPaymentsResponse = await Axios.get(
        //     "/data/payments/payments.json"
        // );
        // console.log(getPaymentsResponse.data);
        const userPaymentsArray = tempPayments.filter(payment => payment.User == selectedPayment.User && payment.Status == 'Completed');
        const tempTotalPaymentObject = {
            totalPayment: 0,
            numberOfPayment: 0
        }
        userPaymentsArray.forEach(payment => {
            tempTotalPaymentObject.totalPayment += Number(payment.Amount);
            tempTotalPaymentObject.numberOfPayment++;
        })
        // setLoading(false);
        setUserPayments(userPaymentsArray);
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
        <Button variant="light" onClick={() => history.goBack()}>Geri</Button>
        <div class="row mt-3">
            {totalPaymentDetails.totalPayment ? 
                <div class="col-md-6 col-xl-4">
                    <Card variant="bg-midnight-bloom" details={{number: totalPaymentDetails.totalPayment, title: 'Bu dönemki toplam ödeme'}} />
                </div>
            : null}
            {totalPaymentDetails.numberOfPayment ? 
                <div class="col-md-6 col-xl-4">
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
