// ConditionSelector component that works like IilSelector but for conditions

import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { AsyncTypeahead, Typeahead } from "react-bootstrap-typeahead";
import { ConditionControllerApi, ConditionDto } from "../../ill-repo-client";
import { getConditionText } from "./conditionAbstractor";

export interface ConditionSelectorProp{
  onConditionChange: ((chosenConditions: any[]) => void);
  inputRef: React.MutableRefObject<null>;
  givenCondition: ConditionDto|undefined;
}

export const ConditionSelector = (
  { onConditionChange, inputRef, givenCondition}: ConditionSelectorProp
  ) => {
    const [conditions, setConditions] = useState<ConditionDto[]>([]);

  const [singleSelection, setSingleSelection] = useState<ConditionDto[]>(conditions.filter(e => e.id === givenConditionId));
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (givenCondition) {
        setSingleSelection([givenCondition]);
    }
  },[givenCondition]);

  const conditionControllerApi = new ConditionControllerApi();

  // Bypass client-side filtering by returning `true`. Results are already
  // filtered by the search endpoint, so no need to do it again.
  const filterBy = () => true;

  const handleSearch = (query: string) => {
    setIsLoading(true);
    
    conditionControllerApi.getConditions().then((resp) => {
        const { data } = resp;
        setConditions(data);
        setIsLoading(false);
        });
  };

  return (
      <Form.Group>
        <AsyncTypeahead
      filterBy={filterBy}
      id="async-example"
      isLoading={isLoading}
      labelKey="name"
      minLength={3}
      ref={inputRef}
      onSearch={handleSearch}
      onChange={(selected)=>{
        onConditionChange!(selected);
        setSingleSelection(selected as ConditionDto[]);
        console.log(selected);
      }}
      options={conditions}
      placeholder="Search for a condition"
      renderMenuItemChildren={(option: ConditionDto) => (
        <>
          <span>{option.name}</span>
        </>
      )}
      selected={singleSelection}
    />
    </Form.Group>
  );
}