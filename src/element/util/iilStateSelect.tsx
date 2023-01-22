import React from "react";

import Select from 'react-select'
import { IilDto, IilDtoStateEnum } from "../../ill-repo-client";

const options: any = [];
for (const value of enumKeys(IilDtoStateEnum)) {
  options.push({value: value.toString(), label: value.toString()});
}

function enumKeys<O extends object, K extends keyof O = keyof O>(
  obj: O
): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

export const getStateSelectMenu = (iil: IilDto, onIilItemChange: Function) => {
  return <Select options={options} 
    id={iil.id + "==status"}
    defaultValue={options.filter((e: any) => e.value === iil.state).pop()}
    onChange={(e) => {
      let newIilDto: IilDto = {
        id: iil.id,
        state: e.value as IilDtoStateEnum,
      };
      onIilItemChange(newIilDto);
    }} />
};
