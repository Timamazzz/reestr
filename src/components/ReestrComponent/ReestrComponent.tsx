import React, { FC, useEffect, useState } from "react";
import Tabs from "../Tabs/Tabs";
import InputSearch from "../InputSearch/InputSearch";
import "./styles.scss";
import Buttons from "../Buttons/Buttons";
import LifesituationsComponent from "../LifesituationsComponent/LifesituationsComponent";
import LifesituationsApiRequest from "../../api/Lifesituation/Lifesituation";
import { useDispatch } from "react-redux";
import { LifeSituationActionCreators } from "../../store/reducers/lfieSituation/action-creatorlife";
import { ILifeSituation } from "../../models/ILifeSituation";
import { useTypeSelector } from "../../hooks/useTypedSelector";
import Modal from "../Modal/Modal";
import FormInput from "../FormInput/FormInput";
import { fieldToArray } from "../UI/functions/functions";
import { DataPressActionCreators } from "../../store/reducers/dataPressItem/action-creator";
import { IDataPress } from "../../models/IDataPress";
import LifeSituationServiceItem from "../LifesituationsComponent/LifeSituationServiceItem/LifeSituationServiceItem";
import ServicesApiRequest from "../../api/Services/Services";

const ReestrComponent: FC = () => {
  const lifeSituationApi = new LifesituationsApiRequest();
  const ServicesListApi = new ServicesApiRequest();
  const { lifeSituation, isUpdate } = useTypeSelector(
    (state) => state.lifeSituationReducer
  );
  const { dataPress } = useTypeSelector((state) => state.dataPressReducer);
  const dispatch = useDispatch();
  const [activeTabId, setActiveTabId] = useState<number>(1);
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const [identifier, setIdentifier] = useState<string>("");
  const [lifeSituationOption, setLifeSituationOption] = useState<any>(null);
  const [isUpdateData, setIsUpdateData] = useState<any>({});
  const [servicesData, setServicesData] = useState<any>();

  const tabsData = [
    {
      id: 1,
      text: "Жизненные ситуации",
      content: "",
    },
    // {
    //   id: 2,
    //   text: "Услуги",
    //   content: "",
    // },
  ];

  console.log(isUpdateData);

  useEffect(() => {
    lifeSituationApi.list().then((resp) => {
      if (resp.success) {
        // optionLifeSituation();
        dispatch(
          LifeSituationActionCreators.setLifeSituation(
            resp.data as ILifeSituation[]
          )
        );
      }
    });
  }, [isUpdate]);

  console.log("isUpdateData", isUpdateData);

  useEffect(() => {
    lifeSituationApi.options().then((resp) => {
      if (resp.success) {
        //@ts-ignore
        const options = fieldToArray(resp?.data?.actions);
        setLifeSituationOption(options);

        isUpdateData?.id &&
          lifeSituationApi
            .getById({ id: isUpdateData.id + "/" })
            .then((resp) => {
              if (resp.success) {
                console.log(resp.data);
                //@ts-ignore
                const dataLife = fieldToArray(resp.data ? resp.data : "");
                setIsVisibleModal(true);
                dataLife.map((item) => {
                  dispatch(
                    DataPressActionCreators.setDataPress(item.key, item.value)
                  );
                });
              }
            });
      }
    });

    if (isVisibleModal && Object.keys(isUpdateData).length === 0) {
      lifeSituationApi.generateIdentifier().then((ident) => {
        if (ident.success) {
          dispatch(
            DataPressActionCreators.setDataPress(
              "identifier",
              //@ts-ignore
              ident?.data?.identifier || ""
            )
          );
        }
      });
    }
  }, [isVisibleModal, isUpdateData]);

  const handleChangeInput = (field: string, value: string | boolean) => {
    dispatch(DataPressActionCreators.setDataPress(field, value));
  };

  const addLifeSituation = (type?: string) => {
    type === "update"
      ? lifeSituationApi
          .update({
            urlParams: isUpdateData.id ? isUpdateData.id + "/" : "",
            body: dataPress,
          })
          .then((resp) => {
            if (resp.success) {
              setIsVisibleModal(false);
              setIsUpdateData({});
              dispatch(LifeSituationActionCreators.setUpdate(!isUpdate));
            }
          })
      : lifeSituationApi.create({ body: dataPress }).then((resp) => {
          if (resp.success) {
            setIsVisibleModal(false);
            dispatch(LifeSituationActionCreators.setUpdate(!isUpdate));
          }
        });

    dispatch(DataPressActionCreators.clearDataPress());
  };

  return (
    <>
      {isVisibleModal && (
        <Modal
          content={
            <div>
              <h1>Добавить жизненную ситуацию</h1>
              {lifeSituationOption != null &&
                lifeSituationOption.map((item: any) => {
                  if (item.key === "create") {
                    const optionData = fieldToArray(item.value);
                    return (
                      <div key={item.key}>
                        {optionData.map((data) => (
                          <FormInput
                            key={data.key}
                            style={"formMini"}
                            value={
                              //@ts-ignore
                              dataPress[data.key]
                            }
                            disabled={
                              data.key === "identifier" ? true : undefined
                            }
                            onChange={(e) => {
                              handleChangeInput(data.key, e);
                            }}
                            options={data.value.choices}
                            subInput={data.value.label}
                            error={""}
                            keyData={data.key}
                            required={data.value.required}
                            type={data.value.type}
                          />
                        ))}
                      </div>
                    );
                  } else {
                    return null; // Можете добавить обработку других случаев, если необходимо
                  }
                })}
              <div className="modalButtonContainer">
                <Buttons
                  className="buttonModal_white"
                  text={"Отмена"}
                  onClick={() => {
                    setIsUpdateData({});
                    setIsVisibleModal(false);
                    dispatch(DataPressActionCreators.clearDataPress());
                  }}
                />
                <Buttons
                  className="buttonModal"
                  text={"Добавить"}
                  onClick={() => {
                    addLifeSituation(isUpdateData.id ? "update" : "");
                  }}
                />
              </div>
            </div>
          }
          onClose={() => {
            setIsUpdateData({});
            dispatch(DataPressActionCreators.clearDataPress());
            setIsVisibleModal(false);
          }}
        />
      )}

      <div className="reestrComponent">
        <div className="reestrNav">
          <Tabs tabsData={tabsData} activeTabId={setActiveTabId} />
          <InputSearch
            items={[]}
            searchData={(e) => {
              dispatch(
                LifeSituationActionCreators.setLifeSituation(
                  e as ILifeSituation[]
                )
              );
            }}
          />
          <Buttons
            text={
              activeTabId === 1
                ? "Добавить жизненную ситуацию"
                : "Добавить услугу"
            }
            className="whiteButton"
            onClick={() => {
              setIsVisibleModal(true);
            }}
          />
        </div>

        <LifesituationsComponent
          lifeSituation={lifeSituation}
          lifeSituationOption={lifeSituationOption}
          setUpdate={(update, id) => {
            setIsUpdateData({ update, id });
          }}
        />
      </div>
    </>
  );
};

export default ReestrComponent;
