import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { IilDto } from "../../ill-repo-client";

export const IilSelector = (
  iils: IilDto[],
  onChange: ((selected: any) => void) | undefined,
  ref: React.MutableRefObject<null>,
  initialValue: IilDto[]) => {
  const [singleSelections, setSingleSelections] = useState<IilDto[]>(initialValue);

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