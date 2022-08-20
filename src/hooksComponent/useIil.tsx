import {useState } from 'react';
import { IilDto } from '../ill-repo-client';

const UseIil = (initialItem: IilDto, validator?: Function) => {
    const [ iilItem, setIilItem ] = useState(initialItem);
    const onIilItemUpdate = (item: IilDto) => {
        if (item.id === iilItem.id){
            if (item.goal) {
                iilItem.goal = item.goal;
            } else {
                setIilItem({...iilItem, ...item});
            }
        }
    };
    return { iilItem, setIilItem, onIilItemUpdate };
  };

export default UseIil;