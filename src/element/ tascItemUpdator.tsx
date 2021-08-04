import { Checkbox } from "@material-ui/core";
import React, { useContext, useRef, useState } from "react";
import Popup from "reactjs-popup";
import { OperationContext } from "../App";
import Tasc, { validateTasc } from "../model/tasc.entity";
import { contextMapping, isOrganizeMode, PageContext } from "../type/pageContext";
import { TascState } from "../type/tascState";
import { validURL } from "../util/urlStringCheck";
import { IOperationParam } from "./model/operationParam";
import Picker from "emoji-picker-react";
import {
  getValuesFromInputElement,
} from "./util/elemToTasc";
import { getStateSelectMenu } from "./util/getStateSelectMenu";
import UseTasc from "../hooksComponent/useTasc";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./model/itemType";
import { renderAddButtonForNewField, renderDeleteButton, renderDragButton } from "./util/tascButtons";

interface ITascItemUpdatorProp {
  givenTasc: Tasc;
  onTascListElemChange: Function;
  tascList: Tasc[];
  onTascListChange: Function;
  pageContext: PageContext;
  updatePageContext: Function;
  createCall: Function;
  updateCall: Function;
  deleteCall: Function;
  moveCard: (draggedId: string, id: string) => void;
  updateOrderOfList: () => Promise<any>;
}

