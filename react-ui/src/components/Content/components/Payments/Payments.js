import React, { useEffect, useState } from "react";
import { useRouteMatch, Route, Switch, useHistory } from "react-router-dom";
import Datatable from "react-data-table-component";
import moment from "moment";
import API from "../../../../api";
import PaymentDetails from "./PaymentDetails";
import DateRangePicker from "../../../UI/DateRangePicker";
import LoadingIndicator from "../../../UI/LoadingIndicator";


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
    const getPaymentsResponse = await API.get(
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

  // useEffect(() => {
  //   setLoading(true);
  //   const getter = async () => {
  //     getPayments({
  //       startDate: moment().subtract(7, "days").unix(),
  //       endDate: moment().unix(),
  //     });
  //     setLoading(false);
  //   };
  //   getter();
  // }, []);

  useEffect(() => {
    setLoading(true);
    const getter = async () => {
      await getPayments(selectedDate);
      setLoading(false);
    };
    getter();
  }, [selectedDate]);

  const Filters = () => (
    <div className="d-flex justify-content-end">
      <DateRangePicker selectedDateHandler={setSelectedDate} selectedDate={selectedDate}/>
    </div>
  );

  if (loading) {
    return <LoadingIndicator/>;
  }
  return (
    <>
      <Switch>
        <Route exact path={path}>
          <div class="row">
            <div class="col-lg-12">
              <div class="mb-3 card">
                <div class="card-body">
                  <Filters />
                  <Datatable
                    title="Ödemeler"
                    columns={columns}
                    data={payments}
                    pagination
                    onRowClicked={(event) => {
                      setSelectedPayment(event);
                      history.push(`/payments/${event.id}`);
                    }}
                    // subHeader
                    // subHeaderComponent={<Filters />}
                    // progressPending={pending}
                    // progressComponent={<LoadingIndicator />}
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
