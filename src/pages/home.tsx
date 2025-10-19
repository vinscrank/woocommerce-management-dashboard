import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box, Divider, Typography, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { navData } from 'src/layouts/config-nav-dashboard';
import { OverviewAnalyticsView } from 'src/sections/overview/view';
import { useAuth } from 'src/auth/AuthContext';

// ----------------------------------------------------------------------

export default function Page() {
  const [note, setNote] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Carica le note dal localStorage all'avvio
    const savedNote = localStorage.getItem('userNotes');
    if (savedNote) {
      setNote(savedNote);
    }
  }, []);

  const handleNoteChange = (content: string) => {
    setNote(content);
    // Salva le note nel localStorage
    localStorage.setItem('userNotes', content);
  };

  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title> {`Dashboard - ${CONFIG.appName}`}</title>
        {/* <meta
          name="description"
          content=""
        />
        <meta name="keywords" content="react,material,kit,application,dashboard,admin,template" /> */}
      </Helmet>

      <Box sx={{ mt: 4, mx: 3 }}>
        <Typography variant="h4">
          Ciao, benvenuto {user?.name}👋
        </Typography>

        <Grid container spacing={2} sx={{ mt: 3, mb: 4 }}>
          {navData
            .filter((item) => item.title !== 'Dashboard')
            .map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item.path}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: '90px',
                    py: 2,
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    backgroundColor: 'rgba(145, 158, 171, 0.08)',
                    '&:hover': {
                      backgroundColor: 'rgba(145, 158, 171, 0.16)',
                    },
                  }}
                >
                  {item.title}
                </Button>
              </Grid>
            ))}
        </Grid>

        <Typography variant="h5" sx={{ mt: 2, mb: 2 }}>
          Note rapide
        </Typography>
        <ReactQuill
          value={note}
          onChange={handleNoteChange}
          theme="snow"
          style={{ height: '400px', marginBottom: '50px', borderRadius: '10px', }}
        />
      </Box>
      <Divider sx={{ mb: 4 }} />

      {/* <OverviewAnalyticsView /> */}

    </>
  );
}
