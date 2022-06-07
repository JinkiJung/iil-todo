import 'reactjs-popup/dist/index.css';
import { IilDto } from "../../models";

export const getValuesFromInputElement = (currentTarget: HTMLInputElement): IilDto | undefined => {
  const attributes = currentTarget.name.split("==");
  if (attributes.length === 2) {
    return { id: attributes[0], [attributes[1]]: currentTarget.value };
  }
}
