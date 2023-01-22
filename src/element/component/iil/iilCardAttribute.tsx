import React from "react"
import { Badge } from "react-bootstrap"
import { IilDto } from "../../../ill-repo-client"

export interface IiilCardAttributeProp {
    iil:IilDto;
    type: string;
    color: string;
    bgColor: string;
}

export const IilCardAttribute = ({iil, type, color, bgColor}: IiilCardAttributeProp) => {
    const type2icon: any = {
        activateIf: "💡",
        actor: "👤",
        act: "💪",
        finishIf: "🏁"
    }
    return <div style={{ width: "100%", height: "100%", backgroundColor: bgColor }}>
            <div style={{ fontSize: "16px", color: color, padding: "2px"}}>
                {type2icon[type]} {(iil as any)[type]}
            </div>
        </div>
}
