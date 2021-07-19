import {useState } from 'react';
import Tasc from '../model/tasc.entity';

const UseTasc = (initialItem: Tasc, validator?: Function) => {
    const [ tascItem, setTascItem ] = useState(initialItem);
    const onTascItemChange = (item: Partial<Tasc>) => {
        if(item.id === tascItem.id){
            setTascItem(new Tasc({...tascItem, ...item}));
        }
    };
    return { tascItem, onTascItemChange };
  };

export default UseTasc;