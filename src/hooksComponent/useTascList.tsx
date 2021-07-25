import { useState } from 'react';
import Tasc from '../model/tasc.entity';

const UseTascList = (initialTascList: Tasc[], validator?: Function) => {
    const [ tascList, setTascList] = useState(initialTascList);
    const onTascListChange = (tascs: Tasc[]) => {
      let willUpdate = true;
      if(typeof validator === "function"){
          willUpdate = validator(tascs);
      }
      if(willUpdate){
          setTascList(tascs);
      }
    };
    const onTascListElemChange = (fieldsToUpdate: Partial<Tasc>) => {
      let itemToBeUpdated: Tasc = tascList.filter(x => x.id === fieldsToUpdate.id).pop()!;
      if (itemToBeUpdated){
        const updatedItem = itemToBeUpdated.update(fieldsToUpdate);
        //const updatedItem: Tasc = { ...itemToBeUpdated, ...fieldsToUpdate };
        const appendedList = [...tascList.filter(x => x.id !== updatedItem.id), updatedItem];
        onTascListChange(appendedList);
      }
    };
    return { tascList, onTascListChange, onTascListElemChange };
  }

  export default UseTascList;