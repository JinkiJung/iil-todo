import { AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react"
import { Button, ButtonGroup, Form } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form";
import { IilDto, NextFlowDto } from "../../../ill-repo-client";
import { IilSelector } from "../../util/iilSelector";

export interface NextFlowUpdatorProp{
    fromId: string;
    iils: IilDto[];
    onSubmit: (nextFlow: NextFlowDto) => void;//Promise<AxiosResponse<NextFlowDto> | undefined>;
    onDelete: (id: string) => void; //Promise<AxiosResponse<void> | undefined>;
    onReset: () => void;
}

export const NextFlowUpdator = ({fromId, iils, onSubmit, onDelete, onReset}: NextFlowUpdatorProp) => {
    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm();
    const toRef = useRef<any>(null);
    const [ selectedTo, setSelectedTo ] = useState<string | undefined>("");
    useEffect(() => {
        setValue("from", fromId);
    },[fromId]);

    return (
    <Form onSubmit={handleSubmit((data)=>onSubmit(data))}>
        <Form.Group className="mb-3" controlId="formCondition">
            <Form.Label>Condition</Form.Label>
            <Form.Control {...register("condition", {required: true})} name="condition" type="text" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formTo">
            <Form.Label>To</Form.Label>
            <IilSelector iils={iils} onIilChange={(iils) => setValue("to", iils.pop().id)} inputRef={toRef} selectedIilId={selectedTo} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formFrom">
            <Form.Control {...register("from", {required: true})} name="from" hidden={true} />
        </Form.Group>

        <ButtonGroup className="d-flex">
            <Button variant="secondary" type="submit">
                Add
            </Button>
        </ButtonGroup>
    </Form>);
}