import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { postData } from 'src/utils/api';

import { bgGradient } from 'src/theme/css';

import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function QRCodeReaderView() {
  const theme = useTheme();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      if(email !== "" && password !== ""){
        const body = { email, password };
        const response = await postData("login", body);
        localStorage.setItem('token', response.token);
        router.push("/dashboard");
      }
      else{
        alert("Preencha seu e-mail e senha!");
      }
    } catch (error) {
      alert("Credenciais inválidas!");
    }
  };

  const renderForm = (
    <form onSubmit={handleClick}>
      <Stack spacing={3} paddingTop={4}>
        <TextField name="email" label="E-mail" value={email} onChange={(e) => {setEmail(e.target.value)}} />

        <TextField
          name="password"
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          value={password}
          onChange={(e) => {setPassword(e.target.value)}}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        {/* <Link variant="subtitle2" underline="hover">
          Esqueceu a senha?
        </Link> */}
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="inherit"
        onClick={handleClick}
      >
        Entrar
      </LoadingButton>
    </form>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: { xs: 'auto', md: 1 }, justifyContent: { xs: 'start', md: 'center' } }}
      >
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Logo
            sx={{
              mb: 3,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
            }}
          />
          <Typography variant="h4" mb={2} textAlign="center">
            LEITOR DE QRCODE
          </Typography>

          <p style={{ textAlign: 'center', maxWidth: 300, margin: 'auto' }}>
            Abaixo, você pode fazer o login no sistema utilizando seu QRCode.
          </p>
        </Card>
      </Stack>
    </Box>
  );
}
