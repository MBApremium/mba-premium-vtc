# MBA Premium — App VTC

## Déployer gratuitement sur Vercel (recommandé)

1. Créez un compte sur https://vercel.com (gratuit, avec votre email ou GitHub)
2. Créez un compte sur https://github.com si vous n'en avez pas
3. Sur GitHub, créez un nouveau dépôt (repository), par exemple "mba-premium-vtc"
4. Uploadez tous les fichiers de ce dossier dans ce dépôt (bouton "Add file" → "Upload files" sur GitHub, glissez-déposez tout)
5. Sur Vercel, cliquez "Add New" → "Project", puis "Import" votre dépôt GitHub "mba-premium-vtc"
6. Laissez les réglages par défaut (Vercel détecte Vite automatiquement) et cliquez "Deploy"
7. Après 1-2 minutes, Vercel vous donne une vraie URL publique (ex: mba-premium-vtc.vercel.app)

Sur ce vrai site, l'envoi d'email avec EmailJS fonctionnera normalement (l'aperçu du chat bloque les requêtes réseau externes, mais un site déployé n'a pas cette restriction).

## Développer en local (optionnel, si vous avez Node.js installé)

```
npm install
npm run dev
```
