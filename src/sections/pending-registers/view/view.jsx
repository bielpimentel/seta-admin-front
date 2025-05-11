import Swal from 'sweetalert2';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { fetchData, postData, deleteData } from 'src/utils/api';

import Scrollbar from 'src/components/scrollbar';
import TableHeader from 'src/components/table/table-head';
import TableNoData from 'src/components/table/table-no-data';

import { applyFilter } from '../utils';
import PendingRegistersTableRow from '../table-row';
import PendingRegistersTableToolbar from '../table-toolbar';

// ----------------------------------------------------------------------

export default function PendingRegistersView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('email');
  const [filter, setFilter] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [registers, setRegisters] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const getAllRegisters = useCallback(async () => {
    let url = `pendings?page=${page}&size=${rowsPerPage}&sort=${orderBy},${order}`;
    if (filter !== '') {
      url += `&search=${filter}`;
    }

    try {
      const response = await fetchData(url);
      setRegisters(response.content);
      setTotalRows(response.totalElements);
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
    }
  }, [filter, page, rowsPerPage, order, orderBy]);

  useEffect(() => {
    getAllRegisters();
  }, [getAllRegisters]);

  const resendMail = async (event, email) => {
    const url = `pendings`;
    const body = {email: email};
    try {
      const response = await postData(url, body);
      Swal.fire('Enviado!', `E-mail enviado com sucesso para "${email}"`, 'success');
    } catch (error) {
      Swal.fire('Algo deu errado...', `Não foi possível enviar o e-mail para "${email}".`, 'error');
    }
  };

  const deleteRegister = async (event, email) => {
    const url = `pendings/${email}`
    try {
      await deleteData(url);
    } catch (error) {
      console.error('Erro ao deletar registro:', error);
    }
    getAllRegisters();
  };

  const deleteSelectedRegisters = async (event) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja apagar o(s) registro(s) selecionado(s)?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, apagar!',
      cancelButtonText: 'Cancelar'
    });

    if (isConfirmed) {
      selected.forEach(email => {
        deleteRegister(event, email);
      });
      setSelected([]);
      Swal.fire('Excluído!', 'Registro(s) excluído(s) com sucesso.', 'success');
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
      const newSelecteds = registers.map((n) => n.email);
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
    inputData: registers,
  });

  
  const notFound = !dataFiltered.length && !!filter;

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Cadastros Pendentes</Typography>
      </Stack>

      <Card>
        <PendingRegistersTableToolbar
          selected={selected}
          filterName={filter}
          onFilterName={handleFilter}
          deleteSelectedRegisters={deleteSelectedRegisters}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHeader
                order={order}
                orderBy={orderBy}
                rowCount={registers.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'email', label: 'E-mail' },
                  { id: 'name', label: 'Nome' },
                  { id: 'createdAt', label: 'Data/Hora do Cadastro' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .map((row) => (
                    <PendingRegistersTableRow
                      key={row.email}
                      email={row.email}
                      name={row.name}
                      createdAt={row.createdAt}
                      selected={selected.indexOf(row.email) !== -1}
                      handleClick={(event) => handleClick(event, row.email)}
                      resendMail={(event) => resendMail(event, row.email)}
                      deleteRegister={(event) => deleteRegister(event, row.email)}
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
