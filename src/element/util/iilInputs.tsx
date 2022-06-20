import React, { useState } from 'react';
import { Form } from "react-bootstrap";
import { IilDto } from "../../models";
import { getValuesFromInputElement } from "./elemToIil";

const getInput = (
  name: string,
  placeholder: string,
  initialValue: any,
  onIilItemChange: Function,
  register: Function,
  ) =>
  <Form.Control type="text"
    {...register(name)}
      name={name}
        placeholder={placeholder}
        value={initialValue}
        onChange={(e: any) => {
          onIilItemChange(getValuesFromInputElement(e.currentTarget));
        }} />

export const getInputForAct = (
    iil: IilDto,
    onIilItemChange: Function,
    register: Function,
  ) => getInput(
    `${iil.id ? iil.id : 'new'}==act`,
    "What do you want to achieve?",
    iil.act,
    onIilItemChange,
    register,
  );

export const getInputForEndWhen = (
    iil: IilDto,
    onIilItemChange: Function,
    register: Function,
  ) => getInput(
    `${iil.id ? iil.id : 'new'}==endWhen`,
    "When it is done?",
    iil.endWhen,
    onIilItemChange,
    register
  );