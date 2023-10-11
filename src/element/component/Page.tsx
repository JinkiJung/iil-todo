import React, { MouseEventHandler, useEffect } from "react";
import { useState } from "react";
import { Button, ButtonGroup, Container } from "react-bootstrap";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ConfirmProvider } from "../../hooksComponent/ConfirmContext";
import { IilControllerApi, IilDto, } from "../../ill-repo-client";
import { PageContext } from "../../type/pageContext";
import { IilListView } from "./iilListView";
import { getBrandNewIil } from "../model/iilManager";
import { PageHeader } from "./PageHeader";
import { IilDetailModal } from "./iilDetail/iilDetailModal";
import UseIil from "../../hooksComponent/useIil";
import { validateIil } from "../util/iilValidator";
import UseIilList from "../../hooksComponent/useIilList";

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
    const [modalShow, setModalShow] = useState(false);
    const iilApiHandler = new IilControllerApi();
    const { iilList, onIilListChange, onIilListElemChange } = UseIilList([]);
    const { iilItem, setIilItem, onIilItemUpdate } = UseIil(getBrandNewIil(ownerId, "", ownerId, "new"));

    const onSubmit = async (iilItem: IilDto) => {
        if (validateIil(iilItem)){
            if (iilItem.id === 'new') {
                const res = await iilApiHandler.createIil({ ...iilItem, id: undefined });
                if (res.status === 200) {
                    //onIilListElemChange(res.data as IilDto);
                    onIilListChange([...iilList, res.data as IilDto]);
                    setModalShow(false);
                }
                return res;
            } else {
                return await iilApiHandler.updateIil(iilItem, iilItem.id!).then(
                    res => {
                        if (res.status === 200) {
                            onIilListElemChange(res.data as IilDto);
                            setModalShow(false);
                        }
                        return res;
                    }
                );
            }
        }
    }

    const onDelete = async (id: string) => {
        return await iilApiHandler.deleteIil(id);
    }

    const onResetIilItem = (goalId?: string) => {
        setIilItem(getBrandNewIil(ownerId, "", ownerId, "new", goalId!));
    }

    useEffect(() => {
        iilApiHandler.getIils().then((response) => response.data)
        .then((iilsFromBackend: IilDto[]) => {
            onIilListChange(iilsFromBackend);
            setServiceStatus(1);
        })
        .catch((err) => setServiceStatus(-1));
    }, [serviceStatus, pageContext, ownerId]);
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
                                            setIilItem(getBrandNewIil(ownerId, "", ownerId, "new"));
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
                                        iilList={iilList}
                                        ownerId={ownerId}
                                        onSubmit={onSubmit}
                                        onDelete={onDelete}
                                        onReset={onResetIilItem}
                                    />
                                    <hr className="dashed"></hr>
                                </div>
                                <IilListView 
                                    iilList={iilList}
                                    onIilListChange={onIilListChange}
                                    onIilListElemChange={onIilListElemChange}
                                    updateIilCall={(partialIilDto: IilDto, id: string) => iilApiHandler.updateIil(partialIilDto, id)}
                                    deleteIilCall={(id: string) => iilApiHandler.deleteIil(id)}
                                    ownerId={ownerId} pageContext={pageContext}
                                    onModalShow={(e) => {
                                        const selected = iilList.filter(i => i.id === e.currentTarget.id).pop();
                                        if (selected) {
                                            setIilItem(selected)
                                            setModalShow(true);
                                        }
                                        }}>
                                    <IilDetailModal
                                        show={modalShow}
                                        onHide={() => setModalShow(false)}
                                        iilList={iilList}
                                        iilItem={iilItem}
                                        onIilItemChange={onIilItemUpdate}
                                        ownerId={ownerId}
                                        onSubmit={onSubmit}
                                        onDelete={onDelete}
                                        onReset={onResetIilItem}
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