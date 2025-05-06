import Swal from 'sweetalert2';
import { Link, useParams } from 'react-router-dom';
import { useRef, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Grid, CardContent } from '@mui/material';

import { updateData, fetchData } from 'src/utils/api';

import Iconify from 'src/components/iconify';
import Input from 'src/components/input/input';

export default function EditUserView() {
  const { id } = useParams();
  
  const [oldUser, setOldUser] = useState({});
  const [newUser, setNewUser] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [modifiedValues, setModifiedValues] = useState({});
  
  const formRef = useRef();
  
  let validationSchema = {
    name: ['required'],
    email: ['required', 'email'],
    password: [],
    passwordConfirmation: ['matchPassword'],
    role: ['required'],
  };
  
  const getUser = useCallback(async () => {
    try {
      const user = await fetchData(`users/${id}`);
      setOldUser(user);
      setNewUser({
        name: user.name || '',
        email: user.email || '',
        password: '', 
        passwordConfirmation: '',
        role: user.role || 'USER'
      });
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
    }
  }, [id]);
  
  useEffect(() => {
    getUser();
  }, [getUser]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));

    if (value !== oldUser[name] && value !== '') {
      setModifiedValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setModifiedValues((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }

    if (name === 'password') {
      setNewUser((prev) => ({
        ...prev,
        passwordConfirmation: '',
      }));

      if (value !== '') {
        setValidationErrors((prev) => ({
          ...prev,
          passwordConfirmation: true,
        }));
      } else {
        setValidationErrors((prev) => ({
          ...prev,
          passwordConfirmation: false,
        }));
        setModifiedValues((prev) => {
          const { passwordConfirmation, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handleValidationChange = (inputName, hasError) => {
    setValidationErrors((prev) => ({
      ...prev,
      [inputName]: hasError,
    }));
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const endpoint = `users/${id}`;
    const body = newUser;
    
    try {
      await updateData(endpoint, body);
      Swal.fire({
        icon: 'success',
        title: 'Usuário atualizado com sucesso!',
        confirmButtonText: 'OK',
      }).then(() => {
        setNewUser({
          name: newUser.name || '',
          email: newUser.email || '',
          password: '', 
          passwordConfirmation: '',
          role: newUser.role || 'USER'
        });
        setOldUser(newUser);
        setModifiedValues({});
        setValidationErrors({});
      });
    } catch (error) {
  
      Swal.fire({
        icon: 'error',
        title: 'Ocorreu um erro ao atualizar o usuário.',
        text: 'Verifique os dados e tente novamente.',
      });
    }
  };

  const hasErrors = Object.values(validationErrors).some(error => error);
  const hasNoChanges = Object.keys(modifiedValues).length === 0;
  const disableSubmit = hasErrors || hasNoChanges;
  
  return (
    <Container>
      <Stack direction="column" alignItems="start" gap={2} mb={5}>
        <Link to={'/usuarios'}>
          <Button
            variant="text"
            color="common"
            startIcon={<Iconify icon="eva:corner-up-left-outline" />}
          >
            Voltar
          </Button>
        </Link>

        <Typography variant="h4">Editando usuário: {oldUser.name}</Typography>
      </Stack>

      <Card>
        <form onSubmit={handleUpdate} ref={formRef}>
          <CardContent>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <Input
                  name="name"
                  label="Nome"
                  value={newUser.name || ""}
                  onChange={handleInputChange}
                  validations={validationSchema.name}
                  onValidationChange={handleValidationChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Input
                  name="email"
                  label="Email"
                  value={newUser.email || ""}
                  onChange={handleInputChange}
                  validations={validationSchema.email}
                  onValidationChange={handleValidationChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Input
                  type="password"
                  name="password"
                  label="Nova senha (opcional)"
                  value={newUser.password || ""}
                  onChange={handleInputChange}
                  validations={validationSchema.password}
                  onValidationChange={handleValidationChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Input
                  type="password"
                  name="passwordConfirmation"
                  label="Confirme a senha (opcional)"
                  value={newUser.passwordConfirmation || ""}
                  onChange={handleInputChange}
                  validations={validationSchema.passwordConfirmation}
                  onValidationChange={handleValidationChange}
                  formValues={newUser}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Input
                  type="select"
                  name="role"
                  label="Função"
                  value={newUser.role || ""}
                  onChange={handleInputChange}
                  options={[
                    { value: 'USER', label: 'Usuário' },
                    { value: 'ADMIN', label: 'Administrador' },
                    { value: 'SUPER_ADMIN', label: 'Super Administrador' },
                  ]}
                  validations={validationSchema.role}
                  onValidationChange={handleValidationChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Button variant="contained" type="submit" disabled={disableSubmit}>
                  Salvar Alterações
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </form>
      </Card>
    </Container>
  );
}