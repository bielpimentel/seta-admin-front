import PropTypes from 'prop-types';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function PendingRegistersTableToolbar({ 
  selected, 
  filterName, 
  onFilterName, 
  deleteSelectedRegisters,
}) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(selected.length > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {selected.length > 0 ? (
        <Typography component="div" variant="subtitle1">
          {selected.length} selecionado(s)
        </Typography>
      ) : (
        <OutlinedInput
          sx={{ width: 405 }}
          value={filterName}
          onChange={onFilterName}
          placeholder="Buscar registro por nome ou e-mail..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify
                icon="eva:search-fill"
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          }
        />
      )}

      {selected.length > 0 && (
        <Tooltip title="Deletar">
          <IconButton onClick={deleteSelectedRegisters}>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

PendingRegistersTableToolbar.propTypes = {
  selected: PropTypes.array,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  deleteSelectedRegisters: PropTypes.func,
};
