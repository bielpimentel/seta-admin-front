import { useRef } from 'react';
import * as types from 'prop-types';

import { DateTimePicker } from '@mui/x-date-pickers';
import {
  Box,
  Select,
  Checkbox,
  MenuItem,
  TextField,
  Typography,
  InputLabel,
  FormControl,
} from '@mui/material';

import useInput from './hooks/useInput';

const Input = (props) => {
  const { name, validations, type, label, options, value, onValidationChange, formValues, ...otherProps } = props;
  const inputRef = useRef(null);

  const { feedbackMessages, handleInput } = useInput(inputRef, validations, name, onValidationChange, formValues);

  if (type === 'checkbox') {
    return (
      <Box pt={1}>
        <Box display="flex" alignItems="center" height="100%">
          <Checkbox onInput={handleInput} inputRef={inputRef} name={name} value={value} {...otherProps} />
          <Typography>{label}</Typography>
        </Box>
        <Typography
          color="error"
          fontSize={13}
          textAlign="left"
          pt={0.5}
          pl={5}
          className="feedback"
        >
          {feedbackMessages?.[0]}
        </Typography>
      </Box>
    );
  }

  if (type === 'select') {
    return (
      <FormControl pt={1} fullWidth>
        <InputLabel id="select-label">{label}</InputLabel>
        <Select
          labelId="select-label"
          id="demo-simple-select"
          label={label}
          fullWidth
          name={name}
          value={value}
          onInput={handleInput}
          {...otherProps}
        >
          {options?.map((option) => (
            <MenuItem value={option.value} key={option.value}>{option.label}</MenuItem>
          ))}
        </Select>
        <Typography
          color="error"
          fontSize={13}
          textAlign="left"
          pt={0.5}
          pl={5}
          className="feedback"
        >
          {feedbackMessages?.[0]}
        </Typography>
      </FormControl>
    );
  }

  if (type === 'datetime-local') {
    return (
      <>
        <DateTimePicker
          localeText="br"
          onInput={handleInput}
          inputRef={inputRef}
          name={name}
          value={value}
          sx={{width: '100%'}}
          {...otherProps}
        />

        <Typography color="error" fontSize={13} textAlign="right" pt={0.5} className="feedback">
          {feedbackMessages?.[0]}
        </Typography>
      </>
    );
  }

  return (
    <>
      <TextField
        onInput={handleInput}
        inputRef={inputRef}
        fullWidth
        name={name}
        type={type}
        label={label}
        value={value}
        {...otherProps}
      />

      <Typography color="error" fontSize={13} textAlign="right" pt={0.5} className="feedback">
        {feedbackMessages?.[0]}
      </Typography>
    </>
  );
};

export default Input;

Input.propTypes = {
  name: types.string,
  validations: types.arrayOf(types.string),
  type: types.string,
  label: types.any,
  value: types.any,
  options: types.arrayOf(types.object),
  onValidationChange: types.func,
  formValues: types.object,
};