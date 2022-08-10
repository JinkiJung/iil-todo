import React from "react";
import { Badge } from "react-bootstrap";
import { IilDto } from "../../ill-repo-client";

export const getSummary = (
    iil: IilDto,
    ) =>
    <div >
        {iil.startIf && <span>when </span>}
        {iil.startIf && <Badge bg="warning">{iil.startIf}</Badge>}
        <Badge bg="secondary">{"Jinki"}</Badge>
        <Badge bg="primary">{iil.act}</Badge>
        {iil.endIf && <span>until </span>}
        {iil.endIf && <Badge bg="warning">{iil.endIf}</Badge>}
    </div>