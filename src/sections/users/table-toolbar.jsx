import PropTypes from 'prop-types';

import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UsersTableToolbar({ 
  selected, 
  filterName, 
  filterRole,
  onFilterName, 
  onFilterRole, 
  deleteSelectedUsers,
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
        <>
          <OutlinedInput
            sx={{ width: 405 }}
            value={filterName}
            onChange={onFilterName}
            placeholder="Buscar usuário por nome ou e-mail..."
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
            sx={{ width: 200 }}
            value={filterRole}
            onChange={onFilterRole}
            displayEmpty
          >
            <MenuItem value="">
              <span style={{color: 'lightgray'}}>Filtrar por função...</span>
            </MenuItem>
            <MenuItem value="USER">USER</MenuItem>
            <MenuItem value="ADMIN">ADMIN</MenuItem>
            <MenuItem value="SUPER_ADMIN">SUPER_ADMIN</MenuItem>
          </Select>
        </>
      )}

      {selected.length > 0 && (
        <Tooltip title="Deletar">
          <IconButton onClick={deleteSelectedUsers}>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

UsersTableToolbar.propTypes = {
  selected: PropTypes.array,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  deleteSelectedUsers: PropTypes.func,
};
