import React, { MouseEventHandler } from "react";
import DeleteButton from "../../hooksComponent/DeleteButton";
import { IOperationParam } from "../model/operationParam";
import { FlowButton } from "./flowButton";
import { validateIil } from "./iilValidator";
import { Button, ButtonGroup } from "react-bootstrap";
import { IilDto } from "../../ill-repo-client";

export const renderAddButton = (
  iil: IilDto,
  isDirty: boolean,
  createIil: Function,
) => {
  return (
    <ButtonGroup className="d-flex">
      <Button
      disabled={!isDirty}
      className="item_btn highlighted"
      onClick={() => {
        if(validateIil(iil)) {
          createIil(iil);
        }
        else{
          alert("You have empty field!");
        }
      }}
    >
      Add new
    </Button>
    </ButtonGroup>
    
  );
};

export const renderDeleteButton = (
  iil: IilDto,
  deleteIil: Function,
) => {
  return (
    <ButtonGroup className="d-flex">
      <DeleteButton
              open={false}
              title={`Are you sure to delete this?`}
              message={`${iil.act}`}
              onConfirmCallback={() =>
                deleteIil(iil)
              }
              onCancelCallback={() => console.log()}
            />
     </ButtonGroup>
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
  iil: IilDto
) => {
  return (
    <FlowButton />
  );
};

export const getButtonWithEmoji = (iil: IilDto) => 
<ButtonGroup className="d-flex">
  <Button>
  {iil.about?.emoji ? iil.about?.emoji : ''}
  </Button>
</ButtonGroup>
