import { AxiosRequestConfig, AxiosResponse } from "axios";
import React from "react";
import { Modal } from "react-bootstrap";
import { IilControllerApi, IilDto } from "../../../ill-repo-client";
import { DahmmDto } from "../../../ill-repo-client/models/dahmm-dto";
import { IilUpdator } from "../iil/updator/iilUpdator";

export interface IilDetailModalProp {
  show: boolean;
  onHide: () => void;
  iilItem: IilDto;
  onIilItemChange: Function;
  iilList: IilDto[];
  nextFlows: DahmmDto[];
  ownerId: string;
  onSubmit: (iil: IilDto) => Promise<AxiosResponse<IilDto> | undefined>;
  onDelete: (id: string) => Promise<AxiosResponse<void> | undefined>;
  onReset: (goalId?: string) => void;
  createDahmmCall: (body: DahmmDto, options?: AxiosRequestConfig) => Promise<AxiosResponse<DahmmDto>>;
  updateDahmmCall: (body: DahmmDto, id: string, options?: AxiosRequestConfig) => Promise<AxiosResponse<DahmmDto>>;
  deleteDahmmCall: (id: string, options?: AxiosRequestConfig) => Promise<AxiosResponse<void>>;
}

export const IilDetailModal = ({
  show,
  onHide,
  iilList,
  nextFlows,
  ownerId,
  iilItem,
  onIilItemChange,
  onSubmit,
  onDelete,
  onReset,
  createDahmmCall,
  updateDahmmCall,
  deleteDahmmCall,
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
            <IilUpdator iilList={iilList}
              nextFlows={nextFlows}
              selectedIil={ iilItem}
              onIilItemChange={onIilItemChange}
              ownerId={ownerId}
              onSubmit={onSubmit}
              onDelete={onDelete}
              onReset={onReset}
              onDahmmCreate={createDahmmCall}
              onDahmmUpdate={updateDahmmCall}
              onDahmmDelete={deleteDahmmCall}
              />
        </Modal.Body>
      </Modal>
    );
  }