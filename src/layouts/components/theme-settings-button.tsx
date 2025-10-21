import { useState } from 'react';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  Slider,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  Tooltip,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import {
  useThemeCustomization,
  PRESET_COLORS,
  type ThemeCustomization,
} from 'src/context/ThemeCustomizationContext';

export function ThemeSettingsButton() {
  const [open, setOpen] = useState(false);
  const { customization, updateCustomization, resetCustomization } = useThemeCustomization();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleReset = () => {
    if (window.confirm('Vuoi ripristinare tutte le impostazioni predefinite?')) {
      resetCustomization();
    }
  };

  return (
    <>
      <Tooltip title="Personalizza interfaccia">
        <IconButton onClick={handleOpen} size="large">
          <Iconify icon="solar:palette-bold-duotone" width={24} />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <Iconify icon="solar:palette-bold-duotone" width={28} />
              <Typography variant="h5">Personalizza Interfaccia</Typography>
            </Box>
            <IconButton onClick={handleClose}>
              <Iconify icon="mingcute:close-line" />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={4}>
            {/* Modalità Tema */}
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Modalità Tema
              </Typography>
              <Box
                display="flex"
                gap={2}
                sx={{
                  mt: 2,
                }}
              >
                <Paper
                  onClick={() => updateCustomization({ mode: 'light' })}
                  sx={{
                    flex: 1,
                    p: 2,
                    cursor: 'pointer',
                    border: 2,
                    borderColor: customization.mode === 'light' ? 'primary.main' : 'transparent',
                    '&:hover': {
                      borderColor: 'primary.light',
                    },
                  }}
                >
                  <Box textAlign="center">
                    <Iconify icon="solar:sun-bold-duotone" width={40} />
                    <Typography variant="body2" mt={1}>
                      Chiaro
                    </Typography>
                  </Box>
                </Paper>

                <Paper
                  onClick={() => updateCustomization({ mode: 'dark' })}
                  sx={{
                    flex: 1,
                    p: 2,
                    cursor: 'pointer',
                    border: 2,
                    borderColor: customization.mode === 'dark' ? 'primary.main' : 'transparent',
                    bgcolor: customization.mode === 'dark' ? 'grey.900' : 'background.paper',
                    '&:hover': {
                      borderColor: 'primary.light',
                    },
                  }}
                >
                  <Box textAlign="center">
                    <Iconify icon="solar:moon-bold-duotone" width={40} />
                    <Typography variant="body2" mt={1}>
                      Scuro
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Box>

            <Divider />

            {/* Colore Primario */}
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Colore Primario
              </Typography>
              <Grid container spacing={1.5} sx={{ mt: 1 }}>
                {(Object.keys(PRESET_COLORS) as Array<keyof typeof PRESET_COLORS>).map(
                  (colorKey) => {
                    const color = PRESET_COLORS[colorKey];
                    return (
                      <Grid item key={colorKey}>
                        <Tooltip title={color.name}>
                          <Box
                            onClick={() => updateCustomization({ primaryColor: colorKey })}
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              bgcolor: color.main,
                              cursor: 'pointer',
                              border: 3,
                              borderColor:
                                customization.primaryColor === colorKey
                                  ? 'text.primary'
                                  : 'transparent',
                              transition: 'all 0.2s',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                boxShadow: 3,
                              },
                            }}
                          />
                        </Tooltip>
                      </Grid>
                    );
                  }
                )}
              </Grid>
            </Box>

            <Divider />

            {/* Colore Secondario */}
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Colore Secondario
              </Typography>
              <Grid container spacing={1.5} sx={{ mt: 1 }}>
                {(Object.keys(PRESET_COLORS) as Array<keyof typeof PRESET_COLORS>).map(
                  (colorKey) => {
                    const color = PRESET_COLORS[colorKey];
                    return (
                      <Grid item key={colorKey}>
                        <Tooltip title={color.name}>
                          <Box
                            onClick={() => updateCustomization({ secondaryColor: colorKey })}
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              bgcolor: color.main,
                              cursor: 'pointer',
                              border: 3,
                              borderColor:
                                customization.secondaryColor === colorKey
                                  ? 'text.primary'
                                  : 'transparent',
                              transition: 'all 0.2s',
                              '&:hover': {
                                transform: 'scale(1.1)',
                                boxShadow: 3,
                              },
                            }}
                          />
                        </Tooltip>
                      </Grid>
                    );
                  }
                )}
              </Grid>
            </Box>

            <Divider />

            {/* Border Radius */}
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                Arrotondamento Bordi: {customization.borderRadius}px
              </Typography>
              <Slider
                value={customization.borderRadius}
                onChange={(_, value) => updateCustomization({ borderRadius: value as number })}
                min={0}
                max={24}
                step={2}
                marks={[
                  { value: 0, label: '0' },
                  { value: 8, label: '8' },
                  { value: 16, label: '16' },
                  { value: 24, label: '24' },
                ]}
                sx={{ mt: 2 }}
              />
            </Box>

            <Divider />

            {/* Modalità Compatta */}
            <Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={customization.compactMode}
                    onChange={(e) => updateCustomization({ compactMode: e.target.checked })}
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Modalità Compatta
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Riduci spaziature e padding per visualizzare più contenuti
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Divider />

            {/* Pulsanti Azione */}
            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button variant="outlined" color="error" onClick={handleReset}>
                Ripristina Predefinite
              </Button>
              <Button variant="contained" onClick={handleClose}>
                Chiudi
              </Button>
            </Box>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
