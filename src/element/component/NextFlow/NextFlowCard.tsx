import React from "react";
import { Container } from "react-bootstrap";
import { NextFlowDto } from "../../../ill-repo-client"
import { NextFlowCardAttribute } from "./NextFlowCardAttribute";

export interface NextFlowCardProp{
    nextFlow: NextFlowDto;
}

export const NextFlowCard = (
    {nextFlow}: NextFlowCardProp
    ) =>
    <Container className="p-0">
        {
            <div className="d-flex">
                <div>
                    {nextFlow.condition && <NextFlowCardAttribute nextFlow={nextFlow} type={'condition'} color="#161616" bgColor="#CBD4C2" />}
                </div>
                <div>
                    {nextFlow.input && <NextFlowCardAttribute nextFlow={nextFlow} type={'input'} color="#161616" bgColor="#247BA0" />}
                </div>
                <div>
                    {nextFlow.to && <NextFlowCardAttribute nextFlow={nextFlow} type={'to'} color="#161616" bgColor="#FFFCFF" />}
                </div>
            </div>
        }
    </Container>
