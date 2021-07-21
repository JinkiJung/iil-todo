import React from "react";
import { useContext } from "react";
import Popup from "reactjs-popup";
import { OperationContext } from "../App";
import Tasc from "../model/tasc.entity";
import { IOperationParam } from "./model/operationParam";
import { getBrandNewGoal, getBrandNewTasc } from "./model/tascManager";
import { getValuesFromInputElement } from "./util/elemToTasc";
import Picker from "emoji-picker-react";
import UseTasc from "../hooksComponent/useTasc";
import { isOrganizeMode, PageContext } from "../type/pageContext";
import { renderAddButtonForNewField } from "./util/tascAddButton";

const shortid = require("shortid");

interface ITascItemCreatorProp {
  tascList: Tasc[];
  onTascListChange: Function;
  pageContext: PageContext;
  create: Function;
  givenTasc?: Tasc;
}
  
export const TascItemCreator = ({
  tascList,
  onTascListChange,
  pageContext,
  create,
  givenTasc,
}: ITascItemCreatorProp) => {
  const param = useContext(OperationContext) as IOperationParam;
  const {tascItem, onTascItemChange} = UseTasc(givenTasc? givenTasc : 
    getBrandNewTasc(
    getBrandNewGoal(),
    param.ownerId,
    param.ownerId,
    0
  ));

  const checkEmptyTasc = (t: Tasc) => {
    return t.act.length === 0
  };

  const createTasc = (tasc: Tasc) => {
    const newId = shortid.generate();
    create!({...tasc, id: newId})
          .then(async (res: any) => {
            await onTascListChange(
              [...tascList.filter(t => t.id !== tasc.id), new Tasc(res.data)].sort((a, b) => b.iid - a.iid)
            );
            const newTasc = getBrandNewTasc(
              tasc.goal,
              param.ownerId,
              param.ownerId,
              0
            );
            onTascItemChange({...newTasc, id: tasc.id});
          })
          .catch((error: any) => alert(error));
  }

  const renderAddButton = (
    tasc: Tasc,
    setTascItem: Function,
    goal?: string
  ) => {
    return (
      <button
        className="item_btn_highlighted"
        onClick={() => {
          if(checkEmptyTasc(tasc)) {
            alert("You have empty field!");
          }
          else{
            createTasc(tasc);
          }
        }}
      >
        +
      </button>
    );
  };

  const renderAddForNewItem = (
    tasc: Tasc,
    setTascItem: Function,
    goal?: string
  ) => {
    return (
      <div className="item_division item_options">
        {renderAddButton(tasc, setTascItem, goal)}
      </div>
    );
  };

  const getInputForAct = (
    tasc: Tasc,
    onTascItemChange: Function,
  ) => {
    return (
      <input
        type="text"
        name={`${tasc.id}==act`}
        placeholder={"What do you want to achieve?"}
        value={tasc.act}
        onChange={(e) => {
          onTascItemChange(getValuesFromInputElement(e.currentTarget));
        }}
        className="item_content_act"
      />
    );
  };

  const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      createTasc(tascItem);
    }
  };

  return (
    <div id={tascItem.id} key={tascItem.id}>
      <section
        className="item"
        id={tascItem.id}
        onKeyUp={handleEnterKey}
      >
        <div className="item_division item_dragbtn">
          <button className="item_btn_draggable"></button>
        </div>
        <div className="item_division item_check">
          <input hidden name={`${tascItem.id}==goal`} defaultValue={tascItem.goal} readOnly />
            <Popup
              onClose={() =>
                {
                    /* updateWithSection(document.getElementById(tasc.id)!); */
                }
              }
              trigger={
                <button className="item_btn">
                  {tascItem.goal ? (
                    <span className="emoji_span">
                      {tascItem.goal.split("=goal=")[0]}
                    </span>
                  ) : (
                    <span>{}</span>
                  )}
                </button>
              }
              position="right top"
            >
              <Picker
                onEmojiClick={(e, emoji) => {
                  const partialTasc = {
                    id: tascItem.id,
                    goal: emoji.emoji + "=goal=" + tascItem.goal.split("=goal=")[1],
                  };
                  onTascItemChange(partialTasc);
                }}
              />
            </Popup>
        </div>
        <div className={`item_division item_act`}>
          {
            getInputForAct(tascItem, onTascItemChange)
          }

          <br />
          <input
            type="text"
            name={`${tascItem.id}==endWhen`}
            placeholder={"When is it done?"}
            value={tascItem.endWhen}
            onChange={(e) => {
              onTascItemChange(getValuesFromInputElement(e.currentTarget)!);
            }}
            className="item_content_end_when"
          />
        </div>
        {renderAddForNewItem(tascItem, onTascItemChange)}
      </section>
      {isOrganizeMode(pageContext) ? (
        <div className="separator">
          <input type="text"></input>
        </div>
      ) : (
        <hr className="dashed"></hr>
      )}
      {isOrganizeMode(pageContext) ? (
        renderAddButtonForNewField(tascList!, onTascListChange!, param, tascItem.goal)
      ) : (
        <></>
      )}
    </div>
  );
}
