# Carpeta del instalador - Rockasus

Pega aquí **un único archivo** instalador (ej: `Rockasus-Setup-1.0.0.exe`, `.msi`, `.dmg`, `.AppImage`, `.zip`).

- La web lo detectará automáticamente.
- El botón "Descargar Rockasus" en `/#descargar` apuntará a `/api/download` que redirige a este archivo.
- Si no hay archivo, el botón mostrará "Próximamente" y el endpoint devolverá 404.
- No borres este README ni el `.gitkeep`. Solo añade 1 archivo.

Ejemplo:
```
public/installer/Rockasus-Setup.exe
```
Luego el link será: `https://tu-dominio.com/installer/Rockasus-Setup.exe` (vía `/api/download`)
