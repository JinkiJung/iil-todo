import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { AsyncTypeahead, Typeahead } from "react-bootstrap-typeahead";
import { IilControllerApi, IilDto } from "../../ill-repo-client";
import { getIilText } from "./iilAbstractor";

export interface IilSelectorProp {
  onIilChange: ((chosenIils: any[]) => boolean);
  inputRef: React.MutableRefObject<null>;
  givenIil: IilDto | undefined;
}

export const IilSelector = (
  { onIilChange, inputRef, givenIil }: IilSelectorProp
) => {
  const iilControllerApi = new IilControllerApi();
  const [iilList, setIilList] = useState<IilDto[]>([]);
  const [singleSelection, setSingleSelection] = useState<IilDto[]>(givenIil ? [givenIil] : []);
  useEffect(() => {
    if (givenIil) {
      setSingleSelection([givenIil]);
    }
  }, [givenIil]);

  const handleSearch = (query: string) => {
    fetchIilList();
  };

  const fetchIilList = () => {
    // fetch all iil list from iilControllerApi
    iilControllerApi.getIils().then((resp) => {
      const { data } = resp;
      setIilList(data);
    });
  }

  // Bypass client-side filtering by returning `true`. Results are already
  // filtered by the search endpoint, so no need to do it again.
  const filterBy = () => true;

  // use Typeahead to select one element of the iils
  return (
    <Form.Group>
      <AsyncTypeahead
        filterBy={filterBy}
        id="basic-typeahead-single"
        labelKey={iil => `${getIilText(iil as IilDto)}`}
        ref={inputRef}
        minLength={1}
        onSearch={handleSearch}
        onChange={(selected) => {
          if (selected === undefined || selected.length === 0) {
            setSingleSelection([]);
          }
          // update singleSelection
          if (onIilChange!(selected)) {
            setSingleSelection(selected as IilDto[]);
          }
        }}
        options={iilList}
        placeholder="Choose an iil"
        selected={singleSelection}
        renderMenuItemChildren={(option: IilDto) => (
          <>
            <span>{getIilText(option)}</span>
          </>
        )}
      />
    </Form.Group>
  );
}