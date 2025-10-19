import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { ProdottiView } from 'src/sections/prodotti/view/prodotti-view';

// ----------------------------------------------------------------------

export default function AttributiPage() {
  return (
    <>
      <Helmet>
        <title> {`Prodotti - ${CONFIG.appName}`}</title>
      </Helmet>

      <ProdottiView />
    </>
  );
}
