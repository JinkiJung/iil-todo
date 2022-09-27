import React from "react";
import { Badge, Col, Container, Row } from "react-bootstrap";
import { IilDto } from "../../../ill-repo-client";
import { IilCardAttribute } from "./iilCardAttribute";

export interface IiilSummaryProp {
    iil: IilDto;
    compact: boolean;
}

export const IilCard = (
    {iil, compact = false}: IiilSummaryProp
    ) =>
    <Container className="p-0">
            {
                !compact?
                <div className="d-flex">
                    <div>
                        {iil.startIf && <IilCardAttribute iil={iil} type={'startIf'} color="#161616" bgColor="#CBD4C2" />}
                    </div>
                    <div>
                        {iil.actor && <IilCardAttribute iil={iil} type={'actor'} color="#161616" bgColor="#FFFCFF" />}
                    </div>
                    <div>
                        {iil.act && <IilCardAttribute iil={iil} type={'act'} color="#161616" bgColor="#247BA0" />}
                    </div>
                    <div>
                        {iil.endIf && <IilCardAttribute iil={iil} type={'endIf'} color="#161616" bgColor="#C3B299" />}
                    </div>
                </div>:
                <div role="button"
                    style={{
                    border: "1px solid",
                    display: "inline-block",
                    borderInlineColor: "gray",
                    margin: "0 2px",
                    width: "160px",
                    userSelect: "none"
                    }}
                    tabIndex={0}
                className="card">
                    <div>{iil.startIf && <IilCardAttribute iil={iil} type={'startIf'} color="#161616" bgColor="#CBD4C2" />}</div>
                    <div>{iil.actor && <IilCardAttribute iil={iil} type={'actor'} color="#161616" bgColor="#FFFCFF" />}</div>
                    <div>{iil.act && <IilCardAttribute iil={iil} type={'act'} color="white" bgColor="#247BA0" />}</div>
                    <div>{iil.endIf && <IilCardAttribute iil={iil} type={'endIf'} color="#161616" bgColor="#C3B299" />}</div>
                </div>
            }
    </Container>