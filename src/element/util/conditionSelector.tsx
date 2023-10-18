// ConditionSelector component that works like IilSelector but for conditions

import React, { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { ConditionControllerApi, ConditionDto, ConditionDtoTypeEnum } from "../../ill-repo-client";
import * as Icon from 'react-bootstrap-icons';

export interface ConditionSelectorProp {
    onConditionChange: ((chosenConditions: any[]) => void);
    inputRef: React.MutableRefObject<null>;
    givenCondition: ConditionDto | undefined;
}

export const ConditionSelector = (
    { onConditionChange, inputRef, givenCondition }: ConditionSelectorProp
) => {
    const [conditions, setConditions] = useState<ConditionDto[]>([]);
    const [condition, setCondition] = useState<ConditionDto | undefined>(givenCondition);

    const [singleSelection, setSingleSelection] = useState<ConditionDto[]>(givenCondition ? [givenCondition] : []);
    useEffect(() => {
        if (givenCondition) {
            setSingleSelection([givenCondition]);
        }
    }, [givenCondition]);

    const conditionControllerApi = new ConditionControllerApi();

    // Bypass client-side filtering by returning `true`. Results are already
    // filtered by the search endpoint, so no need to do it again.
    const filterBy = () => true;

    const handleSearch = (query: string) => {
        fetchConditions();
    };

    const fetchConditions = () => {
        // check the condition.type is one of a value in ConditionDtoTypeEnum
        if (condition?.type && Object.values(ConditionDtoTypeEnum).includes(condition.type)) {
            conditionControllerApi.getConditionsByType(condition.type).then((resp) => {
                const { data } = resp;
                setConditions(data);
            });
        }
    }

    // a function returns Icon and ConditionType value corresponding to given ConditionType
    // Icon.Clock for ConditionDtoTypeEnum.TIME
    // Icon.CursorFill for ConditionDtoTypeEnum.LOCATION
    // Icon.Braces for ConditionDtoTypeEnum.IIL_VARIABLE
    // Icon.Files for ConditionDtoTypeEnum.IIL_INPUT
    // Icon.ArrowRightCircle for ConditionDtoTypeEnum.IIL_STATE
    // Icon.BoxArrowInDownLeft for ConditionDtoTypeEnum.EVENT
    const getIconAndTypeString = (conditionType: ConditionDtoTypeEnum) => {
        switch (conditionType) {
            case ConditionDtoTypeEnum.TIME:
                return <><Icon.Clock />{" "+ conditionType}</>;
            case ConditionDtoTypeEnum.LOCATION:
                return <><Icon.CursorFill />{" "+ conditionType}</>
            case ConditionDtoTypeEnum.IILVARIABLE:
                return <><Icon.Braces />{" "+ conditionType}</>
            case ConditionDtoTypeEnum.IILINPUT:
                return <><Icon.Files />{" "+ conditionType}</>
            case ConditionDtoTypeEnum.IILSTATE:
                return <><Icon.ArrowRightCircle />{" "+ conditionType}</>
            case ConditionDtoTypeEnum.EVENT:
                return <><Icon.BoxArrowInDownLeft />{" "+ conditionType}</>
            default:
                return <><Icon.Clock />{" "+ conditionType}</>
        }
    }


    return (
        <Form.Group>
            <InputGroup>
                {
                    condition?.type ?
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setCondition!({ condition, type: undefined } as ConditionDto);
                                inputRef.current && (inputRef.current as any).clear();
                                setSingleSelection([]);
                            }}
                        >
                            {getIconAndTypeString(condition.type)}
                        </Button>
                        :
                        // create buttons with value and name of all ConditionDtoTypeEnum
                        Object.values(ConditionDtoTypeEnum).map((conditionType) => {
                            return (
                                <Button
                                    key={conditionType}
                                    variant="outline-secondary"
                                    onClick={() => {
                                        setCondition!({ condition, type: conditionType } as ConditionDto);
                                        fetchConditions();
                                    }}
                                >
                                    {getIconAndTypeString(conditionType)}
                                </Button>
                            );
                        })
                }
                <AsyncTypeahead
                    filterBy={filterBy}
                    id="async-example"
                    labelKey="name"
                    className="flex-grow-1"
                    minLength={1}
                    ref={inputRef}
                    onSearch={handleSearch}
                    onChange={(selected) => {
                        onConditionChange!(selected);
                        setSingleSelection(selected as ConditionDto[]);
                    }}
                    options={conditions}
                    placeholder="Search for a condition"
                    renderMenuItemChildren={(option: ConditionDto) => (
                        <>
                            <span>{option.name}</span>
                        </>
                    )}
                    selected={singleSelection}
                />
                <Button
                    onClick={() => {
                        console.log("Play again");
                    }}
                    variant="outline-secondary">
                    +
                </Button>
            </InputGroup>
        </Form.Group>
    );
}