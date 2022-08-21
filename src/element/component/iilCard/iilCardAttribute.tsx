import React from "react"
import { Badge } from "react-bootstrap"
import { IilDto } from "../../../ill-repo-client"

export interface IiilCardAttributeProp {
    iil:IilDto;
    name: string;
    color: string;
    bgColor: string;
}

export const IilCardAttribute = ({iil, name, color, bgColor}: IiilCardAttributeProp) => {
    return <div style={{ width: "100%", height: "100%", backgroundColor: bgColor }}>
            <div style={{ fontSize: "13px", color: "#666666", padding: "2px"}}>
                {name}
            </div>
            <div style={{ fontSize: "16px", color: color, padding: "2px"}}>
                {(iil as any)[name]}
            </div>
        </div>
}
