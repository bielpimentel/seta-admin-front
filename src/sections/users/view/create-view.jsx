import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Grid, CardContent } from '@mui/material';

import { postData } from 'src/utils/api';
import Iconify from 'src/components/iconify';
import Input from 'src/components/input/input';

export default function CreateUserView() {
  const [newRegister, setNewRegister] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    role: 'USER',
  });
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();
  const formRef = useRef();

  const validationSchema = {
    name: ['required'],
    email: ['required', 'email'],
    password: ['required'],
    passwordConfirmation: ['required', 'matchPassword'],
    role: ['required'],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRegister((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password') {
      setNewRegister((prev) => ({
        ...prev,
        passwordConfirmation: '',
      }));
    }
  };

  const handleValidationChange = (inputName, hasError) => {
    setValidationErrors((prev) => ({
      ...prev,
      [inputName]: hasError,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
  
    const endpoint = `users`;
    const body = newRegister;
  
    try {
      await postData(endpoint, body);
  
      Swal.fire({
        icon: 'success',
        title: 'Usuário cadastrado com sucesso!',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/usuarios');
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao cadastrar o usuário.',
        text: 'Verifique os dados e tente novamente.',
      });
    }
  };
  
  const emptyFields = Object.values(newRegister).some(value => value === '');
  const hasErrors = Object.values(validationErrors).some(error => error);
  const disableSubmit = hasErrors || emptyFields;

  return (
    <Container>
      <Stack direction="column" alignItems="start" gap={2} mb={5}>
        <Link to={`/usuarios`}>
          <Button
            variant="text"
            color="common"
            startIcon={<Iconify icon="eva:corner-up-left-outline" />}
          >
            Voltar
          </Button>
        </Link>

        <Typography variant="h4">Cadastrar usuário</Typography>
      </Stack>

      <Card>
        <form onSubmit={handleCreate} ref={formRef}>
          <CardContent>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <Input
                  name="name"
                  label="Nome"
                  value={newRegister.name}
                  onChange={handleInputChange}
                  validations={validationSchema.name}
                  onValidationChange={handleValidationChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Input
                  name="email"
                  label="Email"
                  value={newRegister.email}
                  onChange={handleInputChange}
                  validations={validationSchema.email}
                  onValidationChange={handleValidationChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Input
                  type="password"
                  name="password"
                  label="Senha"
                  value={newRegister.password}
                  onChange={handleInputChange}
                  validations={validationSchema.password}
                  onValidationChange={handleValidationChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Input
                  type="password"
                  name="passwordConfirmation"
                  label="Confirme a senha"
                  value={newRegister.passwordConfirmation}
                  onChange={handleInputChange}
                  validations={validationSchema.passwordConfirmation}
                  onValidationChange={handleValidationChange}
                  formValues={newRegister}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Input
                  type="select"
                  name="role"
                  label="Função"
                  value={newRegister.role}
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
                  Confirmar Cadastro
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </form>
      </Card>
    </Container>
  );
}