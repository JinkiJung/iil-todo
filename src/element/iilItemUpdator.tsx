import { Checkbox } from "@material-ui/core";
import React, { useContext, useRef, useState } from "react";
import Popup from "reactjs-popup";
import { OperationContext } from "../App";
import { contextMapping, isOrganizeMode, PageContext } from "../type/pageContext";
import { validURL } from "../util/urlStringCheck";
import { IOperationParam } from "./model/operationParam";
import Picker from "emoji-picker-react";
import {
  getValuesFromInputElement,
} from "./util/elemToIil";
import { getStateSelectMenu } from "./util/getStatusSelectMenu";
import UseIil from "../hooksComponent/useIil";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./model/itemType";
import { renderAddButtonForNewField, renderDeleteButton, renderDragButton } from "./util/iilButtons";
import { IilDto, IilDtoStatusEnum } from "../models";
import { validateIil } from "./util/iilValidator";

interface IIilItemUpdatorProp {
  givenIil: IilDto;
  onIilListElemChange: Function;
  iilList: IilDto[];
  onIilListChange: Function;
  pageContext: PageContext;
  updatePageContext: Function;
  createCall: Function;
  updateCall: Function;
  deleteCall: Function;
  moveCard: (draggedId: string, id: string) => void;
  updateOrderOfList: () => Promise<any>;
}

