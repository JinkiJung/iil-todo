import { AxiosRequestConfig, AxiosResponse } from "axios";
import React from "react";
import { Modal } from "react-bootstrap";
import { IilControllerApi, IilDto, NextFlowDto } from "../../../ill-repo-client";
import { getRandomEmoji } from "../../../util/emojiGenerator";
import { getBrandNewIil } from "../../model/iilManager";
import { IilUpdator } from "../iil/updator/iilUpdator";

export interface IilDetailModalProp {
  show: boolean;
  onHide: () => void;
  iilItem: IilDto;
  onIilItemChange: Function;
  iils: IilDto[];
  nextFlows: NextFlowDto[];
  ownerId: string;
  onSubmit: (iil: IilDto) => Promise<AxiosResponse<IilDto> | undefined>;
  onDelete: (id: string) => Promise<AxiosResponse<void> | undefined>;
  onReset: (goalId?: string) => void;
  createNextFlowCall: (body: NextFlowDto, options?: AxiosRequestConfig) => Promise<AxiosResponse<NextFlowDto>>;
  updateNextFlowCall: (body: NextFlowDto, id: string, options?: AxiosRequestConfig) => Promise<AxiosResponse<NextFlowDto>>;
  deleteNextFlowCall: (id: string, options?: AxiosRequestConfig) => Promise<AxiosResponse<void>>;
}

export const IilDetailModal = ({
  show,
  onHide,
  iils,
  nextFlows,
  ownerId,
  iilItem,
  onIilItemChange,
  onSubmit,
  onDelete,
  onReset,
  createNextFlowCall,
  updateNextFlowCall,
  deleteNextFlowCall,
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
            <IilUpdator iils={iils}
              nextFlows={nextFlows}
              selectedIil={ iilItem}
              onIilItemChange={onIilItemChange}
              ownerId={ownerId}
              onSubmit={onSubmit}
              onDelete={onDelete}
              onReset={onReset}
              onNextFlowCreate={createNextFlowCall}
              onNextFlowUpdate={updateNextFlowCall}
              onNextFlowDelete={deleteNextFlowCall}
              />
        </Modal.Body>
      </Modal>
    );
  }