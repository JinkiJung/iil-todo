import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { IilDto } from "../../../ill-repo-client";
import { IilSummary } from "./iilSummary";

export interface IiilSummaryListProp {
    iils: IilDto[];
}

export const IilSummaryList = (
    {iils}: IiilSummaryListProp
    ) =>
    <Container>
        <Row>
            {
                iils.map((iil) => <Col>
                                    <IilSummary iil={iil} />
                                </Col>
                )
            }
        </Row>
    </Container>