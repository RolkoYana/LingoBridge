import React from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";

const StudentCourseActivities = () => {
  const activities = [
    { name: "Actividad 1: Gramática", status: "pendiente" },
    { name: "Actividad 2: Vocabulario", status: "completado" },
  ];

  return (
    <Card>
      <Card.Header>Actividades</Card.Header>
      <ListGroup variant="flush">
        {activities.map((activity, i) => (
          <ListGroup.Item key={i}>
            {activity.name}{" "}
            <Badge
              bg={activity.status === "completado" ? "success" : "warning"}
            >
              {activity.status}
            </Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default StudentCourseActivities;
