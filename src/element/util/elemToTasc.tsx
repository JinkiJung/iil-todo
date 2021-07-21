import React from "react";
import Tasc from "../../model/tasc.entity";
import 'reactjs-popup/dist/index.css';

export const getValuesFromInputElement = (currentTarget: HTMLInputElement): Partial<Tasc> | undefined => {
  const attributes = currentTarget.name.split("==");
  if (attributes.length === 2) {
    return { id: attributes[0], [attributes[1]]: attributes[1] === "state" ? parseInt(currentTarget.value) : currentTarget.value };
  }
}
