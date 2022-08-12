import React from "react";
import { Form, InputGroup } from "react-bootstrap";

export const iilDescribeInput = (
  name: string,
  placeholder: string,
  dictionary: { [key: string]: string; },
  onIilItemChange: Function,
  register: Function,
  handleEnterKey: Function,
  ) => {
    return <div>
      {
        Object.entries(dictionary).map(
          ([key, value]) => 
          <InputGroup key={key} className="mb-3">
            <InputGroup.Checkbox/>
            <Form.Control readOnly aria-label="key" value={key}/>
            <Form.Control readOnly aria-label="value" value={value}/>
          </InputGroup>
        )
      }
      </div>
}