import React from "react";
import { Button, ButtonGroup, Col, Container, FloatingLabel, Form, Row } from "react-bootstrap";
import { PageContext } from "../../type/pageContext";

export interface IPageHeader {
    setPageContext: (arg0: PageContext) => void;
}

export const PageHeader = ({
    setPageContext,
  }: IPageHeader) => 
  <Container id="pageHeader">
    <Row className="mx-0 p-2">
        <Col>
            <FloatingLabel controlId="floatingSelect" label="Namespace">
            <Form.Select aria-label="Floating label select example">
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </Form.Select>
            </FloatingLabel>
        </Col>
        <Col>
        <Button>Login</Button>
        </Col>
    </Row>
    <Row className="mx-0 p-2">
        <Col>
        <ButtonGroup className="d-flex">
            <Button variant="secondary" className="mx-1"
            onClick={() => {setPageContext(PageContext.Graph); document.getElementById("background")?.classList.replace("bg_normal", "bg_focus");}}>
                Graph
            </Button>
            <Button variant="primary" className="mx-1"
            onClick={() => {setPageContext(PageContext.FocusedList); document.getElementById("background")?.classList.replace("bg_focus", "bg_normal");}}>
                Focused
            </Button>
            <Button variant="success" className="mx-1"
            onClick={() => {setPageContext(PageContext.List); document.getElementById("background")?.classList.replace("bg_focus", "bg_normal");}}>
                List
            </Button>
        </ButtonGroup>
        </Col>
    </Row>
  </Container>
        
