import { Helmet } from 'react-helmet-async';

import CreateUserView from 'src/sections/users/view/create-view';

// ----------------------------------------------------------------------

export default function UserCreatePage() {
  return (
    <>
      <Helmet>
        <title>Novo Usuário | SETA </title>
      </Helmet>

      <CreateUserView />
    </>
  );
}
