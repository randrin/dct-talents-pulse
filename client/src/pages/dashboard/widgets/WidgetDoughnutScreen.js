import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const WidgetDoughnutScreen = ({ sectors, dcts }) => {
  // States
  const [data, setData] = useState([]);
  const [labelsDoughnut, setLabelsDoughnut] = useState([]);

  // Init
  useEffect(() => {
    handleOnGetData();
  }, [sectors, dcts]);

  const optionsDoughnut = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Total candidats par Business Unit",
      },
    },
  };

  const dataDoughnut = {
    labels: labelsDoughnut,
    datasets: [
      {
        data,
        backgroundColor: sectors.map((sector) => sector.colorRgb),
        hoverOffset: 4,
      },
    ],
  };

  // Functions
  const handleOnGetData = () => {
    setLabelsDoughnut(sectors?.map((sector) => sector.code));
    let dataArray = [];
    sectors?.map((sector, index) => {
      dataArray.push(
        dcts.filter((dct, j) => dct.sector.code === sector.code)?.length
      );
    });
    setData(dataArray);
  };

  // Render
  return <Doughnut options={optionsDoughnut} data={dataDoughnut} />;
};

export default WidgetDoughnutScreen;