export const IilItemUpdator = ({
  givenIil,
  onIilListElemChange,
  iilList,
  onIilListChange,
  pageContext,
  updatePageContext,
  createCall,
  updateCall,
  deleteCall,
  moveCard,
  updateOrderOfList,
}: IIilItemUpdatorProp) => {
  const ref = useRef<HTMLDivElement>(null);
  const param = useContext(OperationContext) as IOperationParam;

  const {iilItem, onIilItemChange} = UseIil(givenIil);
  const [toBeCreated, setToBeCreated] = useState<IilDto[]>([]);

  const [{ isDragging, handlerId }, connectDrag] = useDrag({
    type: ItemTypes.IIL,
    item: { id: givenIil.id },
    collect: (monitor) => {
      const result = {
        handlerId: monitor.getHandlerId(),
        isDragging: monitor.isDragging(),
      }
      return result
    },
  })

  const [, connectDrop] = useDrop({
    accept: ItemTypes.IIL,
    hover({ id: draggedId }: { id: string; type: string }) {
      if (draggedId !== givenIil.id) {
        moveCard(draggedId, givenIil.id!)
      }
    },
    drop(item, monitor) {
      updateOrderOfList().then((res) => onIilListChange(iilList.map((t, i) => { /*t.setOrder(i);*/ return t; })));
    }
  })

  const sendDataToBackend = (iilItem: IilDto) => {
    iilList.filter(t => t.id === iilItem.id).length === 0
        && toBeCreated.filter(t => t.id === iilItem.id).length 
        ? createCall(iilItem).then((res: any) => {
          onIilListChange(iilList.filter(t => t.id !== iilItem.id));
        })
          : updateIil(iilItem);
  }

  const updateIil = (iilDto: IilDto): Promise<any> => {
    if (iilDto.id === iilItem.id) {
      return updateCall({...iilItem, ...iilDto}, iilDto.id);
    } else {
      throw new Error("ID is not matched with the given one");
    }
  }

  const deleteIil = (iilDto: IilDto) => {
    !isOrganizeMode(pageContext) ?
      deleteCall(iilDto).then(() =>
                onIilListChange(iilList.filter((t:any)=> t.id !== iilDto.id)))
      :
      onIilListChange(iilList.filter((t:any)=> t.id !== iilDto.id))
  }

  const getInputForAct = (
    iilDto: IilDto,
    onIilItemChange: Function
  ) => {
    return (
      <input
        type="text"
        name={`${iilDto.id}==act`}
        placeholder={"What do you want to achieve?"}
        value={iilDto.act}
        onChange={(e) => {
          onIilItemChange(getValuesFromInputElement(e.currentTarget));
        }}
        className="item_content_act"
      />
    );
  };

  const getInputForEndWhen = (
    iilDto: IilDto,
    onIilItemChange: Function
  ) => {
    return (
      <input
        type="text"
        name={`${iilDto.id}==endWhen`}
        placeholder={"When is it done?"}
        value={iilDto.endWhen}
        onChange={(e) => {
          onIilItemChange(getValuesFromInputElement(e.currentTarget));
        }}
        className="item_content_end_when"
      />
    );
  };

  const updateIilStatus = (iilDto: IilDto) => {
    updateIil(iilDto).then((res: any) => {
      if(res.status === 200){
        const iilDto = res.data as IilDto;
        onIilListElemChange(iilDto);
        if ((pageContext === PageContext.Incoming || pageContext === PageContext.Focusing)
            && iilDto.status === IilDtoStatusEnum.SETTLED){
          onIilListChange(iilList.filter((t) => t.id !== iilDto.id))
        }
        else{
          /*
          onIilListChange(iilList.sort((a,b) => {
            return (new Date(b.lastUpdatedAt!)).getTime() - (new Date(a.lastUpdatedAt!)).getTime();
          }))
          */
        }
      }
      });
  }

  const renderOptions = (
    iil: IilDto,
    pageContext: PageContext,
  ) => {
    return (
      <div className="item_options button_container">
        <div>
          {getStateSelectMenu(
            pageContext,
            iilItem,
            updateIilStatus)}
        </div>
        <div>
          <button
            className="item_btn organize"
            onClick={() => {
              if (isOrganizeMode(pageContext)) {
                updatePageContext(PageContext.Incoming);
              } else {
                updatePageContext(PageContext.Organizing, iilItem.name);
              }
            }}
          >
            {isOrganizeMode(pageContext) ? "Back" : "Chain"}
          </button>
        </div>
        {isOrganizeMode(pageContext)? renderDragButton(iilItem) : <div>{renderDeleteButton(iilItem, deleteIil)}</div>}
      </div>
    );
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (validateIil(iilItem)){
        sendDataToBackend(iilItem);
        //setToBeCreated([]);
      }
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    if (validateIil(iilItem)
      && JSON.stringify(iilList.find((t) => t.id === iilItem.id)) !== JSON.stringify(iilItem)){
        sendDataToBackend(iilItem);
      //setToBeCreated([]);
    }
  };

  if (pageContext === PageContext.Focusing)
  {
    connectDrag(ref)
    connectDrop(ref)
  }
  return (
    <div ref={ref} id={iilItem.id} key={iilItem.id} data-handler-id={handlerId}>
      <section
        className="item"
        id={iilItem.id}
        onKeyUp={handleEnterKey}
        onBlur={handleBlur}
      >
        <div className="item_division item_dragbtn">
          <button className="item_btn_draggable"></button>
        </div>
        <div className="item_division item_check">
          <input hidden name={`${iilItem.id}==name`} defaultValue={iilItem.name} readOnly />
          {pageContext === PageContext.Focusing ? (
            <Checkbox
              checked={iilItem.status === IilDtoStatusEnum.SETTLED}
              onChange={(e) => {
                // phase out
                document
                  .getElementsByName(`${iilItem.id}==status`)
                  .forEach(
                    (e) =>
                      ((e as HTMLInputElement).value =
                      IilDtoStatusEnum.SETTLED.toString())
                  );
                const iilDto = { id: iilItem.id, status: IilDtoStatusEnum.SETTLED };
                onIilListElemChange(iilDto);
                updateIil(iilDto).then((t:any) => onIilListChange(iilList.filter((t) => contextMapping[pageContext].includes(t.status!.toString()))));
              }}
              name={`${iilItem.id}==status==checkbox`}
              color="primary"
            />
          ) : (
            <Popup
              onClose={() =>
                {
                    /* updateWithSection(document.getElementById(iilDto.id)!); */
                }
              }
              trigger={
                <button className="item_btn">
                  {iilItem.name ? (
                    <span className="emoji_span">
                      {iilItem.name}
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
                  const iilDto = {
                    id: iilItem.id,
                    name: emoji.emoji,
                  };
                  updateIil(iilDto).then((res: any) => {
                    onIilListElemChange(res.data);
                    onIilItemChange(res.data);
                  });
                }}
              />
            </Popup>
          )}
        </div>
        <div
          className={`item_division item_act ${
            iilItem.status === IilDtoStatusEnum.FOCUSED &&
            pageContext === PageContext.Incoming
              ? "item_focused"
              : ""
          }`}
        >
          {validURL(iilItem.act!) ? (
            <a href={iilItem.act} target={"_blank"} rel="noreferrer">
              {getInputForAct(iilItem, onIilItemChange)}
            </a>
          ) : (
            getInputForAct(iilItem, onIilItemChange)
          )}

          <br />
          {getInputForEndWhen(iilItem, onIilItemChange)}
        </div>
        {pageContext !== PageContext.Focusing && renderOptions(iilItem, pageContext)}
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
          renderAddButtonForNewField(iilList!, onIilListChange!, param, iilItem.name!)
        }
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};