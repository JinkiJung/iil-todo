import { AxiosResponse } from "axios";
import React, { useEffect } from "react"
import { Button, ButtonGroup, Form } from "react-bootstrap"
import { Controller, useForm } from "react-hook-form";
import { NextFlowDto } from "../../../ill-repo-client";

export interface NextFlowUpdatorProp{
    fromId: string;
    onSubmit: (nextFlow: NextFlowDto) => void;//Promise<AxiosResponse<NextFlowDto> | undefined>;
    onDelete: (id: string) => void; //Promise<AxiosResponse<void> | undefined>;
    onReset: () => void;
}

export const NextFlowUpdator = ({fromId, onSubmit, onDelete, onReset}: NextFlowUpdatorProp) => {
    const { control, register, handleSubmit, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        setValue("from", fromId);
    },[fromId]);

    return (
    <Form onSubmit={handleSubmit((data)=>console.log(data))}>
        <Form.Group className="mb-3" controlId="formCondition">
            <Form.Label>Condition</Form.Label>
            <Form.Control {...register("condition", {required: true})} name="condition" type="text" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formTo">
            <Form.Label>To</Form.Label>
            <Form.Control {...register("to", {required: true})} name="to" type="text" />
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