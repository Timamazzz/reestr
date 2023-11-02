import React, { FC, useState } from "react";
import Buttons from "../../Buttons/Buttons";
import icons from "../../../assets/icons/icons";
import { ILifeSituationProcess } from "../../../models/ILifeSituation";
import "./styles.scss";
import { useTypeSelector } from "../../../hooks/useTypedSelector";
import { useDispatch } from "react-redux";
import { DataPressActionCreators } from "../../../store/reducers/dataPressItem/action-creator";
import Modal from "../../Modal/Modal";
import FormInput from "../../FormInput/FormInput";
import { LifeSituationActionCreators } from "../../../store/reducers/lfieSituation/action-creatorlife";
import { fieldToArray } from "../../UI/functions/functions";
import ProcessesApiRequest from "../../../api/Processes/Processes";
import Checkbox from "../../Checkbox/Checkbox";
import { updateDataKey } from "../../UI/functions/updateDataKey/updateDataKey";
import ErrorMessage from "../../UI/ErrorMassage/ErrorMassage";

interface LifeSituationProcessItemProps {
  processes: ILifeSituationProcess | undefined;
  processesOption: any;
  servicesId: string | undefined;
}

interface IProcesses {
  name: string | null;
  service: string | null;
  status: string | null;
  is_internal_client: boolean;
  is_external_client: boolean;
  responsible_authority: string | null;
  department: string | null;
  is_digital_format: boolean;
  is_non_digital_format: boolean;
  digital_format_link: string | null;
  identifier: string | null;
}

