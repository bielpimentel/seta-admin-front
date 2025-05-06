import Swal from 'sweetalert2';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Iconify from '../../../components/iconify';
import { Link } from 'react-router-dom';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { fetchData, deleteData } from 'src/utils/api';

import Scrollbar from 'src/components/scrollbar';
import TableHeader from 'src/components/table/table-head';
import TableNoData from 'src/components/table/table-no-data';

import { applyFilter } from '../utils';
import MailExtensionsTableRow from '../table-row';
import MailExtensionsTableToolbar from '../table-toolbar';

// ----------------------------------------------------------------------

export default function MailExtensionsView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('id');
  const [filter, setFilter] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [mailExtensions, setMailExtensions] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const getAllMailExtensions = useCallback(async () => {
    let url = `mail-extensions?page=${page}&size=${rowsPerPage}&sort=${orderBy},${order}`;
    if (filter !== '') {
      url += `&search=${filter}`;
    }

    try {
      const response = await fetchData(url);
      setMailExtensions(response.content);
      setTotalRows(response.totalElements);
    } catch (error) {
      console.error('Erro ao buscar extensões de e-mail:', error);
    }
  }, [filter, page, rowsPerPage, order, orderBy]);

  useEffect(() => {
    getAllMailExtensions();
  }, [getAllMailExtensions]);

  const deleteMailExtension = async (event, id) => {
    const url = `mail-extensions/${id}`
    try {
      await deleteData(url);
    } catch (error) {
      console.error('Erro ao deletar extensão de e-mail:', error);
    }
    getAllMailExtensions();
  };

  const deleteSelectedMailExtensions = async (event) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja excluir a(s) extensão(ões) de e-mail selecionada(s)?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    });

    if (isConfirmed) {
      selected.forEach(id => {
        deleteMailExtension(event, id);
      });
      setSelected([]);
      Swal.fire('Excluída!', 'Extensão(ões) excluída(s) com sucesso.', 'success');
    }
  };

  const handleSort = (event, id) => {
    setPage(0);
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = mailExtensions.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
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
    inputData: mailExtensions,
  });

  
  const notFound = !dataFiltered.length && !!filter;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">E-mails Permitidos</Typography>

        <Link to="/emails-permitidos/novo">
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
            Cadastrar e-mail
          </Button>
        </Link>
      </Stack>

      <Card>
        <MailExtensionsTableToolbar
          selected={selected}
          filterMail={filter}
          onFilterMail={handleFilter}
          deleteSelectedMailExtensions={deleteSelectedMailExtensions}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHeader
                order={order}
                orderBy={orderBy}
                rowCount={mailExtensions.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'id', label: '#' },
                  { id: 'mailExtension', label: 'Extensão de E-mail' },
                  { id: 'createdAt', label: 'Data/Hora da Criação' },
                  { id: 'updatedAt', label: 'Última Atualização' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .map((row) => (
                    <MailExtensionsTableRow
                      key={row.id}
                      id={row.id}
                      mailExtension={row.mailExtension}
                      createdAt={row.createdAt}
                      updatedAt={row.updatedAt}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(event) => handleClick(event, row.id)}
                      deleteMailExtension={(event) => deleteMailExtension(event, row.id)}
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
