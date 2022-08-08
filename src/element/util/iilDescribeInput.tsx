import React, { useCallback } from "react";
import { Form } from "react-bootstrap";
//import { useDictionary } from "use-dictionary";
import { getRandomEmoji } from "../../util/emojiGenerator";
import { getValuesFromInputElement } from "./elemToIil";

export const iilDescribeInput = (
  name: string,
  placeholder: string,
  initialValue: any,
  onIilItemChange: Function,
  register: Function,
  handleEnterKey: Function,
  ) => {
    /*
    const initialState = {
        emoji: getRandomEmoji(),
      };
      const {
        state,
        onUpdateValue, // Update a value from the dictionary
        onClearValue,   // Remove a value from the dictionary
        onClear        // Remove all values from the dictionary
      } = useDictionary(initialState);
    
      const onSubmit = useCallback((event: React.FormEvent) => {
        event.preventDefault();
        console.log('Create User!', state);
      }, [state]);
      
      return (
        <Form.Control type="text"
          {...register(name)}
            name={name}
              placeholder={placeholder}
              value={state.emoji}
              onChange={(e: any) => {
                onIilItemChange(getValuesFromInputElement(e.currentTarget));
              }}
              onKeyDown={handleEnterKey}/>
      );
      */
     return <div></div>
}