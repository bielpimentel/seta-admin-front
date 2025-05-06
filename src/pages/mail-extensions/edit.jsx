import { Helmet } from 'react-helmet-async';

import MailExtensionEditView from 'src/sections/mail-extensions/view/edit-view';

// ----------------------------------------------------------------------

export default function MailExtensionEditPage() {
  return (
    <>
      <Helmet>
        <title>Editar E-mail | SETA </title>
      </Helmet>

      <MailExtensionEditView />
    </>
  );
}
