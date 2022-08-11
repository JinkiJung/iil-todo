import React, { Ref, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { IilDto } from "../../ill-repo-client";

export const IilSelector = (
  iils: IilDto[],
  onChange: Function,
  ref: React.MutableRefObject<null>) => {
  const [singleSelections, setSingleSelections] = useState<IilDto[]>([]);
  
  return (
      <Form.Group>
      <Typeahead
        clearButton
        id="basic-typeahead-single"
        labelKey="act"
        ref={ref}
        onChange={(item: React.SetStateAction<IilDto[]>) => {
          setSingleSelections(item);
          onChange(item);
        }}
        options={iils}
        placeholder="Choose an iil"
        selected={singleSelections}
      />
    </Form.Group>
  );
}