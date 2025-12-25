export const defaultCreditColumns = [
  { name: "date", align: "left", label: "Date", field: "date" },
  { name: "item", align: "left", label: "Item", field: "item" },
  { name: "quantity", align: "left", label: "Qty.", field: "quantity" },
  { name: "rate", align: "left", label: "Rate", field: "rate" },
  {
    name: "credit",
    align: "left",
    label: "Amount",
    field: "credit",
    format: (val) => `${val.toLocaleString("en-IN")}`,
  },
  {
    name: "total",
    align: "left",
    label: "Total",
    field: "total",
    format: (val) => `${val.toLocaleString("en-IN")}`,
  },
  { name: "receipt", align: "left", label: "Receipt", field: "receipt" },
  { name: "vehicle", align: "left", label: "Vehicle", field: "vehicle" },
  { name: "action", align: "left", label: "", field: "action" },
];

export const deafaultAllCoumns = [
  { name: "date", align: "left", label: "Date", field: "date" },
  {
    name: "receipt",
    align: "left",
    label: "Receipt",
    field: "receipt",
  },
  {
    name: "vehicle",
    align: "left",
    label: "Vehicle",
    field: "vehicle",
  },
  {
    name: "item",
    align: "left",
    label: "Item/Payment",
    field: "item",
  },
  {
    name: "quantity",
    align: "left",
    label: "Qty.",
    field: "quantity",
    format: (val) => `${val === 0 || val === null ? "" : val}`,
  },
  {
    name: "rate",
    align: "left",
    label: "Rate",
    field: "rate",
    format: (val) => `${val === 0 || val === null ? "" : val}`,
  },
  {
    name: "debit",
    align: "left",
    label: "Debit",
    field: "debit",
    format: (val) =>
      `${val === 0 || val === null ? "" : val.toLocaleString("en-IN")}`,
  },
  {
    name: "credit",
    align: "left",
    label: "Credit",
    field: "credit",
    format: (val) =>
      `${val === 0 || val === null ? "" : val.toLocaleString("en-IN")}`,
  },
  {
    name: "total",
    align: "left",
    label: "Total",
    field: "total",
    format: (val) => `${val.toLocaleString("en-IN")}`,
  },
  {
    name: "remark",
    align: "left",
    label: "Remark",
    field: "remark",
  },
  { name: "action", align: "left", label: "", field: "action" },
];

export function getCreditColumns(columns) {
  //   window.alert("parsing");
  var temp = JSON.parse(columns);
  var selectedColumns = [
    { name: "date", align: "left", label: "Date", field: "date" },
  ];
  for (let col of temp) {
    if (col.selected) {
      if (col.customeLabel !== null && col.customeLabel !== "")
        col.label = col.customeLabel;
      selectedColumns.push(col);
    }
  }
  return selectedColumns;
}

export function getAllColumns(columns) {
  var creditColumns = JSON.parse(columns);
  var allColumns = JSON.parse(JSON.stringify(deafaultAllCoumns));

  for (let col of creditColumns) {
    for (let index = 0; index < allColumns.length; index++) {
      if (col.name === allColumns[index].name) {
        if (col.selected) {
          allColumns[index].label = isNotNullOrEmpty(col.customeLabel)
            ? col.customeLabel
            : allColumns[index].label;
          break;
        } else {
          allColumns.splice(index, 1);
          break;
        }
      }
    }
  }
  return allColumns;
}

function isNotNullOrEmpty(text) {
  return text !== null && text !== "";
}
