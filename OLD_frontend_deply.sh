
#!/bin/bash

SOURCE="/home/lskjcgpa/mars-frontend/dist"  # Percorso della cartella build di React
DESTINATION="/home/lskjcgpa/public_html/dist"  # Modifica con il percorso corretto

# Controlla se la cartella di destinazione esiste
if [ -d "$DESTINATION" ]; then
  echo "La cartella di destinazione esiste, sovrascrivo i file..."
else
  echo "La cartella di destinazione non esiste, la creo..."
  mkdir -p "$DESTINATION"
fi

# Copia i file sovrascrivendo quelli esistenti
cp -r "$SOURCE"/* "$DESTINATION"/

echo "Operazione completata!"