import { useState } from 'react';
import { IilDto } from '../models';

export const applyUpdateToIilList = (iil: IilDto, iilList: IilDto[]) => [...iilList.filter(x => x.id !== iil.id), iil]

const UseIilList = (initialIilList: IilDto[], validator?: Function) => {
    const [ iilList, setIilList] = useState(initialIilList);
    const onIilListChange = (iils: IilDto[]) => {
      setIilList(iils);
    };
    const onIilListElemChange = (completeIil: IilDto) => {
      let willUpdate = true;
      if(typeof validator === "function"){
          willUpdate = validator(completeIil);
      }
      if(willUpdate){
        const appendedList = applyUpdateToIilList(completeIil, iilList);
        onIilListChange(appendedList);
      }
    };
    return { iilList, onIilListChange, onIilListElemChange };
  }

  export default UseIilList;