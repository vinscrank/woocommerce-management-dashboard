import type { ButtonBaseProps } from '@mui/material/ButtonBase';

import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import MenuList from '@mui/material/MenuList';
import ButtonBase from '@mui/material/ButtonBase';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { varAlpha } from 'src/theme/styles';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { useWorkspace } from 'src/context/WorkspaceContext';

// ----------------------------------------------------------------------

export type WorkspacesPopoverProps = ButtonBaseProps & {
  data?: {
    id: string;
    name: string;
    logo: React.ReactNode;
    plan: string;
    href: string;
  }[];
  isCollapsed: boolean;
};

export function WorkspacesPopover({
  data = [],
  sx,
  isCollapsed,
  ...other
}: WorkspacesPopoverProps) {
  const { selectedWorkspaceId, setSelectedWorkspaceId } = useWorkspace();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  // Seleziona automaticamente il primo workspace se non ce n'è uno selezionato
  useEffect(() => {
    if (data && data.length > 0 && !selectedWorkspaceId) {
      setSelectedWorkspaceId(data[0].id);
    }
  }, [data, selectedWorkspaceId, setSelectedWorkspaceId]);

  // Trova il workspace corrente dall'ID
  const selectedWorkspace = data.find((ws) => ws.id === selectedWorkspaceId) || data[0];

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleChangeWorkspace = useCallback(
    (workspaceId: string) => {
      setSelectedWorkspaceId(workspaceId);
      handleClosePopover();
    },
    [handleClosePopover, setSelectedWorkspaceId]
  );

  const renderAvatar = (alt: string, src: React.ReactNode, href: string) => (
    <Box
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ width: 24, height: 24, borderRadius: '50%' }}
    >
      {src}
    </Box>
  );

  const renderLabel = (plan: string, href: string) => (
    <ButtonBase
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ width: 24, height: 24, borderRadius: '50%' }}
    >
      {plan}
    </ButtonBase>
  );

  return (
    <>
      {!isCollapsed && (
        <ButtonBase
          disableRipple
          onClick={handleOpenPopover}
          sx={{
            pl: 2,
            py: 3,
            gap: 1.5,
            pr: 1.5,
            width: 1,
            borderRadius: 1.5,
            textAlign: 'left',
            justifyContent: 'flex-start',
            bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
            ...sx,
          }}
          {...other}
        >
          {renderAvatar(selectedWorkspace?.name, selectedWorkspace?.logo, selectedWorkspace?.href)}

          <Box
            gap={1}
            flexGrow={1}
            display="flex"
            alignItems="center"
            sx={{ typography: 'body2', fontWeight: 'fontWeightSemiBold' }}
          >
            {selectedWorkspace?.name}
          </Box>

          <Iconify width={16} icon="carbon:chevron-sort" sx={{ color: 'text.disabled' }} />
        </ButtonBase>
      )}

      <Popover open={!!openPopover} anchorEl={openPopover} onClose={handleClosePopover}>
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 260,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              p: 1.5,
              gap: 1.5,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: {
                bgcolor: 'action.selected',
                fontWeight: 'fontWeightSemiBold',
              },
            },
          }}
        >
          {data.map((option) => (
            <MenuItem
              key={option.id}
              selected={option.id === selectedWorkspaceId}
              onClick={() => handleChangeWorkspace(option.id)}
            >
              {renderAvatar(option.name, option.logo, option.href)}

              <Box component="span" sx={{ flexGrow: 1 }}>
                {option.name}
              </Box>

              {renderLabel(option.plan, option.href)}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  );
}
