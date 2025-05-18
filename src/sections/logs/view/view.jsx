import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { fetchData } from 'src/utils/api';

import Scrollbar from 'src/components/scrollbar';
import TableHeaderWithoutCheckbox from 'src/components/table/table-head-without-checkbox';
import TableNoData from 'src/components/table/table-no-data';

import { applyFilter } from '../utils';
import AccessLogTableRow from '../table-row';
import AccessLogsTableToolbar from '../table-toolbar';

// ----------------------------------------------------------------------

export default function LogsView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('id');
  const [filter, setFilter] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [logs, setLogs] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const getAllLogs = useCallback(async () => {
    let url = `access-logs?page=${page}&size=${rowsPerPage}&sort=${orderBy},${order}`;
    if (filter !== '') {
      url += `&search=${filter}`;
    }

    try {
      const response = await fetchData(url);
      setLogs(response.content);
      setTotalRows(response.totalElements);
    } catch (error) {
      console.error('Erro ao buscar logs:', error);
    }
  }, [filter, page, rowsPerPage, order, orderBy]);

  useEffect(() => {
    getAllLogs();
  }, [getAllLogs]);

  const handleSort = (event, id) => {
    setPage(0);
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilter = (event) => {
    setPage(0);
    setFilter(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: logs,
  });
  
  const notFound = !dataFiltered.length && !!filter;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Logs de Acesso</Typography>
      </Stack>

      <Card>
        <AccessLogsTableToolbar
          filterName={filter}
          onFilterName={handleFilter}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHeaderWithoutCheckbox
                order={order}
                orderBy={orderBy}
                headLabel={[
                  { id: 'id', label: '#' },
                  { id: 'userName', label: 'Nome' },
                  { id: 'userEmail', label: 'E-mail' },
                  { id: 'type', label: 'Tipo' },
                  { id: 'accessDateTime', label: 'Data/Hora' },
                ]}
                onRequestSort={handleSort}
              />
              <TableBody>
                {dataFiltered
                  .map((row) => (
                    <AccessLogTableRow
                      key={row.id}
                      id={row.id}
                      name={row.name}
                      email={row.email}
                      type={row.type}
                      accessDateTime={row.accessDateTime}
                    />
                  ))}

                {notFound && <TableNoData query={filter} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Linhas por página:"
        />
      </Card>
    </Container>
  );
}
