import React, { MouseEventHandler } from "react";
import { Badge, Col, Container, Row } from "react-bootstrap";
import { IilDto } from "../../../ill-repo-client";
import { IilCardAttribute } from "./iilCardAttribute";

export interface IiilSummaryProp {
    iil: IilDto;
    compact: boolean;
    onModalShow?: MouseEventHandler<HTMLButtonElement>;
}

export const IilCard = (
    {iil, compact = false, onModalShow}: IiilSummaryProp
    ) =>
    <Container id={iil.id} onClick={onModalShow} className="p-0">
            {
                !compact?
                <div className="d-flex">
                    
                    {
                        
                        /*
                        <div>{iil.act && <IilCardAttribute iil={iil} type={'act'} color="161616" bgColor="#FFFFFF" />}</div>
                        <div>{iil.activateIf && <IilCardAttribute iil={iil} type={'activateIf'} color="#161616" bgColor="#FFFFFF" />}</div>
                        <div>{iil.finishIf && <IilCardAttribute iil={iil} type={'finishIf'} color="#161616" bgColor="#FFFFFF" />}</div>
                        */
                    }
                    <div>{iil.actor && <IilCardAttribute iil={iil} type={'actor'} color="#161616" bgColor="#FFFFFF" />}</div>
                </div> :
                <div role="button"
                    style={{
                        border: "0px solid",
                    display: "inline-block",
                    borderInlineColor: "gray",
                    margin: "0 2px",
                    maxWidth: "160px",
                    userSelect: "none"
                    }}
                    tabIndex={0}
                className="card">
                    {
                        /*
                        <div>{iil.act && <IilCardAttribute iil={iil} type={'act'} color="161616" bgColor="#FFFFFF" />}</div>
                    <div>{iil.activateIf && <IilCardAttribute iil={iil} type={'activateIf'} color="#161616" bgColor="#FFFFFF" />}</div>
                    <div>{iil.finishIf && <IilCardAttribute iil={iil} type={'finishIf'} color="#161616" bgColor="#FFFFFF" />}</div>
                        */
                    }
                    
                    <div>{iil.actor && <IilCardAttribute iil={iil} type={'actor'} color="#161616" bgColor="#FFFFFF" />}</div>
                </div>
            }
    </Container>