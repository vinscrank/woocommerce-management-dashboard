import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import {  AttributiView } from 'src/sections/attributi/view/attributo-view';

// ----------------------------------------------------------------------

export default function AttributiPage() {
  return (
    <>
      <Helmet>
        <title> {`Blog - ${CONFIG.appName}`}</title>
      </Helmet>

      <AttributiView />
    </>
  );
}
