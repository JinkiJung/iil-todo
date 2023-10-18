import { AxiosResponse } from "axios";
import React from "react";
import { Modal } from "react-bootstrap";
import { IilDto } from "../../../ill-repo-client";
import { IilForm } from "../iil/iilForm";

export interface IilDetailModalProp {
  show: boolean;
  onHide: () => void;
  iilItem: IilDto;
  goalIil: IilDto | undefined;
  onIilItemChange: Function;
  ownerId: string;
  onSubmit: (iil: IilDto) => Promise<AxiosResponse<IilDto> | undefined>;
  onDelete: (id: string) => Promise<AxiosResponse<void> | undefined>;
  onReset: (goalId?: string) => void;
}

export const IilDetailModal = ({
  show,
  onHide,
  ownerId,
  iilItem,
  goalIil,
  onIilItemChange,
  onSubmit,
  onDelete,
  onReset,
}: IilDetailModalProp ) => {

    return (
      <Modal
        show={show}
        onHide={onHide}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
            <IilForm
              selectedIil={ iilItem}
              goalIil={goalIil}
              onIilItemChange={onIilItemChange}
              ownerId={ownerId}
              onSubmit={onSubmit}
              onDelete={onDelete}
              onReset={onReset}
              />
        </Modal.Body>
      </Modal>
    );
  }