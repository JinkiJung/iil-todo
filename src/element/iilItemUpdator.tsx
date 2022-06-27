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
import { getStateSelectMenu } from "./util/iilStatusSelect";
import UseIil from "../hooksComponent/useIil";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./model/itemType";
import { getButtonWithEmoji, getDraggableButton, renderDeleteButton } from "./util/iilButtons";
import { IilDto, IilDtoStatusEnum } from "../models";
import { validateIil } from "./util/iilValidator";
import { Button, Col, Row } from "react-bootstrap";
import { getInputForAct, getInputForEndWhen } from "./util/iilInputs";
import { isStatusFitToContext } from "./util/illFilterByContext";
import { useForm } from "react-hook-form";

interface IIilItemUpdatorProp {
  givenIil: IilDto;
  onIilListElemChange: Function;
  iilList: IilDto[];
  onIilListChange: Function;
  pageContext: PageContext;
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
  createCall,
  updateCall,
  deleteCall,
  moveCard,
  updateOrderOfList,
}: IIilItemUpdatorProp) => {
  const ref = useRef<HTMLDivElement>(null);
  const param = useContext(OperationContext) as IOperationParam;

  const {iilItem, onIilItemChange} = UseIil(givenIil, validateIil);

  const {
    register,
    handleSubmit,
    // Read the formState before render to subscribe the form state through the Proxy
    formState: { errors, isDirty, isSubmitting, touchedFields, submitCount },
  } = useForm({
    defaultValues: givenIil
  });

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
      updateOrderOfList().then((res) => onIilListChange(iilList));
    }
  })

  const sendDataToBackend = (iilItem: IilDto) => {
    iilList.filter(t => t.id === iilItem.id).length
        ? updateIil(iilItem).then(({data}) => {
          onIilListElemChange(data as IilDto);
        }) :
        console.log("Error! - no ID corresponding to");
  }

  const updateIil = (iil: IilDto): Promise<any> => {
    if (iil.id === iilItem.id) {
      return updateCall({...iilItem, ...iil}, iil.id);
    } else {
      throw new Error("ID is not matched with the given one");
    }
  }

  const deleteIil = (iil: IilDto) => {
    !isOrganizeMode(pageContext) ?
      deleteCall(iil.id).then(() =>
                onIilListChange(iilList.filter((t:any)=> t.id !== iil.id)))
      :
      onIilListChange(iilList.filter((t:any)=> t.id !== iil.id))
  }

  const updateIilStatus = (iil: IilDto) => {
    const updateIilDto = {...iilList.filter(e => e.id === iil.id).pop(), ...iil};
    console.log(updateIilDto);
    updateIil(updateIilDto).then(({data}) => {
      onIilListElemChange(data as IilDto);
      });
  }

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (validateIil(iilItem)){
        sendDataToBackend(iilItem);
      }
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    if (isDirty && validateIil(iilItem)){
        sendDataToBackend(iilItem);
    }
  };

  const getSeperator = () => {
    return isOrganizeMode(pageContext) ? (
        <div className="separator">
          <input type="text"></input>
        </div>
      ) : (
        <hr className="dashed"></hr>
      )}

const getCheckBox = (iil: IilDto, onChangeCheckBox: Function) =>
<Checkbox
checked={iil.status === IilDtoStatusEnum.SETTLED}
onChange={(e) => onChangeCheckBox(iil)}
name={`${iil.id}==status==checkbox`}
color="primary"
/>

const getEmojiPopup = () => 
  <Popup
    onClose={() =>
      {
          /* updateWithSection(document.getElementById(iil.id)!); */
      }
    }
    trigger={
      getButtonWithEmoji(iilItem)
    }
    position="right top"
  >
    <Picker
      onEmojiClick={(e, emoji) => {
        const iil = {
          id: iilItem.id,
          name: emoji.emoji,
        };
        updateIil(iil).then((res: any) => {
          onIilListElemChange(res.data);
          onIilItemChange(res.data);
        });
      }}
    />
  </Popup>

const onChangeCheckBox = (iil: IilDto) => {
  /*
  const partialIil = { id: iil.id, status: IilDtoStatusEnum.ACTIVE };
  onIilListElemChange(partialIil);
  updateIil(partialIil).then((t:any) => onIilListChange(iilList.filter((t) => contextMapping[pageContext].includes(t.status!.toString()))));
  */
}

const getIilItemEditor = () => 
  <div ref={ref} id={iilItem.id} key={iilItem.id} data-handler-id={handlerId}>
    <form
          className="item"
          id={iilItem.id}
          onBlur={handleBlur}
        >
    <Row>
      <Col sm={1} className="item_division item_dragbtn">
        {getDraggableButton()}
      </Col>
      <Col sm={1} className="item_division item_check">
        <input hidden name={`${iilItem.id}==name`} defaultValue={iilItem.name} readOnly />
        {pageContext === PageContext.Focusing ? 
          getCheckBox(iilItem, onChangeCheckBox):
          getEmojiPopup()
        }
      </Col>
      <Col sm={5} className={`item_division item_act ${
              iilItem.status === IilDtoStatusEnum.FOCUSED &&
              pageContext === PageContext.Incoming
                ? "item_focused"
                : ""
            }`}>
        {validURL(iilItem.act!) ? (
              <a href={iilItem.act} target={"_blank"} rel="noreferrer">
                {getInputForAct(iilItem, onIilItemChange, register, handleEnterKey)}
              </a>
            ) : (
              getInputForAct(iilItem, onIilItemChange, register, handleEnterKey)
            )}
      </Col>
      <Col sm={2}>
        {getInputForEndWhen(iilItem, onIilItemChange, register, handleEnterKey)}
      </Col>
      <Col sm={2}>
        {getStateSelectMenu( pageContext, iilItem, updateIilStatus)}
      </Col>
      <Col sm={1}>
        {renderDeleteButton(iilItem, deleteIil)}
      </Col>
    </Row>
    {getSeperator()}
    </form>
    </div>

  if (pageContext === PageContext.Focusing)
  {
    connectDrag(ref)
    connectDrop(ref)
  }
  return (
    isStatusFitToContext(pageContext, iilItem.status!) ? getIilItemEditor() : <></>    
  );
};
