import styles from "../../styles/table.module.scss";

function TableRow({ row, columns, step = 0 }) {
  return (
    <>
      <tr>
        {columns.map((column, columnIndex) => (
          <td key={`column-${column.key}-${row.id}`}>
            {columnIndex === 0 &&
              step > 0 &&
              `${Array.from({ length: step })
                .map(() => "--")
                .join("")}  `}
            {column.render ? column.render(row, step) : row[column.key]}
          </td>
        ))}
      </tr>
      {row.children?.map((childRow) => (
        <TableRow
          key={`child-row-${step}-${childRow.id}`}
          row={childRow}
          columns={columns}
          step={step + 1}
        />
      ))}
    </>
  );
}

export default TableRow;
