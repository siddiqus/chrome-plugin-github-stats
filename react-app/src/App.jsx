import { Container } from "react-bootstrap";
import UserPicker from "./components/UserPicker/UserPicker";
import { useState } from "react";
import { UserCard } from "./components/UserCard/UserCard";
import UserPrChart from "./components/UserPRChart/UserPrChart";
import { getMonthsBetween } from "./services/utils";
import { getUserData } from "./services/github.service";

const statusMap = {
  LOADING: "loading",
  NO_DATA: "no-data",
  LOADED: "loaded",
  ERROR: "error",
};

function App() {
  const [dataStatus, setDataStatus] = useState(statusMap.NO_DATA);

  const [months, setMonths] = useState([]);
  const [userDataList, setUserDataList] = useState([]);

  async function onSubmit({ startDate, endDate, usernames }) {
    const months = getMonthsBetween(
      startDate || new Date(),
      endDate || new Date()
    );
    setMonths(months);

    setDataStatus(statusMap.LOADING);

    const data = await Promise.all(
      usernames.map((u) =>
        getUserData({
          author: u,
          startDate,
          endDate,
        })
      )
    );
    setUserDataList(data);
    setDataStatus(statusMap.LOADED);
  }

  const isLoaded = dataStatus === statusMap.LOADED;
  const isLoading = dataStatus === statusMap.LOADING;

  return (
    <Container>
      <br />
      <h2>Github Stats</h2>
      <hr />
      <UserPicker onSubmit={onSubmit} />
      <hr />

      <h4>{isLoading ? "Loading..." : <></>}</h4>

      {isLoaded ? (
        <UserPrChart months={months} userDataList={userDataList}></UserPrChart>
      ) : (
        <></>
      )}

      {isLoaded ? (
        userDataList.map((d, index) => {
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
