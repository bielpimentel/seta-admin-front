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

export default function MailExtensionCreateView() {
  const [newRegister, setNewRegister] = useState({ mailExtension: '' });
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();
  const formRef = useRef();

  const validationSchema = {
    mailExtension: ['required', 'mailExtension'],
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRegister((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleValidationChange = (inputName, hasError) => {
    setValidationErrors((prev) => ({
      ...prev,
      [inputName]: hasError,
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    const endpoint = `mail-extensions`;
    const body = newRegister;

    try {
      await postData(endpoint, body);

      Swal.fire({
        icon: 'success',
        title: 'Extensão de e-mail cadastrada com sucesso!',
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/emails-permitidos');
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao cadastrar extensão de e-mail.',
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
        <Link to={`/emails-permitidos`}>
          <Button
            variant="text"
            color="common"
            startIcon={<Iconify icon="eva:corner-up-left-outline" />}
          >
            Voltar
          </Button>
        </Link>

        <Typography variant="h4">Cadastrar nova extensão de e-mail</Typography>
      </Stack>

      <Card>
        <form onSubmit={handleCreate} ref={formRef}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Input
                  name="mailExtension"
                  label="E-mail"
                  value={newRegister.mailExtension}
                  onChange={handleInputChange}
                  validations={validationSchema.mailExtension}
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