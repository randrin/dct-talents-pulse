import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const TalentsPulseSearchItem = ({ placeholder, keyword, setKeyword }) => {
  const handleSearchChange = (e) => {
    e.preventDefault();
    setKeyword(e.target.value.toLowerCase());
  };

  return (
    <Input
      type="search"
      size="large"
      value={keyword}
      placeholder={!!placeholder.length ? placeholder : "Filter"}
      prefix={<SearchOutlined />}
      onChange={handleSearchChange}
      className="mt-3 mb-3"
    />
  );
};

export default TalentsPulseSearchItem;
