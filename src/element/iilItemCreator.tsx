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
import { getButtonWithEmoji, getDraggableButton, renderAddButton, renderAddButtonForNewField, renderDeleteButton } from "./util/iilButtons";
import { IilDto } from "../models";
import { validateIil } from "./util/iilValidator";
import { Button, Col, Form, Row } from "react-bootstrap";
import { getInputForAct, getInputForEndWhen } from "./util/iilInputs";
import { useForm } from "react-hook-form";

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
              [res.data, ...iilList.filter(t => t.id !== iil.id)]
            );
            renewIil(ownerId, ownerId);
          })
          .catch((error: any) => alert(error));
  }

  const renewIil = (actor: string, owner: string) => {
    onIilItemChange(getBrandNewIil(getBrandNewName(), actor, "", owner, "new"));
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
            <input hidden name={`${iilItem.id}==name`} defaultValue={iilItem.name} readOnly />
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
                      name: emoji.emoji,
                    };
                    onIilItemChange(partialIilDto);
                  }}
                />
              </Popup>
            </Col>
            <Col xs={6}>
            {
              getInputForAct(iilItem, onIilItemChange, register, handleEnterKey)
            }
            </Col>
            <Col xs={2}>
            {getInputForEndWhen(iilItem, onIilItemChange, register, handleEnterKey)}
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
