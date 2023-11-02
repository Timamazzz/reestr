import BaseModelAPI from "../BaseModelAPI";
import apiConfig from "../apiConfig";
import axiosClient from "../axiosClient";
import { API_PROCESSES_MODEL } from "./const";

class ProcessesApiRequest extends BaseModelAPI {
    constructor() {
        super(API_PROCESSES_MODEL.url);
    }

    async generateIdentifier<T>(urlParams?: string) {
        return this.makeRequest<T>(axiosClient.get, {method: API_PROCESSES_MODEL.methods.generateIdentifier.url, urlParams: urlParams});
    }
}

export default ProcessesApiRequest;
