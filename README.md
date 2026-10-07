# Dades.cat · Estadística
Aplicació educativa en català per a 1r d’ESO, sense comptes ni dependències de paquets. Disseny juvenil amb colors violeta i verd llima, navegació adaptable i exemples contextualitzats a Catalunya: Sant Jordi a Vic, instituts de Girona i Lleida, castells a Tarragona i festes majors. Totes les dades dels exemples són fictícies per practicar.

## Contingut
- Vuit blocs: variables, freqüències, mesures de centralització, mostres, gràfics, rang, lectura crítica i investigació responsable.
- Laboratori numèric i de categories amb sis conjunts d’exemple, freqüències absolutes/relatives/acumulades, percentatges, gràfics de barres/sectors, càlculs explicats i exportació CSV.
- Quatre activitats autocorrectives, amb deu respostes en total.
- Banc de quinze preguntes: escalfament aleatori de cinc o repte complet, retorn explicatiu i pràctica dels errors.
- Projecte guiat amb sis apartats, desament i impressió/PDF des del navegador.
- Progrés, millor percentatge, projecte i conclusió desats només al navegador. Es poden esborrar des d’«El meu progrés».

## Executar
Des del repositori: `npm start` (requereix Python 3). Serveix l’aplicació al port 3000. Per validar els càlculs i l’entrada de dades: `npm test` (Node.js).

## Publicar
Compatible amb GitHub Pages i altres allotjaments estàtics. A Settings → Pages, selecciona Deploy from a branch, main i / (root). No cal cap procés de compilació.

## Validació
Sis proves automatitzades cobreixen càlculs, decimals, dades incorrectes, categories i CSV. S’ha comprovat amb Chromium la navegació, el laboratori, la representació segura de categories, les quatre activitats, el desament del projecte, les quinze preguntes, la revisió d’errors, el progrés i l’absència de desbordament horitzontal al mòbil.

La tipografia externa és opcional i té alternatives locals. No hi ha analítica ni enviament de dades d’alumnes. El contingut és una proposta didàctica per a 1r d’ESO i no una certificació de cobertura completa del currículum.

## Il·lustracions
La portada i les quatre escenes d’activitats utilitzen il·lustracions generades per a aquest projecte, desades a `assets/`. Representen situacions de Catalunya; no són fotografies documentals. La portada té text alternatiu i les escenes d’activitats tenen descripcions accessibles. Les imatges es carreguen des del mateix allotjament, sense serveis externs.

## Lliurament directe i resum
A «Envia les respostes», l’alumne indica el nom, escriu un resum i revisa les darreres respostes comprovades. El formulari les envia directament al servei de Google Apps Script, que les desa en un full privat del professorat i notifica a a8870408@xtec.cat. Cal activar el servei: segueix `google-apps-script/README.md` i configura l’URL a `submission-config.js`. Mentre no estigui configurada, el botó de lliurament està desactivat. No cal cap adjunt ni aplicació de correu. La recepció es confirma només a la pestanya del servei. Els treballs desats no es poden editar des de l’aplicació de l’alumne; no s’hi verifica la identitat ni la correcció de les dades enviades des del navegador.
