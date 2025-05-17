import { Helmet } from 'react-helmet-async';

import { QRCodeReaderView } from 'src/sections/qrcode-reader';

// ----------------------------------------------------------------------

export default function QRCodeReaderPage() {
  return (
    <>
      <Helmet>
        <title> Leitor | SETA </title>
      </Helmet>

      <QRCodeReaderView />
    </>
  );
}
