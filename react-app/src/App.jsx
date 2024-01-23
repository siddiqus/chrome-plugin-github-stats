import { Container } from "react-bootstrap";
import UserPicker from "./components/UserPicker/UserPicker";
import { useState } from "react";
import { UserCard } from "./components/UserCard/UserCard";
import UserPrChart from "./components/UserPRChart/UserPrChart";
import { getMonthsBetween } from "./services/utils";
import { mockData, mockData2 } from "./components/UserCard/data";

function App() {
  const [data, setData] = useState({});

  function onSubmit({ startDate, endDate, usernames }) {
    setData({ startDate, endDate, usernames });
  }

  const months = getMonthsBetween(
    data.startDate || new Date(),
    data.endDate || new Date()
  );

  return (
    <Container>
      <br />
      <h2>Github Stats</h2>
      <hr />
      <UserPicker onSubmit={onSubmit} />
      <hr />
      {data.startDate ? (
        <UserPrChart
          months={months}
          userDataList={[mockData, mockData2]}
        ></UserPrChart>
      ) : (
        <></>
      )}

      {data.startDate ? (
        [mockData, mockData2].map((d, index) => {
          return (
            <UserCard
              key={`data-${index}`}
              userData={d}
              months={months}
            ></UserCard>
          );
        })
      ) : (
        <></>
      )}
      <br />
    </Container>
  );
}

export default App;
