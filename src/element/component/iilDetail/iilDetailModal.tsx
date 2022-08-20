import { AxiosResponse } from "axios";
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
    onSubmit: (iil: IilDto) => Promise<AxiosResponse<IilDto> | undefined>;
    onDelete: (id: string) => Promise<AxiosResponse<void> | undefined>;
}

export const IilDetailModal = ({
    show,
    onHide,
    iils,
    ownerId,
    iilItem,
    onIilItemChange,
    onSubmit,
    onDelete,
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
              onSubmit={onSubmit}
              onDelete={onDelete}
              />
        </Modal.Body>
      </Modal>
    );
  }