# Aula oberta · Estadística
Aplicació educativa en català per a 1r d’ESO, sense comptes ni dependències de paquets.

## Contingut
- Vuit blocs: variables, freqüències, mesures de centralització, mostres, gràfics, rang, lectura crítica i investigació responsable.
- Laboratori numèric i de categories amb quatre conjunts d’exemple, freqüències absolutes/relatives/acumulades, percentatges, gràfics de barres/sectors, càlculs explicats i exportació CSV.
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
