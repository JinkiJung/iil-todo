// ActionSelector component that works like IilSelector but for actions

import React, { useEffect, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { ActionDto, ActionControllerApi } from "../../ill-repo-client";

export interface ActionSelectorProp {
    onActionChange: ((chosenActions: any[]) => void);
    inputRef: React.MutableRefObject<null>;
    givenAction: ActionDto | undefined;
}

export const ActionSelector = (
    { onActionChange, inputRef, givenAction }: ActionSelectorProp
) => {
    const [actions, setActions] = useState<ActionDto[]>([]);

    const [singleSelection, setSingleSelection] = useState<ActionDto[]>(givenAction ? [givenAction] : []);

    useEffect(() => {
        if (givenAction) {
            setSingleSelection([givenAction]);
        }
    }, [givenAction]);

    const actionControllerApi = new ActionControllerApi();

    // Bypass client-side filtering by returning `true`. Results are already
    // filtered by the search endpoint, so no need to do it again.
    const filterBy = () => true;

    const handleSearch = (query: string) => {
        actionControllerApi.getActions().then((resp) => {
            const { data } = resp;
            setActions(data);
        });
    };

    return (
        <Form.Group>
            <InputGroup>
                <AsyncTypeahead
                    filterBy={filterBy}
                    id="async-example"
                    labelKey="name"
                    minLength={1}
                    className="flex-grow-1"
                    ref={inputRef}
                    onSearch={handleSearch}
                    onChange={(selected) => {
                        onActionChange!(selected);
                        setSingleSelection(selected as ActionDto[]);
                    }}
                    options={actions}
                    placeholder="Search for a action"
                    renderMenuItemChildren={(option: ActionDto) => (
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