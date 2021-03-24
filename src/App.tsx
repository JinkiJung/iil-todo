import React, {useEffect, useState } from 'react';
import './App.css';
import UseTascList from "./hooksComponent/useTascList";
import UseTasc from "./hooksComponent/useTasc";
import Tasc from './model/tasc.entity';
import ITasc from './model/tasc.entity';
import 'reflect-metadata';
import { plainToClass } from 'class-transformer';
import { KeyboardEvent } from "react";
const axios = require('axios').default;

const shortid = require('shortid');

const testActor = "user";
const testURL = "http://localhost:12500/tasc";
const isChanged: string[] = [];

const content: Tasc[] = [];

const getInformation = (section: HTMLElement): object => {
  let tascPartial = { id: section.id }
  let elements = Array.from(section.getElementsByTagName('input'))
  for (let item of elements) {
    let attributes = item.name.split("==");
    if (attributes[0] === section.id && attributes[1] !== 'state'){
      tascPartial = {... tascPartial, [attributes[1]]: item.value }
    }
  }
  return tascPartial
}

const callCreateAPI = (tasc: object): Promise<string> => {
  return axios({
    method: 'post',
    url: testURL,
    data: tasc,
    headers: { 'content-type': 'application/json'},
  });
  /*
  return new Promise((resolve) => {
    //throw new Error('something bad happened');
    console.log('Create item:', tasc);
    resolve("Done!");
  });
  */
}

const callUpdateAPI = (id: string, tasc: object): Promise<string> => {
  console.log(tasc);
  return axios({
    method: 'patch',
    url: testURL + "/"+ id,
    data: tasc,
    headers: { 'content-type': 'application/json'},
  }).then((res: any) => console.log(res));
}

const update = (section: HTMLElement) => {
  callUpdateAPI(section.id, getInformation(section));
  isChanged.length = 0;
}

const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
    update(event.currentTarget);
  }
}

const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
  if (isChanged.length){
    update(event.currentTarget);
  }
}

const renderRow = (tasc: Tasc, onTascItemChange: Function) => {
  return (
    <section className="item" id={tasc.id} key={tasc.id} onKeyUp={handleEnterKey} onBlur={handleBlur} >
      <div className="item_division item_dragbtn"><button className="item_content_drag_btn"></button></div>
      <div className="item_division item_checkbox"><input className="item_content item_content_checkbox" name={`${tasc.id}==state`} type="checkbox"/></div>
        <div className="item_division item_act">
          <input type="text" name={`${tasc.id}==act`} value={tasc.act} onChange={(e) => {onTascItemChange(e); isChanged.push(e.target.name);}} className="item_content_act"/><br />
          <input type="text" name={`${tasc.id}==endWhen`} value={tasc.endWhen} onChange={(e) => {onTascItemChange(e); isChanged.push(e.target.name);}} className="item_content_end_when"/>
        </div>
      <div className="item_division item_option"><button className="item_option_btn">...</button></div>
    </section>
  )
}

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

const getBrandNewTasc = (listSize: number) : Tasc => {
  return new Tasc({id: shortid.generate(), actor: testActor, act: shortid.generate(), startWhen: "", endWhen: shortid.generate(), order:listSize});
}

const getTascList = (): Promise<any> => {
  return axios({
    method: 'get',
    url: testURL,
  });
}

function App() {
  const [serviceStatus, setServiceStatus] = useState(0);
  let initialTascList: Tasc[] = [];
  const { tascList, onTascListChange, onTascItemChange }  = UseTascList([...initialTascList, getBrandNewTasc(initialTascList.length)], );

  useEffect( () => {
    getTascList().then((response) => response.data).then((data: ITasc[]) => data.map((e) => new Tasc(e))).then((tascs) => { onTascListChange(tascs); setServiceStatus(1); }).catch((err) => setServiceStatus(-1))
  }, [serviceStatus]);

  return (
    <div className="App">
      {serviceStatus>0 ?      
      <>
      <div className="page_header">Tasc list</div>
      <div className="item_container">
        <section className="add_item_button_container"><button className="add_item_button" onClick={()=>{ const newTasc: Tasc= getBrandNewTasc(tascList.length); callCreateAPI(newTasc).then(() => onTascListChange([...tascList, newTasc])).catch((error) => alert(error));  }}>+</button></section>
        {  getSolidTascs(tascList, getChildIndices(tascList)).map( (solidTasc: Tasc) => renderRow(solidTasc, onTascItemChange) ) }
      </div>
      </>
    : serviceStatus<0 ?
    <div className="page_header">Something went wrong with server.</div>
    : <div className="page_header">Loading........</div>}
      </div>
  );
}

export default App;
