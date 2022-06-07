import { FormControl, MenuItem, Select } from "@material-ui/core";
import React from "react";
import { IilDto, IilDtoStatusEnum } from "../../models";
import { contextMapping, PageContext } from "../../type/pageContext";

function enumKeys<O extends object, K extends keyof O = keyof O>(
  obj: O
): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

export const getStateSelectMenu = (pageContext: PageContext, iilDto: IilDto, updateIilStatus: Function) => {
  const states: any = [];
  for (const value of enumKeys(IilDtoStatusEnum)) {
    states.push(value.toString());
  }
  return pageContext !== PageContext.Focusing ? (
    <form noValidate>
      <FormControl>
        <Select
          value={iilDto.status}
          onChange={(e) => {
            let newIilDto: IilDto = {
              id: iilDto.id,
              name: iilDto.id + "==status",
              status: e.target.value as IilDtoStatusEnum,
            };
            updateIilStatus(newIilDto);
          }}
          inputProps={{
            name: iilDto.id + "==status",
            id: iilDto.id + "==status",
          }}
        >
          {contextMapping[PageContext.Managing].map((k: any) => (
            <MenuItem key={iilDto.id + "==" + k} value={k}>
              {k}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </form>
  ) : (
    <input hidden={true} name={iilDto.id + "==status"} value={iilDto.status} readOnly/>
  );
};
