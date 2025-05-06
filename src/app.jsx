import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { ptBR } from 'date-fns/locale';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
        <Router />
      </LocalizationProvider>
    </ThemeProvider>
  );
}
