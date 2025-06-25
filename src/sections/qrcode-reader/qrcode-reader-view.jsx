import { useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

import { alpha, useTheme } from '@mui/material/styles';

import { Html5Qrcode } from 'html5-qrcode';

import { postData } from 'src/utils/api';
import { bgGradient } from 'src/theme/css';
import Logo from 'src/components/logo';

export default function QRCodeReaderView() {
  const theme = useTheme();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);

  const startScanner = async () => {
    const config = { fps: 20, qrbox: { width: 250, height: 250 } };

    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          if (!loading) {
            setLoading(true);
            setStatus('');

            try {
              const response = await postData("qrcode/read", { token: decodedText });
              setStatus(`QR Code lido com sucesso!`);
            } catch (error) {
              setStatus('Erro ao enviar o QR Code!');
            } finally {
              await scannerRef.current.stop();

              setTimeout(() => {
                startScanner();
                setStatus('');
              }, 5000);

              setLoading(false);
            }
          }
        }
      );
    } catch (err) {
      setStatus("Erro ao iniciar o leitor de QR Code.");
      console.error("Erro ao iniciar o leitor de QR Code:", err);
    }
  };

  useEffect(() => {
    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

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
        sx={{ height: { xs: 'auto', md: 1 }, justifyContent: { xs: 'start', md: 'center' }, p: 2 }}
      >
        <Card sx={{ p: 5, width: 1, maxWidth: 420 }}>
          <Logo sx={{ mb: 3, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }} />

          <Typography variant="h4" mb={2} textAlign="center">
            LEITOR DE QRCODE
          </Typography>

          <Typography variant="body2" textAlign="center" sx={{ mb: 2 }}>
            Aponte a câmera para o QR Code para continuar.
          </Typography>

          <Box
            id="qr-reader-container"
            sx={{
              position: 'relative',
              width: '100%',
              height: 250,
              borderRadius: 2.5,
              overflow: 'hidden',
              mb: 2,
            }}
          >
            <Box id="qr-reader" sx={{ width: '100%', height: '100%' }} />

            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
              }}
            >
              <Box sx={{
                position: 'absolute', top: 6, left: 50,
                width: 40, height: 40,
                borderTop: '7px solid #00e55b',
                borderLeft: '7px solid #00e55b',
                borderRadius: '10px 2px 0 2px',
              }} />

              <Box sx={{
                position: 'absolute', top: 6, right: 50,
                width: 40, height: 40,
                borderTop: '7px solid #00e55b',
                borderRight: '7px solid #00e55b',
                borderRadius: '2px 10px 2px 0',
              }} />

              <Box sx={{
                position: 'absolute', bottom: 6, left: 50,
                width: 40, height: 40,
                borderBottom: '7px solid #00e55b',
                borderLeft: '7px solid #00e55b',
                borderRadius: '2px 0 2px 10px',
              }} />

              <Box sx={{
                position: 'absolute', bottom: 6, right: 50,
                width: 40, height: 40,
                borderBottom: '7px solid #00e55b',
                borderRight: '7px solid #00e55b',
                borderRadius: '0 2px 10px 2px',
              }} />
            </Box>
          </Box>

          {loading && (
            <Stack alignItems="center" sx={{ mb: 2 }}>
              <CircularProgress size={24} />
            </Stack>
          )}

          {status && (
            <Alert severity={status.includes('sucesso') ? 'success' : 'error'}>
              {status}
            </Alert>
          )}
        </Card>
      </Stack>
    </Box>
  );
}