import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { IilDto } from "../../ill-repo-client";
import { getIilText } from "./iilAbstractor";

export interface IilSelectorProp{
  iilList: IilDto[];
  onIilChange: ((chosenIils: any[]) => boolean);
  inputRef: React.MutableRefObject<null>;
  givenIil: IilDto | undefined;
}

export const IilSelector = (
  {iilList: iils, onIilChange, inputRef, givenIil}: IilSelectorProp
  ) => {
  const [singleSelection, setSingleSelection] = useState<IilDto[]>(givenIil ? [givenIil] : []);
  useEffect(() => {
    if(givenIil){
      setSingleSelection([givenIil]);
    }
  },[givenIil]);
  
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