import { Helmet } from 'react-helmet-async';

import MailExtensionsView from 'src/sections/mail-extensions/view/view';

// ----------------------------------------------------------------------

export default function MailExtensionsPage() {
  return (
    <>
      <Helmet>
        <title>E-mails Permitidos | SETA </title>
      </Helmet>

      <MailExtensionsView />
    </>
  );
}
