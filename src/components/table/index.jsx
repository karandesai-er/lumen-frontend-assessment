import styles from "../../styles/table.module.scss";
import tableData from "../../data/tableData.json";
import TableRow from "./TableRow";
import NumericInput from "./NumericInput.jsx";
import { useMemo, useState } from "react";

function getRowValue(row) {
  return typeof row.modifiedValue === "number" || row.modifiedValue
    ? row.modifiedValue
    : row.value;
}

function getColumns({ handleNumberInput, onAllocation }) {
  return [
    {
      label: "Label",
      key: "label",
    },
    {
      label: "Value",
      key: "value",
      render: getRowValue,
    },
    {
      label: "Input",
      key: "input",
      render: (row) => {
        return <NumericInput onChange={handleNumberInput(row)} />;
      },
    },
    {
      label: "Allocation %",
      key: "allocationPercent",
      render: (row) => {
        return (
          <button type="button" onClick={onAllocation(row, "percentage")}>
            Allocate %
          </button>
        );
      },
    },
    {
      label: "Allocation Val",
      key: "allocation_val",
      render: (row) => {
        return (
          <button type="button" onClick={onAllocation(row, "value")}>
            Allocate Val
          </button>
        );
      },
    },
    {
      label: "Variance",
      key: "variancePercent",
      render: (row) => {
        return `${(((getRowValue(row) - row.value) / row.value) * 100).toFixed(2)}%`;
      },
    },
  ];
}

function updatedRowValue(rows, rowId, value) {
  let isChanged = false;
  let modifiedValue;
  const updatedRows = [...rows];
  console.log(updatedRows, rowId, value);
  for (let i = 0; i < updatedRows.length; i++) {
    const row = rows[i];
    if (row.id === rowId) {
      isChanged = true;
      modifiedValue = value - row.value;
      updatedRows[i] = {
        ...row,
        modifiedValue: value,
      };
    } else if (row.children) {
      const {
        isChanged: childIsChanged,
        updatedRows: updatedChildrenRows,
        modifiedValue: modifiedChildValue,
      } = updatedRowValue(row.children, rowId, value);

      if (childIsChanged) {
        isChanged = true;
        modifiedValue = getRowValue(row) + modifiedChildValue;
        updatedRows[i] = {
          ...row,
          children: [...updatedChildrenRows],
          modifiedValue,
        };
      }
    }

    return { isChanged, updatedRows, modifiedValue };
  }
}

function Table() {
  const [rows, setRows] = useState(tableData.rows);
  const [rowValues, setRowValues] = useState({});

  function handleNumberInput(row) {
    return (value) => {
      setRowValues((prevRowValues) => ({
        ...prevRowValues,
        [row.id]: value,
      }));
    };
  }

  function handleAllocation(row, type) {
    return () => {
      const inputNumber = rowValues[row.id];
      if (inputNumber || typeof inputNumber === "number") {
        let newValue = getRowValue(row);
        if (type === "percentage") {
          newValue += (newValue * inputNumber) / 100;
        } else {
          newValue += inputNumber;
        }
        const { updatedRows } = updatedRowValue(rows, row.id, newValue);
        setRows([...updatedRows]);
      }
    };
  }

  const columns = useMemo(() => {
    return getColumns({
      handleNumberInput,
      onAllocation: handleAllocation,
    });
  }, [handleAllocation, handleNumberInput]);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key}>{column.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <TableRow key={`row-${row.id}`} row={row} columns={columns} />
        ))}
      </tbody>
    </table>
  );
}

export default Table;
