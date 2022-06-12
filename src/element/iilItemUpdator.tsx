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
import { getDraggableButton, renderAddButtonForNewField, renderDeleteButton, renderDragButton } from "./util/iilButtons";
import { IilDto, IilDtoStatusEnum } from "../models";
import { validateIil } from "./util/iilValidator";
import { Button, Col, Row } from "react-bootstrap";

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

  const {iilItem, onIilItemChange} = UseIil(givenIil, validateIil);
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

  const sortIil = (a: IilDto, b: IilDto) => {
    return (new Date(b.createdAt!)).getTime() - (new Date(a.createdAt!)).getTime();
  }

  const sendDataToBackend = (iilItem: IilDto) => {
    iilList.filter(t => t.id === iilItem.id).length === 0
        && toBeCreated.filter(t => t.id === iilItem.id).length 
        ? createIil(iilItem)
          : updateIil(iilItem).then((res: any) => {
            iilList.sort(sortIil);
          });
  }

  const createIil = (iilDto: IilDto) => {
    createCall(iilItem).then((res: any) => {
      onIilListChange(iilList.filter(t => t.id !== iilItem.id).sort(sortIil));
    })
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
      deleteCall(iilDto.id).then(() =>
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
    const updateIilDto = {...iilList.filter(e => e.id === iilDto.id).pop(), ...iilDto};
    console.log(updateIilDto);
    updateIil(updateIilDto).then((res: any) => {
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
        {isOrganizeMode(pageContext)? renderDragButton(iilItem) : <div></div>}
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

  const getSeperator = () => {
    return isOrganizeMode(pageContext) ? (
        <div className="separator">
          <input type="text"></input>
        </div>
      ) : (
        <hr className="dashed"></hr>
      )}
  
const getButtonWithEmoji = (iil: IilDto) => 
<Button>
{iil.name ? (
  <span className="emoji_span">
    {iil.name}
  </span>
) : (
  <span>{}</span>
)}
</Button>

const getCheckBox = (iil: IilDto, onChangeCheckBox: Function) =>
<Checkbox
checked={iil.status === IilDtoStatusEnum.SETTLED}
onChange={onChangeCheckBox(iil)}
name={`${iil.id}==status==checkbox`}
color="primary"
/>

const getEmojiPopup = () => 
  <Popup
    onClose={() =>
      {
          /* updateWithSection(document.getElementById(iilDto.id)!); */
      }
    }
    trigger={
      getButtonWithEmoji(iilItem)
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

const onChangeCheckBox = (iil: IilDto) => {
  // phase out
  document
    .getElementsByName(`${iil.id}==status`)
    .forEach(
      (e) =>
        ((e as HTMLInputElement).value =
        IilDtoStatusEnum.SETTLED.toString())
    );
  const iilDto = { id: iil.id, status: IilDtoStatusEnum.SETTLED };
  onIilListElemChange(iilDto);
  updateIil(iilDto).then((t:any) => onIilListChange(iilList.filter((t) => contextMapping[pageContext].includes(t.status!.toString()))));
}

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
    <Row>
      <Col className="item_division item_dragbtn">
        {getDraggableButton()}
      </Col>
      <Col className="item_division item_check">
        <input hidden name={`${iilItem.id}==name`} defaultValue={iilItem.name} readOnly />
        {pageContext === PageContext.Focusing ? 
          getCheckBox(iilItem, onChangeCheckBox):
          getEmojiPopup()
        }
      </Col>
      <Col className={`item_division item_act ${
              iilItem.status === IilDtoStatusEnum.FOCUSED &&
              pageContext === PageContext.Incoming
                ? "item_focused"
                : ""
            }`}>
        {validURL(iilItem.act!) ? (
              <a href={iilItem.act} target={"_blank"} rel="noreferrer">
                {getInputForAct(iilItem, onIilItemChange)}
              </a>
            ) : (
              getInputForAct(iilItem, onIilItemChange)
            )}
      </Col>
      <Col>
        {getInputForEndWhen(iilItem, onIilItemChange)}
      </Col>
      <Col>
        {getStateSelectMenu( pageContext, iilItem, updateIilStatus)}
      </Col>
      <Col>
        {renderDeleteButton(iilItem, deleteIil)}
      </Col>
    </Row>
    {getSeperator()}
    </section>
    </div>
  );
};
