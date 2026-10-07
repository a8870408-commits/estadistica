# Dashboard privat del professorat
Aquest dashboard s’obre dins del full Google Sheets i no es publica a GitHub Pages. Només les persones amb accés al full poden consultar les dades. No publiquis aquest projecte com a aplicació web ni comparteixis el full amb l’alumnat.

1. A Google Drive, obre **Dades.cat · Lliuraments** (el full creat per `setup`).
2. Dins d’aquest full: **Extensions → Apps Script**. És un projecte nou vinculat al full; no substitueixis el projecte web que rep els lliuraments.
3. Copia el contingut de `teacher-dashboard/Code.gs` al fitxer `Code.gs` del nou projecte.
4. Prem **+ → HTML**, posa-hi el nom **Dashboard**, i copia-hi `Dashboard.html`.
5. Desa. Executa `openDashboard` des de l’editor i accepta els permisos si cal. Recarrega el full.
6. Al full apareixerà el menú **Dades.cat → Obre el dashboard**. No cal cap nova implementació ni URL pública.

Targetes amb nombre de lliuraments, noms diferents, treballs d’avui i notificacions pendents/fallides; gràfic dels darrers 7 dies; cerca per nom/resum i filtres per data/notificació; detall del treball. Les dates es mostren amb el fus horari de Catalunya. Prem Actualitza per consultar els nous lliuraments.

El dashboard és de consulta: no modifica els lliuraments ni envia correus. Els noms no verifiquen la identitat i no hi ha una llista de matrícula per calcular qui falta per lliurar. No mostra notes automàtiques perquè el servidor no verifica els resultats del navegador.

## Imprimir o desar en PDF
Prem **Imprimeix / PDF**. La impressió inclou els indicadors globals, el gràfic i la llista segons els filtres actuals. Si has obert el detall d’un treball, també s’hi inclou. Per desar un document, tria **Desa com a PDF** al diàleg del navegador. Per instal·lar aquesta actualització, substitueix el contingut de `Dashboard.html` al projecte vinculat al full, desa i tanca/reobre el dashboard. No cal actualitzar el projecte web de lliuraments.
