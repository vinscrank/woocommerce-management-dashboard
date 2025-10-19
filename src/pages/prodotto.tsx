import { Box } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { ProdottoView } from 'src/sections/prodotto/view/prodotto-view';

// ----------------------------------------------------------------------

export default function ProdottoPage() {
    const { id } = useParams();


    return (
        <>
            <Helmet>
                <title> {`Prodotti - ${CONFIG.appName}`}</title>
            </Helmet>

            <ProdottoView id={id as string} />

        </>
    );
}
