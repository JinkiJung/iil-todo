import { FormControl, MenuItem, Select } from "@material-ui/core";
import React from "react";
import Tasc from "../../model/tasc.entity";
import { contextMapping, PageContext } from "../../type/pageContext";
import { TascState } from "../../type/tascState";

function enumKeys<O extends object, K extends keyof O = keyof O>(
  obj: O
): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

export const getStateSelectMenu = (pageContext: PageContext, tasc: Tasc, onTascListElemChange: Function, update: Function, deleteFromTascList: Function) => {
  const states: any = [];
  for (const value of enumKeys(TascState)) {
    states.push(value);
  }
  return pageContext !== PageContext.Focusing ? (
    <form noValidate>
      <FormControl>
        <Select
          value={tasc.state}
          onChange={(e) => {
            let partialTasc: Partial<Tasc> = {
              id: tasc.id,
              state: e.target.value,
            } as Partial<Tasc>;
            onTascListElemChange(partialTasc);
            update(partialTasc).then((res: any) => { 
              if(res.status === 200){
                const partialTasc = res.data as Partial<Tasc>;
                if (pageContext !== PageContext.Admin && partialTasc.state === TascState.Done){
                  deleteFromTascList(partialTasc.id);
                }
              }
             });
          }}
          inputProps={{
            name: tasc.id + "==state",
            id: tasc.id + "==state",
          }}
        >
          {contextMapping[pageContext].map((k: any) => (
            <MenuItem key={tasc.id + "==" + k} value={k}>
              {states[k]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </form>
  ) : (
    <input hidden={true} name={tasc.id + "==state"} value={tasc.state} />
  );
};