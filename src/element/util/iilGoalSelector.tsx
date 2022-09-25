import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { IilDto } from "../../ill-repo-client";

export interface IilGoalSelectorProp{
  iils: IilDto[];
  onGoalChanged: ((chosenIils: any[]) => void);
  goalRef: React.MutableRefObject<null>;
  selectedGoal: string|undefined;
}

export const IilGoalSelector = (
  {iils, onGoalChanged: onChange, goalRef: ref, selectedGoal}: IilGoalSelectorProp
  ) => {
  const [singleSelections, setSingleSelections] = useState<IilDto[]>(iils.filter(e => e.id === selectedGoal));

  useEffect(() => {
    if(singleSelections.length === 0 || singleSelections.filter(e => e.id === selectedGoal).length === 0){
      setSingleSelections(iils.filter(e => e.id === selectedGoal));
    }
  },[selectedGoal]);
  
  return (
      <Form.Group>
      <Typeahead
        id="basic-typeahead-single"
        labelKey="act"
        ref={ref}
        onChange={(selected)=>{
          onChange!(selected);
          setSingleSelections(selected as IilDto[]);
        }}
        options={iils}
        placeholder="Choose an iil"
        selected={singleSelections}
      />
    </Form.Group>
  );
}