import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
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
import { talentsPulseExtractDateToMonth } from "../../../utils";

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

const WidgetBarScreen = ({ sectors, dcts }) => {
  // States
  const [data, setData] = useState([]);

  // Init
  useEffect(() => {
    handleOnGetData();
  }, [sectors, dcts]);

  const optionsBar = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Evolution effectifs par Business Unit",
      },
    },
  };

  const labelsBar = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Novembre",
    "Décembre",
  ];

  const dataBar = {
    labels: labelsBar,
    datasets: data,
  };

  // Functions
  const handleOnGetData = () => {
    let dataArray = [];
    sectors?.map((sector, index) => {
      dataArray.push({
        label: sector.code,
        backgroundColor: sector.colorRgb,
        data: labelsBar.map(
          (month, i) =>
            dcts?.filter(
              (dct, j) =>
                talentsPulseExtractDateToMonth(dct.createdAt.split("-")[1]) ===
                  month && dct.sector.code === sector.code
            )?.length
        ),
      });
    });
    setData(dataArray);
  };

  // Render
  return <Bar options={optionsBar} data={dataBar} />;
};

export default WidgetBarScreen;
