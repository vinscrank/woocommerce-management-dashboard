import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';     
import SeoConfig from 'src/sections/SeoConfig';

// ----------------------------------------------------------------------

export default function SeoConfigPage() {
  return (
    <>
      <SeoConfig />
    </>
  );
}
