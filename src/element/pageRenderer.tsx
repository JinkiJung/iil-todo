import React, { MouseEventHandler, useCallback, useEffect, useState } from "react";
import UseiilList from "../hooksComponent/useIilList";
import { ConfirmProvider } from "../hooksComponent/ConfirmContext";
import { getBrandNewName, getBrandNewIil } from "./model/iilManager";
import { IilItemUpdator } from "./iilItemUpdator";
import { contextMapping, PageContext } from "../type/pageContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from 'immutability-helper'
import { IilDto, IilDtoStatusEnum } from "../models";
import { IilControllerApi } from "../api/iil-controller-api";
import { AxiosResponse } from "axios";
import UseIilList from "../hooksComponent/useIilList";
import { IilItemCreator } from "./iilItemCreator";

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
  const [iilListOriginal, setIilListOriginal] = useState<IilDto[]>([]);

  const [newIil, setNewIil] = useState<IilDto>(getBrandNewIil(getBrandNewName(), ownerId, "", ownerId, "new"));
  const apiHandler = new IilControllerApi();

  useEffect(() => {
    let mounted = true;
    getCall().then((response) => response.data)
      .then((iils: IilDto[]) => {
        if (mounted){
          setIilListOriginal(setIilListOrder(iils));
          updatePageContext(pageContext);
          setServiceStatus(1);
        }
      })
      .catch((err) => setServiceStatus(-1));

      return () => {mounted = false;}
  }, [serviceStatus, url, ownerId]);

  const getCall = (): Promise<AxiosResponse<IilDto[]>> => {
    return apiHandler.getIils();
  }

  const createCall = (iilDto : IilDto): Promise<any> => {
    return apiHandler.createIil(iilDto);
  }
  
  const updateCall = (partialIilDto : IilDto, id: string): Promise<any> => {
    return apiHandler.updateIil(partialIilDto, id);
  }

  const deleteCall = (id: string): Promise<any> => {
    return apiHandler.deleteIil(id);
  }


  let initialiilList: IilDto[] = [];
  const { iilList, onIilListChange, onIilListElemChange } = UseIilList(initialiilList);

  const removeAllFocused = async (piilList: IilDto[]) => {
    /*
    return await callUpdateBatchAPI(url, ownerId, piilList)
        .then((res: any) => { oniilListChange([]); return res;})
        .catch((error) => alert(error));
        */
  }

  const setIilListOrder = (iilList: IilDto[]): IilDto[] => {
    return iilList.reverse();
  }

  const getChildIndices = (iilList: IilDto[]): string[] => {
    let indiceSet = new Set<string>();
    iilList.forEach((element) => {
      if (Array.isArray(element.act)) {
        element.act.forEach((subElement) => {
          indiceSet.add(subElement);
        });
      }
    });
    return Array.from(indiceSet);
  };

  const getIilsNotIncluded = (iilList: IilDto[], indices: string[]) => {
    return iilList.filter((iilDto: IilDto) => !indices.includes(iilDto.id!));
  };

  const updatePageContext = (givenContext: PageContext, name?: string) => {
    if (givenContext === PageContext.Organizing && name) {
      onIilListChange(iilListOriginal.filter((t) => contextMapping[givenContext].includes(t.status!) && t.name === name));
    }
    else if (givenContext === PageContext.Focusing) {
      onIilListChange(iilListOriginal.filter((t) => contextMapping[givenContext].includes(t.status!)));
    }
    else {
      onIilListChange(iilListOriginal.filter((t) => contextMapping[givenContext].includes(t.status!)));
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
    const nextState = update(iilList, pendingUpdateFn);
    onIilListChange(nextState);

    pendingUpdateFn = undefined;
    requestedFrame = undefined;
  }

  const moveCard = (id: string, afterId: string): void => {
    const cardIndex = iilList.findIndex((t: IilDto) => t.id === id);
    const afterIndex = iilList.findIndex((t: IilDto) => t.id === afterId);
    const card = iilList[cardIndex];

    scheduleUpdate({
      $splice: [
        [cardIndex, 1],
        [afterIndex, 0, card],
      ],
    })
  }

  const updateOrderOfList = async () => {
    const partials = iilList.map((t: IilDto, i: number) => {return {id: t.id, order: i}});
    // TODO: hold the page until the update being settled
    //return callUpdateBatchAPI(url, ownerId, partials);
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
      <div className="menu">{pageContext === PageContext.Focusing 
        && <button onClick={() => removeAllFocused(iilList.filter((t: IilDto) => t.status === IilDtoStatusEnum.FOCUSED).map((t: IilDto) => {t.status = IilDtoStatusEnum.ACTIVE; return t;}))}>Remove all</button>}
      </div>
      <div className="item_container">
        <DndProvider backend={HTML5Backend}>
          <ConfirmProvider>
            <br />
            {pageContext === PageContext.Incoming ?
              <IilItemCreator iilList={iilList} onIilListChange={onIilListChange} pageContext={pageContext} createCall={createCall} deleteCall={deleteCall}
              ownerId={ownerId} givenIil={newIil}/> : <></>
            }
            {getIilsNotIncluded(
              iilList,
              getChildIndices(iilList)
            ).map((iil: IilDto, i: number) =>
            iil.act!.length ?
              <IilItemUpdator key={iil.id} givenIil={iil} 
                                onIilListElemChange={onIilListElemChange}
                                iilList={iilList}
                                onIilListChange={onIilListChange}
                                pageContext={pageContext}
                                updatePageContext={updatePageContext}
                                createCall={createCall}
                                updateCall={updateCall}
                                deleteCall={deleteCall}
                                moveCard={moveCard}
                                updateOrderOfList={updateOrderOfList}
                                />
              :
              <IilItemCreator key={iil.id} iilList={iilList} onIilListChange={onIilListChange} pageContext={pageContext} createCall={createCall} deleteCall={deleteCall}
              ownerId={ownerId} givenIil={iil}/>
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
