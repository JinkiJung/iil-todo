// ActionSelector component that works like IilSelector but for actions

import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { AsyncTypeahead, Typeahead } from "react-bootstrap-typeahead";
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
    const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(true);

        actionControllerApi.getActions().then((resp) => {
            const { data } = resp;
            setActions(data);
            setIsLoading(false);
        });
    };

    return (
        <Form.Group>
            <AsyncTypeahead
                filterBy={filterBy}
                id="async-example"
                isLoading={isLoading}
                labelKey="name"
                minLength={3}
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
        </Form.Group>
    );
}