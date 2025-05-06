import { Helmet } from 'react-helmet-async';

import EditUserView from 'src/sections/users/view/edit-view';

// ----------------------------------------------------------------------

export default function UserEditPage() {
  return (
    <>
      <Helmet>
        <title>Editar Usuário | SETA </title>
      </Helmet>

      <EditUserView />
    </>
  );
}
