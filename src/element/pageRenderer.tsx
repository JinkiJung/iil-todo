import React, { MouseEventHandler, useCallback, useEffect, useState } from "react";
import UseTascList from "../hooksComponent/useTascList";
import Tasc, { ITasc } from "../model/tasc.entity";
import {
  callCreateAPI,
  callGetAPI,
  callUpdateAPI,
  callUpdateBatchAPI,
} from "../api/apiHandler";
import { ConfirmProvider } from "../hooksComponent/ConfirmContext";
import { getBrandNewGoal, getBrandNewTasc } from "./model/tascManager";
import { TascItemUpdator } from "./ tascItemUpdator";
import { contextMapping, PageContext } from "../type/pageContext";
import { TascItemCreator } from "./tascItemCreator";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from 'immutability-helper'

export interface IPageRenderer {
  url: string;
  ownerId: string;
  givenPageContext: PageContext;
  onLogOut: MouseEventHandler<HTMLButtonElement>;
}

export const PageRenderer = ({
  url,
  ownerId,
  givenPageContext,
  onLogOut,
}: IPageRenderer) => {
  let pendingUpdateFn: any;
  let requestedFrame: number | undefined;

  const [serviceStatus, setServiceStatus] = useState(0);
  const [pageContext, setPageContext] = useState<PageContext>(givenPageContext);
  const [tascListOriginal, setTascListOriginal] = useState<Tasc[]>([]);
  
  useEffect(() => {
    let mounted = true;
    callGetAPI(url, ownerId, PageContext.Admin)
      .then((response) => response.data)
      .then((data: ITasc[]) => data.map((e) => new Tasc(e)))
      .then((tascs) => {
        if (mounted){
          setTascListOriginal(setTascListOrder(tascs));
          updatePageContext(pageContext);
          setServiceStatus(1);
        }
      })
      .catch((err) => setServiceStatus(-1));

      return () => {mounted = false;}
  }, [serviceStatus, url, ownerId]);

  const createCall = (tasc : Tasc): Promise<any> => {
    return callCreateAPI(url, ownerId, tasc);
  }
  
  const updateCall = (partialTasc : Partial<Tasc>): Promise<any> => {
    return callUpdateAPI(url, ownerId, partialTasc);
  }
  let initialTascList: Tasc[] = [];
  const { tascList, onTascListChange, onTascListElemChange } = UseTascList([
    ...initialTascList,
    getBrandNewTasc(getBrandNewGoal(), ownerId, ownerId, initialTascList.length),
  ]);

  const removeAllFocused = async (ptascList: Partial<Tasc>[]) => {
    return await callUpdateBatchAPI(url, ownerId, ptascList)
        .then((res: any) => { onTascListChange([...tascList, new Tasc(res.data)]); return res;})
        .catch((error) => alert(error));
  }

  const setTascListOrder = (tascList: Tasc[]): Tasc[] => {
    return tascList.reverse();
  }

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

  const updatePageContext = (givenContext: PageContext, goal?: string) => {
    if (givenContext === PageContext.Organizing && goal) {
      onTascListChange(tascListOriginal.filter((t) => contextMapping[givenContext].includes(t.state) && t.goal === goal));
    }
    else if (givenContext === PageContext.Focusing) {
      onTascListChange(tascListOriginal.filter((t) => contextMapping[givenContext].includes(t.state)).sort((a,b) => a.order - b.order));
    }
    else {
      onTascListChange(tascListOriginal.filter((t) => contextMapping[givenContext].includes(t.state)));
    }
    setPageContext(givenContext);
  }

  const scheduleUpdate = (updateFn: any) => {
    pendingUpdateFn = updateFn;

    if (!requestedFrame) {
      requestedFrame = requestAnimationFrame(drawFrame);
    }
  }

  const drawFrame = (): void => {
    const nextState = update(tascList, pendingUpdateFn);
    onTascListChange(nextState);

    pendingUpdateFn = undefined;
    requestedFrame = undefined;
  }

  const moveCard = (id: string, afterId: string): void => {
    const cardIndex = tascList.findIndex((t) => t.id === id);
    const afterIndex = tascList.findIndex((t) => t.id === afterId);
    const card = tascList[cardIndex];

    scheduleUpdate({
        $splice: [
          [cardIndex, 1],
          [afterIndex, 0, card],
        ],
      })
  }

  const updateOrderOfList = () => {
    const partials = tascList.map((t, i) => {return {id: t.id, order: i}});
    // TODO: hold the page until the update being settled
    callUpdateBatchAPI(url, ownerId, partials).then((res) => console.log(partials));
  }

  return serviceStatus > 0 ? (
    <div className="bg bg_normal" id="background">
      <div className="pageHeader" id="pageHeader"><button onClick={onLogOut}>logOut</button></div>
      <div className="equalHWrap eqWrap">
        <button
          className="equalHW eq"
          onClick={() => {updatePageContext(PageContext.Incoming); document.getElementById("background")?.classList.replace("bg_focus", "bg_normal");}}
        >
          incoming
        </button>
        <button
          className="equalHW eq"
          onClick={() => {updatePageContext(PageContext.Focusing); document.getElementById("background")?.classList.replace("bg_normal", "bg_focus");}}
        >
          focusing
        </button>
        <button
          className="equalHW eq"
          onClick={() => {updatePageContext(PageContext.Admin); document.getElementById("background")?.classList.replace("bg_focus", "bg_normal");}}
        >
          admin
        </button>
      </div>
      <div className="menu">{pageContext === PageContext.Focusing ? <button onClick={() => removeAllFocused(tascList)}>Remove all</button> : <></>}</div>
      <div className="item_container">
        <DndProvider backend={HTML5Backend}>
          <ConfirmProvider>
            <br />
            {pageContext === PageContext.Incoming ? <TascItemCreator tascList={tascList} onTascListChange={onTascListChange} pageContext={pageContext} create={createCall}/> : <></>
            }
            {getSolidTascs(
              tascList,
              getChildIndices(tascList)
            ).map((tasc: Tasc, i: number) =>
            tasc.act.length ?
              <TascItemUpdator key={tasc.id} givenTasc={tasc} 
                                onTascListElemChange={onTascListElemChange}
                                tascList={tascList}
                                onTascListChange={onTascListChange}
                                pageContext={pageContext}
                                updatePageContext={updatePageContext}
                                create={createCall}
                                update={updateCall}
                                moveCard={moveCard}
                                updateOrderOfList={updateOrderOfList}
                                />
              :
              <TascItemCreator key={tasc.id} tascList={tascList} onTascListChange={onTascListChange} pageContext={pageContext} create={createCall} givenTasc={tasc}/>
            )}
          </ConfirmProvider>
        </DndProvider>
      </div>
    </div>
  ) : serviceStatus < 0 ? (
    <div className="page_header">Something went wrong with server.</div>
  ) : (
    <div className="page_header">Loading........</div>
  );
};
