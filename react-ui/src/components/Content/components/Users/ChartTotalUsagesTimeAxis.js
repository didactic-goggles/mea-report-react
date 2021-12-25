import React, { useState, useEffect, useRef } from 'react';
import Chart from 'react-apexcharts';

import moment from 'moment';
import colors from '../../../../constants/colors';

const ChartTotalUsagesTimeAxis = (props) => {
  const { series, dates } = props;
  const chartTotalUsages = useRef();
  const [showAllSeries, setShowAllSeries] = useState(true);
  // const [series, setSeries] = useState(seriesData);

  const options = {
    series: series.filter((s) => s.showCategory),
    options: {
      chart: {
        events: {
          legendClick: function (chartContext, seriesIndex, config) {
            // series.forEach((s, i) => {
            //   if (i === seriesIndex) {
            //     chartContext.showSeries(s.name);
            //   } else {
            //     chartContext.hideSeries(s.name);
            //   }
            // });
            // chartContext.showSeries(series[seriesIndex].name);
          },
        },
        type: 'bar',
        height: 550,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],

      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
        },
      },
      xaxis: {
        type: 'date',
        categories: dates.map((d) => moment(d * 1000).format('DD/MM/YYYY')),
      },
      legend: {
        position: 'bottom',
        offsetX: -10,
        offsetY: 0,
        onItemClick: {
          toggleDataSeries: false,
        },
      },
      fill: {
        opacity: 1,
      },
      colors: colors,
      zoom: {
        enabled: true,
        type: 'x',
        resetIcon: {
          offsetX: -10,
          offsetY: 0,
          fillColor: '#fff',
          strokeColor: '#37474F',
        },
        selection: {
          background: '#90CAF9',
          border: '#0D47A1',
        },
      },
    },
  };

  // useEffect(() => {
  //   console.log(series, dates)
  // }, [series])

  if (series.length === 0 || dates.length === 0) return <div></div>;
  return (
    <div id="chart-totalUsages">
      <button
        onClick={(e) => {
          series.forEach((s) => {
            s.showCategory = !showAllSeries;
          })
          // setSeries((currentSeries) => {
          //   return currentSeries.map((serie) => {
          //     serie.showCategory = !showAllSeries;
          //     return serie;
          //   });
          // });
          setShowAllSeries(!showAllSeries);
        }}
      >
        Hepsini Gizle/Göster
      </button>
      <Chart
        options={options.options}
        series={options.series}
        type="bar"
        ref={chartTotalUsages}
        height={options.options.chart.height}
      />
    </div>
  );
};

export default ChartTotalUsagesTimeAxis;
