import { Container } from "react-bootstrap";
import UserPicker from "./components/UserPicker/UserPicker";
import { useState } from "react";
import { UserCard } from "./components/UserCard/UserCard";

function App() {
  const [data, setData] = useState({});

  function onSubmit({ startDate, endDate, usernames }) {
    setData({ startDate, endDate, usernames });
  }

  return (
    <Container>
      <br />
      <h2>Github Stats</h2>
      <hr />
      <UserPicker onSubmit={onSubmit} />
      <hr />
      {data ? (
        <UserCard startDate={data.startDate} endDate={data.endDate}></UserCard>
      ) : (
        <></>
      )}
      <br />
    </Container>
  );
}

export default App;
