import React from 'react';

const { PROD_LIST_URL } = process.env;

export const linkCellsProps = {
  station: {
    path: 'program',
    rowKey: 'id_program',
  },
  mux: {
    path: 'mux',
    rowKey: 'id_multipleks',
  },
  obiekt: {
    path: 'obiekt',
    rowKey: 'id_obiekt',
  },
  mHz: {
    rowKey: 'id_nadajnik',
  },
};

export const linkCellFormat = (cell, row, propKeys, isMHz = false) => (
  <a
    href={
      isMHz
        ? `${PROD_LIST_URL}/${row.typ}/${row[propKeys.rowKey]}`
        : `${PROD_LIST_URL}/${propKeys.path}/${row[propKeys.rowKey]}`
    }
    title="Szczegóły"
    target="_blank"
    rel="noopener noreferrer">
    {cell}
  </a>
);
