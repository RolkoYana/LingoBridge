import React from "react";
import { Card, ListGroup } from "react-bootstrap";

const StudentCourseMaterial = () => {
  const materials = [
    { type: "PDF", url: "#" },
    { type: "Presentación", url: "#" },
    { type: "Video", url: "#" },
  ];

  return (
    <Card>
      <Card.Header>Material del curso</Card.Header>
      <ListGroup variant="flush">
        {materials.map((item, i) => (
          <ListGroup.Item key={i}>
            {item.type} - <a href={item.url}>Ver</a>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default StudentCourseMaterial;
