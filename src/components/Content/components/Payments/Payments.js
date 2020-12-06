import React, { useEffect, useState } from "react";
import {useRouteMatch, Route, Switch, useHistory} from 'react-router-dom';
import { Spinner } from "react-bootstrap";
import Datatable from "react-data-table-component";
import Axios from "axios";
import PaymentDetails from "./PaymentDetails";

const Payments = () => {
    let history = useHistory();
    let { path, url } = useRouteMatch();
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState('');
    const getPayments = async () => {
        const getPaymentsResponse = await Axios.get(
            "/data/payments/payments.json"
            );
            // setLoading(false);
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
              />
            </div>
          </div>
        </div>
      </div>
        </Route>
        <Route path={`${path}/:ID`}>
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
