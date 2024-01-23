import { Container } from "react-bootstrap";
import UserPicker from "./components/UserPicker/UserPicker";

function App() {
  return (
    <Container>
      <br />
      <h2>Github Stats</h2>
      <hr />
      <UserPicker />
      <br />
      <br />
    </Container>
  );
}

export default App;
