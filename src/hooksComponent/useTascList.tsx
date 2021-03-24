import { plainToClass } from 'class-transformer';
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
          setTascList(tascs.sort((a, b) => b.order - a.order));
      }
    };
    const onTascItemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const {
          currentTarget: {value},
      } = event;
      const attributes = event.currentTarget.name.split('==');
      if (attributes.length===2){
        let itemToBeUpdated = tascList.filter(x => x.id === attributes[0]);
        if (itemToBeUpdated && itemToBeUpdated[0] && itemToBeUpdated[0] instanceof Tasc){
          const updatedItem: Tasc = itemToBeUpdated[0].update({[attributes[1]]:value});
          onTascListChange([...tascList.filter(x => x.id !== attributes[0]), updatedItem])
        }
      }
    };
    return { tascList, onTascListChange, onTascItemChange };
  }

  export default UseTascList;