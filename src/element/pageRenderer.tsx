import React, { MouseEventHandler, useEffect, useState } from "react";
import { ConfirmProvider } from "../hooksComponent/ConfirmContext";
import { getBrandNewName, getBrandNewIil } from "./model/iilManager";
import { IilItemUpdator } from "./iilItemUpdator";
import { PageContext } from "../type/pageContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { IilDto } from "../models";
import { IilControllerApi } from "../api/iil-controller-api";
import { AxiosResponse } from "axios";
import UseIilList from "../hooksComponent/useIilList";
import { IilItemCreator } from "./iilItemCreator";
import { Button, ButtonGroup, Col, Container, Row } from "react-bootstrap";
import { isStatusFitToContext } from "./util/illFilterByContext";

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

  const [serviceStatus, setServiceStatus] = useState(0);
  const [pageContext, setPageContext] = useState<PageContext>(givenPageContext);
  const { iilList, onIilListChange, onIilListElemChange } = UseIilList([]);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ isLoaded, setIsLoaded ] = useState(false);

  const [newIil, setNewIil] = useState<IilDto>(getBrandNewIil(getBrandNewName(), ownerId, "", ownerId, "new"));
  const apiHandler = new IilControllerApi();

  useEffect(() => {
    let mounted = true;
    getCall().then((response) => response.data)
      .then((iils: IilDto[]) => {
        console.log(iils);
        if (mounted){
          onIilListChange(iils);
          setServiceStatus(1);
        }
      })
      .catch((err) => setServiceStatus(-1));

      return () => {mounted = false;}
  }, [serviceStatus, url, ownerId]);

  const getCall = (): Promise<AxiosResponse<IilDto[]>> => {
    return apiHandler.getIils();
  }

  const createCall = (iil : IilDto): Promise<any> => {
    return apiHandler.createIil(iil);
  }
  
  const updateCall = (partialIilDto : IilDto, id: string): Promise<any> => {
    return apiHandler.updateIil(partialIilDto, id);
  }

  const deleteCall = (id: string): Promise<any> => {
    return apiHandler.deleteIil(id);
  }

  const removeAllFocused = async (piilList: IilDto[]) => {
    /*
    return await callUpdateBatchAPI(url, ownerId, piilList)
        .then((res: any) => { oniilListChange([]); return res;})
        .catch((error) => alert(error));
        */
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
    return iilList.filter((iil: IilDto) => !indices.includes(iil.id!));
  };

  

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

  const provideIilCreator = () => {
    return <IilItemCreator iilList={iilList} onIilListChange={onIilListChange} pageContext={pageContext} createCall={createCall}
              ownerId={ownerId} givenIil={newIil}/>;
  }

  const provideIilEditor = (givenContext: PageContext, iil: IilDto, iilList: IilDto[]) => 
    <IilItemUpdator key={iil.id} givenIil={iil} 
    onIilListElemChange={onIilListElemChange}
    iilList={iilList}
    onIilListChange={onIilListChange}
    pageContext={givenContext}
    createCall={createCall}
    updateCall={updateCall}
    deleteCall={deleteCall}
    moveCard={() => console.log("moveCard")}
    updateOrderOfList={updateOrderOfList}
    />
  
    //<button className="input-block-level" onClick={onLogOut}>logOut</button>
  const getPageHeader = (givenContext: PageContext) => 
    <Row className="mx-0 p-2" id="pageHeader">
      <Col>
        <ButtonGroup className="d-flex">
          <Button variant="primary"
            onClick={() => {setPageContext(PageContext.Incoming); document.getElementById("background")?.classList.replace("bg_focus", "bg_normal");}}>
              Incoming
          </Button>
          <Button variant="secondary" className="mx-2"
            onClick={() => {setPageContext(PageContext.Focusing); document.getElementById("background")?.classList.replace("bg_normal", "bg_focus");}}>
              Focusing
          </Button>
          <Button variant="success"
            onClick={() => {setPageContext(PageContext.Admin); document.getElementById("background")?.classList.replace("bg_focus", "bg_normal");}}>
              Admin
          </Button>
        </ButtonGroup>
      </Col>
    </Row>

  const updateOrderOfList = async () => {
    const partials = iilList.map((t: IilDto, i: number) => {return {id: t.id, order: i}});
    // TODO: hold the page until the update being settled
    //return callUpdateBatchAPI(url, ownerId, partials);
  }
  
  return serviceStatus > 0 ? (
    <div className="row" id="background">
      {getPageHeader(pageContext)}
      <div className="menu">
        
      </div>
      <div className="item_container">
        <DndProvider backend={HTML5Backend}>
          <ConfirmProvider>
            <Container>
              {pageContext === PageContext.Incoming ? provideIilCreator() : <></>}
              {iilList.map((iil: IilDto) => isStatusFitToContext(pageContext, iil.status!) ?
                provideIilEditor(pageContext, iil, iilList) : <></>)}
            </Container>
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
