import React from "react";
import moment from "moment";
import * as Rsuite from "rsuite";
import { Locale } from "../../constants/daterangepicker";
const DateRangePicker = (props) => {
  const {selectedDate, selectedDateHandler, style, placement, className} = props;

  return (
    <Rsuite.DateRangePicker
      locale={Locale}
      onChange={async (value) => {
        const selectedDateObject = {
          startDate: moment(value[0]).unix(),
          endDate: moment(value[1]).unix(),
        };
        selectedDateHandler(selectedDateObject);
      }}
      ranges={[
        {
        label: 'Dün',
        value: [moment().subtract(1, 'day').format(), moment().subtract(1, 'day').format()]
      }, 
      {
        label: 'Bugün',
        value: [new Date(), new Date()]
      }, 
      {
        label: 'Yarın',
        value: [moment().add(1, 'day').format(), moment().add(1, 'day').format()]
      }, 
      {
        label: 'Son 7 gün',
        value: [moment().subtract(7, 'days').format(), new Date()]
      },
      {
        label: 'Son 30 gün',
        value: [moment().subtract(30, 'days').format(), new Date()]
      }
    ]}
      style={style}
      placement={placement}
      className={className}
      value={[
        moment(selectedDate.startDate * 1000)._d,
        moment(selectedDate.endDate * 1000)._d,
      ]}
    />
  );
}

export default DateRangePicker;
