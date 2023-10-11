import React, { MouseEventHandler } from "react";
import { PageContext } from "../../type/pageContext";
import { IilDto, IilDtoStateEnum } from "../../ill-repo-client";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { IilItemUpdator } from "./iilList/iilItemUpdator";

export interface IIilListViewProp {
  iilList: IilDto[];
  ownerId: string;
  pageContext: PageContext;
  onIilListChange: Function;
  onIilListElemChange: Function;
  updateIilCall: (body: IilDto, id: string, options?: AxiosRequestConfig) => Promise<AxiosResponse<IilDto>>;
  deleteIilCall: (id: string, options?: AxiosRequestConfig) => Promise<AxiosResponse<void>>;
  onModalShow: MouseEventHandler<HTMLButtonElement>;
  children: any;
  onLogOut?: MouseEventHandler<HTMLButtonElement>;
}

export const IilListView = ({
  iilList,
  ownerId,
  pageContext,
  onIilListChange,
  onIilListElemChange,
  updateIilCall,
  deleteIilCall,
  onModalShow,
  onLogOut,
}: IIilListViewProp) => {
  /*
  const removeAllFocused = async (piilList: IilDto[]) => {
    
    return await callUpdateBatchAPI(url, ownerId, piilList)
        .then((res: any) => { oniilListChange([]); return res;})
        .catch((error) => alert(error));
        
  }
  */

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

  return (
    <>
      {(pageContext === PageContext.List || pageContext === PageContext.FocusedList) &&
        iilList.map((iil: IilDto, index) => 
        pageContext === PageContext.List ||
        (pageContext === PageContext.FocusedList &&
        iil.state === IilDtoStateEnum.ACTIVATED) ?
          <IilItemUpdator key={index} iilItem={iil} 
            onIilListElemChange={onIilListElemChange}
            iilList={iilList}
            onIilListChange={onIilListChange}
            pageContext={pageContext}
            updateCall={updateIilCall}
            deleteCall={deleteIilCall}
            onModalShow={onModalShow}
          /> :
          <div key={index}></div>
        )
      }
    </>
  );
};
