import React from "react";
import { Container, Row } from "react-bootstrap";
import { IilDto } from "../../../ill-repo-client"
import { DahmmDto } from "../../../ill-repo-client/models/dahmm-dto";
import { IilCard } from "../iil/iilCard";
import { DahmmCardAttribute } from "./DahmmCardAttribute";

export interface DahmmCardProp{
    nextFlow: DahmmDto;
    toIil?: IilDto;
}

export const DahmmCard = (
    {nextFlow, toIil}: DahmmCardProp
    ) =>
    <Container className="p-0">
        <Row>
            {nextFlow.condition && <DahmmCardAttribute nextFlow={nextFlow} type={'condition'} color="#161616" bgColor="#CBD4C2" />}
        </Row>
        <Row>
            { toIil && <IilCard iil={toIil} compact={true} /> }
        </Row>
    </Container>
