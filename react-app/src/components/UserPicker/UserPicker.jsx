import { Form, Row, Button, Alert, Col } from "react-bootstrap";
import "./UserPicker.css";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { formatDate } from "../../services/utils";

function UserPicker({ onSubmit }) {
  const [usernames, setUsernames] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  function handleKeyDown(e) {
    if (e.key !== "Enter") return;

    const value = e.target.value;

    if (!value.trim()) return;

    const valueSplit = value.split(",").map((v) => v.trim());
    setUsernames(Array.from(new Set([...usernames, ...valueSplit])));
    e.target.value = "";
  }

  function removeTag(index) {
    setUsernames(usernames.filter((el, i) => i !== index));
  }

  function handleUserPicketInputChange(event) {
    if (["Backspace", "Delete"].includes(event.key)) {
      setUsernames([...usernames.slice(0, -1)]);
      return;
    }
  }

  function clearUsernames() {
    setUsernames([]);
  }

  async function handleSubmit() {
    setErrorMessage("");

    if (!startDate || !endDate || !usernames.length) {
      setErrorMessage("StartDate, End Date and Usernames required");
      return;
    }
    const startDateFormatted = formatDate(startDate);
    const endDateFormatted = formatDate(endDate);

    setIsLoading(true);
    await onSubmit({
      startDate: startDateFormatted,
      endDate: endDateFormatted,
      usernames,
    });
    setIsLoading(false);
  }

  return (
    <div style={{ opacity: `${isLoading ? 60 : 100}%` }}>
      <div className="tags-input-container">
        {usernames.map((tag, index) => (
          <div className="tag-item" key={index}>
            <span className="text">{tag}</span>
            <span className="close" onClick={() => removeTag(index)}>
              &times;
            </span>
          </div>
        ))}
        <input
          onKeyDown={handleKeyDown}
          onKeyDownCapture={handleUserPicketInputChange}
          type="text"
          className="tags-input"
          placeholder="Type in Github usernames"
          disabled={isLoading}
        />
        {usernames.length ? (
          <Button size="sm" variant="light" onClick={clearUsernames}>
            {" "}
            Clear All{" "}
          </Button>
        ) : (
          <></>
        )}
      </div>

      <Form style={{ paddingTop: "10px" }}>
        <Row style={{ display: "inline-flex" }}>
          <div style={{ flex: 1 }}>
            <ReactDatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Start Date"
              disabled={isLoading}
            />
          </div>

          <div style={{ flex: 1 }}>
            <ReactDatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="End Date"
              disabled={isLoading}
            />
          </div>
          <div style={{ flex: 1 }}>
            <Button disabled={isLoading} onClick={handleSubmit}>
              Calculate Stats
            </Button>
          </div>
        </Row>
        <Row style={{ marginTop: "1em" }}>
          <Col>
            {errorMessage ? (
              <Alert variant="danger">{errorMessage}</Alert>
            ) : (
              <></>
            )}
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default UserPicker;
