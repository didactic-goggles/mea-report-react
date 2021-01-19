import React from "react";
import moment from "moment";
import * as Rsuite from "rsuite";
import { Locale } from "../../constants/daterangepicker";
const DateRangePicker = (props) => {
  const {selectedDate, selectedDateHandler} = props;

  return (
    <Rsuite.DateRangePicker
      placement={"bottomEnd"}
      locale={Locale}
      onChange={async (value) => {
        const selectedDateObject = {
          startDate: moment(value[0]).unix(),
          endDate: moment(value[1]).unix(),
        };
        selectedDateHandler(selectedDateObject);
      }}
      value={[
        moment(selectedDate.startDate * 1000)._d,
        moment(selectedDate.endDate * 1000)._d,
      ]}
    />
  );
}

export default DateRangePicker;
