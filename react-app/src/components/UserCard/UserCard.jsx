import { Card, ListGroup, ListGroupItem, Table } from "react-bootstrap";
import { getMonthsBetween } from "../../services/utils";
import { mockData } from "./data";

export function UserCard({ startDate, endDate }) {
  const userData = mockData;
  const months = getMonthsBetween(startDate, endDate);
  console.log(months);

  return (
    <Card style={{ padding: "1em" }}>
      <Table borderless>
        <thead>
          <tr>
            <th>{userData.username}</th>
            {months.map((month, index) => (
              <th index={`month-${index}`}>{month}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <ListGroup variant="flush">
                <ListGroupItem>
                  PR Count ({userData.totalPrCounts})
                </ListGroupItem>
                <ListGroupItem>
                  PR Comments Avg ({userData.averageCommentsPerPr})
                </ListGroupItem>
                <ListGroupItem>
                  PR Comments (max)
                </ListGroupItem>
              </ListGroup>
            </td>

            {months.map((month, index) => {
              const monthData = userData.statList.find(
                (s) => s.month === month
              );

              return (
                <td>
                  <ListGroup variant="flush" key={`listgroup-${index}`}>
                    <ListGroupItem>{monthData?.prCount || 0}</ListGroupItem>
                    <ListGroupItem>
                      {monthData?.averageNumberOfComments || 0}
                    </ListGroupItem>
                    <ListGroupItem>
                      {monthData?.maxNumberOfComments || 0}
                    </ListGroupItem>
                  </ListGroup>
                </td>
              );
            })}
          </tr>
        </tbody>
      </Table>
    </Card>
  );
}
