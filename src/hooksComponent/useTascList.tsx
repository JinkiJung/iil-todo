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
          setTascList(tascs.sort((a, b) => b.iid - a.iid));
      }
    };
    const onTascElemChange = (fieldsToUpdate: Partial<Tasc>) => {
      let itemToBeUpdated: Tasc = tascList.filter(x => x.id === fieldsToUpdate.id).pop()!;
      if (itemToBeUpdated){
        const updatedItem = itemToBeUpdated.update(fieldsToUpdate);
        //const updatedItem: Tasc = { ...itemToBeUpdated, ...fieldsToUpdate };
        onTascListChange([...tascList.filter(x => x.id !== updatedItem.id), updatedItem].sort((a,b) => b.iid - a.iid));
      }
    };
    return { tascList, onTascListChange, onTascElemChange };
  }

  export default UseTascList;