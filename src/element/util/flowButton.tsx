import React from "react"
import { FC } from "react"
import { Button } from "react-bootstrap"
import { useDrag } from "react-dnd"
import { ItemTypes } from "../model/itemType"
  
export const FlowButton: FC = () => {
const [, drag] = useDrag(() => ({ type: ItemTypes.FLOW }))
return (
    <Button ref={drag} className={"draggable"}>
    Drag
    </Button>
)
}
