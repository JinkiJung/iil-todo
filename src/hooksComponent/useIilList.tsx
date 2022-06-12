import { useState } from 'react';
import { IilDto } from '../models';

const UseIilList = (initialIilList: IilDto[], validator?: Function) => {
    const [ iilList, setIilList] = useState(initialIilList);
    const onIilListChange = (iils: IilDto[]) => {
      setIilList(iils);
    };
    const onIilListElemChange = (fieldsToUpdate: IilDto) => {
      let willUpdate = true;
      if(typeof validator === "function"){
          willUpdate = validator(fieldsToUpdate);
      }
      if(willUpdate){
        let itemToBeUpdated: IilDto = iilList.filter(x => x.id === fieldsToUpdate.id).pop()!;
        if (itemToBeUpdated){
          const updatedItem = { ...itemToBeUpdated, ...fieldsToUpdate };
          //const updatedItem: Tasc = { ...itemToBeUpdated, ...fieldsToUpdate };
          const appendedList = [...iilList.filter(x => x.id !== updatedItem.id), updatedItem];
          onIilListChange(appendedList);
        }    
      }
    };
    return { iilList, onIilListChange, onIilListElemChange };
  }

  export default UseIilList;