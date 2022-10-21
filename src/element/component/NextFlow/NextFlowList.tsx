import React from "react";
import { IilDto, NextFlowDto } from "../../../ill-repo-client";
import { NextFlowCard } from "./NextFlowCard";

export interface NextFlowListProp{
    nextFlowList: NextFlowDto[];
    iilList: IilDto[];
}

export const NextFlowList = ({nextFlowList, iilList}: NextFlowListProp) => {
    return (
        <>
        {}
        {
            nextFlowList.map((flow: NextFlowDto, index) => 
            <NextFlowCard
                nextFlow={flow}
                toIil={iilList?.find(i => i.id === flow.to)}
                key={index}/>)
        }
        </>
    )
}