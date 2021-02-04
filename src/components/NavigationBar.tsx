import { apiClient } from "@services/api/Index";
import { AppContainer } from "@state/AppState";
import { Routes } from "@typeDefinitions/Routes";
import { buildUserInfo } from "@utils/ClientInfo";
import React from "react";
import {
  Button,
  Form,
  FormControl,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import useEffectOnce from "react-use/lib/useEffectOnce";

export const NavigationBar = () => {
  const { state, setState } = AppContainer.useContainer();
  useEffectOnce(() => {
    (async () => {
      var redirectUrl = await apiClient.authentication_GetLoginRedirectUrl(
        buildUserInfo()
      );
      setState({ loginRedirectUrl: redirectUrl });
    })();
  });

  return (
    <Navbar bg="dark" variant="dark" expand="lg" style={{ zIndex: 9999 }}>
      <Navbar.Brand href="#home">Repo Analyser</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link to={Routes.Home}>
            <Nav.Link>Home</Nav.Link>
          </Link>
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item href={state.loginRedirectUrl}>
              Githoob
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              Another action
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">
              Separated link
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
        <Form inline>
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
          <Button variant="outline-success">Search</Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};
