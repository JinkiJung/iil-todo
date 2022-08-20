import React from "react";
import { Badge, Col, Container, Row } from "react-bootstrap";
import { IilDto } from "../../../ill-repo-client";
import { IilAttribute } from "./iilAttribute";

export interface IiilSummaryProp {
    iil: IilDto;
}

export const IilSummary = (
    {iil}: IiilSummaryProp
    ) =>
    <Container>
        <Row>
            <Col>
                {iil.startIf && <IilAttribute iil={iil} name={'startIf'} color="#161616" bgColor="#CBD4C2" />}
            </Col>
            <Col>
                {iil.actor && <IilAttribute iil={iil} name={'actor'} color="#161616" bgColor="#FFFCFF" />}
            </Col>
            <Col>
                {iil.act && <IilAttribute iil={iil} name={'act'} color="white" bgColor="#247BA0" />}
            </Col>
            <Col>
                {iil.endIf && <IilAttribute iil={iil} name={'endIf'} color="#161616" bgColor="#C3B299" />}
            </Col>
        </Row>
    </Container>