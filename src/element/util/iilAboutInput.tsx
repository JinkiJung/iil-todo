import React from "react";
import { Form, InputGroup } from "react-bootstrap";

export const iilDictInput = (
  dictionary: string,
  onIilItemChange: Function,
  register: Function,
  handleEnterKey: Function,
  ) => {
    return <div>
      {
        Object.entries(dictionary).map(
          ([key, value]) => 
          <InputGroup key={key} className="mb-3">
            <Form.Control as="textarea" aria-label="With textarea" value={JSON.stringify(dictionary)} />
          </InputGroup>
        )
      }
      </div>
}