import { Helmet } from 'react-helmet-async';

import PendingRegistersView from 'src/sections/pending-registers/view/view';

// ----------------------------------------------------------------------

export default function PendingRegistersPage() {
  return (
    <>
      <Helmet>
        <title>Cadastros Pendentes | SETA </title>
      </Helmet>

      <PendingRegistersView />
    </>
  );
}
