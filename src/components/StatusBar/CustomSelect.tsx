import * as React from 'react'
import * as Colors from '../../constants/colors'
import Select, { OptionTypeBase, Theme } from 'react-select' 

const customSelectStyles = {
  container: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: Colors.MAIN_COLOR,
  }),
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: Colors.MAIN_COLOR,
    borderRadius: 0,
    direction: 'rtl',
    outline: 'none',
    minHeight: '0.8em',
    height: '10px',
    top: '-0.4em',
    border: 0,
    boxShadow: 'none',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    color: Colors.SECOND_COLOR,
    backgroundColor: Colors.MAIN_COLOR,
    padding: 2,
    direction: 'rtl',
    '&:hover': {
      color: Colors.MAIN_COLOR,
      backgroundColor: Colors.SECOND_COLOR,
    }
  }),
  singleValue: (provided: any, state: any) => ({
    ...provided,
    color: Colors.SECOND_COLOR
  }),
  menu: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: Colors.MAIN_COLOR,
    boxShadow: 'none',
  }),
  menuList: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: Colors.MAIN_COLOR,
    padding: 0,
    '&:hover': {
      color: Colors.MAIN_COLOR,
      backgroundColor: Colors.SECOND_COLOR,
    },
  }),
}

export interface CustomSelectProps {
  value: any,
  onSelect: any,
  options: any,
}

export const CustomSelect = (props: CustomSelectProps) => (
  <Select
    menuPlacement="top"
    styles={customSelectStyles}
    value={props.value}
    onChange={props.onSelect}
    components={
      {
        DropdownIndicator: () => null,
        IndicatorSeparator: () => null
      }
    }
    options={props.options}
    isSearchable={false}
  />
)