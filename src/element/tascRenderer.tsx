import React, { useState } from "react";
import { addNewItem, handleBlur, handleEnterKey, update } from "../App";
import Tasc from "../model/tasc.entity";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Picker from 'emoji-picker-react';
import { getRandomEmoji } from "../util/emojiGenerator";
import { Confirm } from "../hooksComponent/Confirm";
import DeleteButton from "../hooksComponent/DeleteButton";
import { callDeleteAPI } from "../api/apiHandler";

export const getValuesFromInputElement = (event: React.ChangeEvent<HTMLInputElement>): Partial<Tasc> | undefined => {
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

export const getValuesFromSectionElement = (section: HTMLElement): Partial<Tasc> | undefined => {
  let tascPartial = { id: section.id, state: 1 }
  let elements = Array.from(section.getElementsByTagName('input'));
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
  console.log(tascPartial);
  return tascPartial;
}

export const renderRow = (tasc: Tasc, tascList: Tasc[], isChanged: string[], url: string, ownerId: string, onTascItemChange: Function, onTascListChange: Function, renderTrigger: Function) => {
    return (
      <div key={tasc.id}>
        <section className="item" id={tasc.id} onKeyUp={handleEnterKey} onBlur={handleBlur} >
          <div className="item_division item_dragbtn">
            <button className="item_btn_draggable"></button>
          </div>
          <div className="item_division item_check">
            <input hidden name={`${tasc.id}==goal`} defaultValue={tasc.goal} />
            {false ? 
              <input className="item_content item_content_checkbox" name={`${tasc.id}==state`} onChange={(e)=> {onTascItemChange(getValuesFromInputElement(e)); update(url, ownerId, document.getElementById(tasc.id)!);}} type="checkbox"/>
              :
              <Popup onClose={()=>isChanged? update(url, ownerId, document.getElementById(tasc.id)!): console.log() } trigger={
                <button className="item_btn">{tasc.goal ? (
                  <span>{tasc.goal}</span>
                  ) : (
                    <span>{}</span>
                  )}</button>} position="right top">
                
                <div>{tasc.act}</div>
                <Picker onEmojiClick={(e, emoji) => {console.log(tasc.goal); console.log(emoji.emoji); onTascItemChange({id: tasc.id, goal: emoji.emoji}); isChanged.push(`${tasc.id}==goal`); document.getElementsByName(`${tasc.id}==goal`).forEach((e) => (e as HTMLInputElement).value = emoji.emoji);}} />
              </Popup>
            }
          </div>
            <div className="item_division item_act">
              <input type="text" name={`${tasc.id}==act`} placeholder={"What do you want to achieve?"} value={tasc.act} onChange={(e) => {onTascItemChange(getValuesFromInputElement(e)); isChanged.push(e.target.name);}} className="item_content_act"/><br />
              <input type="text" name={`${tasc.id}==endWhen`} placeholder={"When is it done?"} value={tasc.endWhen} onChange={(e) => {onTascItemChange(getValuesFromInputElement(e)); isChanged.push(e.target.name);}} className="item_content_end_when"/>
            </div>
          <div className="item_division item_append">
            <button className="item_btn_highlighted" onClick={() => addNewItem(tascList, onTascListChange, tasc.id, tasc.goal)}>+</button>
          </div>
          <div className="item_division item_option">
            <Popup trigger={<button className="item_btn_highlighted">...</button>} position="left center">
              <DeleteButton
                  open={false}
                  title={`Are you sure to delete this?`}
                  message={
                    `${tasc.act}`
                  }
                  onConfirmCallback={()=> callDeleteAPI(url, ownerId, tasc.id).then(() =>window.location.reload())}
                  onCancelCallback={()=>console.log()}
              />
            </Popup>
          </div>
        </section>
        <hr className="dashed"></hr>
      </div>
    )
  }