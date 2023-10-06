import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { IilDto } from "../../ill-repo-client";
import { getIilText } from "./iilAbstractor";

export interface IilSelectorProp{
  iils: IilDto[];
  onIilChange: ((chosenIils: any[]) => boolean);
  inputRef: React.MutableRefObject<null>;
  givenIilId: string|undefined;
}

export const IilSelector = (
  {iils, onIilChange, inputRef, givenIilId}: IilSelectorProp
  ) => {
  const [singleSelection, setSingleSelection] = useState<IilDto[]>(iils.filter(e => e.id === givenIilId));
  useEffect(() => {
    if(singleSelection.length === 0 || singleSelection.filter(e => e.id === givenIilId).length === 0){
      setSingleSelection(iils.filter(e => e.id === givenIilId));
    }
  },[givenIilId]);
  
  // use Typeahead to select one element of the iils
  return (
      <Form.Group>
      <Typeahead
        id="basic-typeahead-single"
        labelKey={iil => `${getIilText(iil as IilDto)}`}
        ref={inputRef}
        onChange={(selected)=>{
          if (selected === undefined || selected.length === 0) { 
            setSingleSelection([]);
          }
          // update singleSelection
          if (onIilChange!(selected)) {
            setSingleSelection(selected as IilDto[]);
          }
        }}
        options={iils}
        placeholder="Choose an iil"
        selected={singleSelection}
      />
    </Form.Group>
  );
}