import {useState } from 'react';
import { IilDto } from '../models';

const UseIil = (initialItem: IilDto, validator?: Function) => {
    const [ iilItem, setIilItem ] = useState(initialItem);
    const onIilItemChange = (item: IilDto) => {
        if (item.id === iilItem.id){
            setIilItem({...iilItem, ...item});
        }
    };
    return { iilItem, onIilItemChange };
  };

export default UseIil;