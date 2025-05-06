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

import { fetchData, deleteData } from 'src/utils/api';

import Modal from 'src/components/modal/modal';
import Scrollbar from 'src/components/scrollbar';
import TableHeader from 'src/components/table/table-head';
import TableNoData from 'src/components/table/table-no-data';

import { applyFilter } from '../utils';
import SupportsTableRow from '../table-row';
import SupportsTableToolbar from '../table-toolbar';

// ----------------------------------------------------------------------

export default function SupportsView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('id');
  const [filter, setFilter] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [registers, setRegisters] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [registerDetails, setRegisterDetails] = useState({});
  const [isOpenModalDetails, setIsOpenModalDetails] = useState(false);

  const getAllRegisters = useCallback(async () => {
    let url = `supports?page=${page}&size=${rowsPerPage}&sort=${orderBy},${order}`;
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

  const getRegister = async (event, id) => {
    const url = `supports/${id}`;
    try {
      const cont = await fetchData(url);
      setRegisterDetails(cont);
      setIsOpenModalDetails(true);
    } catch (error) {
      console.error('Erro ao buscar registro:', error);
    }
  };

  const deleteRegister = async (event, id) => {
    const url = `supports/${id}`
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
      selected.forEach(id => {
        deleteRegister(event, id);
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
      const newSelecteds = registers.map((n) => n.id);
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
        <Typography variant="h4">Contatos Recebidos</Typography>
      </Stack>

      <Card>
        <SupportsTableToolbar
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
                  { id: 'id', label: '#' },
                  { id: 'userName', label: 'Nome' },
                  { id: 'userEmail', label: 'E-mail' },
                  { id: 'subject', label: 'Assunto' },
                  { id: 'createdAt', label: 'Data/Hora do Contato' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .map((row) => (
                    <SupportsTableRow
                      key={row.id}
                      id={row.id}
                      name={row.name}
                      email={row.email}
                      subject={row.subject}
                      createdAt={row.createdAt}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(event) => handleClick(event, row.id)}
                      getRegister={(event) => getRegister(event, row.id)}
                      deleteRegister={(event) => deleteRegister(event, row.id)}
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

      <Modal 
        isOpen={isOpenModalDetails} 
        setIsOpen={setIsOpenModalDetails}
        title="Detalhes do Contato"
        inputs={[
          {
            desc: "ID",
            value: registerDetails.id
          },
          {
            desc: "E-MAIL",
            value: registerDetails.email
          },
          {
            desc: "NOME",
            value: registerDetails.name
          },
          {
            desc: "NÚMERO PARA CONTATO",
            value: registerDetails.phoneNumber
          },
          {
            desc: "ASSUNTO",
            value: registerDetails.subject
          },
          {
            desc: "DATA/HORA DO CONTATO",
            value: new Date(registerDetails.createdAt).toLocaleString('pt-BR', { hour12: false })
          },
          {
            desc: "MENSAGEM",
            value: registerDetails.message
          },
        ]} 
      />
    </Container>
  );
}
