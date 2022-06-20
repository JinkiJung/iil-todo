import { FormControl, MenuItem } from "@material-ui/core";
import React from "react";
import { IilDto, IilDtoStatusEnum } from "../../models";
import { contextMapping, PageContext } from "../../type/pageContext";

import Select from 'react-select'

const options: any = [];
for (const value of enumKeys(IilDtoStatusEnum)) {
  options.push({value: value.toString(), label: value.toString()});
}

function enumKeys<O extends object, K extends keyof O = keyof O>(
  obj: O
): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

export const getStateSelectMenu = (pageContext: PageContext, iil: IilDto, updateIilStatus: Function) => {
  return <Select options={options} 
    id={iil.id + "==status"}
    defaultValue={options.filter((e: any) => e.value === iil.status).pop()}
    onChange={(e) => {
      let newIilDto: IilDto = {
        id: iil.id,
        status: e.value as IilDtoStatusEnum,
      };
      updateIilStatus(newIilDto);
    }} />
  /*
  const states: any = [];
  for (const value of enumKeys(IilDtoStatusEnum)) {
    states.push(value.toString());
  }
  return pageContext !== PageContext.Focusing ? (
      <FormControl fullWidth>
        <Select
          id={iil.id + "==status"}
          value={iil.status}
          onChange={(e) => {
            let newIilDto: IilDto = {
              id: iil.id,
              status: e.target.value as IilDtoStatusEnum,
            };
            updateIilStatus(newIilDto);
          }}
          inputProps={{
            name: iil.id + "==status",
            id: iil.id + "==status",
          }}
        >
          {contextMapping[PageContext.Managing].map((k: any) => (
            <MenuItem key={iil.id + k} value={k}>
              {k}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  ) : (
    <input hidden={true} name={iil.id + "==status"} value={iil.status} readOnly/>
  );
  */
};
