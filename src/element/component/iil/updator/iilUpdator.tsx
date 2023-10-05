import React, { useEffect, useRef, useState } from "react";
import { Accordion, Button, ButtonGroup, Card, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { IilDto } from "../../../../ill-repo-client";
import { getDictInput, getInputForAttribute } from "../../../util/iilInputs";
import ReactJson from 'react-json-view-2';
import { getStateSelectMenu } from "../../../util/iilStateSelect";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { IilSelector } from "../../../util/iilSelector";
import { IilCardList } from "../iilCardList";
import { ConditionSelector } from "../../../util/ConditionSelector";

export interface IIilUpdatorProp {
    iilList: IilDto[];
    selectedIil: IilDto;
    onIilItemChange: Function;
    ownerId: string;
    onSubmit: (iil: IilDto) => Promise<AxiosResponse<IilDto> | undefined>;
    onDelete: (id: string) => Promise<AxiosResponse<void> | undefined>;
    onReset: (goalId?: string) => void;
}

export const IilUpdator = ({
    iilList,
    selectedIil,
    onIilItemChange,
    ownerId,
    onSubmit,
    onDelete,
    onReset,
}: IIilUpdatorProp) => {
    const goalRef = useRef<any>(null);
    const [selectedGoal, setSelectedGoal] = useState<string | undefined>(selectedIil?.goal);
    const {
        register,
        handleSubmit,
        // Read the formState before render to subscribe the form state through the Proxy
        formState: { errors, isDirty, isSubmitting, touchedFields, submitCount },
    } = useForm({
        defaultValues: selectedIil
    });

    const onGoalChanged = (chosenIils: IilDto[]): boolean => {
        if (chosenIils.length) {
            if (selectedIil.id === chosenIils[0].id) {
                alert("Goal and task should not be identical");
                return false;
            } else {
                onIilItemChange({ id: selectedIil.id, goal: chosenIils[0].id });
                return true;
            }
        }
        return false;
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

    useEffect(() => {
        if (selectedIil.goal) {
            setSelectedGoal(selectedIil.goal);
        } else {
            goalRef.current.clear();
        }
    }, [selectedIil]);

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
                            <IilSelector iils={iilList.filter(e => e.id !== selectedIil.id)} onIilChange={onGoalChanged} inputRef={goalRef} selectedIilId={selectedGoal} />
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
                                <Row style={{ padding: '10px' }}>
                                    <Col>
                                        <Card>
                                            <Row xs="auto">
                                                <Col xs={2} className="align-self-center">
                                                    Activate if
                                                </Col>
                                                <Col xs={10}>
                                                    {getInputForAttribute(selectedIil, 'activateIf', onIilItemChange, register, handleEnterKey)}
                                                </Col>
                                            </Row>
                                            <Row xs="auto">
                                                <Col xs={2} className="align-self-center">
                                                    Input
                                                </Col>
                                                <Col xs={10}>
                                                    {getInputForAttribute(selectedIil, 'input', onIilItemChange, register, handleEnterKey)}
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row style={{ padding: '10px' }}>
                                    <Col>
                                        <Card>
                                            <Row xs="auto">
                                                <Col xs={2} className="align-self-center">
                                                    Who
                                                </Col>
                                                <Col xs={10}>
                                                    {getInputForAttribute(selectedIil, 'actor', onIilItemChange, register, handleEnterKey)}
                                                </Col>
                                            </Row>
                                            <Row xs="auto">
                                                <Col xs={2} className="align-self-center">
                                                    Doing What
                                                </Col>
                                                <Col xs={10}>
                                                    {getInputForAttribute(selectedIil, 'act', onIilItemChange, register, handleEnterKey)}
                                                </Col>
                                            </Row>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row style={{ padding: '10px' }}>
                                    <Col>
                                        <Card>
                                            <Row xs="auto">
                                                <Col xs={2} className="align-self-center">
                                                    Finish if
                                                </Col>
                                                <Col xs={10}>
                                                    {getInputForAttribute(selectedIil, 'finishIf', onIilItemChange, register, handleEnterKey)}
                                                </Col>
                                            </Row>
                                            <Row xs="auto">
                                                <Col xs={2} className="align-self-center">
                                                    Output
                                                </Col>
                                                <Col xs={10}>
                                                    {getInputForAttribute(selectedIil, 'output', onIilItemChange, register, handleEnterKey)}
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
                                                    {selectedIil.id !== 'new' &&
                                                        <Row xs="auto">
                                                            <Col xs={2} className="align-self-center">
                                                                ID
                                                            </Col>
                                                            <Col xs={10}>
                                                                {selectedIil.id}
                                                            </Col>
                                                        </Row>
                                                    }
                                                    {(selectedIil.id === 'new' || selectedIil.about) &&
                                                        <Row xs="auto">
                                                            <Col xs={2} className="align-self-center">
                                                                About
                                                            </Col>
                                                            <Col xs={10}>
                                                                {
                                                                    <ReactJson src={selectedIil.about!} name="about"
                                                                        onEdit={form => onIilItemChange({ ...selectedIil, about: form.updated_src })}
                                                                        onAdd={form => onIilItemChange({ ...selectedIil, about: form.updated_src })}
                                                                        onDelete={form => onIilItemChange({ ...selectedIil, about: form.updated_src })} />
                                                                }
                                                            </Col>
                                                        </Row>
                                                    }
                                                    {(selectedIil.id === 'new' || selectedIil.help) &&
                                                        <Row xs="auto">
                                                            <Col xs={2} className="align-self-center">
                                                                Help
                                                            </Col>
                                                            <Col xs={10}>
                                                                {
                                                                    <ReactJson src={selectedIil.help!} name="help"
                                                                        onEdit={form => onIilItemChange({ ...selectedIil, help: form.updated_src })}
                                                                        onAdd={form => onIilItemChange({ ...selectedIil, help: form.updated_src })}
                                                                        onDelete={form => onIilItemChange({ ...selectedIil, help: form.updated_src })} />
                                                                }
                                                            </Col>
                                                        </Row>
                                                    }
                                                    {selectedIil.id !== 'new' &&
                                                        <Row xs="auto">
                                                            <Col xs={2} className="align-self-center">
                                                                Maintainer
                                                            </Col>
                                                            <Col xs={10}>
                                                                {selectedIil.id}
                                                            </Col>
                                                        </Row>
                                                    }
                                                    <Row xs="auto">
                                                        <Col xs={2} className="align-self-center">
                                                            Owner
                                                        </Col>
                                                        <Col xs={10}>
                                                            {getInputForAttribute(selectedIil, 'owner', onIilItemChange, register, handleEnterKey)}
                                                        </Col>
                                                    </Row>
                                                    <Row xs="auto">
                                                        <Col xs={2} className="align-self-center">
                                                            Status
                                                        </Col>
                                                        <Col xs={10}>
                                                            {getStateSelectMenu(selectedIil, onIilItemChange)}
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
                                                <Button variant="danger" onClick={() => onReset()}>Reset</Button> :
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
                                    iils={iilList.filter(iil => iil.goal === selectedIil.id)}
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