import {useState } from 'react';
import { IilDto } from '../ill-repo-client';

const UseIil = (initialItem: IilDto, validator?: Function) => {
    const [ iilItem, setIilItem ] = useState(initialItem);
    const onIilItemUpdate = (newItem: IilDto) => {
        if (newItem.id === iilItem.id){
            setIilItem({...iilItem, ...newItem});
            /*
            if (newItem.goal) {
                iilItem.goal = newItem.goal;
            } else {
                setIilItem({...iilItem, ...newItem});
            }
            */
        }
    };
    return { iilItem, setIilItem, onIilItemUpdate };
  };

export default UseIil;