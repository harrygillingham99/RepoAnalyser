import { Dropdown, Pagination, Row } from "react-bootstrap";

interface IPaginationHandlerProps {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

export const PaginationHandler = (props: IPaginationHandlerProps) => {
  const handlePaginationButtonPress = (type: "first" | "next" | "previous") => {
    switch (type) {
      case "first":
        props.setPage(1);
        break;
      case "next":
        props.setPage(props.page + 1);
        break;
      case "previous":
        if (props.page === 1) return;
        props.setPage(props.page - 1);
        break;
    }
  };

  return (
    <Row className="justify-content-center">
      <Dropdown className="pr-3">
        <Dropdown.Toggle variant="info">
          Page Size: {props.pageSize}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => props.setPageSize(10)}>
            10
          </Dropdown.Item>
          <Dropdown.Item onClick={() => props.setPageSize(25)}>
            25
          </Dropdown.Item>
          <Dropdown.Item onClick={() => props.setPageSize(50)}>
            50
          </Dropdown.Item>
          <Dropdown.Item onClick={() => props.setPageSize(75)}>
            75
          </Dropdown.Item>
          <Dropdown.Item onClick={() => props.setPageSize(100)}>
            100
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Pagination>
        <Pagination.First
          onClick={() => handlePaginationButtonPress("first")}
        />
        <Pagination.Prev
          onClick={() => handlePaginationButtonPress("previous")}
        />
        <Pagination.Item>{props.page}</Pagination.Item>
        <Pagination.Next onClick={() => handlePaginationButtonPress("next")} />
      </Pagination>
    </Row>
  );
};
