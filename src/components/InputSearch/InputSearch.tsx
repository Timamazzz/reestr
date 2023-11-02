import React, { FC, useState } from "react";
import FormInput from "../FormInput/FormInput";
import Buttons from "../Buttons/Buttons";
import "./styles.scss";
import LifesituationsApiRequest from "../../api/Lifesituation/Lifesituation";

interface InputSearchProps {
  items: string[]; // Массив элементов для поиска
  searchData: (item: any) => void;
}

const InputSearch: FC<InputSearchProps> = ({ items, searchData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const lifeSituationApi = new LifesituationsApiRequest();

  const handleSearch = () => {
    setIsSearching(true);
    const searchText = searchTerm.toLowerCase();
    lifeSituationApi
      .list({ urlParams: `?search=${searchText}` })
      .then((resp) => {
        console.log("searchResults", resp.data);
        if (resp.success) {
          //@ts-ignore
          searchData(resp.data);
        }
      });
    setIsSearching(false);
  };

  return (
    <div className="inputSearchContainer">
      <FormInput
        style="searchInput"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e)}
        subInput={undefined}
        placeholder="Введите слово для поиска…"
        required={false}
        error={false}
        keyData={""}
        friedlyInput={false}
      />

      <Buttons
        className="buttonSearch"
        text={"Поиск"}
        onClick={() => handleSearch()}
      />
    </div>
  );
};

export default InputSearch;
