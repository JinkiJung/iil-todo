import React, { MouseEventHandler, ReactElement, useEffect, useState } from "react";
import { getBrandNewIil } from "../model/iilManager";
import { PageContext } from "../../type/pageContext";
import UseIilList from "../../hooksComponent/useIilList";
import { IilItemCreator } from "./iilList/iilItemCreator";
import { isStatusFitToContext } from "../util/illFilterByContext";
import { IilDto } from "../../ill-repo-client";
import { getRandomEmoji } from "../../util/emojiGenerator";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { IilItemUpdator } from "./iilList/iilItemUpdator";
import { IilDetailModal } from "./iilDetail/iilDetailModal";

export interface IIilListViewProp {
  iils: IilDto[];
  ownerId: string;
  pageContext: PageContext;
  getAllCall: () => Promise<AxiosResponse<IilDto[]>>;
  createCall: (body: IilDto, options?: AxiosRequestConfig) => Promise<AxiosResponse<IilDto>>;
  updateCall: (body: IilDto, id: string, options?: AxiosRequestConfig) => Promise<AxiosResponse<IilDto>>;
  deleteCall: (id: string, options?: AxiosRequestConfig) => Promise<AxiosResponse<void>>;
  children: any;
  onLogOut?: MouseEventHandler<HTMLButtonElement>;
}

export const IilListView = ({
  iils,
  ownerId,
  pageContext,
  getAllCall,
  createCall,
  updateCall,
  deleteCall,
  onLogOut,
}: IIilListViewProp) => {
  const { iilList, onIilListChange, onIilListElemChange } = UseIilList(iils);

  const [newIil, setNewIil] = useState<IilDto>(getBrandNewIil(getRandomEmoji(), ownerId, "", ownerId, "new"));

  const removeAllFocused = async (piilList: IilDto[]) => {
    /*
    return await callUpdateBatchAPI(url, ownerId, piilList)
        .then((res: any) => { oniilListChange([]); return res;})
        .catch((error) => alert(error));
        */
  }

  /*
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
  */

  const provideIilItemCreator = () => {
    return <IilItemCreator iilList={iilList} onIilListChange={onIilListChange} pageContext={pageContext}
              createCall={createCall}
              ownerId={ownerId} givenIil={newIil}/>;
  }

  const provideIilItemUpdator = (key: string, givenContext: PageContext, iil: IilDto, iilList: IilDto[]) => 
    <IilItemUpdator key={key} givenIil={iil} 
    onIilListElemChange={onIilListElemChange}
    iilList={iilList}
    onIilListChange={onIilListChange}
    pageContext={givenContext}
    updateCall={updateCall}
    deleteCall={deleteCall}
    moveCard={() => console.log("moveCard")}
    />

  return (
    <>
      {/*pageContext === PageContext.List ? provideIilItemCreator() : <></>*/}
      {(pageContext === PageContext.List || pageContext === PageContext.FocusedList) &&
        iilList.map((iil: IilDto, index) => {
        return isStatusFitToContext(pageContext, iil.status!) ?
            <div key={pageContext + "_" + index + "_" + iil.id!}>
            {provideIilItemUpdator(pageContext + "_" + index + "_" + iil.id!, pageContext, iil, iilList)}</div> : <></>;
          })
      }
    </>
  );
};
