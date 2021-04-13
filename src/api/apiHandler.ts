import Tasc, { TascState } from "../model/tasc.entity";
const axios = require('axios').default;

export const callCreateAPI = (url: string, ownerId: string, tasc: object): Promise<string> => {
    return axios({
      method: 'post',
      url: url + "/"+ ownerId,
      data: tasc,
      headers: { 'content-type': 'application/json'},
    });
  }
  
export const callUpdateAPI = (url: string, ownerId: string, tasc: Partial<Tasc>): Promise<string> => {
    return axios({
        method: 'patch',
        url: url + "/"+ ownerId,
        data: tasc,
        headers: { 'content-type': 'application/json'},
    }).then((res: any) => console.log(res));
}

export const callDeleteAPI = (url: string, ownerId: string, tascId: string): Promise<string> => {
    return axios({
        method: 'delete',
        url: url + "/"+ ownerId + "/" + tascId,
    }).then((res: any) => console.log(res));
}

export const callGetAPI = async (url: string, ownerId: string, state: TascState = TascState.Active): Promise<any> => {
    return axios({
        method: 'get',
        url: `${url}/${ownerId}/${TascState[state].toString().toLowerCase()}`,
        headers: { 'content-type': 'application/json'},
    });
}