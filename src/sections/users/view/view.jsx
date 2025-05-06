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

import Modal from 'src/components/modal/modal';
import Scrollbar from 'src/components/scrollbar';
import TableHeader from 'src/components/table/table-head';
import TableNoData from 'src/components/table/table-no-data';

import { applyFilter } from '../utils';
import UserTableRow from '../table-row';
import UsersTableToolbar from '../table-toolbar';

// ----------------------------------------------------------------------

export default function UsersView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('id');
  const [filter, setFilter] = useState('');
  const [role, setRole] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [users, setUsers] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [userDetails, setUserDetails] = useState({});
  const [isOpenModalDetails, setIsOpenModalDetails] = useState(false);

  const getAllUsers = useCallback(async () => {
    let url = `users?page=${page}&size=${rowsPerPage}&sort=${orderBy},${order}`;
    if (filter !== '') {
      url += `&search=${filter}`;
    }
    if (role !== '') {
      url += `&role=${role}`;
    }

    try {
      const response = await fetchData(url);
      setUsers(response.content);
      setTotalRows(response.totalElements);
    } catch (error) {
      console.error('Erro ao buscar usários:', error);
    }
  }, [filter, page, rowsPerPage, order, orderBy, role]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const getUser = async (event, id) => {
    const url = `users/${id}`;
    try {
      const cont = await fetchData(url);
      setUserDetails(cont);
      setIsOpenModalDetails(true);
    } catch (error) {
      console.error('Erro ao buscar usário:', error);
    }
  };

  const deleteUser = async (event, id) => {
    const url = `users/${id}`
    try {
      await deleteData(url);
    } catch (error) {
      console.error('Erro ao deletar usário:', error);
    }
    getAllUsers();
  };

  const deleteSelectedUsers = async (event) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja apagar o(s) usário(s) selecionado(s)?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, apagar!',
      cancelButtonText: 'Cancelar'
    });

    if (isConfirmed) {
      selected.forEach(id => {
        deleteUser(event, id);
      });
      setSelected([]);
      Swal.fire('Excluído!', 'Usário(s) excluído(s) com sucesso.', 'success');
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
      const newSelecteds = users.map((n) => n.id);
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

  const handleRoleFilter = (event) => {
    setPage(0);
    setRole(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: users,
  });

  const notFound = !dataFiltered.length && !!(filter || role);

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Usuários</Typography>

        <Link to="/usuarios/novo">
          <Button variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
            Cadastrar usuário
          </Button>
        </Link>
      </Stack>

      <Card>
        <UsersTableToolbar
          selected={selected}
          filterName={filter}
          filterRole={role}
          onFilterName={handleFilter}
          onFilterRole={handleRoleFilter}
          deleteSelectedUsers={deleteSelectedUsers}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHeader
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'id', label: '#' },
                  { id: 'name', label: 'Nome' },
                  { id: 'email', label: 'E-mail' },
                  { id: 'role', label: 'Função' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      id={row.id}
                      name={row.name}
                      email={row.email}
                      role={row.role}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(event) => handleClick(event, row.id)}
                      getUser={(event) => getUser(event, row.id)}
                      deleteUser={(event) => deleteUser(event, row.id)}
                    />
                  ))}

                {notFound && <TableNoData query={filter} role={role} />}
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
        title="Detalhes do Usuário"
        inputs={[
          {
            desc: "ID",
            value: userDetails.id
          },
          {
            desc: "E-MAIL",
            value: userDetails.email
          },
          {
            desc: "NOME",
            value: userDetails.name
          },
          {
            desc: "FUNÇÃO",
            value: userDetails.role
          },
          {
            desc: "DATA/HORA DE CADASTRO",
            value: new Date(userDetails.createdAt).toLocaleString('pt-BR', { hour12: false })
          },
          {
            desc: "ÚLTIMA ATUALIZAÇÃO",
            value: new Date(userDetails.updatedAt).toLocaleString('pt-BR', { hour12: false })
          },
        ]} 
      />
    </Container>
  );
}
