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
  const [errorMessage, setErrorMessage] = useState("");

  async function onSubmit({ startDate, endDate, usernames }) {
    const months = getMonthsBetween(
      startDate || new Date(),
      endDate || new Date()
    );
    setMonths(months);

    setDataStatus(statusMap.LOADING);

    try {
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
    } catch (error) {
      setErrorMessage(error.message);
      setDataStatus(statusMap.ERROR);
    }
  }

  const isLoaded = dataStatus === statusMap.LOADED;
  const isLoading = dataStatus === statusMap.LOADING;
  const isError = dataStatus === statusMap.ERROR;

  return (
    <Container>
      <br />
      <h2>Github Stats</h2>
      <hr />
      <UserPicker onSubmit={onSubmit} />
      <hr />

      {isLoading ? <h4>Loading...</h4> : <></>}
      {isError ? <h4 style={{ color: "red" }}> {errorMessage}</h4> : <></>}

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
