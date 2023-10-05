import React from "react"
import { Badge } from "react-bootstrap"
import { IilDto } from "../../../ill-repo-client"

export interface IiilCardAttributeProp {
    value: string;
    type: string;
    color: string;
    bgColor: string;
}

export const IilCardAttribute = ({value, type, color, bgColor}: IiilCardAttributeProp) => {
    return <div style={{ width: "100%", height: "100%", backgroundColor: bgColor }}>
            <div contentEditable="true" style={{ fontSize: "16px", color: color, padding: "2px"}}>
                {value}
            </div>
        </div>
}
