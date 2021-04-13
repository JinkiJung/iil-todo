import React, {useEffect, useState } from 'react';
import './App.css';
import UseTascList from "./hooksComponent/useTascList";
import Tasc, { TascState, ITasc } from './model/tasc.entity';
import 'reflect-metadata';
import { callCreateAPI, callGetAPI, callUpdateAPI } from './api/apiHandler';
import { getValuesFromSectionElement, renderRow } from './element/tascRenderer';
import { ConfirmProvider } from './hooksComponent/ConfirmContext';

const shortid = require('shortid');

const testActor = "jinki";
const testURL = "http://localhost:12500/tasc";
const isChanged: string[] = [];

const getChildIndices = (tascList: Tasc[]) : string[] => {
  let indiceSet = new Set<string>();
  tascList.map(element => {
    if(Array.isArray(element.act))
      {
        element.act.forEach(subElement =>{ 
          indiceSet.add(subElement);
        });
      }
  });
  return Array.from(indiceSet);
}

const getSolidTascs = (tascList: Tasc[], indices: string[]) => {
  return tascList.filter((tasc: Tasc) => !indices.includes(tasc.id) );
}

const getBrandNewTasc = (startWhen: string, goal: string, listSize: number) : Tasc => {
  return new Tasc({id: shortid.generate(), actor: testActor, act: "", startWhen: startWhen, endWhen: "", goal: goal, order:listSize});
}

export const addNewItem = (tascList: Tasc[], onTascListChange: Function, startWhen: string = "", goal: string = "") => {
  const newTasc: Tasc= getBrandNewTasc(startWhen, goal, tascList.length); callCreateAPI(testURL, testActor, newTasc).then(() => onTascListChange([...tascList, newTasc])).catch((error) => alert(error));
}

export const update = (url: string, ownerId: string, section: HTMLElement) => {
  const partialTasc = getValuesFromSectionElement(section);
  if (partialTasc) {
    callUpdateAPI(url, ownerId, partialTasc);
  }
  isChanged.length = 0;
}

export const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
    update(testURL, testActor, event.currentTarget);
  }
}

export const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
  if (isChanged.length){
    update(testURL, testActor, event.currentTarget);
  }
}

function App() {
  const [serviceStatus, setServiceStatus] = useState(0);

  let initialTascList: Tasc[] = [];
  const { tascList, onTascListChange, onTascItemChange }  = UseTascList([...initialTascList, getBrandNewTasc("", "", initialTascList.length)], );

  useEffect( () => {
    callGetAPI(testURL, testActor).then((response) => response.data).then((data: ITasc[]) => data.map((e) => new Tasc(e))).then((tascs) => { onTascListChange(tascs); setServiceStatus(1); }).catch((err) => setServiceStatus(-1))
  }, [serviceStatus]);

  return (
    <div className="App">
      {serviceStatus>0 ?
      <>
      <div className="equalHWrap eqWrap">
        <button className="equalHW eq">incoming</button>
        <button className="equalHW eq">organizing</button>
        <button className="equalHW eq">focusing</button>
      </div>
      <div className="item_container">
        <ConfirmProvider>
          <section className="add_item_button_container"><button className="add_item_button" onClick={()=>{ addNewItem(tascList, onTascListChange) }}>+</button></section>
          {  getSolidTascs(tascList, getChildIndices(tascList)).map( (solidTasc: Tasc) => renderRow(solidTasc, tascList, isChanged, testURL, testActor, onTascItemChange, onTascListChange, setServiceStatus) ) }
        </ConfirmProvider>
      </div>
      </>
    : serviceStatus<0 ?
    <div className="page_header">Something went wrong with server.</div>
    : <div className="page_header">Loading........</div>}
      </div>
  );
}

export default App;
