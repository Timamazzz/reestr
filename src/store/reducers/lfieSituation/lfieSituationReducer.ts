// lifeSituationReducer.ts
import { IErr } from "../../../models/IErr";
import { LifeSituationAction, LifeSituationActionEnum, LifeSituationState } from "./types";

const initState: LifeSituationState = {
  isLoading: false,
  isUpdate:false,
  error: {} as IErr,
  lifeSituation: undefined,
};

export default function lifeSituationReducer(
  state = initState,
  action: LifeSituationAction
): LifeSituationState {
  switch (action.type) {
    case LifeSituationActionEnum.SET_LIFESITUATION:
      return { ...state, lifeSituation: action.payload };
    case LifeSituationActionEnum.SET_ERROR:
      return {...state, error: action.payload}
    case LifeSituationActionEnum.SET_UPDATE:
      return {...state, isUpdate: action.payload}
    default:
      return state;
  }
}