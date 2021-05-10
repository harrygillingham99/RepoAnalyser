import { Routes } from "@typeDefinitions/Routes";
import clsx from "clsx";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

interface IErrorScreenProps {
  title: string;
  message: string;
  redirectTo: Routes;
  redirectSubtitle: string;
  type?: ErrorType;
}

type ErrorType = "tabError" | "error";

export const ErrorScreen = (props: IErrorScreenProps) => {
  const getDisplayClass = (type: ErrorType) =>
    type === "error" ? "display-1" : "display-4";
  return (
    <div
      className={clsx(
        props.type === "tabError" && "mt-4",
        "page-wrap d-flex flex-row align-items-center"
      )}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={12} className="text-center">
            <span
              className={clsx(
                getDisplayClass(props.type ?? "error"),
                "d-block"
              )}
            >
              {props.title}
            </span>
            <div className="mb-4 lead">{props.message}</div>
            <Link to={props.redirectTo} className="btn btn-link">
              {props.redirectSubtitle}
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
