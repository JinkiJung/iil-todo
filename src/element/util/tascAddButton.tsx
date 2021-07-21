import React from "react";
import Tasc from "../../model/tasc.entity";
import { IOperationParam } from "../model/operationParam";
import { getBrandNewTasc } from "../model/tascManager";

export const renderAddButtonForNewField = (
    tascList: Tasc[],
    onTascListChange: Function,
    param: IOperationParam,
    goal: string
  ) => {
    return (
      <button
        className="item_btn_highlighted"
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