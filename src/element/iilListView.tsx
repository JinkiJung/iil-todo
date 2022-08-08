import React, { MouseEventHandler, useEffect, useState } from "react";
import { ConfirmProvider } from "../hooksComponent/ConfirmContext";
import { getBrandNewIil } from "./model/iilManager";
import { IilItemUpdator } from "./iilItemUpdator";
import { PageContext } from "../type/pageContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import UseIilList from "../hooksComponent/useIilList";
import { IilItemCreator } from "./iilItemCreator";
import { Button, ButtonGroup, Col, Container, Row } from "react-bootstrap";
import { isStatusFitToContext } from "./util/illFilterByContext";
import { IilControllerApi, IilDto } from "../ill-repo-client";
import { getRandomEmoji } from "../util/emojiGenerator";
import { IilDetailView } from "./iilDetailView";
import { PageHeader } from "./component/PageHeader";
import { AxiosRequestConfig, AxiosResponse } from "axios";

export interface IIilListViewProp {
  ownerId: string;
  pageContext: PageContext;
  getAllCall: () => Promise<AxiosResponse<IilDto[]>>;
  createCall: (body: IilDto, options?: AxiosRequestConfig) => Promise<AxiosResponse<IilDto>>;
  updateCall: (body: IilDto, id: string, options?: AxiosRequestConfig) => Promise<AxiosResponse<IilDto>>;
  deleteCall: (id: string, options?: AxiosRequestConfig) => Promise<AxiosResponse<void>>;
  onLogOut?: MouseEventHandler<HTMLButtonElement>;
}

export const IilListView = ({
  ownerId,
  pageContext,
  getAllCall,
  createCall,
  updateCall,
  deleteCall,
  onLogOut,
}: IIilListViewProp) => {
  const { iilList, onIilListChange, onIilListElemChange } = UseIilList([]);
  const [serviceStatus, setServiceStatus] = useState(0);

  const [newIil, setNewIil] = useState<IilDto>(getBrandNewIil(getRandomEmoji(), ownerId, "", ownerId, "new"));
  

  useEffect(() => {
    let mounted = true;

    getAllCall().then((response) => response.data)
      .then((iils: IilDto[]) => {
        console.log(iils);
        if (mounted){
          onIilListChange(iils);
          setServiceStatus(1);
        }
      })
      .catch((err) => setServiceStatus(-1));

      return () => {mounted = false;}
  }, [serviceStatus, ownerId]);  

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
    serviceStatus > 0 ? 
    <Container>
      {pageContext === PageContext.Admin ? provideIilItemCreator() : <></>}
      {(pageContext === PageContext.Admin || pageContext === PageContext.List) &&
        iilList.map((iil: IilDto) => {
        return isStatusFitToContext(pageContext, iil.status!) ?
        provideIilItemUpdator(pageContext + "_" + iil.id!, pageContext, iil, iilList) : <></>;})}
    </Container>
    : serviceStatus < 0 ? (
      <div>Something went wrong with server.</div>
    ) : (
      <div>Loading........</div>
    ));
};
