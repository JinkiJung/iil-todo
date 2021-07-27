import Tasc from "../model/tasc.entity";
import { PageContext } from "../type/pageContext";
const axios = require('axios').default;

export const callCreateAPI = (url: string, ownerId: string, tasc: object): Promise<any> => {
    return axios({
      method: 'post',
      url: url + "/"+ ownerId,
      data: tasc,
      headers: { 'content-type': 'application/json'},
    });
  }
  
export const callUpdateAPI = (url: string, ownerId: string, tasc: Partial<Tasc>): Promise<any> => {
    return axios({
        method: 'patch',
        url: url + "/"+ ownerId,
        data: tasc,
        headers: { 'content-type': 'application/json'},
    });
}

export const callUpdateBatchAPI = (url: string, ownerId: string, tascs: Partial<Tasc>[]): Promise<any> => {
    return axios({
        method: 'patch',
        url: url + "s" + "/"+ ownerId,
        data: tascs,
        headers: { 'content-type': 'application/json'},
    });
}

export const callDeleteAPI = (url: string, ownerId: string, tascId: string): Promise<any> => {
    return axios({
        method: 'delete',
        url: url + "/"+ ownerId + "/" + tascId,
    });
}

export const callGetAPI = async (url: string, ownerId: string, pageContext: PageContext): Promise<any> => {
    return axios({
        method: 'get',
        url: `${url}s/${ownerId}/${PageContext[pageContext]}`,
        headers: { 'content-type': 'application/json'},
    });
}