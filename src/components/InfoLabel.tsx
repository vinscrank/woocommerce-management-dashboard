import { Box, Typography } from '@mui/material';
import { alpha, SxProps } from '@mui/material/styles';

interface InfoLabelProps {
    title: string;
    subtitle?: string;
    color?: 'primary' | 'success' | 'error' | 'warning' | 'info';
    children?: React.ReactNode;
    sx?:   SxProps;
}

export function InfoLabel({ title, subtitle, color = 'primary', children, sx }: InfoLabelProps) {
    const getColorValues = (colorName: string) => {
        const colors = {
            primary: '#1976d2',
            success: '#2e7d32',
            error: '#d32f2f',
            warning: '#ed6c02',
            info: '#0288d1'
        };
        return colors[colorName as keyof typeof colors];
    };

    const baseColor = getColorValues(color);

    return (
        <Box sx={{
            p: 1.5,
            borderRadius: 1,
            background: `linear-gradient(135deg, ${alpha(baseColor, 0.05)}, ${alpha(baseColor, 0.1)})`,
            border: `1px solid ${alpha(baseColor, 0.2)}`,
            ...sx
        }}>
            <Typography variant="body2" color={`${color}.main`} sx={{ fontWeight: 500 }}>
                {title}
            </Typography>
            {subtitle && (
                <Typography variant="caption" color="text.secondary">
                    {subtitle}
                </Typography>
            )}
            {children}
        </Box>
    );
} 