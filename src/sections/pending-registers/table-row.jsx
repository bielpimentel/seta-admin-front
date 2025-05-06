import Swal from 'sweetalert2';
import { useState } from 'react';
import PropTypes from 'prop-types';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function PendingRegistersTableRow({
  email,
  name,
  createdAt,
  selected,
  handleClick,
  resendMail,
  deleteRegister,
}) {
  const [open, setOpen] = useState(null);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleSendMailClick = () => {
    resendMail();
    handleCloseMenu();
  };

  const handleDeleteClick = async () => {
    handleCloseMenu();
    const { isConfirmed } = await Swal.fire({
      title: 'Tem certeza?',
      text: `Deseja apagar o registro com e-mail ${email}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, apagar!',
      cancelButtonText: 'Cancelar'
    });

    if (isConfirmed) {
      deleteRegister();
      Swal.fire('Excluído!', 'Registro excluído com sucesso!', 'success');
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>{email}</TableCell>
        <TableCell>{name}</TableCell>
        <TableCell>{new Date(createdAt).toLocaleString('pt-BR', { hour12: false })}</TableCell>

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
          sx: { width: 180 },
        }}
      >
        <MenuItem onClick={handleSendMailClick}>
          <Iconify icon="mdi:email-resend-outline" sx={{ mr: 2 }} />
          Reenviar e-mail
        </MenuItem>

        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Deletar
        </MenuItem>
      </Popover>
    </>
  );
}

PendingRegistersTableRow.propTypes = {
  selected: PropTypes.any,
  name: PropTypes.string,
  email: PropTypes.string,
  createdAt: PropTypes.any,
  handleClick: PropTypes.func,
  resendMail: PropTypes.func,
  deleteRegister: PropTypes.func,
};
