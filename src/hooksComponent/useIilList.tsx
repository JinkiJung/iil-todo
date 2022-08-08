import { useState } from 'react';
import { IilDto } from '../ill-repo-client';

export const applyUpdateToIilList = (iil: IilDto, iilList: IilDto[]) => [...iilList.filter(x => x.id !== iil.id), iil]

const cmpIilByDate = (a: IilDto, b: IilDto): number => {
  return (new Date(b.createdAt!)).getTime() - (new Date(a.createdAt!)).getTime();
}

const UseIilList = (initialIilList: IilDto[], validator?: Function) => {
    const [ iilList, setIilList] = useState(initialIilList);
    const onIilListChange = (iils: IilDto[], cmpIil?: (a: IilDto, b: IilDto)=>number) => {
      iils.sort(cmpIil ? cmpIil : cmpIilByDate);
      setIilList(iils);
    };
    const onIilListElemChange = (completeIil: IilDto, cmpIil?: (a: IilDto, b: IilDto)=>number) => {
      let willUpdate = true;
      if(typeof validator === "function"){
          willUpdate = validator(completeIil);
      }
      if(willUpdate){
        const appendedList = applyUpdateToIilList(completeIil, iilList);
        onIilListChange(appendedList, cmpIil);
      }
    };
    return { iilList, onIilListChange, onIilListElemChange };
  }

  export default UseIilList;