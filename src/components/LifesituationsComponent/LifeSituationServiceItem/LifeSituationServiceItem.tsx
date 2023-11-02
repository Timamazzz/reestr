import React, { FC, useEffect, useState } from "react";
import { ILifeSituationServices } from "../../../models/ILifeSituation";
import Buttons from "../../Buttons/Buttons";
import icons from "../../../assets/icons/icons";
import "../styles.scss";
import LifeSituationProcessItem from "../LifeSituationProcessItem/LifeSituationProcessItem";
import Modal from "../../Modal/Modal";
import { DataPressActionCreators } from "../../../store/reducers/dataPressItem/action-creator";
import { fieldToArray } from "../../UI/functions/functions";
import FormInput from "../../FormInput/FormInput";
import { useTypeSelector } from "../../../hooks/useTypedSelector";
import LifesituationsApiRequest from "../../../api/Lifesituation/Lifesituation";
import { useDispatch } from "react-redux";
import ServicesApiRequest from "../../../api/Services/Services";
import { LifeSituationActionCreators } from "../../../store/reducers/lfieSituation/action-creatorlife";
import ErrorMessage from "../../UI/ErrorMassage/ErrorMassage";

interface LifeSituationServiceItemProps {
  services: ILifeSituationServices | undefined;
  servicesOption: any;
  lifeSitaitonsId: string | undefined;
  lifeSituationActive?: any;
}

