import React from "react";
import { Card, Button, ProgressBar } from "react-bootstrap";

const Course = ({ title, teacher, progress }) => {
  return (
    <Card className="mb-3">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Profesor: {teacher}
        </Card.Subtitle>
        <ProgressBar now={progress} label={`${progress}%`} />
        <Button varian="info" className="mt-2">
          Continuar
        </Button>
      </Card.Body>
    </Card>
  );
};

export default Course;
