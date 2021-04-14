import React, { useEffect, useState } from "react";
import UseTascList from "../hooksComponent/useTascList";
import Tasc, { ITasc } from "../model/tasc.entity";
import {
  callCreateAPI,
  callDeleteAPI,
  callGetAPI,
  callUpdateAPI,
} from "../api/apiHandler";
import {
  getValuesFromInputElement,
  getValuesFromSectionElement,
} from "../element/tascRenderer";
import Picker from "emoji-picker-react";
import { ConfirmProvider } from "../hooksComponent/ConfirmContext";
import { contextMapping, PageContext } from "../type/pageContext";
import Popup from "reactjs-popup";
import DeleteButton from "../hooksComponent/DeleteButton";
import { FormControl, MenuItem, Select } from "@material-ui/core";
import { TascState } from "../type/tascState";

const shortid = require("shortid");

export interface IPageRenderer {
  url: string;
  ownerId: string;
  givenPageContext: PageContext;
}

export const PageRenderer = ({
  url,
  ownerId,
  givenPageContext,
}: IPageRenderer) => {
  const [serviceStatus, setServiceStatus] = useState(0);
  const [toBeUpdated, setToBeUpdated] = useState<string[]>([]);
  const [pageContext, setPageContext] = useState<PageContext>(givenPageContext);

  const getBrandNewTasc = (
    startWhen: string,
    goal: string,
    actor: string,
    listSize: number
  ): Tasc => {
    return new Tasc({
      id: shortid.generate(),
      startWhen,
      goal,
      actor,
      state: TascState.Active,
      order: listSize,
    });
  };

  let initialTascList: Tasc[] = [];
  const { tascList, onTascListChange, onTascItemChange } = UseTascList([
    ...initialTascList,
    getBrandNewTasc("", "", ownerId, initialTascList.length),
  ]);

  useEffect(() => {
    callGetAPI(url, ownerId, pageContext)
      .then((response) => response.data)
      .then((data: ITasc[]) => data.map((e) => new Tasc(e)))
      .then((tascs) => {
        onTascListChange(tascs);
        setServiceStatus(1);
      })
      .catch((err) => setServiceStatus(-1));
  }, [serviceStatus, pageContext, url, ownerId]);

  const getChildIndices = (tascList: Tasc[]): string[] => {
    let indiceSet = new Set<string>();
    tascList.forEach((element) => {
      if (Array.isArray(element.act)) {
        element.act.forEach((subElement) => {
          indiceSet.add(subElement);
        });
      }
    });
    return Array.from(indiceSet);
  };

  const getSolidTascs = (tascList: Tasc[], indices: string[]) => {
    return tascList.filter((tasc: Tasc) => !indices.includes(tasc.id));
  };

  const addNewItem = (
    tascList: Tasc[],
    onTascListChange: Function,
    actor: string,
    startWhen: string = "",
    goal: string = ""
  ) => {
    const newTasc: Tasc = getBrandNewTasc(
      startWhen,
      goal,
      actor,
      tascList.length
    );
    callCreateAPI(url, ownerId, newTasc)
      .then(() => onTascListChange([...tascList, newTasc]))
      .catch((error) => alert(error));
  };

  const update = (section: HTMLElement) => {
    const partialTasc = getValuesFromSectionElement(section);
    if (partialTasc) {
      callUpdateAPI(url, ownerId, partialTasc);
    }
    setToBeUpdated([]);
  };

  const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      update(event.currentTarget);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    if (toBeUpdated.length) {
      update(event.currentTarget);
    }
  };

  function enumKeys<O extends object, K extends keyof O = keyof O>(
    obj: O
  ): K[] {
    return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
  }

  const getSelectMenu = (pageContext: PageContext, tasc: Tasc) => {
    const states: any = [];
    for (const value of enumKeys(TascState)) {
      states.push(value);
    }
    return pageContext !== PageContext.Focusing ? (
      <form noValidate>
        <FormControl>
          <Select
            value={tasc.state}
            onChange={(e) => {
              onTascItemChange({
                id: tasc.id,
                state: e.target.value,
              } as Partial<Tasc>);
              setToBeUpdated([...toBeUpdated, `${tasc.id}==state`]);
            }}
            inputProps={{
              name: tasc.id + "==state",
              id: tasc.id + "==state",
            }}
          >
            {contextMapping[pageContext].map((k: any) => (
              <MenuItem key={tasc.id + "==" + k} value={k}>
                {states[k]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </form>
    ) : (
      <></>
    );
  };

  const renderRow = (
    tasc: Tasc,
    tascList: Tasc[],
    onTascItemChange: Function,
    onTascListChange: Function
  ) => {
    return (
      <div key={tasc.id}>
        <section
          className="item"
          id={tasc.id}
          onKeyUp={handleEnterKey}
          onBlur={handleBlur}
        >
          <div className="item_division item_dragbtn">
            <button className="item_btn_draggable"></button>
          </div>
          <div className="item_division item_check">
            <input hidden name={`${tasc.id}==goal`} defaultValue={tasc.goal} />
            {false ? (
              <input
                className="item_content item_content_checkbox"
                name={`${tasc.id}==state`}
                onChange={(e) => {
                  onTascItemChange(getValuesFromInputElement(e));
                  update(document.getElementById(tasc.id)!);
                }}
                type="checkbox"
              />
            ) : (
              <Popup
                onClose={() =>
                  toBeUpdated
                    ? update(document.getElementById(tasc.id)!)
                    : console.log()
                }
                trigger={
                  <button className="item_btn">
                    {tasc.goal ? (
                      <span className="emoji_span">{tasc.goal}</span>
                    ) : (
                      <span>{}</span>
                    )}
                  </button>
                }
                position="right top"
              >
                <Picker
                  onEmojiClick={(e, emoji) => {
                    onTascItemChange({ id: tasc.id, goal: emoji.emoji });
                    setToBeUpdated([...toBeUpdated, `${tasc.id}==goal`]);
                    document
                      .getElementsByName(`${tasc.id}==goal`)
                      .forEach(
                        (e) => ((e as HTMLInputElement).value = emoji.emoji)
                      );
                  }}
                />
              </Popup>
            )}
          </div>
          <div className="item_division item_act">
            <input
              type="text"
              name={`${tasc.id}==act`}
              placeholder={"What do you want to achieve?"}
              value={tasc.act}
              onChange={(e) => {
                onTascItemChange(getValuesFromInputElement(e));
                setToBeUpdated([...toBeUpdated, e.target.name]);
              }}
              className="item_content_act"
            />
            <br />
            <input
              type="text"
              name={`${tasc.id}==endWhen`}
              placeholder={"When is it done?"}
              value={tasc.endWhen}
              onChange={(e) => {
                onTascItemChange(getValuesFromInputElement(e));
                setToBeUpdated([...toBeUpdated, e.target.name]);
              }}
              className="item_content_end_when"
            />
          </div>
          <div className="item_division item_state">
            {getSelectMenu(pageContext, tasc)}
          </div>
          <div className="item_division item_append">
            <button
              className="item_btn_highlighted"
              onClick={() =>
                addNewItem(
                  tascList,
                  onTascListChange,
                  tasc.id,
                  tasc.goal,
                  ownerId
                )
              }
            >
              +
            </button>
          </div>
          <div className="item_division item_option">
            <Popup
              trigger={<button className="item_btn_highlighted">...</button>}
              position="left center"
            >
              <DeleteButton
                open={false}
                title={`Are you sure to delete this?`}
                message={`${tasc.act}`}
                onConfirmCallback={() =>
                  callDeleteAPI(url, ownerId, tasc.id).then(() =>
                    setPageContext(PageContext.Admin)
                  )
                }
                onCancelCallback={() => console.log()}
              />
            </Popup>
          </div>
        </section>
        <hr className="dashed"></hr>
      </div>
    );
  };

  return serviceStatus > 0 ? (
    <>
      <div className="equalHWrap eqWrap">
        <button
          className="equalHW eq"
          onClick={() => setPageContext(PageContext.Incoming)}
        >
          incoming
        </button>
        <button
          className="equalHW eq"
          onClick={() => setPageContext(PageContext.Focusing)}
        >
          focusing
        </button>
        <button
          className="equalHW eq"
          onClick={() => setPageContext(PageContext.Admin)}
        >
          admin
        </button>
      </div>
      <div className="item_container">
        <ConfirmProvider>
          <section className="add_item_button_container">
            <button
              className="add_item_button"
              onClick={() => {
                addNewItem(tascList, onTascListChange, ownerId);
              }}
            >
              +
            </button>
          </section>
          {getSolidTascs(
            tascList,
            getChildIndices(tascList)
          ).map((solidTasc: Tasc) =>
            renderRow(solidTasc, tascList, onTascItemChange, onTascListChange)
          )}
        </ConfirmProvider>
      </div>
    </>
  ) : serviceStatus < 0 ? (
    <div className="page_header">Something went wrong with server.</div>
  ) : (
    <div className="page_header">Loading........</div>
  );
};