const LifeSituationServiceItem: FC<LifeSituationServiceItemProps> = ({
  services,
  servicesOption,
  lifeSitaitonsId,
  lifeSituationActive,
}) => {
  const lifeSituationServicesApi = new ServicesApiRequest();
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const { isUpdate, error } = useTypeSelector(
    (state) => state.lifeSituationReducer
  );
  const [currentLifeSituationId, setCurrentLifeSituationId] = useState<
    string | null
  >(null);
  const lifeSituationApi = new LifesituationsApiRequest();
  const { dataPress } = useTypeSelector((state) => state.dataPressReducer);
  const dispatch = useDispatch();

  const [servicesOptionCreate, setServicesOptionCreate] = useState<any>();
  const [updateData, setUpdateData] = useState<boolean>(false);

  const handleChangeInput = (field: string, value: string | boolean) => {
    dispatch(DataPressActionCreators.setDataPress(field, value));
  };

  const addLifeSituation = (type?: string, id?: string) => {
    type === "update"
      ? lifeSituationServicesApi.getById({ id: id + "/" }).then((resp) => {
          console.log("aaaaaaaaaaa", resp);
          if (resp.success) {
            lifeSituationServicesApi.options().then((resp) => {
              if (resp.success) {
                //@ts-ignore
                setServicesOptionCreate(resp?.data?.actions?.create);
              }
            });
            setUpdateData(true);
            //@ts-ignore
            const dataServices = fieldToArray(resp.data ? resp.data : "");
            setIsVisibleModal(true);
            dataServices.map((item) => {
              dispatch(
                DataPressActionCreators.setDataPress(item.key, item.value)
              );
            });
          }
        })
      : lifeSituationServicesApi
          .generateIdentifier(`?life_situation_id=${lifeSitaitonsId}`)
          .then((ident) => {
            if (ident.success) {
              dispatch(
                DataPressActionCreators.setDataPress(
                  "lifesituation",
                  lifeSitaitonsId ? lifeSitaitonsId : ""
                )
              );
              lifeSituationServicesApi.options().then((resp) => {
                if (resp.success) {
                  //@ts-ignore
                  setServicesOptionCreate(resp?.data?.actions?.create);
                  setIsVisibleModal(true);
                }
              });

              dispatch(
                DataPressActionCreators.setDataPress(
                  "identifier",
                  //@ts-ignore
                  ident?.data?.identifier || ""
                )
              );
            }
          });
  };

  const addLifeSituationServices = (type?: string) => {
    type === "update"
      ? lifeSituationServicesApi
          .update({
            urlParams: dataPress?.id ? dataPress?.id + "/" : "",
            body: dataPress,
          })
          .then((resp) => {
            if (resp.success) {
              setIsVisibleModal(false);
              dispatch(DataPressActionCreators.clearDataPress());
              dispatch(LifeSituationActionCreators.setUpdate(!isUpdate));
            } else {
              dispatch(
                LifeSituationActionCreators.setErr({
                  type: "error",
                  message: "Произошла ошибка при обработке данных",
                })
              );
            }
            setUpdateData(false);
          })
      : lifeSituationServicesApi.create({ body: dataPress }).then((resp) => {
          if (resp.success) {
            setIsVisibleModal(false);
            dispatch(DataPressActionCreators.clearDataPress());
            dispatch(LifeSituationActionCreators.setUpdate(!isUpdate));
          } else {
            dispatch(
              LifeSituationActionCreators.setErr({
                type: "error",
                message: "Произошла ошибка при обработке данных",
              })
            );
          }
        });
  };

  const [selectedCards, setSelectedCards] = useState<string[]>([]);

  const toggleCardSelection = (id: string) => {
    if (selectedCards.includes(id)) {
      setSelectedCards(selectedCards.filter((cardId) => cardId !== id));
    } else {
      setSelectedCards([...selectedCards, id]);
    }
    dispatch(DataPressActionCreators.setDataPress("service", id ? id : ""));
  };

  const closeModal = (type?: string) => {
    setIsVisibleModal(false);

    dispatch(DataPressActionCreators.clearDataPress());
  };

  const servOptionData = fieldToArray(servicesOptionCreate);

  return (
    <>
      {error.message && (
        <ErrorMessage
          type={error?.type}
          message={error?.message}
          onClick={() => {}}
          onClose={() => {
            dispatch(
              LifeSituationActionCreators.setErr({ type: "", message: "" })
            );
          }}
        />
      )}
      {isVisibleModal && (
        <Modal
          content={
            <div className="modalContainerGrid">
              <h1>Добавить услугу/функцию/сервис</h1>
              {servOptionData != null &&
                servOptionData.map((item: any) => {
                  if (
                    item.key === "id" ||
                    item.key === "processes" ||
                    item.key === "service_type_selected" ||
                    item.key === "lifesituation"
                  ) {
                    return null;
                  }

                  return (
                    <div key={item.key}>
                      <FormInput
                        key={item.key}
                        style={""}
                        value={
                          //@ts-ignore
                          dataPress && dataPress[item.key]
                        }
                        options={item.value.choices}
                        disabled={item.key === "identifier" ? true : undefined}
                        onChange={(e) => {
                          handleChangeInput(item.key, e);
                        }}
                        subInput={item.value.label}
                        error={""}
                        keyData={item.key}
                        required={item.value.required}
                        type={item.value.type}
                      />
                    </div>
                  );
                })}
              <div className="modalButtonContainer">
                <Buttons
                  className="buttonModal_white"
                  text={"Отмена"}
                  onClick={() => {
                    closeModal();
                  }}
                />
                <Buttons
                  className="buttonModal"
                  text={"Добавить"}
                  onClick={() => {
                    addLifeSituationServices(updateData ? "update" : "");
                  }}
                />
              </div>
            </div>
          }
          onClose={() => {
            closeModal();
          }}
        />
      )}
      <div
        className={`lifeSituationServiceContainer ${
          lifeSituationActive && "flexGrid"
        }`}
      >
        {/*@ts-ignore*/}
        {services?.map((service) => (
          <div className="containerServiceProcesses">
            <div key={service?.id} className="cardLifeSituationServices">
              <div
                className="cardHeader"
                onClick={(e) => {
                  service?.id && toggleCardSelection(service?.id);
                }}
              >
                <div className="cardHeaderTitleType">
                  <h3 className="cardHeaderSubtitle">
                    {service?.service_type_selected || ""}
                  </h3>
                </div>
                <h1>{service?.name}</h1>
              </div>
              <div className="cardFooter">
                <div className="footerRight">
                  <p className="cardFooterNumber">
                    {service?.regulating_act || ""}
                  </p>
                  <p className="cardFooterNumber">
                    {service?.identifier || ""}
                  </p>
                </div>
                <Buttons
                  className="whiteIco"
                  ico={icons.edit}
                  text={""}
                  onClick={() => {
                    addLifeSituation("update", service?.id);
                  }}
                />
              </div>
            </div>
            {selectedCards.includes(service.id ? service.id : "") && (
              <LifeSituationProcessItem
                processes={service.processes}
                servicesId={service?.id}
                processesOption={
                  servicesOption?.services?.child?.children?.processes
                }
              />
            )}
          </div>
        ))}
        {!lifeSituationActive && (
          <Buttons
            ico={icons.plusCircle}
            text={"Добавить услугу/функцию/сервис"}
            className="whiteButtonAdd"
            onClick={() => {
              addLifeSituation();
            }}
          />
        )}
      </div>
    </>
  );
};

export default LifeSituationServiceItem;
