import React, { useEffect, useState } from "react";
import { useRouteMatch, Route, Switch, useHistory } from "react-router-dom";
import {
  Spinner,
  Badge,
  Button,
  OverlayTrigger,
  Popover,
  Form,
} from "react-bootstrap";
import Datatable from "react-data-table-component";
import moment from "moment";
import Axios from "axios";
import { DateRangePicker } from "rsuite";
import PaymentDetails from "./PaymentDetails";

import { Locale } from "../../../../constants/daterangepicker";
const Payments = () => {
  console.log("Rendering => Payments");
  let history = useHistory();
  let { path, url } = useRouteMatch();
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedDate, setSelectedDate] = useState({
    startDate: moment().subtract(7, "days").unix(),
    endDate: moment().unix(),
  });
  const getPayments = async (dateObject) => {
    setPending(true);
    const getPaymentsResponse = await Axios.get(
      `/db/payments?Created_gte=${dateObject.startDate}&Created_lte=${dateObject.endDate}`
    );
    setPayments(getPaymentsResponse.data);
    setPending(false);
  };

  const columns = React.useMemo(() => [
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
  ]);

  useEffect(() => {
    setLoading(true);
    const getter = async () => {
      getPayments({
        startDate: moment().subtract(7, "days").unix(),
        endDate: moment().unix(),
      });
      setLoading(false);
    };
    getter();
  }, []);

  useEffect(() => {
    getPayments(selectedDate);
  }, [selectedDate]);

  const Filters = () => (
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
  );

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
                      history.push(`/payments/${event.ID}`);
                    }}
                    subHeader
                    subHeaderComponent={<Filters />}
                    progressPending={pending}
                    progressComponent={loadingComponent}
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
                  <PaymentDetails selectedPayment={selectedPayment} />
                </div>
              </div>
            </div>
          </div>
        </Route>
      </Switch>
    </>
  );
};

export default Payments;
