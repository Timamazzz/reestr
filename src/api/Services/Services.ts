import BaseModelAPI from "../BaseModelAPI";
import apiConfig from "../apiConfig";
import axiosClient from "../axiosClient";
import { API_SERVICES_MODEL } from "./const";

class ServicesApiRequest extends BaseModelAPI {
    constructor() {
        super(API_SERVICES_MODEL.url);
    }

    async generateIdentifier<T>(urlParams?: string) {
        return this.makeRequest<T>(axiosClient.get, {method: API_SERVICES_MODEL.methods.generateIdentifier.url, urlParams: urlParams? urlParams : ''});
    }
}

export default ServicesApiRequest;
