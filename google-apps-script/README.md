# Activar els lliuraments amb el compte XTEC

1. Entra a https://script.google.com amb el compte XTEC i crea un projecte.
2. Copia `Code.gs` a l’editor i desa.
3. Selecciona la funció `setup`, executa-la i autoritza l’accés a Sheets i l’enviament de correus. Es crea un full privat; l’enllaç apareix al registre d’execució. No el comparteixis amb l’alumnat.
4. A **Implementa → Implementació nova → Aplicació web**, executa com a **tu mateix** i permet l’accés als usuaris previstos. Si permets «Qualsevol», el formulari funciona sense iniciar sessió, però qualsevol persona que conegui l’URL pot lliurar un treball. La política XTEC pot impedir aquesta opció. En aquest cas, comprova l’accés amb un compte d’alumne del domini.
5. Copia l’URL que acaba en `/exec` i posa-la entre les cometes de `submissionEndpoint` a `submission-config.js`. Puja el canvi a GitHub. També pots enviar aquesta URL al xat perquè s’integri; no és una contrasenya.
6. Obre Dades.cat, completa una activitat, indica un nom de prova i un resum, i prem «Lliura les respostes». La pestanya del servei ha de confirmar el registre. Verifica la fila del full i la notificació a a8870408@xtec.cat.

No es fan peticions CORS: un formulari POST obre la confirmació del servei en una pestanya nova. El web inicial no afirma que s’hagi rebut el treball. Els intents repetits amb el mateix identificador no creen duplicats. La data és del servidor. Una còpia rebuda al full no es modifica des de l’aplicació de l’alumne, però un alumne pot modificar les dades abans de lliurar o usar un altre nom: això no és autenticació d’identitat ni una plataforma d’exàmens. Els resultats del navegador no són qualificacions verificades. Per verificar identitat cal afegir autenticació del domini amb una configuració compatible amb XTEC.

El servei usa les quotes del teu compte d’Apps Script i MailApp. Si falla el correu, el treball continua desat al full i s’indica a la confirmació. Evita publicar el full o dades personals al repositori. Esborra els lliuraments segons les normes del centre. Cada actualització de `Code.gs` requereix actualitzar la implementació.

## Dashboard de l’alumne
Actualitza Code.gs amb la nova versió i implementa una **Versió nova** mantenint la mateixa URL. L’aplicació pública inclou «El meu espai», amb identificadors desats al navegador i entrada manual. El servei mostra només el treball corresponent a l’identificador: respostes, correcció, resum, valoracions docents i feedback. L’alumne pot imprimir-lo. No és autenticació amb compte: l’URL és privada per possessió d’un identificador aleatori. No la comparteixis. Les dades registrades al navegador són intents de lliurament; el servei confirma si estan realment rebudes. No cal canviar el projecte del dashboard docent per aquesta actualització.
