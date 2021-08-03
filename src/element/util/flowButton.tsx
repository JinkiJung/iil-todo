import React from "react"
import { FC } from "react"
import { useDrag } from "react-dnd"
import { ItemTypes } from "../model/itemType"
  
export const FlowButton: FC = () => {
const [, drag] = useDrag(() => ({ type: ItemTypes.FLOW }))
return (
    <div ref={drag} className={"draggable"}>
    
    </div>
)
}
  