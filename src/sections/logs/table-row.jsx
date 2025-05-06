import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

export default function AccessLogTableRow({
  id,
  name,
  email,
  type,
  createdAt,
}) {

return (
    <TableRow hover tabIndex={-1}>
      <TableCell>{id}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell>{email}</TableCell>
      <TableCell>{type}</TableCell>
      <TableCell>{createdAt}</TableCell>
    </TableRow>
  );
}

AccessLogTableRow.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  email: PropTypes.string,
  type: PropTypes.string,
  createdAt: PropTypes.string,
};