const LifeSituationProcessItem: FC<LifeSituationProcessItemProps> = ({
  processes,
  processesOption,
  servicesId,
}) => {
  const lifeSituationProcessesApi = new ProcessesApiRequest();
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const [isVisibleModalData, setIsVisibleModalData] = useState<boolean>(false);
  const [updateData, setIsUpdateData] = useState<boolean>(false);
  const { isUpdate, error } = useTypeSelector(
    (state) => state.lifeSituationReducer
  );
  const dispatch = useDispatch();
  const { dataPress } = useTypeSelector((state) => state.dataPressReducer);
  const [identifier, setIdentifier] = useState<string>("");

  const handleChangeInput = (
    field: string,
    value: string,
    isChecked: boolean | undefined
  ) => {
    dispatch(
      DataPressActionCreators.setDataPress(field, isChecked ? isChecked : value)
    );
  };
  const handleChangeInputData = (
    field: string,
    value: string,
    isChecked: boolean | undefined
  ) => {
    const updatedMainInformation = {
      //@ts-ignore
      ...dataPress?.process_data,
      [field]: value,
    };

    dispatch(
      DataPressActionCreators.setDataPress(
        "process_data",
        //@ts-ignore
        updatedMainInformation
      )
    );
  };

  const addLifeSituationProcess = (type?: string, typeData?: string) => {
    dispatch(DataPressActionCreators.setDataPress("identifier", identifier));
    type === "update"
      ? lifeSituationProcessesApi
          .update({
            urlParams: dataPress?.id ? dataPress?.id + "/" : "",
            body: dataPress,
          })
          .then((resp) => {
            if (resp.success) {
              closeModal(typeData);
              setIsUpdateData(false);
              dispatch(LifeSituationActionCreators.setUpdate(!isUpdate));
              dispatch(
                LifeSituationActionCreators.setErr({
                  type: "success",
                  message: "Данные успешно обновлены",
                })
              );
            } else {
              dispatch(
                LifeSituationActionCreators.setErr({
                  type: "error",
                  message: "Произошла ошибка при обработке данных",
                })
              );
            }
          })
      : lifeSituationProcessesApi.create({ body: dataPress }).then((resp) => {
          if (resp.success) {
            closeModal("create");
            dispatch(LifeSituationActionCreators.setUpdate(!isUpdate));
            dispatch(
              LifeSituationActionCreators.setErr({
                type: "success",
                message: "Данные успешно добавлены",
              })
            );
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

  const openModal = (type?: string, id?: string) => {
    type === "get"
      ? lifeSituationProcessesApi.getById({ id: id + "/" }).then((resp) => {
          if (resp.success) {
            const dataProcess = fieldToArray(resp.data ? resp?.data : "");
            setIsVisibleModal(true);
            setIsUpdateData(true);
            dataProcess.map((item) => {
              dispatch(
                DataPressActionCreators.setDataPress(item.key, item.value)
              );
            });
          } else {
            dispatch(
              LifeSituationActionCreators.setErr({
                type: "error",
                message: "Произошла ошибка при обработке данных",
              })
            );
          }
        })
      : lifeSituationProcessesApi
          .generateIdentifier(
            //@ts-ignore
            servicesId ? `?service_id=${servicesId}` : ""
          )
          .then((ident) => {
            if (ident.success) {
              dispatch(
                DataPressActionCreators.setDataPress(
                  "identifier",
                  //@ts-ignore
                  ident?.data?.identifier || ""
                )
              );
              dispatch(
                DataPressActionCreators.setDataPress(
                  "service",
                  servicesId || ""
                )
              );
              setIsVisibleModal(true);
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

  const processesOptionCreate = fieldToArray(processesOption?.child?.children);
  const processesOptionData = fieldToArray(
    processesOption?.child?.children?.process_data?.children
  );

  const openModalData = (process: IProcesses) => {
    fieldToArray(process).map(
      (item: { key: string; value: string | boolean }) => {
        dispatch(DataPressActionCreators.setDataPress(item.key, item.value));
      }
    );
    setIsVisibleModalData(true);
  };

  const closeModal = (updateType?: string) => {
    switch (true) {
      case updateType === "updateProcess":
        setIsVisibleModalData(false);
        break;

      case updateType === "updateData":
        setIsVisibleModal(false);
        break;

      default:
        setIsVisibleModal(false);
    }
    dispatch(DataPressActionCreators.clearDataPress());
  };

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
              <h1>Добавить процесс</h1>
              {processesOptionCreate != null &&
                processesOptionCreate.map((item: any) => {
                  if (item.key === "id" || item.key === "process_data") {
                    return null;
                  }

                  return (
                    <div key={item.key}>
                      <FormInput
                        key={item.key}
                        style={""}
                        value={
                          //@ts-ignore
                          dataPress[item.key]
                        }
                        options={item.value.choices}
                        disabled={item.key === "identifier" ? true : undefined}
                        onChange={(e, isChecked) => {
                          handleChangeInput(
                            item.key,
                            e,
                            isChecked && isChecked
                          );
                        }}
                        subInput={item.value.label}
                        error={""}
                        checked={
                          //@ts-ignore
                          dataPress[item.key]
                        }
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
                    closeModal("create");
                  }}
                />
                <Buttons
                  className="buttonModal"
                  text={"Добавить"}
                  onClick={() => {
                    addLifeSituationProcess(
                      updateData ? "update" : "create",
                      "updateData"
                    );
                  }}
                />
              </div>
            </div>
          }
          onClose={() => {
            closeModal("create");
          }}
        />
      )}

      {isVisibleModalData && (
        <Modal
          content={
            <div className="modalContainerGrid">
              <h1>Данные процесса</h1>
              <FormInput
                key={""}
                style={""}
                value={
                  //@ts-ignore
                  dataPress?.name
                }
                disabled={true}
                onChange={() => {}}
                subInput={"Название процесса"}
                error={""}
                keyData={""}
                required={false}
                type={""}
              />
              {processesOptionData != null &&
                processesOptionData.map((item: any) => {
                  if (item.key === "id") {
                    return null;
                  }
                  return (
                    <div key={item.key}>
                      <FormInput
                        key={item.key}
                        style={""}
                        value={
                          //@ts-ignore
                          item.key === "identifier"
                            ? identifier
                            : //@ts-ignore
                              dataPress?.process_data &&
                              dataPress?.process_data[item.key]
                        }
                        options={item.value.choices}
                        disabled={item.key === "identifier" ? true : undefined}
                        onChange={(e, isChecked) => {
                          handleChangeInputData(item.key, e, isChecked);
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
                    closeModal("updateProcess");
                  }}
                />
                <Buttons
                  className="buttonModal"
                  text={"Добавить"}
                  onClick={() => {
                    addLifeSituationProcess("update", "updateProcess");
                  }}
                />
              </div>
            </div>
          }
          onClose={() => {
            closeModal("updateProcess");
          }}
        />
      )}
      <div className="lifeSituationProcessContainer">
        {/*@ts-ignore*/}

        {processes?.map((proces) => (
          <div className="containerProcesses">
            <div key={proces?.id} className="cardLifeSituationServices">
              <div className="cardHeader">
                <h1 className="titleProcesses">{proces?.name}</h1>
                <div className="containerIdentProcesses">
                  <p className="processesIdent">{proces?.identifier}</p>
                  <p className="processesStatus">
                    {proces?.responsible_authority}
                  </p>

                  <Buttons
                    text={"Данные"}
                    ico={
                      Object.values(proces.process_data).some((data) => !!data)
                        ? icons.checkBlack
                        : ""
                    }
                    className="buttonDataWhite"
                    onClick={() => {
                      openModalData(proces);
                    }}
                  />
                </div>
                <h1 className="processesDepartament">{proces.department}</h1>
                {proces?.digital_format_link && (
                  <a
                    className="linkProcesses"
                    href={proces?.digital_format_link}
                    target="_blank"
                  >
                    <img src={icons.linkExt}></img>
                    {proces?.digital_format_link}
                  </a>
                )}
              </div>
              <div className="footerCardPositon">
                {proces.is_digital_format && (
                  <Buttons
                    className="whiteIco"
                    ico={icons.monitor}
                    text={""}
                    onClick={() => {}}
                  />
                )}
                {proces.is_external_client && (
                  <Buttons
                    className="whiteIco"
                    ico={icons.userRight}
                    text={""}
                    onClick={() => {}}
                  />
                )}
                {proces.is_internal_client && (
                  <Buttons
                    className="whiteIco"
                    ico={icons.userRight}
                    text={""}
                    onClick={() => {}}
                  />
                )}
                {proces.is_non_digital_format && (
                  <Buttons
                    className="whiteIco"
                    ico={icons.file5}
                    text={""}
                    onClick={() => {}}
                  />
                )}

                <Buttons
                  className="whiteIco"
                  ico={icons.edit}
                  text={""}
                  onClick={() => {
                    openModal("get", proces.id);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
        <Buttons
          ico={icons.plusCircle}
          text={"Добавить процесс"}
          className="whiteButtonAdd"
          onClick={() => {
            openModal();
          }}
        />
      </div>
    </>
  );
};

export default LifeSituationProcessItem;
