import React from "react";
import Popup from "reactjs-popup";
import DeleteButton from "../../hooksComponent/DeleteButton";
import Tasc, { validateTasc } from "../../model/tasc.entity";
import { IOperationParam } from "../model/operationParam";
import { getBrandNewTasc } from "../model/tascManager";
import { FlowButton } from "./flowButton";

export const renderAddButton = (
  tasc: Tasc,
  createTasc: Function,
) => {
  return (
    <button
      className="item_btn highlighted"
      onClick={() => {
        if(validateTasc(tasc)) {
          createTasc(tasc);
        }
        else{
          alert("You have empty field!");
        }
      }}
    >
      +
    </button>
  );
};

export const renderDeleteButton = (
  tasc: Tasc,
  deleteTasc: Function,
) => {
  return (
    <Popup
          trigger={<button className="item_btn warning">-</button>}
          position="left center"
        >
          <DeleteButton
            open={false}
            title={`Are you sure to delete this?`}
            message={`${tasc.act}`}
            onConfirmCallback={() =>
              deleteTasc(tasc)
            }
            onCancelCallback={() => console.log()}
          />
        </Popup>
  );
};

export const renderAddButtonForNewField = (
  tascList: Tasc[],
  onTascListChange: Function,
  param: IOperationParam,
  goal: string
) => {
  return (
    <button
      className="item_btn highlighted"
      onClick={() => {
        const newTasc = new Tasc(getBrandNewTasc(goal, param.ownerId, param.ownerId, 0));
        onTascListChange([
          ...tascList,
          newTasc,
        ]);
      }}
    >
      +
    </button>
  );
};

export const renderDragButton = (
  tasc: Tasc
) => {
  return (
    <FlowButton />
  );
};