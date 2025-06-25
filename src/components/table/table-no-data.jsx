import PropTypes from 'prop-types';

import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function TableNoData({ query, role, type }) {
  const filters = [];

  if (query) {
    filters.push(`"${query}"`);
  }

  if (role) {
    filters.push(`função "${role}"`);
  }

  if (type) {
    filters.push(`tipo "${type}"`);
  }

  return (
    <TableRow>
      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
        <Paper
          sx={{
            textAlign: 'center',
          }}
        >
          <Typography variant="body2">
            Nenhum resultado encontrado com o(s) filtro(s): &nbsp;
            <strong>{filters.join(' e ')}</strong>.
          </Typography>
        </Paper>
      </TableCell>
    </TableRow>
  );
}

TableNoData.propTypes = {
  query: PropTypes.string,
  role: PropTypes.string,
};
