import React from "react";
import Popup from "reactjs-popup";
import DeleteButton from "../../hooksComponent/DeleteButton";
import { IOperationParam } from "../model/operationParam";
import { getBrandNewIil } from "../model/iilManager";
import { FlowButton } from "./flowButton";
import { IilDto } from "../../models";
import { validateIil } from "./iilValidator";
import { Button } from "react-bootstrap";

export const renderAddButton = (
  iilDto: IilDto,
  createIil: Function,
) => {
  return (
    <Button
      className="item_btn highlighted"
      onClick={() => {
        if(validateIil(iilDto)) {
          createIil(iilDto);
        }
        else{
          alert("You have empty field!");
        }
      }}
    >
      Add new
    </Button>
  );
};

export const renderDeleteButton = (
  iilDto: IilDto,
  deleteIil: Function,
) => {
  return (
    <DeleteButton
            open={false}
            title={`Are you sure to delete this?`}
            message={`${iilDto.act}`}
            onConfirmCallback={() =>
              deleteIil(iilDto)
            }
            onCancelCallback={() => console.log()}
          />
  );
};

export const renderAddButtonForNewField = (
  iilList: IilDto[],
  onIilListChange: Function,
  param: IOperationParam,
  name: string
) => {
  return (
    <button
      className="item_btn highlighted"
      onClick={() => {
        console.log(param);
        //const newIil = getBrandNewIil(name, param.ownerId, "", param.ownerId);
        onIilListChange([
          ...iilList,
          //newIil,
        ]);
      }}
    >
      +
    </button>
  );
};

export const renderDragButton = (
  iilDto: IilDto
) => {
  return (
    <FlowButton />
  );
};

export const getDraggableButton = () => 
<Button className="item_btn_draggable"></Button>