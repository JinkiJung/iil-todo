import React, { MouseEventHandler, useEffect } from "react";
import { useState } from "react";
import { Button, ButtonGroup, Container, Modal } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ConfirmProvider } from "../../hooksComponent/ConfirmContext";
import { IilControllerApi, IilDto } from "../../ill-repo-client";
import { PageContext } from "../../type/pageContext";
import { getRandomEmoji } from "../../util/emojiGenerator";
import { IilListView } from "./iilListView";
import { getBrandNewIil } from "../model/iilManager";
import { PageHeader } from "./PageHeader";
import { IilDetailModal } from "./iilDetail/iilDetailModal";
import UseIil from "../../hooksComponent/useIil";
import { validateIil } from "../util/iilValidator";

const defaultPageContext = PageContext.List;
export interface IPageProp {
    ownerId: string;
    onLogOut?: MouseEventHandler<HTMLButtonElement>;
}

export const Page = ({
  ownerId,
  onLogOut,
}: IPageProp) => {
    const [pageContext, setPageContext] = useState<PageContext>(defaultPageContext);
    const [serviceStatus, setServiceStatus] = useState(0);
    const [iils, setIils] = useState<IilDto[]>([]);
    const [modalShow, setModalShow] = useState(false);
    const apiHandler = new IilControllerApi();
    const [selectedIil, setSelectedIil] = useState<IilDto>();
    const { iilItem, setIilItem, onIilItemUpdate } = UseIil(getBrandNewIil(getRandomEmoji(),
    ownerId, "", ownerId, "new"));

    const onSubmit = async (iilItem: IilDto) => {
        if (validateIil(iilItem)){
            if (iilItem.id === 'new') {
                const res = await apiHandler.createIil({ ...iilItem, id: undefined });
                if (res.status === 200) {
                    setIils([...iils, res.data as IilDto]);
                    setModalShow(false);
                }
                return res;
            } else {
                return await apiHandler.updateIil(iilItem, iilItem.id!);
            }
        }
    }

    const onDelete = async (id: string) => {
        return await apiHandler.deleteIil(id);
    }

    useEffect(() => {
        apiHandler.getIils().then((response) => response.data)
        .then((iilsFromBackend: IilDto[]) => {
            setIils(iilsFromBackend);
            setServiceStatus(1);
        })
        .catch((err) => setServiceStatus(-1));
    }, [serviceStatus, selectedIil, pageContext, ownerId]);
    return (
        <div>
        {
            serviceStatus > 0 ? 
                <div className="row" id="background">
                <PageHeader setPageContext={setPageContext} />
                <div className="item_container">
                    <DndProvider backend={HTML5Backend}>
                        <ConfirmProvider>
                            <Container>
                                <div className="item">
                                    <ButtonGroup className="d-flex">
                                        <Button variant="primary" onClick={() => {
                                            setIilItem(getBrandNewIil(getRandomEmoji(),
                                                ownerId, "", ownerId, "new"));
                                            setModalShow(true);
                                            }}>
                                            Add new
                                        </Button>
                                    </ButtonGroup>
                                    
                                    <IilDetailModal
                                        show={modalShow}
                                        onHide={() => setModalShow(false)}
                                        iilItem={iilItem}
                                        onIilItemChange={onIilItemUpdate}
                                        iils={iils}
                                        ownerId={ownerId}
                                        onSubmit={onSubmit}
                                        onDelete={onDelete}
                                    />
                                    <hr className="dashed"></hr>
                                </div>
                                <IilListView 
                                    iils={iils}
                                    getAllCall={() => apiHandler.getIils()}
                                    createCall={(iil:IilDto) => apiHandler.createIil(iil)}
                                    updateCall={(partialIilDto : IilDto, id: string) => apiHandler.updateIil(partialIilDto, id)}
                                    deleteCall={(id: string) => apiHandler.deleteIil(id)}
                                    ownerId={ownerId} pageContext={pageContext}
                                    onModalShow={(e) => {
                                        const selected = iils.filter(i => i.id === e.currentTarget.id).pop();
                                        if (selected) {
                                            setIilItem(selected)
                                            setModalShow(true);
                                        }
                                        }}>
                                    <IilDetailModal
                                        show={modalShow}
                                        onHide={() => setModalShow(false)}
                                        iils={iils}
                                        iilItem={iilItem}
                                        onIilItemChange={onIilItemUpdate}
                                        ownerId={ownerId}
                                        onSubmit={onSubmit}
                                        onDelete={onDelete}
                                    />
                                </IilListView>
                            </Container>
                        </ConfirmProvider>
                    </DndProvider>
                </div>
            </div>
            : serviceStatus < 0 ? (
            <div>Something went wrong with server.</div>
            ) : (
            <div>Loading........</div>
            )
        }
        </div>
    );
}