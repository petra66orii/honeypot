import getData from 'react-select-country-list';

// This returns an array like: [{ value: 'IE', label: 'Ireland' }, ...]
export const COUNTRIES = getData().getData();