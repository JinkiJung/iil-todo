import React from "react";
import { useContext, useEffect, useState } from "react";
import { Button, ButtonGroup, Card, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Popup from "reactjs-popup";
import Picker from "emoji-picker-react";
import UseIil from "../hooksComponent/useIil";
import { IilDto } from "../ill-repo-client";
import { getRandomEmoji } from "../util/emojiGenerator";
import { getBrandNewIil } from "./model/iilManager";
import { getButtonWithEmoji, renderAddButton } from "./util/iilButtons";
import { getDescribeInput, getInputForAttribute } from "./util/iilInputs";
import { validateIil } from "./util/iilValidator";
import { getStateSelectMenu } from "./util/iilStatusSelect";
import { iilButton } from "./buttons/iilButton";
import { iilAddButton } from "./buttons/iilAddButton";
import { AxiosRequestConfig, AxiosResponse } from "axios";

export interface IIilDetailViewProp {
    iil: IilDto;
    ownerId: string;
    createCall: (body: IilDto, options?: AxiosRequestConfig) => Promise<AxiosResponse<IilDto>>;
    updateCall: (body: IilDto, id: string, options?: AxiosRequestConfig) => Promise<AxiosResponse<IilDto>>;
    deleteCall: (id: string, options?: AxiosRequestConfig) => Promise<AxiosResponse<void>>;
}

export const IilDetailView = ({
    iil,
    ownerId,
    createCall,
    updateCall,
    deleteCall,
  }: IIilDetailViewProp) => {
    const [newIil, setNewIil] = useState<IilDto>(iil);
  
    const {
      register,
      handleSubmit,
      // Read the formState before render to subscribe the form state through the Proxy
      formState: { errors, isDirty, isSubmitting, touchedFields, submitCount },
    } = useForm({
      defaultValues: newIil
    });
  
    const createIil = (iil: IilDto) => {
      createCall!({...iil, id: undefined})
            .then(async (res: any) => {
              // close window?
              resetNewIil(ownerId, ownerId);
            })
            .catch((error: any) => alert(error));
    }
  
    const resetNewIil = (actor: string, owner: string) => {
        setNewIil(getBrandNewIil(getRandomEmoji(), ownerId, "", ownerId, "new"));
    }
  
    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (validateIil(newIil)){
          createIil(newIil);
        }
      }
    };
  
    useEffect( () => {
      let mounted = true;
      if (mounted){
      }
      return () => {mounted = false;}
    }, [])
  
    console.log(newIil);
    return (
        <>
        <Row xs="2">
            <Col xs="2">

            </Col>
            <Col xs="8">
                <Card style={{ width: '100%' }}>
                    <Card.Header>
                        Goal
                    </Card.Header>
                    <Card.Body>
                        { newIil.goal ? iilButton(newIil.goal, ()=>console.log("!!")) : iilAddButton() }
                    </Card.Body>
                </Card>
            </Col>
            <Col xs="2">

            </Col>
        </Row>
        <Row xs="2">
            <Col xs="2">
                <Card style={{ width: '100%' }}>
                    <Card.Header>
                        Previous
                    </Card.Header>
                    <Card.Body>
                        <div>

                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <Col xs="8">
                <Card style={{ width: '100%' }}>
                    <Card.Body>
                        <Row>
                            <Col xs="8">
                                <Row style={{padding: '10px'}}>
                                    <Col>
                                        <Card>
                                            <Row xs="auto">
                                                <Col xs={2} className="align-self-center">
                                                    Start if
                                                </Col>
                                                <Col xs={10}>
                                                { getInputForAttribute(newIil, 'startIf', setNewIil, register, handleEnterKey) }
                                                </Col>
                                            </Row>
                                            <Row xs="auto">
                                                <Col xs={2} className="align-self-center">
                                                    Input
                                                </Col>
                                                <Col xs={10}>
                                                { getInputForAttribute(newIil, 'input', setNewIil, register, handleEnterKey) }
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row style={{padding: '10px'}}>
                                    <Col>
                                        <Card>
                                            <Row xs="auto">
                                                <Col xs={2} className="align-self-center">
                                                    Who
                                                </Col>
                                                <Col xs={10}>
                                                { getInputForAttribute(newIil, 'actor', setNewIil, register, handleEnterKey) }
                                                </Col>
                                            </Row>
                                            <Row xs="auto">
                                                <Col xs={2} className="align-self-center">
                                                    Doing What
                                                </Col>
                                                <Col xs={10}>
                                                { getInputForAttribute(newIil, 'act', setNewIil, register, handleEnterKey) }
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row style={{padding: '10px'}}>
                                    <Col>
                                        <Card>
                                            <Row xs="auto">
                                                <Col xs={2} className="align-self-center">
                                                    End if
                                                </Col>
                                                <Col xs={10}>
                                                { getInputForAttribute(newIil, 'endIf', setNewIil, register, handleEnterKey) }
                                                </Col>
                                            </Row>
                                            <Row xs="auto">
                                                <Col xs={2} className="align-self-center">
                                                    Output
                                                </Col>
                                                <Col xs={10}>
                                                { getInputForAttribute(newIil, 'output', setNewIil, register, handleEnterKey) }
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs="4" style={{padding: '10px'}}>
                                <Card>
                                    <Row xs="auto">
                                        <Col xs={2} className="align-self-center">
                                            Describe
                                        </Col>
                                        <Col xs={10}>
                                        {/* getDescribeInput(newIil, setNewIil, register, handleEnterKey) */}
                                        </Col>
                                    </Row>
                                    <Row xs="auto">
                                        <Col xs={2} className="align-self-center">
                                            Owner
                                        </Col>
                                        <Col xs={10}>
                                        { getInputForAttribute(newIil, 'owner', setNewIil, register, handleEnterKey) }
                                        </Col>
                                    </Row>
                                    <Row xs="auto">
                                        <Col xs={2} className="align-self-center">
                                            Status
                                        </Col>
                                        <Col xs={10}>
                                        { getStateSelectMenu( newIil, setNewIil) }
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <ButtonGroup className="d-flex">
                                    <Button variant="primary">Save</Button>
                                </ButtonGroup>
                            </Col>
                            <Col>
                                <ButtonGroup className="d-flex">
                                    <Button variant="danger">Delete</Button>
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
            <Col xs="2">
                <Card style={{ width: '100%' }}>
                    <Card.Header>
                        Next
                    </Card.Header>
                    <Card.Body>
                        { iilAddButton() }
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row xs="2">
            <Col xs="2">

            </Col>
            <Col xs="8">
                <Card style={{ width: '100%' }}>
                    <Card.Header>
                        Children
                    </Card.Header>
                    <Card.Body>
                        { iilAddButton() }
                    </Card.Body>
                </Card>
            </Col>
            <Col xs="2">

            </Col>
        </Row>
        </>
    );
  }