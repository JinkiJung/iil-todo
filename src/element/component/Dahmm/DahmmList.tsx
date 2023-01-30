import React from "react";
import { IilDto } from "../../../ill-repo-client";
import { DahmmDto } from "../../../ill-repo-client/models/dahmm-dto";
import { DahmmCard } from "./DahmmCard";

export interface DahmmListProp{
    nextFlowList: DahmmDto[];
    iilList: IilDto[];
}

export const DahmmList = ({nextFlowList, iilList}: DahmmListProp) => {
    return (
        <>
        {}
        {
            nextFlowList.map((flow: DahmmDto, index) => 
            <DahmmCard
                nextFlow={flow}
                toIil={iilList?.find(i => i.id === flow.iilTo)}
                key={index}/>)
        }
        </>
    )
}