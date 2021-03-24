import {useState } from 'react';
import Tasc from '../model/tasc.entity';
import { plainToClass } from 'class-transformer';

const UseTasc = (initialItem: Tasc, validator?: Function) => {
    const [ item, setValue ] = useState(initialItem);
    const onChange = (event: React.FormEvent<HTMLInputElement>) => {
        const {
            currentTarget: {value}
        } = event;
        let willUpdate = true;
        if(typeof validator === "function"){
            willUpdate = validator(value);
        }
        if(willUpdate){
            setValue(plainToClass(Tasc, {...item, [event.currentTarget.name]:value}));
        }
    };
    return { item, onChange };
  };

export default UseTasc;