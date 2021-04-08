import React, {useEffect, useState } from 'react';
import './App.css';
import UseTascList from "./hooksComponent/useTascList";
import Tasc, { TascState, ITasc } from './model/tasc.entity';
import 'reflect-metadata';
const axios = require('axios').default;

const shortid = require('shortid');

const testActor = "jinki";
const testURL = "http://localhost:12500/tasc";
const isChanged: string[] = [];

const callCreateAPI = (ownerId: string, tasc: object): Promise<string> => {
  return axios({
    method: 'post',
    url: testURL + "/"+ ownerId,
    data: tasc,
    headers: { 'content-type': 'application/json'},
  });
}

const callUpdateAPI = (ownerId: string, tasc: Partial<Tasc>): Promise<string> => {
  return axios({
    method: 'patch',
    url: testURL + "/"+ ownerId,
    data: tasc,
    headers: { 'content-type': 'application/json'},
  }).then((res: any) => console.log(res));
}

const callDeleteAPI = (ownerId: string, tasc: Partial<Tasc>): Promise<string> => {
  return axios({
    method: 'delete',
    url: testURL + "/"+ ownerId,
    data: tasc,
    headers: { 'content-type': 'application/json'},
  }).then((res: any) => console.log(res));
}

const callGetAPI = async (ownerId: string, state: TascState = TascState.Active): Promise<any> => {
  return axios({
    method: 'get',
    url: `${testURL}/${ownerId}/${TascState[state].toString().toLowerCase()}`,
    headers: { 'content-type': 'application/json'},
  });
}

const update = (ownerId: string, section: HTMLElement) => {
  const partialTasc = getValuesFromSectionElement(section);
  if (partialTasc) {
    callUpdateAPI(ownerId, partialTasc);
  }
  isChanged.length = 0;
}

const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
    update(testActor, event.currentTarget);
  }
}

const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
  if (isChanged.length){
    update(testActor, event.currentTarget);
  }
}

const getValuesFromInputElement = (event: React.ChangeEvent<HTMLInputElement>): Partial<Tasc> | undefined => {
  const {
    currentTarget: {value},
  } = event;
  const attributes = event.currentTarget.name.split('==');
  if (attributes.length===2){
    if (attributes[1] === 'state' && value === 'on'){
      return {id: attributes[0], [attributes[1]]: 4};
    } else {
      return {id: attributes[0], [attributes[1]]: value};
    }
  }
}

const getValuesFromSectionElement = (section: HTMLElement): Partial<Tasc> | undefined => {
  let tascPartial = { id: section.id, state: 1 }
  let elements = Array.from(section.getElementsByTagName('input'));
  console.log(elements);
  for (let item of elements) {
    let attributes = item.name.split("==");
    if (attributes[0] === section.id){
      if (attributes[1] === 'state' && item.value === 'on'){
        tascPartial = {... tascPartial, state: 4 };
      }
      else {
        tascPartial = {... tascPartial, [attributes[1]]: item.value }
      }
    }
  }
  return tascPartial;
}

const renderRow = (tasc: Tasc, tascList: Tasc[], onTascItemChange: Function, onTascListChange: Function) => {
  return (
    <section className="item" id={tasc.id} key={tasc.id} onKeyUp={handleEnterKey} onBlur={handleBlur} >
      <div className="item_division item_dragbtn"><button className="item_content_drag_btn"></button></div>
      <div className="item_division item_checkbox"><input className="item_content item_content_checkbox" name={`${tasc.id}==state`} onChange={(e)=> {onTascItemChange(getValuesFromInputElement(e)); update(testActor, document.getElementById(tasc.id)!);}} type="checkbox"/></div>
        <div className="item_division item_act">
          <input type="text" name={`${tasc.id}==act`} value={tasc.act} onChange={(e) => {onTascItemChange(getValuesFromInputElement(e)); isChanged.push(e.target.name);}} className="item_content_act"/><br />
          <input type="text" name={`${tasc.id}==endWhen`} value={tasc.endWhen} onChange={(e) => {onTascItemChange(getValuesFromInputElement(e)); isChanged.push(e.target.name);}} className="item_content_end_when"/>
        </div>
      <div className="item_division item_option"><button className="item_option_btn" onClick={() => addNewItem(tascList, onTascListChange, tasc.id)}>+</button><button className="item_option_btn">...</button></div>
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

const getBrandNewTasc = (startWhen: string, listSize: number) : Tasc => {
  return new Tasc({id: shortid.generate(), actor: testActor, act: "", startWhen: startWhen, endWhen: "", order:listSize});
}

const addNewItem = (tascList: Tasc[], onTascListChange: Function, startWhen: string = "") => {
  const newTasc: Tasc= getBrandNewTasc(startWhen, tascList.length); callCreateAPI(testActor, newTasc).then(() => onTascListChange([...tascList, newTasc])).catch((error) => alert(error));
}

function App() {
  const [serviceStatus, setServiceStatus] = useState(0);
  let initialTascList: Tasc[] = [];
  const { tascList, onTascListChange, onTascItemChange }  = UseTascList([...initialTascList, getBrandNewTasc("", initialTascList.length)], );

  useEffect( () => {
    callGetAPI(testActor).then((response) => response.data).then((data: ITasc[]) => data.map((e) => new Tasc(e))).then((tascs) => { onTascListChange(tascs); setServiceStatus(1); }).catch((err) => setServiceStatus(-1))
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
        <section className="add_item_button_container"><button className="add_item_button" onClick={()=>{ addNewItem(tascList, onTascListChange) }}>+</button></section>
        {  getSolidTascs(tascList, getChildIndices(tascList)).map( (solidTasc: Tasc) => renderRow(solidTasc, tascList, onTascItemChange, onTascListChange) ) }
      </div>
      </>
    : serviceStatus<0 ?
    <div className="page_header">Something went wrong with server.</div>
    : <div className="page_header">Loading........</div>}
      </div>
  );
}

export default App;
