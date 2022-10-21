import React from "react";
import { Container, Row } from "react-bootstrap";
import { IilDto, NextFlowDto } from "../../../ill-repo-client"
import { IilCard } from "../iil/iilCard";
import { NextFlowCardAttribute } from "./NextFlowCardAttribute";

export interface NextFlowCardProp{
    nextFlow: NextFlowDto;
    toIil?: IilDto;
}

export const NextFlowCard = (
    {nextFlow, toIil}: NextFlowCardProp
    ) =>
    <Container className="p-0">
        <Row>
            {nextFlow.condition && <NextFlowCardAttribute nextFlow={nextFlow} type={'condition'} color="#161616" bgColor="#CBD4C2" />}
        </Row>
        <Row>
            { toIil && <IilCard iil={toIil} compact={true} /> }
        </Row>
    </Container>
