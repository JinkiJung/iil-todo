import React, { useEffect } from "react";
import { useContext } from "react";
import Popup from "reactjs-popup";
import { OperationContext } from "../App";
import { IOperationParam } from "./model/operationParam";
import { getBrandNewName, getBrandNewIil } from "./model/iilManager";
import { getValuesFromInputElement } from "./util/elemToIil";
import Picker from "emoji-picker-react";
import UseIil from "../hooksComponent/useIil";
import { isOrganizeMode, PageContext } from "../type/pageContext";
import { renderAddButton, renderAddButtonForNewField, renderDeleteButton } from "./util/iilButtons";
import { IilDto } from "../models";
import { validateIil } from "./util/iilValidator";

interface IIilItemCreatorProp {
  iilList: IilDto[];
  onIilListChange: Function;
  pageContext: PageContext;
  ownerId: string;
  createCall: Function;
  deleteCall: Function;
  givenIil: IilDto;
}
  
export const IilItemCreator = ({
  iilList,
  onIilListChange,
  pageContext,
  ownerId,
  createCall,
  deleteCall,
  givenIil,
}: IIilItemCreatorProp) => {
  const param = useContext(OperationContext) as IOperationParam;

  const {iilItem, onIilItemChange} = UseIil(givenIil!);

  const createIil = (iil: IilDto) => {
    createCall!({...iil, id: undefined})
          .then(async (res: any) => {
            await onIilListChange(
              [res.data, ...iilList.filter(t => t.id !== iil.id)]
            );
            renewIil(ownerId, ownerId);
          })
          .catch((error: any) => alert(error));
  }

  const renewIil = (actor: string, owner: string) => {
    onIilItemChange(getBrandNewIil(getBrandNewName(), actor, "", owner, "new"));
  }

  const deleteIil = (iil: IilDto) => {
    !isOrganizeMode(pageContext) ?
      deleteCall(iil).then(() =>
                onIilListChange(iilList.filter((t:any)=> t.id !== iil.id)))
      :
      onIilListChange(iilList.filter((t:any)=> t.id !== iil.id))
  }

  const renderAddForNewItem = (
    iil: IilDto
  ) => {
    return (
      <div className="item_options button_container">
        <div>{renderAddButton(iil, createIil)}</div>
        { givenIil && <div>{renderDeleteButton(iil, deleteIil)}</div> }
      </div>
    );
  };

  const getInputForAct = (
    iil: IilDto,
    onIilItemChange: Function,
  ) => {
    return (
      <input
        type="text"
        name={`${iil.id ? iil.id : 'new'}==act`}
        placeholder={"What do you want to achieve?"}
        value={iil.act}
        onChange={(e) => {
          onIilItemChange(getValuesFromInputElement(e.currentTarget));
        }}
        className="item_content_act"
      />
    );
  };

  const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && validateIil(iilItem)) {
      createIil(iilItem);
    }
  };

  useEffect( () => {
    let mounted = true;
    if (mounted){
    }
    return () => {mounted = false;}
  }, [iilItem])

  return (
    <div id={iilItem.id} key={iilItem.id}>
      <section
        className="item"
        id={iilItem.id}
        onKeyUp={handleEnterKey}
      >
        <div className="item_division item_dragbtn">
          <button className="item_btn_draggable"></button>
        </div>
        <div className="item_division item_check">
          <input hidden name={`${iilItem.id}==name`} defaultValue={iilItem.name} readOnly />
            <Popup
              onClose={() =>
                {
                    /* updateWithSection(document.getElementById(tasc.id)!); */
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
                  const partialIilDto = {
                    id: iilItem.id,
                    name: emoji.emoji,
                  };
                  onIilItemChange(partialIilDto);
                }}
              />
            </Popup>
        </div>
        <div className={`item_division item_act`}>
          {
            getInputForAct(iilItem, onIilItemChange)
          }

          <br />
          <input
            type="text"
            name={`${iilItem.id}==endWhen`}
            placeholder={"When is it done?"}
            value={iilItem.endWhen}
            onChange={(e) => {
              onIilItemChange(getValuesFromInputElement(e.currentTarget)!);
            }}
            className="item_content_end_when"
          />
        </div>
        {renderAddForNewItem(iilItem)}
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
        }</div>
      ) : (
        <></>
      )}
    </div>
  );
}
