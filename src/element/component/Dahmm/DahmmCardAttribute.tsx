import React from "react";
import { DahmmDto } from "../../../ill-repo-client/models/dahmm-dto";

export interface DahmmCardAttributeProp{
    nextFlow: DahmmDto;
    type: string;
    color: string;
    bgColor: string;
}

export const DahmmCardAttribute = ({nextFlow, type, color, bgColor}: DahmmCardAttributeProp) => {
    const type2icon: any = {
        condition: "?",
        from: "from",
        to: "to",
        input: "input"
    }
    return <div style={{ width: "100%", height: "100%", backgroundColor: bgColor }}>
            <div style={{ fontSize: "16px", color: color, padding: "2px"}}>
                {type2icon[type]} {(nextFlow as any)[type]}
            </div>
        </div>
}
