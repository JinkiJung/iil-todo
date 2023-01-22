import React, { useState } from 'react';
import { Form } from "react-bootstrap";
import { IilDto } from '../../ill-repo-client';
import { getValuesFromInputElement } from "./elemToIil";
import { iilAboutInput } from './iilAboutInput';

export interface IIndexable {
  [key: string]: any;
}

const getInput = (
  name: string,
  placeholder: string,
  initialValue: any,
  onIilItemChange: Function,
  register: Function,
  handleEnterKey: Function,
  ) =>
  <Form.Control type="text"
    {...register(name)}
      name={name}
        placeholder={placeholder}
        value={initialValue ? initialValue : ""}
        onChange={(e: any) => {
          onIilItemChange(getValuesFromInputElement(e.currentTarget));
        }}
        onKeyDown={handleEnterKey}/>

export const getInputForAttribute = (iil: IilDto,
  attributeName: string,
  onIilItemChange: Function,
  register: Function,
  handleEnterKey: Function,
  ) => getInput(
    `${iil.id ? iil.id : 'new'}==${attributeName}`,
    'Enter ' + attributeName,
    (iil as IIndexable)[attributeName],
    onIilItemChange,
    register,
    handleEnterKey,
  );

export const getAboutInput = (iil: IilDto,
  onIilItemChange: Function,
  register: Function,
  handleEnterKey: Function,) =>
  iilAboutInput('emoji', '', iil.about!, onIilItemChange, register, handleEnterKey);