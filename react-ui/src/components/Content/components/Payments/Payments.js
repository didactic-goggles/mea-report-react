import React, { useEffect, useState } from "react";
import {useRouteMatch, Route, Switch, useHistory} from 'react-router-dom';
import { Spinner, Badge, Button, OverlayTrigger, Popover, Form } from "react-bootstrap";
import Datatable from "react-data-table-component";
import moment from 'moment';
import { DateRange } from 'react-date-range';
import Axios from "axios";
import PaymentDetails from "./PaymentDetails";

const Payments = () => {
    console.log("Rendering => Payments");
    let history = useHistory();
    let { path, url } = useRouteMatch();
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [selectedDate, setSelectedDate] = useState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
      }
    ]);
    const getPayments = async () => {
      const getPaymentsResponse = await Axios.get(
        `/db/payments`
    );
      setPayments(getPaymentsResponse.data);
    };
        
    const columns = React.useMemo(
        () => [
            {
                name: "Ad",
                selector: "User",
                sortable: true,
            },
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
        ]
    );
    
    useEffect(() => {
        setLoading(true);
        const getter = async () => {
            await getPayments();
            setLoading(false);
        };
        getter();
    }, []);

    const onDateChangeHandler = () => {

    }

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
  
  if (loading) {
    return loadingComponent;
  }
  return (
    <>

      <Switch>
        <Route exact path={path}>
        <div class="row">
        <div class="col-lg-12">
          <div class="mb-3 card">
            <div class="card-body">
              <Datatable
                title="Ödemeler"
                columns={columns}
                data={payments}
                pagination
                onRowClicked={(event) => {
                    setSelectedPayment(event);
                    history.push(`/payments/${event.ID}`)
                }}
                subHeader
                subHeaderComponent={<Filters />}
              />
            </div>
          </div>
        </div>
      </div>
        </Route>
        <Route path={`${path}/:id`}>
            <div class="row">
                <div class="col-lg-12">
                    <div class="mb-3 card">
                        <div class="card-body">
                            <PaymentDetails selectedPayment={selectedPayment}/>
                        </div>
                    </div>
                </div>
            </div>
        </Route>
      </Switch>
    </>
  );
};

export default Payments
