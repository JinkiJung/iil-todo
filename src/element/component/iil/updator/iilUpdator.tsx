import React, { useEffect, useRef, useState } from "react";
import { Accordion, Button, ButtonGroup, Card, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { IilDto, NextFlowDto } from "../../../../ill-repo-client";
import { getRandomEmoji } from "../../../../util/emojiGenerator";
import { getBrandNewIil } from "../../../model/iilManager";
import { getAboutInput, getInputForAttribute } from "../../../util/iilInputs";
import { getStateSelectMenu } from "../../../util/iilStateSelect";
import { iilAddButton } from "../../../buttons/iilAddButton";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { IilSelector } from "../../../util/iilSelector";
import { IilCardList } from "../iilCardList";
import { NextFlowUpdator } from "../../NextFlow/NextFlowUpdator";
import { NextFlowList } from "../../NextFlow/NextFlowList";

export interface IIilUpdatorProp {
    iils: IilDto[];
    nextFlows: NextFlowDto[];
    selectedIil: IilDto;
    onIilItemChange: Function;
    ownerId: string;
    onSubmit: (iil: IilDto) => Promise<AxiosResponse<IilDto> | undefined>;
    onDelete: (id: string) => Promise<AxiosResponse<void> | undefined>;
    onReset: (goalId?: string) => void;
    onNextFlowCreate: (body: NextFlowDto, options?: AxiosRequestConfig) => Promise<AxiosResponse<IilDto>>;
    onNextFlowUpdate: (body: NextFlowDto, id: string, options?: AxiosRequestConfig) => Promise<AxiosResponse<IilDto>>;
    onNextFlowDelete: (id: string, options?: AxiosRequestConfig) => Promise<AxiosResponse<void>>;
}

export const IilUpdator = ({
    iils,
    nextFlows,
    selectedIil,
    onIilItemChange,
    ownerId,
    onSubmit,
    onDelete,
    onReset,
    onNextFlowCreate,
    onNextFlowUpdate,
    onNextFlowDelete,
  }: IIilUpdatorProp) => {
    const goalRef = useRef<any>(null);
    const [ selectedGoal, setSelectedGoal ] = useState<string | undefined>(selectedIil?.goal);
    const [previousFlows, setPreviousFlows] = useState<NextFlowDto[]>([]);
    const [incomingFlows, setIncomingFlows] = useState<NextFlowDto[]>([]);
    const {
      register,
      handleSubmit,
      // Read the formState before render to subscribe the form state through the Proxy
      formState: { errors, isDirty, isSubmitting, touchedFields, submitCount },
    } = useForm({
      defaultValues: selectedIil
    });

    const onGoalChanged = (chosenIils: IilDto[]) => {
        if (chosenIils.length) {
            if (selectedIil.id === chosenIils[0].id) {
                alert("Goal and task should not be identical");
            } else {
                onIilItemChange({id: selectedIil.id, goal: chosenIils[0].id});
            }
        }
    }
  
    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        onSubmit(selectedIil);
      }
    };

    const submit = (e: any) => {
        e.preventDefault();
        onSubmit(selectedIil).then(async (res: any) => 
            onReset())
          .catch((error: any) => alert(error));
    }

    const getPreviousFlows = (): NextFlowDto[] => {
        return nextFlows.filter(f => f.to === selectedIil.id);
    }

    const getNextFlows = (): NextFlowDto[] => {
        return nextFlows.filter(f => f.from === selectedIil.id);
    }

    useEffect(() => {
        if (selectedIil.goal) {
            setSelectedGoal(selectedIil.goal);
        } else {
            goalRef.current.clear();
        }
        if (nextFlows) {
            setIncomingFlows(getNextFlows());
            setPreviousFlows(getPreviousFlows());
        }
    },[selectedIil]);

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
                        <IilSelector iils={iils} onIilChange={onGoalChanged} inputRef={goalRef} selectedIilId={selectedGoal} />
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
                <Form onSubmit={submit}>
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
                                        { getInputForAttribute(selectedIil, 'activateIf', onIilItemChange, register, handleEnterKey) }
                                        </Col>
                                    </Row>
                                    <Row xs="auto">
                                        <Col xs={2} className="align-self-center">
                                            Input
                                        </Col>
                                        <Col xs={10}>
                                        { getInputForAttribute(selectedIil, 'input', onIilItemChange, register, handleEnterKey) }
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
                                        { getInputForAttribute(selectedIil, 'actor', onIilItemChange, register, handleEnterKey) }
                                        </Col>
                                    </Row>
                                    <Row xs="auto">
                                        <Col xs={2} className="align-self-center">
                                            Doing What
                                        </Col>
                                        <Col xs={10}>
                                        { getInputForAttribute(selectedIil, 'act', onIilItemChange, register, handleEnterKey) }
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
                                            Finish if
                                        </Col>
                                        <Col xs={10}>
                                        { getInputForAttribute(selectedIil, 'finishIf', onIilItemChange, register, handleEnterKey) }
                                        </Col>
                                    </Row>
                                    <Row xs="auto">
                                        <Col xs={2} className="align-self-center">
                                            Output
                                        </Col>
                                        <Col xs={10}>
                                        { getInputForAttribute(selectedIil, 'output', onIilItemChange, register, handleEnterKey) }
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
                                                {selectedIil.id}
                                            </Col>
                                        </Row>
                                        <Row xs="auto">
                                            <Col xs={2} className="align-self-center">
                                                About
                                            </Col>
                                            <Col xs={10}>
                                            {
                                                getAboutInput(selectedIil, onIilItemChange, register, handleEnterKey)
                                            }
                                            </Col>
                                        </Row>
                                        <Row xs="auto">
                                            <Col xs={2} className="align-self-center">
                                                Owner
                                            </Col>
                                            <Col xs={10}>
                                            { getInputForAttribute(selectedIil, 'owner', onIilItemChange, register, handleEnterKey) }
                                            </Col>
                                        </Row>
                                        <Row xs="auto">
                                            <Col xs={2} className="align-self-center">
                                                Status
                                            </Col>
                                            <Col xs={10}>
                                            { getStateSelectMenu( selectedIil, onIilItemChange) }
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
                                    {selectedIil.id === 'new' ?
                                        <Button variant="danger" onClick={() => onReset()}>Reset</Button>:
                                        <Button variant="danger" onClick={() => onReset()}>Delete</Button>
                                    }
                                </ButtonGroup>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                </Form>
            </Col>
            <Col xs="2">
                <Card style={{ width: '100%' }}>
                    <Card.Header>
                        Next
                    </Card.Header>
                    <Card.Body>
                        {console.log(nextFlows)}
                        <NextFlowList nextFlowList={nextFlows.filter(i => i.to === selectedIil.id)} iilList={iils} />
                        <NextFlowUpdator fromId={selectedIil.id!} iils={iils} 
                        onSubmit={(data: NextFlowDto) => onNextFlowCreate(data)} onDelete={onNextFlowDelete} onReset={() => {}} />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
            {
                selectedIil.id !== 'new' &&
                <Row xs="2">
                    <Col xs="2">

                    </Col>
                    <Col xs="8">
                        <Card style={{ width: '100%' }}>
                            <Card.Header>
                                Tasks
                            </Card.Header>
                            <Card.Body>
                                <IilCardList
                                    iils={iils.filter(iil => iil.goal === selectedIil.id)}
                                    goalIil={selectedIil}
                                    onAddTask={onReset}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col xs="2">

                    </Col>
                </Row>
            }
        
        </>
    );
  }