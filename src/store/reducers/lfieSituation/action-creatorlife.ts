// action-creatorlife.ts
import { LifeSituationActionEnum, SetErrorAction, SetLifeSituationAction, SetUpdateAction } from "./types";
import { ILifeSituation } from "../../../models/ILifeSituation";
import { IErr } from "../../../models/IErr";

export const LifeSituationActionCreators = {
  setLifeSituation: (lifeSituation: ILifeSituation[]): SetLifeSituationAction => ({
    type: LifeSituationActionEnum.SET_LIFESITUATION,
    payload: lifeSituation,
  }),
  setErr: (payload: IErr): SetErrorAction => ({ type: LifeSituationActionEnum.SET_ERROR, payload }),
  setUpdate: (payload: boolean): SetUpdateAction => ({ type: LifeSituationActionEnum.SET_UPDATE, payload }),
};
