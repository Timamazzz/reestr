import BaseModelAPI from "../BaseModelAPI";
import apiConfig from "../apiConfig";
import axiosClient from "../axiosClient";
import { API_LIFESITUATION_MODEL } from "./const";

class LifesituationsApiRequest extends BaseModelAPI {
    constructor() {
        super(API_LIFESITUATION_MODEL.url);
    }

    async generateIdentifier<T>(urlParams?: string) {
        return this.makeRequest<T>(axiosClient.get, {method: API_LIFESITUATION_MODEL.methods.generateIdentifier.url, urlParams: urlParams? urlParams : ''});
    }
}

export default LifesituationsApiRequest;
