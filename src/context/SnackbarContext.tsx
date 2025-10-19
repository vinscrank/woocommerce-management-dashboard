import { createContext, useContext, useState, ReactNode } from 'react';

type MessageType = {
    text: string;
    type: 'success' | 'error';
};

type SnackbarContextType = {
    showMessage: (message: MessageType) => void;
    message: MessageType | null;
    clearMessage: () => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
    const [message, setMessage] = useState<MessageType | null>(null);

    const showMessage = (newMessage: MessageType) => {
        setMessage(newMessage);
    };

    const clearMessage = () => {
        setMessage(null);
    };

    return (
        <SnackbarContext.Provider value={{ showMessage, message, clearMessage }}>
            {children}
        </SnackbarContext.Provider>
    );
};

export const useSnackbar = () => {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error('useSnackbar deve essere usato all\'interno di SnackbarProvider');
    }
    return context;
}; 