CORS = Cross-Origin Resource Sharing (Compartir recursos entre diferentes orígenes)
Por defecto, los navegadores BLOQUEAN peticiones entre diferentes dominios por seguridad.

El problema sin CORS:
Frontend: https://lingobridge.es
Backend:  https://kind-inspiration-production-xxxx.up.railway.app

Navegador: "¡PROHIBIDO! Son dominios diferentes"

********************************************************

Para mandar correo de confirmacion a la hora de registrarse:
Definir las variables de entorno en tu entorno local:
En terminal (entes de arrancar la app):

export MAIL_USERNAME=tu_correo@gmail.com
export MAIL_PASSWORD=contraseña_de_aplicacion_generada