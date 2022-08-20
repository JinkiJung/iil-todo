import React from "react"
import { Badge } from "react-bootstrap"
import { IilDto } from "../../../ill-repo-client"

export interface IiilAttributeProp {
    iil:IilDto;
    name: string;
    color: string;
    bgColor: string;
}

export const IilAttribute = ({iil, name, color, bgColor}: IiilAttributeProp) => {
    return <div style={{ width: "100%", height: "100%", backgroundColor: bgColor }}>
            <div style={{ fontSize: "14px", color: "#313131", padding: "2px"}}>
                {name}
            </div>
            <div style={{ fontSize: "18px", color: color, padding: "2px"}}>
                {(iil as any)[name]}
            </div>
        </div>
}
