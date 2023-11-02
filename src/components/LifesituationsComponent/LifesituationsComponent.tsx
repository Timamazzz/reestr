import React, { FC, useEffect, useState } from "react";
import { ILifeSituation } from "../../models/ILifeSituation";
import "./styles.scss";
import LifeSituationServiceItem from "./LifeSituationServiceItem/LifeSituationServiceItem";
import { useDispatch } from "react-redux";
import { DataPressActionCreators } from "../../store/reducers/dataPressItem/action-creator";
import Buttons from "../Buttons/Buttons";
import icons from "../../assets/icons/icons";

interface LifeSituationDataProps {
  lifeSituation: ILifeSituation[] | undefined;
  lifeSituationOption: any;
  setUpdate: (e: boolean, id: string) => void;
}

const LifesituationsComponent: FC<LifeSituationDataProps> = ({
  lifeSituation,
  lifeSituationOption,
  setUpdate,
}) => {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const dispatch = useDispatch();

  const toggleCardSelection = (id: string) => {
    if (selectedCards.includes(id)) {
      setSelectedCards(selectedCards.filter((cardId) => cardId !== id));
    } else {
      setSelectedCards([...selectedCards, id]);
    }
  };

  return (
    <div className="lifeCituationContainer">
      {lifeSituation?.map((item) => (
        <div
          key={item.id}
          className={`lifeContinaerItem ${
            item?.id && selectedCards.includes(item.id) ? "active" : ""
          }`}
        >
          <div className="cardLifeSituation">
            <div
              className="cardHeader"
              onClick={() => item?.id && toggleCardSelection(item.id)}
            >
              <h3 className="cardHeaderSubtitle">
                {item.subname || "Жизненная ситуация"}
              </h3>
              <h1 className="cardHeaderTitle">{item.name}</h1>
            </div>
            <div className="cardFooter">
              <p className="cardFooterNumber">{item.identifier || ""}</p>
              <Buttons
                className="whiteIco buttoPosition"
                ico={icons.edit}
                text={""}
                onClick={() => {
                  setUpdate(true, item.id || "");
                }}
              />
            </div>
          </div>
          {selectedCards.includes(item.id ? item.id : "") && (
            <LifeSituationServiceItem
              lifeSitaitonsId={item.id}
              services={item.services}
              servicesOption={
                lifeSituationOption?.find(
                  (option: { key: string }) => option.key === "list"
                )?.value
              }
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default LifesituationsComponent;
