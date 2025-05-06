import { Helmet } from 'react-helmet-async';

import SupportsView from 'src/sections/supports/view/view';

// ----------------------------------------------------------------------

export default function SupportsPage() {
  return (
    <>
      <Helmet>
        <title>Suporte | SETA </title>
      </Helmet>

      <SupportsView />
    </>
  );
}
