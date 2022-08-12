import React, { useRef } from "react";
import { useEffect } from "react";
import { Accordion, Button, ButtonGroup, Card, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import UseIil from "../../../hooksComponent/useIil";
import { IilDto } from "../../../ill-repo-client";
import { getRandomEmoji } from "../../../util/emojiGenerator";
import { getBrandNewIil } from "../../model/iilManager";
import { getDescribeInput, getInputForAttribute } from "../../util/iilInputs";
import { validateIil } from "../../util/iilValidator";
import { getStateSelectMenu } from "../../util/iilStatusSelect";
import { iilAddButton } from "../../buttons/iilAddButton";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { IilSelector } from "../../util/iilSelector";

export interface IIilDetailViewProp {
    iils: IilDto[];
    selectedIil: IilDto;
    ownerId: string;
    createCall: (body: IilDto, options?: AxiosRequestConfig) => Promise<AxiosResponse<IilDto>>;
    updateCall: (body: IilDto, id: string, options?: AxiosRequestConfig) => Promise<AxiosResponse<IilDto>>;
    deleteCall: (id: string, options?: AxiosRequestConfig) => Promise<AxiosResponse<void>>;
}

export const IilDetailView = ({
    iils,
    selectedIil,
    ownerId,
    createCall,
    updateCall,
    deleteCall,
  }: IIilDetailViewProp) => {
    const { iilItem, onIilItemChange } = UseIil(selectedIil);
    const goalRef = useRef<any>(null);
    const {
      register,
      handleSubmit,
      // Read the formState before render to subscribe the form state through the Proxy
      formState: { errors, isDirty, isSubmitting, touchedFields, submitCount },
    } = useForm({
      defaultValues: iilItem
    });
  
    const createIil = (iil: IilDto) => {
      createCall!({...iil, id: undefined})
            .then(async (res: any) => {
              // close window?
              resetNewIil(ownerId, ownerId);
            })
            .catch((error: any) => alert(error));
    }
  
    const resetNewIil = (actor?: string, owner?: string) => {
        goalRef.current.clear();
        onIilItemChange(getBrandNewIil(getRandomEmoji(),
            actor? actor : ownerId, "", 
            owner? owner : ownerId, "new"
        ));

    }

    const onGoalChanged = (iils: IilDto[]) => {
        onIilItemChange({id: selectedIil.id, goal: iils.pop()});
    }
  
    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (validateIil(iilItem)){
          createIil(iilItem);
        }
      }
    };

    const submit = (e: any) => {
        e.preventDefault();
        if (validateIil(iilItem)){
            createIil(iilItem);
        }
    }
  
    useEffect( () => {
      let mounted = true;
      if (mounted){
      }
      return () => {mounted = false;}
    }, [iilItem])

    return (
        <Form onSubmit={submit}>
        <Row xs="2">
            <Col xs="2">

            </Col>
            <Col xs="8">
                <Card style={{ width: '100%' }}>
                    <Card.Header>
                        Goal
                    </Card.Header>
                    <Card.Body>
                        {IilSelector(iils, onGoalChanged, goalRef)}
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
                        <Row style={{padding: '10px'}}>
                            <Col>
                                <Card>
                                    <Row xs="auto">
                                        <Col xs={2} className="align-self-center">
                                            Start if
                                        </Col>
                                        <Col xs={10}>
                                        { getInputForAttribute(iilItem, 'startIf', onIilItemChange, register, handleEnterKey) }
                                        </Col>
                                    </Row>
                                    <Row xs="auto">
                                        <Col xs={2} className="align-self-center">
                                            Input
                                        </Col>
                                        <Col xs={10}>
                                        { getInputForAttribute(iilItem, 'input', onIilItemChange, register, handleEnterKey) }
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
                                        { getInputForAttribute(iilItem, 'actor', onIilItemChange, register, handleEnterKey) }
                                        </Col>
                                    </Row>
                                    <Row xs="auto">
                                        <Col xs={2} className="align-self-center">
                                            Doing What
                                        </Col>
                                        <Col xs={10}>
                                        { getInputForAttribute(iilItem, 'act', onIilItemChange, register, handleEnterKey) }
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
                                        { getInputForAttribute(iilItem, 'endIf', onIilItemChange, register, handleEnterKey) }
                                        </Col>
                                    </Row>
                                    <Row xs="auto">
                                        <Col xs={2} className="align-self-center">
                                            Output
                                        </Col>
                                        <Col xs={10}>
                                        { getInputForAttribute(iilItem, 'output', onIilItemChange, register, handleEnterKey) }
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                        <Accordion>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Advanced</Accordion.Header>
                                    <Accordion.Body>
                                    <Card>
                                        <Row xs="auto">
                                            <Col xs={2} className="align-self-center">
                                                ID
                                            </Col>
                                            <Col xs={10}>
                                                {iilItem.id}
                                            </Col>
                                        </Row>
                                        <Row xs="auto">
                                            <Col xs={2} className="align-self-center">
                                                Describe
                                            </Col>
                                            <Col xs={10}>
                                            {
                                                getDescribeInput(iilItem, onIilItemChange, register, handleEnterKey)
                                            }
                                            </Col>
                                        </Row>
                                        <Row xs="auto">
                                            <Col xs={2} className="align-self-center">
                                                Owner
                                            </Col>
                                            <Col xs={10}>
                                            { getInputForAttribute(iilItem, 'owner', onIilItemChange, register, handleEnterKey) }
                                            </Col>
                                        </Row>
                                        <Row xs="auto">
                                            <Col xs={2} className="align-self-center">
                                                Status
                                            </Col>
                                            <Col xs={10}>
                                            { getStateSelectMenu( iilItem, onIilItemChange) }
                                            </Col>
                                        </Row>
                                    </Card>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Row>
                        <Row>
                            <Col>
                                <ButtonGroup className="d-flex">
                                    <Button variant="primary" type="submit">Save</Button>
                                </ButtonGroup>
                            </Col>
                            <Col>
                                <ButtonGroup className="d-flex">
                                    <Button variant="danger" onClick={() => resetNewIil()}>Delete</Button>
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
        </Form>
    );
  }