import { Helmet } from 'react-helmet-async';

import MailExtensionCreateView from 'src/sections/mail-extensions/view/create-view';

// ----------------------------------------------------------------------

export default function MailExtensionCreatePage() {
  return (
    <>
      <Helmet>
        <title>Novo E-mail | SETA </title>
      </Helmet>

      <MailExtensionCreateView />
    </>
  );
}
