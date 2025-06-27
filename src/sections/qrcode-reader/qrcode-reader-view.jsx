import { useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';

import { alpha, useTheme } from '@mui/material/styles';

import { Html5Qrcode } from 'html5-qrcode';

import { postData } from 'src/utils/api';
import { bgGradient } from 'src/theme/css';
import Logo from 'src/components/logo';

export default function QRCodeReaderView() {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'success' | 'error'
  const [userName, setUserName] = useState('');
  const [accessType, setAccessType] = useState('');

  const scannerRef = useRef(null);
  const isHandlingRef = useRef(false);
  const lastTokenRef = useRef('');
  const lastScanTimeRef = useRef(0);

  const MIN_TIME_BETWEEN_SCANS = 2000; // 2 segundos

  const startScanner = async () => {
    const config = { fps: 20, qrbox: { width: 250, height: 250 } };

    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        config,
        async (decodedText) => {
          const now = Date.now();

          if (isHandlingRef.current) return;
          if (decodedText === lastTokenRef.current) return;
          if (now - lastScanTimeRef.current < MIN_TIME_BETWEEN_SCANS) return;

          isHandlingRef.current = true;
          lastTokenRef.current = decodedText;
          lastScanTimeRef.current = now;
          setLoading(true);

          try {
            const response = await postData("qrcode/read", { token: decodedText });
            setUserName(response.user?.name || 'Usuário');
            setAccessType(response.type || 'ENTRADA');
            setModalType('success');
          } catch (error) {
            setModalType('error');
          } finally {
            await scannerRef.current.stop();

            setModalOpen(true);

            setTimeout(() => {
              setModalOpen(false);
              setModalType('');
              setUserName('');
              setAccessType('');
              isHandlingRef.current = false;
              lastTokenRef.current = '';
              setLoading(false);
              startScanner();
            }, 5000);
          }
        }
      );
    } catch (err) {
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

  const renderScannerView = (
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

        <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((pos) => {
            const styleMap = {
              'top-left': { top: 6, left: 50, borderTop: '7px solid #00e55b', borderLeft: '7px solid #00e55b', borderRadius: '10px 2px 0 2px' },
              'top-right': { top: 6, right: 50, borderTop: '7px solid #00e55b', borderRight: '7px solid #00e55b', borderRadius: '2px 10px 2px 0' },
              'bottom-left': { bottom: 6, left: 50, borderBottom: '7px solid #00e55b', borderLeft: '7px solid #00e55b', borderRadius: '2px 0 2px 10px' },
              'bottom-right': { bottom: 6, right: 50, borderBottom: '7px solid #00e55b', borderRight: '7px solid #00e55b', borderRadius: '0 2px 10px 2px' },
            };
            return (
              <Box key={pos} sx={{ position: 'absolute', width: 40, height: 40, ...styleMap[pos] }} />
            );
          })}
        </Box>
      </Box>

      {loading && (
        <Stack alignItems="center" sx={{ mb: 2 }}>
          <CircularProgress size={24} />
        </Stack>
      )}
    </Card>
  );

  const renderModalContent = (
    <Card
      sx={{
        p: 5,
        width: 1,
        maxWidth: 420,
        bgcolor: modalType === 'success' ? '#00C853' : '#FF3D00',
        color: '#fff',
        textAlign: 'center',
        borderRadius: 3,
      }}
    >
      <Logo sx={{ mb: 5, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }} />

      {modalType === 'success' ? (
        <>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {accessType === 'ENTRADA' ? 'ENTRADA REGISTRADA' : 'SAÍDA REGISTRADA'}
          </Typography>
          <Typography variant="subtitle1" mt={8} fontWeight="bold">
            USUÁRIO
          </Typography>
          <Typography variant="body1">{userName}</Typography>
        </>
      ) : (
        <>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            QRCODE INVÁLIDO
          </Typography>
          <Typography variant="body1" mt={5}>
            Contate o suporte
          </Typography>
        </>
      )}
    </Card>
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
        sx={{ height: { xs: 'auto', md: 1 }, justifyContent: { xs: 'start', md: 'center' }, p: 2 }}
      >
        {renderScannerView}

        <Modal
          open={modalOpen}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={modalOpen}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                outline: 'none',
              }}
            >
              {renderModalContent}
            </Box>
          </Fade>
        </Modal>
      </Stack>
    </Box>
  );
}