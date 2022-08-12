import React from "react";
import { Modal } from "react-bootstrap";
import { IilControllerApi, IilDto } from "../../../ill-repo-client";
import { getRandomEmoji } from "../../../util/emojiGenerator";
import { getBrandNewIil } from "../../model/iilManager";
import { IilDetailView } from "./iilDetailView";

export interface IilDetailModalProp {
    show: boolean;
    onHide: () => void;
    iilItem: IilDto;
    onIilItemChange: Function;
    iils: IilDto[];
    ownerId: string;
    apiHandler: IilControllerApi;
    
}

export const IilDetailModal = ({
    show,
    onHide,
    iils,
    ownerId,
    apiHandler,
    iilItem,
    onIilItemChange,
}: IilDetailModalProp ) => {
    return (
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
            <IilDetailView iils={iils}
              iilItem={ iilItem}
              onIilItemChange={onIilItemChange}
              ownerId={ownerId}
              createCall={(iil:IilDto) => apiHandler.createIil(iil)}
              updateCall={(partialIilDto : IilDto, id: string) => apiHandler.updateIil(partialIilDto, id)}
              deleteCall={(id: string) => apiHandler.deleteIil(id)} />
        </Modal.Body>
      </Modal>
    );
  }