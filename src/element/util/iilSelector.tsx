import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { IilDto } from "../../ill-repo-client";

export interface IilSelectorProp{
  iils: IilDto[];
  onIilChange: ((chosenIils: any[]) => void);
  inputRef: React.MutableRefObject<null>;
  selectedIilId: string|undefined;
}

export const IilSelector = (
  {iils, onIilChange, inputRef, selectedIilId}: IilSelectorProp
  ) => {
  const [singleSelections, setSingleSelections] = useState<IilDto[]>(iils.filter(e => e.id === selectedIilId));

  useEffect(() => {
    if(singleSelections.length === 0 || singleSelections.filter(e => e.id === selectedIilId).length === 0){
      setSingleSelections(iils.filter(e => e.id === selectedIilId));
    }
  },[selectedIilId]);
  
  return (
      <Form.Group>
      <Typeahead
        id="basic-typeahead-single"
        labelKey="act"
        ref={inputRef}
        onChange={(selected)=>{
          onIilChange!(selected);
          setSingleSelections(selected as IilDto[]);
        }}
        options={iils}
        placeholder="Choose an iil"
        selected={singleSelections}
      />
    </Form.Group>
  );
}