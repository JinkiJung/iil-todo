import React from "react";
import { NextFlowDto } from "../../../ill-repo-client"

export interface NextFlowCardAttributeProp{
    nextFlow: NextFlowDto;
    type: string;
    color: string;
    bgColor: string;
}

export const NextFlowCardAttribute = ({nextFlow, type, color, bgColor}: NextFlowCardAttributeProp) => {
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
