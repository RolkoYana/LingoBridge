import React from "react";
import { ListGroup } from "react-bootstrap";

const StudentActivities = () => {
  const activities = [
    { type: "Evaluación", date: "2025-05-10" },
    { type: "Clase en vivo", date: "2025-05-12" },
  ];
  return (
    <div className="mt-3">
      <h5>Próximas actividades</h5>
      <ListGroup>
        {activities.map((a, i) => (
          <ListGroup.Item key={i}>
            {a.type} - {a.date}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default StudentActivities;
