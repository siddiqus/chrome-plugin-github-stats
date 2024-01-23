import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Card } from "react-bootstrap";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "PR Counts",
    },
  },
};

const colorNames = [
  "red",
  "maroon",
  "cornflowerblue",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
  "brown",
  "cyan",
  "magenta",
  "lime",
  "teal",
  "indigo",
  "violet",
  "black",
  "white",
  "gray",
  "lightgray",
  "darkgray",
  "olive",
  "navy",
  "aquamarine",
  "beige",
  "bisque",
  "blanchedalmond",
  "burlywood",
  "chartreuse",
  "chocolate",
  "coral",
  "darkcyan",
  "darkgoldenrod",
  "darkgreen",
  "darkkhaki",
  "darkmagenta",
  "darkolivegreen",
  "darkorange",
  "darkorchid",
  "darksalmon",
  "darkseagreen",
  "darkslateblue",
  "darkslategray",
  "darkturquoise",
  "darkviolet",
  "deeppink",
  "deepskyblue",
];

function UserPrChart({ months, userDataList }) {
  const data = {
    labels: months,
    datasets: userDataList.map((userData, index) => {
      return {
        label: userData.username,
        data: userData.statList.map((s) => s.prCount),
        borderColor: colorNames[index] || "red",
      };
    }),
  };
  return (
    <Card style={{ height: "400px", padding: "1em", marginBottom: "1em" }}>
      <Line options={options} data={data} />
    </Card>
  );
}

export default UserPrChart;
