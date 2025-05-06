import Swal from 'sweetalert2';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function UserTableRow({
  selected,
  id,
  name,
  email,
  role,
  handleClick,
  getUser,
  deleteUser,
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleViewClick = () => {
    getUser();
    handleCloseMenu();
  };

  const handleEditClick = () => {
    handleCloseMenu();
    navigate(`/usuarios/editar/${id}`);
  };

  const handleDeleteClick = async () => {
    handleCloseMenu();
    const { isConfirmed } = await Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja apagar o usuário ID ${id}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, apagar!',
      cancelButtonText: 'Cancelar'
    });

    if (isConfirmed) {
      deleteUser();
      Swal.fire('Excluído!', 'Usuário excluído com sucesso!', 'success');
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>{id}</TableCell>

        <TableCell>{name}</TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{role}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleViewClick}>
          <Iconify icon="eva:eye-fill" sx={{ mr: 2 }} />
          Ver
        </MenuItem>

        <MenuItem onClick={handleEditClick}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Editar
        </MenuItem>

        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Deletar
        </MenuItem>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  selected: PropTypes.any,
  id: PropTypes.number,
  name: PropTypes.string,
  email: PropTypes.string,
  role: PropTypes.any,
  handleClick: PropTypes.func,
  getUser: PropTypes.func,
  deleteUser: PropTypes.func,
};
