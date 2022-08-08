import React from "react";
import { IilDto } from "../../ill-repo-client";

export const iilButton = (iil: IilDto, onClick: () => void) => 
    <div onClick={onClick}>
        <div>{iil.actor}</div>
        <div>{iil.act}</div>
    </div>