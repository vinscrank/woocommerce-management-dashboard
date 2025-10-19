import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

import { NavUpgrade } from '../components/nav-upgrade';
import { WorkspacesPopover } from '../components/workspaces-popover';

import type { WorkspacesPopoverProps } from '../components/workspaces-popover';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: {
    path: string;
    title: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
  }[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  workspaces: WorkspacesPopoverProps['data'];
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  workspaces,
  layoutQuery,
  isCollapsed,
  onCollapse,
}: NavContentProps & {
  layoutQuery: Breakpoint;
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: isCollapsed
          ? 'var(--layout-nav-collapsed-width, 88px)'
          : 'var(--layout-nav-vertical-width)',
        transition: theme.transitions.create('width', {
          duration: theme.transitions.duration.shorter,
        }),
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent
        data={data}
        slots={slots}
        workspaces={workspaces}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => onCollapse(!isCollapsed)}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
  workspaces,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({
  data,
  slots,
  workspaces,
  sx,
  isCollapsed,
  onToggleCollapse,
}: NavContentProps & {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
        }}
      >
        {!isCollapsed && <Logo />}

        {onToggleCollapse && (
          <IconButton onClick={onToggleCollapse}>
            {isCollapsed ? (
              <Iconify icon="material-symbols:chevron-right" />
            ) : (
              <Iconify icon="material-symbols:chevron-left" />
            )}
          </IconButton>
        )}
      </Box>

      {slots?.topArea}

      <WorkspacesPopover
        data={workspaces}
        isCollapsed={isCollapsed || false}
        sx={{
          my: 2,
          ...(isCollapsed && {
            width: 40,
            mx: 'auto',
            '& .MuiButton-root': {
              minWidth: 40,
              padding: 0,
              justifyContent: 'center',
            },
          }),
        }}
      />

      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
            {data.map((item) => {
              const isActived = item.path === pathname;

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <ListItemButton
                    disableGutters
                    component={RouterLink}
                    href={item.path}
                    sx={{
                      pl: 2,
                      py: 1,
                      gap: 2,
                      pr: 1.5,
                      borderRadius: 0.75,
                      typography: 'body2',
                      fontWeight: 'fontWeightMedium',
                      color: 'var(--layout-nav-item-color)',
                      minHeight: 'var(--layout-nav-item-height)',
                      ...(isCollapsed && {
                        px: 0.5,
                        justifyContent: 'center',
                      }),
                      ...(isActived && {
                        fontWeight: 'fontWeightSemiBold',
                        bgcolor: 'var(--layout-nav-item-active-bg)',
                        color: 'var(--layout-nav-item-active-color)',
                        '&:hover': {
                          bgcolor: 'var(--layout-nav-item-hover-bg)',
                        },
                      }),
                    }}
                  >
                    <Box component="span" sx={{ width: 24, height: 24 }}>
                      {item.icon}
                    </Box>

                    {!isCollapsed && (
                      <>
                        <Box component="span" flexGrow={1}>
                          {item.title}
                        </Box>

                        {item.info && item.info}
                      </>
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {!isCollapsed && slots?.bottomArea}

      {/* <NavUpgrade /> */}
    </>
  );
}
