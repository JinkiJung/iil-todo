import React from "react";
import { Button, ButtonGroup, Col, Row } from "react-bootstrap";
import { PageContext } from "../../type/pageContext";

export interface IPageHeader {
    setPageContext: (arg0: PageContext) => void;
}

export const PageHeader = ({
    setPageContext,
  }: IPageHeader) => 
        <Row className="mx-0 p-2" id="pageHeader">
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
