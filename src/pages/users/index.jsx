import { Helmet } from 'react-helmet-async';

import UsersView from 'src/sections/users/view/view';

// ----------------------------------------------------------------------

export default function UsersPage() {
  return (
    <>
      <Helmet>
        <title>Usuários | SETA </title>
      </Helmet>

      <UsersView />
    </>
  );
}
