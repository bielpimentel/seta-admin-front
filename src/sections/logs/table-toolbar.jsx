import PropTypes from 'prop-types';

import Toolbar from '@mui/material/Toolbar';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function AccessLogsTableToolbar({ 
  filterName, 
  filterType,
  onFilterName, 
  onFilterType, 
}) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
      }}
    >
      <OutlinedInput
        sx={{ width: 405 }}
        value={filterName}
        onChange={onFilterName}
        placeholder="Buscar logs por nome ou e-mail..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify
              icon="eva:search-fill"
              sx={{ color: 'text.disabled', width: 20, height: 20 }}
            />
          </InputAdornment>
        }
      />
      <Select
        sx={{ width: 180 }}
        value={filterType}
        onChange={onFilterType}
        displayEmpty
      >
        <MenuItem value="">
          <span style={{color: 'lightgray'}}>Filtrar por tipo...</span>
        </MenuItem>
        <MenuItem value="ENTRADA">Entrada</MenuItem>
        <MenuItem value="SAIDA">Saída</MenuItem>
      </Select>
    </Toolbar>
  );
}

AccessLogsTableToolbar.propTypes = {
  filterName: PropTypes.string,
  filterType: PropTypes.string,
  onFilterName: PropTypes.func,
  onFilterType: PropTypes.func,
};
