import { Helmet } from 'react-helmet-async';

import AccessLogsView from 'src/sections/logs/view/view';

// ----------------------------------------------------------------------

export default function AccessLogsPage() {
  return (
    <>
      <Helmet>
        <title>Logs de Acesso | SETA </title>
      </Helmet>

      <AccessLogsView />
    </>
  );
}
