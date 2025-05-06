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

export default function MailExtensionEditView() {
  const { id } = useParams();

  const [oldExtension, setOldExtension] = useState({});
  const [newExtension, setNewExtension] = useState({ mailExtension: '' });
  const [validationErrors, setValidationErrors] = useState({});
  const [hasNoChanges, setHasNoChanges] = useState(true);

  const formRef = useRef();

  const validationSchema = {
    mailExtension: ['required', 'mailExtension'],
  };

  const getExtension = useCallback(async () => {
    try {
      const extension = await fetchData(`mail-extensions/${id}`);
      setOldExtension(extension);
      setNewExtension({ mailExtension: extension.mailExtension || '' });
    } catch (error) {
      console.error('Erro ao buscar extensão de e-mail:', error);
    }
  }, [id]);

  useEffect(() => {
    getExtension();
  }, [getExtension]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExtension((prev) => ({
      ...prev,
      [name]: value,
    }));

    setHasNoChanges(value === oldExtension[name]);
  };

  const handleValidationChange = (inputName, hasError) => {
    setValidationErrors((prev) => ({
      ...prev,
      [inputName]: hasError,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateData(`mail-extensions/${id}`, newExtension);
      Swal.fire({
        icon: 'success',
        title: 'Extensão de e-mail atualizada com sucesso!',
        confirmButtonText: 'OK',
      }).then(() => {
        setOldExtension(newExtension);
        setHasNoChanges(true);
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao atualizar a extensão de e-mail.',
        text: 'Verifique os dados e tente novamente.',
      });
    }
  };
  
  const disableSubmit = Object.values(validationErrors).some(error => error) || hasNoChanges;

  return (
    <Container>
      <Stack direction="column" alignItems="start" gap={2} mb={5}>
        <Link to={'/emails-permitidos'}>
          <Button
            variant="text"
            color="common"
            startIcon={<Iconify icon="eva:corner-up-left-outline" />}
          >
            Voltar
          </Button>
        </Link>

        <Typography variant="h4">
          Editando: {oldExtension.mailExtension}
        </Typography>
      </Stack>

      <Card>
        <form onSubmit={handleUpdate} ref={formRef}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Input
                  name="mailExtension"
                  label="Extensão de e-mail"
                  value={newExtension.mailExtension || ""}
                  onChange={handleInputChange}
                  validations={validationSchema.mailExtension}
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