import { Checkbox } from "@material-ui/core";
import React, { useContext } from "react";
import Popup from "reactjs-popup";
import { callCreateAPI, callDeleteAPI } from "../api/apiHandler";
import { OperationContext } from "../App";
import DeleteButton from "../hooksComponent/DeleteButton";
import Tasc from "../model/tasc.entity";
import { contextMapping, PageContext } from "../type/pageContext";
import { TascState } from "../type/tascState";
import { validURL } from "../util/urlStringCheck";
import { IOperationParam } from "./model/operationParam";
import Picker from "emoji-picker-react";
import { getBrandNewGoal, getBrandNewTasc } from "./model/tascManager";
import {
  getValuesFromInputElement,
  getValuesFromSectionElement,
} from "./util/elemToTasc";
import { getStateSelectMenu } from "./util/getStateSelectMenu";

interface ITascItemRendererProp {
  tasc: Tasc;
  onTascListElemChange: Function;
  tascList: Tasc[];
  onTascListChange: Function;
  pageContext: PageContext;
  updatePageContext: Function;
  update: Function;
}

export const TascItemRenderer = ({
  tasc,
  onTascListElemChange,
  tascList,
  onTascListChange,
  pageContext,
  updatePageContext,
  update,
}: ITascItemRendererProp) => {
    const param = useContext(OperationContext) as IOperationParam;

    const mockANewTasc = (goal?: string) => {
        return getBrandNewTasc(
            goal ? goal : getBrandNewGoal(),
            param.ownerId,
            param.ownerId,
            0
          );
    }

  const renderAddButton = (
    tasc: Tasc,
    setTascItem: Function,
    goal?: string
  ) => {
    return (
      <button
        className="item_btn_highlighted"
        onClick={() => {
          addNewItem(tasc, tascList, onTascListChange).then((res: any) => {
            setTascItem(
                mockANewTasc(goal)
            );
            document
              .getElementsByName(res.data.id + "==act")
              .forEach((e) => e.focus());
          });
        }}
      >
        +
      </button>
    );
  };

  const checkEmptyTasc = (tascList: Tasc[]) => {
    let result = false;
    tascList.forEach((t) => (result = result || t.act.length === 0));
    return result;
  };

  const renderAddForNewItem = (
    tasc: Tasc,
    setTascItem: Function,
    goal?: string
  ) => {
    return (
      <div className="item_division item_options">
        {renderAddButton(tasc, setTascItem, goal)}
      </div>
    );
  };

  const renderAddButtonForNewField = (
    tascList: Tasc[],
    onTascListChange: Function,
    goal: string
  ) => {
    return (
      <button
        className="item_btn_highlighted"
        onClick={() => {
          if (checkEmptyTasc(tascList)) {
            alert("You have empty field!");
          } else {
            onTascListChange([
              ...tascList,
              new Tasc(getBrandNewTasc(goal, param.ownerId, param.ownerId, 0)),
            ]);
          }
        }}
      >
        +
      </button>
    );
  };

  const isOrganizeMode = (pageContext: PageContext) => {
    return pageContext === PageContext.Organizing;
  };

  const addNewItem = async (
    tasc: Tasc | undefined,
    tascList: Tasc[],
    onTascListChange: Function
  ) => {
    const newTasc: Tasc = tasc
      ? tasc
      : mockANewTasc()
    return await callCreateAPI(param.backEndUrl, param.ownerId, newTasc)
      .then((res: any) => {
        onTascListChange(
          [...tascList, new Tasc(res.data)].sort((a, b) => b.iid - a.iid)
        );
        return res;
      })
      .catch((error) => alert(error));
  };

  const getInputForAct = (
    tasc: Tasc,
    onTascListElemChange: Function,
    tascList?: Tasc[] | undefined
  ) => {
    return (
      <input
        type="text"
        name={`${tasc.id}==act`}
        placeholder={"What do you want to achieve?"}
        value={tasc.act}
        onChange={(e) => {
          onTascListElemChange(getValuesFromInputElement(e));
        }}
        className="item_content_act"
      />
    );
  };

  const renderOptions = (
    tasc: Tasc,
    pageContext: PageContext,
  ) => {
    return (
      <div className="item_division item_options">
        <div className="item_division item_state">
          {getStateSelectMenu(
            pageContext,
            tasc,
            onTascListElemChange,
            update,
            (id: string) => {onTascListChange(tascList.filter((t) => t.id !== id))})}
        </div>
        <div className="item_division item_org">
          <button
            className="item_btn_highlighted"
            onClick={() => {
              if (isOrganizeMode(pageContext)) {
                updatePageContext(PageContext.Incoming);
              } else {
                updatePageContext(PageContext.Organizing, tasc.goal);
              }
            }}
          >
            Organize
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
                callDeleteAPI(param.backEndUrl, param.ownerId, tasc.id).then(() =>
                  onTascListChange(tascList.filter((t:any)=> t.id !== tasc.id))
                )
              }
              onCancelCallback={() => console.log()}
            />
          </Popup>
        </div>
      </div>
    );
  };

  const handleEnterKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const partialTasc = getValuesFromSectionElement(event.currentTarget);
      update(partialTasc);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    /*
    const partialTasc = getValuesFromSectionElement(event.currentTarget);
    update(partialTasc);
    */
  };

  return (
    <div id={tasc.id} key={tasc.id}>
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
          <input hidden name={`${tasc.id}==goal`} defaultValue={tasc.goal} readOnly />
          {pageContext === PageContext.Focusing ? (
            <Checkbox
              checked={tasc.state === TascState.Done}
              onChange={(e) => {
                // phase out
                document
                  .getElementsByName(`${tasc.id}==state`)
                  .forEach(
                    (e) =>
                      ((e as HTMLInputElement).value =
                        TascState.Done.toString())
                  );
                const partialTasc = { id: tasc.id, state: TascState.Done };
                onTascListElemChange(partialTasc);
                update(partialTasc).then((t:any) => onTascListChange(tascList.filter((t) => contextMapping[pageContext].includes(t.state))));
              }}
              name={`${tasc.id}==state==checkbox`}
              color="primary"
            />
          ) : (
            <Popup
              onClose={() =>
                {
                    /* updateWithSection(document.getElementById(tasc.id)!); */
                }                
              }
              trigger={
                <button className="item_btn">
                  {tasc.goal ? (
                    <span className="emoji_span">
                      {tasc.goal.split("=goal=")[0]}
                    </span>
                  ) : (
                    <span>{}</span>
                  )}
                </button>
              }
              position="right top"
            >
              <Picker
                onEmojiClick={(e, emoji) => {
                  const partialTasc = {
                    id: tasc.id,
                    goal: emoji.emoji + "=goal=" + tasc.goal.split("=goal=")[1],
                  };
                  onTascListElemChange(partialTasc);
                  update(partialTasc).then((t: any) => {
                    document
                    .getElementsByName(`${tasc.id}==goal`)
                    .forEach(
                      (e) =>
                        ((e as HTMLInputElement).value =
                          emoji.emoji + "=goal=" + tasc.goal.split("=goal=")[1])
                    );
                  });
                }}
              />
            </Popup>
          )}
        </div>
        <div
          className={`item_division item_act ${
            tasc.state === TascState.Focused &&
            pageContext === PageContext.Incoming
              ? "item_focused"
              : ""
          }`}
        >
          {validURL(tasc.act) ? (
            <a href={tasc.act} target={"_blank"} rel="noreferrer">
              {getInputForAct(tasc, onTascListElemChange, tascList)}
            </a>
          ) : (
            getInputForAct(tasc, onTascListElemChange, tascList)
          )}

          <br />
          <input
            type="text"
            name={`${tasc.id}==endWhen`}
            placeholder={"When is it done?"}
            value={tasc.endWhen}
            onChange={(e) => {
              onTascListElemChange(getValuesFromInputElement(e));
            }}
            className="item_content_end_when"
          />
        </div>
        {tascList
          ? renderOptions(tasc, pageContext)
          : renderAddForNewItem(tasc, onTascListElemChange)}
      </section>
      {isOrganizeMode(pageContext) ? (
        <div className="separator">
          <input type="text"></input>
        </div>
      ) : (
        <hr className="dashed"></hr>
      )}
      {isOrganizeMode(pageContext) ? (
        renderAddButtonForNewField(tascList!, onTascListChange!, tasc.goal)
      ) : (
        <></>
      )}
    </div>
  );
};
