import React, { useEffect } from "react";
import { useContext } from "react";
import Popup from "reactjs-popup";
import { OperationContext } from "../App";
import { IOperationParam } from "./model/operationParam";
import { getBrandNewIil } from "./model/iilManager";
import { getValuesFromInputElement } from "./util/elemToIil";
import Picker from "emoji-picker-react";
import UseIil from "../hooksComponent/useIil";
import { isOrganizeMode, PageContext } from "../type/pageContext";
import { getButtonWithEmoji, getDraggableButton, renderAddButton, renderAddButtonForNewField, renderDeleteButton } from "./util/iilButtons";
import { validateIil } from "./util/iilValidator";
import { Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { getRandomEmoji } from "../util/emojiGenerator";
import { IilDto } from "../ill-repo-client";
import { getInputForAttribute } from "./util/iilInputs";

interface IIilItemCreatorProp {
  iilList: IilDto[];
  onIilListChange: Function;
  pageContext: PageContext;
  ownerId: string;
  createCall: Function;
  givenIil: IilDto;
}
  
export const IilItemCreator = ({
  iilList,
  onIilListChange,
  pageContext,
  ownerId,
  createCall,
  givenIil,
}: IIilItemCreatorProp) => {
  const param = useContext(OperationContext) as IOperationParam;

  const {iilItem, onIilItemChange} = UseIil(givenIil!, validateIil);

  const {
    register,
    handleSubmit,
    // Read the formState before render to subscribe the form state through the Proxy
    formState: { errors, isDirty, isSubmitting, touchedFields, submitCount },
  } = useForm({
    defaultValues: givenIil
  });

  const createIil = (iil: IilDto) => {
    createCall!({...iil, id: undefined})
          .then(async (res: any) => {
            await onIilListChange(
              [...iilList, res.data]
            );
            resetNewIil(ownerId, ownerId);
          })
          .catch((error: any) => alert(error));
  }

  const resetNewIil = (actor: string, owner: string) => {
    onIilItemChange(getBrandNewIil(getRandomEmoji(), actor, "", owner, "new"));
  }

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (validateIil(iilItem)){
        createIil(iilItem);
      }
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
        <Form>
          <Row xs="auto">
            <Col xs={1} className="item_division item_dragbtn">
            {getDraggableButton()}
            </Col>
            <Col xs={1}>
              {console.log(iilItem.describe)}
            <input hidden name={`${iilItem.id}==describe==emoji`} defaultValue={iilItem.describe?.emoji} readOnly />
              <Popup
                onClose={() =>
                  {
                      /* updateWithSection(document.getElementById(tasc.id)!); */
                  }
                }
                trigger={
                  getButtonWithEmoji(iilItem)
                }
                position="right top"
              >
                <Picker
                  onEmojiClick={(e, emoji) => {
                    const partialIilDto = {
                      id: iilItem.id,
                      describe: {emoji: emoji.emoji},
                    };
                    onIilItemChange(partialIilDto);
                  }}
                />
              </Popup>
            </Col>
            <Col xs={6}>
            {
              getInputForAttribute(iilItem, 'act', onIilItemChange, register, handleEnterKey)
            }
            </Col>
            <Col xs={2}>
            {getInputForAttribute(iilItem, 'endIf', onIilItemChange, register, handleEnterKey)}
            </Col>
            <Col xs={2}>
            {renderAddButton(iilItem, isDirty, createIil)}
            {/*renderAddButtonForNewField(iilList!, onIilListChange!, param, iilItem.name!)*/}
            </Col>
          </Row>
        </Form>
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
