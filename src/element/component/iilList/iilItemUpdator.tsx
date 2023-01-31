import { Checkbox } from "@material-ui/core";
import React, { MouseEventHandler, useContext, useEffect, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Col, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { IilDto, IilDtoStateEnum } from "../../../ill-repo-client";
import { PageContext } from "../../../type/pageContext";
import { OperationContext } from "../../../App";
import { IOperationParam } from "../../model/operationParam";
import { validateIil } from "../../util/iilValidator";
import { ItemTypes } from "../../model/itemType";
import { getButtonWithEmoji, renderDeleteButton } from "../../util/iilButtons";
import { getStateSelectMenu } from "../../util/iilStateSelect";
import { IilCard } from "../iil/iilCard";

interface IIilItemUpdatorProp {
  iilItem: IilDto;
  onIilListElemChange: Function;
  iilList: IilDto[];
  onIilListChange: Function;
  pageContext: PageContext;
  updateCall: Function;
  deleteCall: Function;
  onModalShow: MouseEventHandler<HTMLButtonElement>;
}

export const IilItemUpdator = ({
  iilItem,
  onIilListElemChange,
  iilList,
  onIilListChange,
  pageContext,
  updateCall,
  deleteCall,
  onModalShow,
}: IIilItemUpdatorProp) => {
  const ref = useRef<HTMLDivElement>(null);
  const param = useContext(OperationContext) as IOperationParam;

  const {
    register,
    handleSubmit,
    // Read the formState before render to subscribe the form state through the Proxy
    formState: { errors, isDirty, isSubmitting, touchedFields, submitCount },
  } = useForm({
    defaultValues: iilItem
  });

  const [{ isDragging, handlerId }, connectDrag] = useDrag({
    type: ItemTypes.IIL,
    item: { id: iilItem.id },
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
      if (draggedId !== iilItem.id) {
        //moveCard(draggedId, givenIil.id!)
      }
    },
    drop(item, monitor) {
      //updateOrderOfList().then((res) => onIilListChange(iilList));
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
    deleteCall(iil.id).then(() =>
      onIilListChange(iilList.filter((t:any)=> t.id !== iil.id)))
  }

  const updateIilStatus = (iil: IilDto) => {
    const updateIilDto = {...iilList.filter(e => e.id === iil.id).pop(), ...iil};
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
    return <hr className="dashed"></hr>;
  }

const getCheckBox = (iil: IilDto, onChangeCheckBox: Function) =>
<Checkbox
  checked={iil.state === IilDtoStateEnum.FINISHED}
  onChange={(e) => onChangeCheckBox(iil)}
  name={`${iil.id}==status==checkbox`}
  color="primary"
/>
/*
const getEmojiPopup = () => 
  <Popup
    onClose={() =>
      {
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
          describe: {emoji: emoji.emoji},
        };
        updateIil(iil).then((res: any) => {
          onIilListElemChange(res.data);
          onIilItemUpdate(res.data);
        });
      }}
    />
  </Popup>
  */

  if (pageContext === PageContext.List)
  {
    connectDrag(ref)
    connectDrop(ref)
  }
  
  return (
    <div ref={ref} id={"item_"+iilItem.id} key={"item_"+iilItem.id} data-handler-id={handlerId}>
      <section
            className="item"
            id={"form_"+iilItem.id}
            key={"form_"+iilItem.id}
            onBlur={handleBlur}
          >
      <Row>
        <Col sm={9}>
          <IilCard iil={iilItem} compact={false} onModalShow={onModalShow}/>
        </Col>
        <Col sm={2}>
          {getStateSelectMenu( iilItem, updateIilStatus)}
        </Col>
        <Col sm={1}>
          {renderDeleteButton(iilItem, deleteIil)}
        </Col>
      </Row>
      {getSeperator()}
      </section>
      </div>
  );
};
