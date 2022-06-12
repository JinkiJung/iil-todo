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
import { getDraggableButton, renderAddButton, renderAddButtonForNewField, renderDeleteButton } from "./util/iilButtons";
import { IilDto } from "../models";
import { validateIil } from "./util/iilValidator";
import { Button, Col, Row } from "react-bootstrap";

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

  const {iilItem, onIilItemChange} = UseIil(givenIil!, validateIil);

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
        <Row>
          <Col className="item_division item_dragbtn">
          {getDraggableButton()}
          </Col>
          <Col>
          <input hidden name={`${iilItem.id}==name`} defaultValue={iilItem.name} readOnly />
            <Popup
              onClose={() =>
                {
                    /* updateWithSection(document.getElementById(tasc.id)!); */
                }
              }
              trigger={
                <Button className="item_btn">
                  {iilItem.name ? (
                    <span className="emoji_span">
                      {iilItem.name}
                    </span>
                  ) : (
                    <span>{}</span>
                  )}
                </Button>
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
          </Col>
          <Col>
          {
            getInputForAct(iilItem, onIilItemChange)
          }
          </Col>
          <Col>
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
          </Col>
          <Col>
          {renderAddButton(iilItem, createIil)}
          {/*renderAddButtonForNewField(iilList!, onIilListChange!, param, iilItem.name!)*/}
          </Col>
        </Row>
      </section>
      {isOrganizeMode(pageContext) ? (
        <div className="separator">
          <input type="text"></input>
        </div>
      ) : (
        <hr className="dashed"></hr>
      )}
    </div>
  );
}
