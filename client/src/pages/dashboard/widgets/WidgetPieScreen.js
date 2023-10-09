import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import * as _ from "lodash/fp";
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

const WidgetPieScreen = ({ dcts, expertises, unit }) => {
  // States
  const [data, setData] = useState([]);
  const [labelsPie, setLabelsPie] = useState([]);
  const [backgroundColor, setBackgroundColor] = useState([]);

  // Init
  useEffect(() => {
    handleOnSetOptions();
  }, [dcts]);

  useEffect(() => {
    handleOnGetData();
  }, [labelsPie]);

  const optionsPie = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: `Métiers par Business Unit ${unit}`,
      },
    },
  };

  const dataPie = {
    labels: labelsPie,
    datasets: [
      {
        data,
        backgroundColor,
        hoverOffset: 4,
      },
    ],
  };

  console.log(expertises);
  // Functions
  const handleOnSetOptions = () => {
    setLabelsPie(
      expertises
        ?.filter((expertise) => expertise?.parent.code === unit)
        .map((label) => label.name)
    );
    setBackgroundColor(
      expertises
        ?.filter((expertise) => expertise?.parent.code === unit)
        .map((color) => color.colorRgb)
    );
  };

  const handleOnGetData = () => {
    let dataArray = [];
    labelsPie?.map((label, index) => {
      dataArray.push(
        dcts?.filter(
          (dct, j) => dct?.expertise?.name === label && dct.sector.code === unit
        )?.length
      );
    });
    setData(dataArray);
  };

  // Render
  return <Pie options={optionsPie} data={dataPie} />;
};

export default WidgetPieScreen;