export const TascItemUpdator = ({
  givenTasc,
  onTascListElemChange,
  tascList,
  onTascListChange,
  pageContext,
  updatePageContext,
  createCall,
  updateCall,
  deleteCall,
  moveCard,
  updateOrderOfList,
}: ITascItemUpdatorProp) => {
  const ref = useRef<HTMLDivElement>(null);
  const param = useContext(OperationContext) as IOperationParam;

  const {tascItem, onTascItemChange} = UseTasc(givenTasc);
  const [toBeCreated, setToBeCreated] = useState<Tasc[]>([]);

  const [{ isDragging, handlerId }, connectDrag] = useDrag({
    type: ItemTypes.TASC,
    item: { id: givenTasc.id },
    collect: (monitor) => {
      const result = {
        handlerId: monitor.getHandlerId(),
        isDragging: monitor.isDragging(),
      }
      return result
    },
  })

  const [, connectDrop] = useDrop({
    accept: ItemTypes.TASC,
    hover({ id: draggedId }: { id: string; type: string }) {
      if (draggedId !== givenTasc.id) {
        moveCard(draggedId, givenTasc.id)
      }
    },
    drop(item, monitor) {
      updateOrderOfList().then((res) => onTascListChange(tascList.map((t, i) => { t.setOrder(i); return t; })));
    }
  })

  const deleteTasc = (tasc: Tasc) => {
    !isOrganizeMode(pageContext) ?
      deleteCall(tasc).then(() =>
                onTascListChange(tascList.filter((t:any)=> t.id !== tasc.id)))
      :
      onTascListChange(tascList.filter((t:any)=> t.id !== tasc.id))
  }

  const getInputForAct = (
    tasc: Tasc,
    onTascItemChange: Function
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

  const getInputForEndWhen = (
    tasc: Tasc,
    onTascItemChange: Function
  ) => {
    return (
      <input
        type="text"
        name={`${tascItem.id}==endWhen`}
        placeholder={"When is it done?"}
        value={tascItem.endWhen}
        onChange={(e) => {
          onTascItemChange(tascItem.update(getValuesFromInputElement(e.currentTarget)!));
        }}
        className="item_content_end_when"
      />
    );
  };

  const updateTascState = (partialTasc: Partial<Tasc>) => {
    updateCall(partialTasc).then((res: any) => {
      if(res.status === 200){
        const partialTasc = res.data as Partial<Tasc>;
        onTascListElemChange(partialTasc);
        if ((pageContext === PageContext.Incoming || pageContext === PageContext.Focusing)
            && partialTasc.state === TascState.Done){
          onTascListChange(tascList.filter((t) => t.id !== partialTasc.id))
        }
        else{
          onTascListChange(tascList.sort((a,b) => b.iid - a.iid))
        }
      }
      });
  }

  const renderOptions = (
    tasc: Tasc,
    pageContext: PageContext,
  ) => {
    return (
      <div className="item_options button_container">
        <div>
          {getStateSelectMenu(
            pageContext,
            tasc,
            updateTascState)}
        </div>
        <div>
          <button
            className="item_btn organize"
            onClick={() => {
              if (isOrganizeMode(pageContext)) {
                updatePageContext(PageContext.Incoming);
              } else {
                updatePageContext(PageContext.Organizing, tasc.goal);
              }
            }}
          >
            {isOrganizeMode(pageContext) ? "Back" : "Chain"}
          </button>
        </div>
        {isOrganizeMode(pageContext)? renderDragButton(tascItem) : <div>{renderDeleteButton(tascItem, deleteTasc)}</div>}
      </div>
    );
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (validateTasc(tascItem)){
        tascList.filter(t => t.id === tascItem.id).length === 0
        && toBeCreated.filter(t => t.id === tascItem.id).length 
        ? createCall(tascItem).then((res: any) => onTascListChange(tascList.filter(t => t.id !== tascItem.id)))
          : updateCall(tascItem);
        //setToBeCreated([]);
      }
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    if (validateTasc(tascItem)
      && JSON.stringify(tascList.find((t) => t.id === tascItem.id)) !== JSON.stringify(tascItem)){
        tascList.filter(t => t.id === tascItem.id).length === 0
        && toBeCreated.filter(t => t.id === tascItem.id).length 
        ? createCall(tascItem).then((res: any) => onTascListChange(tascList.filter(t => t.id !== tascItem.id)))
        : updateCall(tascItem);
      //setToBeCreated([]);
    }
  };

  if (pageContext === PageContext.Focusing)
  {
    connectDrag(ref)
    connectDrop(ref)
  }
  return (
    <div ref={ref} id={tascItem.id} key={tascItem.id} data-handler-id={handlerId}>
      <section
        className="item"
        id={tascItem.id}
        onKeyUp={handleEnterKey}
        onBlur={handleBlur}
      >
        <div className="item_division item_dragbtn">
          <button className="item_btn_draggable"></button>
        </div>
        <div className="item_division item_check">
          <input hidden name={`${tascItem.id}==goal`} defaultValue={tascItem.goal} readOnly />
          {pageContext === PageContext.Focusing ? (
            <Checkbox
              checked={tascItem.state === TascState.Done}
              onChange={(e) => {
                // phase out
                document
                  .getElementsByName(`${tascItem.id}==state`)
                  .forEach(
                    (e) =>
                      ((e as HTMLInputElement).value =
                        TascState.Done.toString())
                  );
                const partialTasc = { id: tascItem.id, state: TascState.Done };
                onTascListElemChange(partialTasc);
                updateCall(partialTasc).then((t:any) => onTascListChange(tascList.filter((t) => contextMapping[pageContext].includes(t.state))));
              }}
              name={`${tascItem.id}==state==checkbox`}
              color="primary"
            />
          ) : (
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
                  onTascListElemChange(partialTasc);
                  updateCall(partialTasc).then((t: any) => {
                    document
                    .getElementsByName(`${tascItem.id}==goal`)
                    .forEach(
                      (e) =>
                        ((e as HTMLInputElement).value =
                          emoji.emoji + "=goal=" + tascItem.goal.split("=goal=")[1])
                    );
                  });
                }}
              />
            </Popup>
          )}
        </div>
        <div
          className={`item_division item_act ${
            tascItem.state === TascState.Focused &&
            pageContext === PageContext.Incoming
              ? "item_focused"
              : ""
          }`}
        >
          {validURL(tascItem.act) ? (
            <a href={tascItem.act} target={"_blank"} rel="noreferrer">
              {getInputForAct(tascItem, onTascItemChange)}
            </a>
          ) : (
            getInputForAct(tascItem, onTascItemChange)
          )}

          <br />
          {getInputForEndWhen(tascItem, onTascItemChange)}
        </div>
        {pageContext !== PageContext.Focusing && renderOptions(tascItem, pageContext)}
      </section>
      {isOrganizeMode(pageContext) ? (
        <div className="separator">
          <input type="text"></input>
        </div>
      ) : (
        <hr className="dashed"></hr>
      )}
      {isOrganizeMode(pageContext) ? (
        <div className="button_container">{
          renderAddButtonForNewField(tascList!, onTascListChange!, param, tascItem.goal)
        }
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};