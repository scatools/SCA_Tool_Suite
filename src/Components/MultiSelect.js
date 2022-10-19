import React, { useRef, useState, useEffect } from "react";
import ReactSelect from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { changeMeasures } from "../Redux/action";

export const MultiSelect = (props) => {
  const dispatch = useDispatch();

  // isOptionSelected sees previous props.value after onChange
  const valueRef = useRef(props.value);
  valueRef.current = props.value;
  if (!valueRef.current) valueRef.current = [];

  const inStateWeight = useSelector((state) => state.weights[props.name]);

  const inStateSelected = !!inStateWeight ? inStateWeight.selected : [];

  if (
    !!valueRef.current.length &&
    valueRef.current.length !== inStateSelected.length
  ) {
    let state;

    state = valueRef.current.map((selected) => ({
      ...selected,
      utility: selected["utility"] || "1",
      weight: selected["weight"] || "medium",
    }));
    if (props.name) dispatch(changeMeasures([props.name], state));
  }

  const selectAllOption = {
    value: "<SELECT_ALL>",
    label: "Select All",
  };

  const isSelectAllSelected = () => {
    return valueRef.current.length === props.options.length;
  };

  const isOptionSelected = (option) =>
    valueRef.current.some(({ value }) => value === option.value) ||
    isSelectAllSelected();

  const getOptions = () => [selectAllOption, ...props.options];

  const getValue = () =>
    isSelectAllSelected() ? [selectAllOption] : props.value;

  const onChange = (newValue, actionMeta) => {
    const { action, option, removedValue } = actionMeta;

    if (action === "select-option" && option.value === selectAllOption.value) {
      props.onChange(props.options, actionMeta);
    } else if (
      (action === "deselect-option" &&
        option.value === selectAllOption.value) ||
      (action === "remove-value" &&
        removedValue.value === selectAllOption.value)
    ) {
      props.onChange([], actionMeta);
    } else if (
      actionMeta.action === "deselect-option" &&
      isSelectAllSelected()
    ) {
      props.onChange(
        props.options.filter(({ value }) => value !== option.value),
        actionMeta
      );
    } else {
      props.onChange(newValue || [], actionMeta);
    }
  };

  return (
    <ReactSelect
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      menuPortalTarget={document.body}
      isMulti
      isClearable={true}
      placeholder={props.placeholder}
      name="colors"
      className="basic-multi-select"
      classNamePrefix="select"
      isOptionSelected={isOptionSelected}
      options={getOptions()}
      value={getValue()}
      onChange={onChange}
      hideSelectedOptions={false}
      closeMenuOnSelect={true}
    />
  );
};
