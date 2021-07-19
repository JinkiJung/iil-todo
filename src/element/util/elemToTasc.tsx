import React from "react";
import Tasc from "../../model/tasc.entity";
import 'reactjs-popup/dist/index.css';

export const getValuesFromInputElement = (event: React.ChangeEvent<HTMLInputElement>): Partial<Tasc> | undefined => {
  const {
    currentTarget: { value },
  } = event;
  const attributes = event.currentTarget.name.split("==");
  if (attributes.length === 2) {
    return { id: attributes[0], [attributes[1]]: attributes[1] === "state" ? parseInt(value) : value };
  }
}

export const getValuesFromSectionElement = (section: HTMLElement): Partial<Tasc> | undefined => {
  console.log((section as HTMLElement));
  console.log((section as HTMLElement).getAttribute("value"));
  let tascPartial = { id: section.id.split("==")[0], state: 1 }
  let elements = Array.from(section.getElementsByTagName('input'));
  for (let item of elements) {
    let attributes = item.name.split("==");
    if (attributes[0] === section.id){
      tascPartial = {...tascPartial, [attributes[1]]: attributes[1] === "state" ? parseInt(item.value) : item.value }
    }
  }
  return tascPartial;
}