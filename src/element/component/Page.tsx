import React, { MouseEventHandler, useEffect } from "react";
import { useState } from "react";
import { Container } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ConfirmProvider } from "../../hooksComponent/ConfirmContext";
import { IilControllerApi, IilDto } from "../../ill-repo-client";
import { PageContext } from "../../type/pageContext";
import { getRandomEmoji } from "../../util/emojiGenerator";
import { IilDetailView } from "./iilDetailView";
import { IilListView } from "./iilListView";
import { getBrandNewIil } from "../model/iilManager";
import { PageHeader } from "./PageHeader";

const defaultPageContext = PageContext.Graph;
export interface IPageProp {
    ownerId: string;
    onLogOut?: MouseEventHandler<HTMLButtonElement>;
}

export const Page = ({
  ownerId,
  onLogOut,
}: IPageProp) => {
    const [pageContext, setPageContext] = useState<PageContext>(defaultPageContext);
    const [iils, setIils] = useState<IilDto[]>([]);
    const apiHandler = new IilControllerApi();

    useEffect(() => {
        apiHandler.getIils().then((response) => response.data)
        .then((iilsFromBackend: IilDto[]) => {
            setIils(iilsFromBackend);
        })
    }, []);
    return (
        <div className="row" id="background">
            <PageHeader setPageContext={setPageContext} />
            <div className="item_container">
                <DndProvider backend={HTML5Backend}>
                    <ConfirmProvider>
                        <IilDetailView iils={iils} selectedIil={getBrandNewIil(getRandomEmoji(), ownerId, "", ownerId, "new")} ownerId={ownerId}
                            createCall={(iil:IilDto) => apiHandler.createIil(iil)}
                            updateCall={(partialIilDto : IilDto, id: string) => apiHandler.updateIil(partialIilDto, id)}
                            deleteCall={(id: string) => apiHandler.deleteIil(id)} />
                        <IilListView 
                            getAllCall={() => apiHandler.getIils()}
                            createCall={(iil:IilDto) => apiHandler.createIil(iil)}
                            updateCall={(partialIilDto : IilDto, id: string) => apiHandler.updateIil(partialIilDto, id)}
                            deleteCall={(id: string) => apiHandler.deleteIil(id)}
                            ownerId={ownerId} pageContext={pageContext} />
                    </ConfirmProvider>
                </DndProvider>
            </div>
        </div>
    );
}