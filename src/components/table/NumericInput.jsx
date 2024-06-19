import React, { useState } from "react";

function NumericInput({ onChange }) {
  const [numberValue, setNumberValue] = useState("");

  function handleChangeNumberValue(event) {
    setNumberValue(Number(event.target.value.replaceAll(/\D/g, "")));
  }

  return (
    <>
      <input
        type="text"
        value={numberValue}
        onChange={handleChangeNumberValue}
        onBlur={() => onChange(numberValue)}
      />
    </>
  );
}

export default NumericInput;
