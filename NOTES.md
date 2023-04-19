# Twitch Délires

Un jeu créé par Ambroise Garel diffusé sur [la chaîne Twitch de Canard PC](https://www.twitch.tv/canardpc).

Ce site a été créé par [Yves Gurcan](https://yvesgurcan.com). Envoyez-lui un message sur [Twitter](https://twitter.com/YvesGurcanFR) ou [LinkedIn](https://www.linkedin.com/in/yvesgurcan/).

[Retour](/README.md)

## Scripts

    node ./scripts/json_to_md.js

Génère des fichiers Markdown à partir de fichiers JSON situés dans le dossier `/json`.

Le nom des fichiers JSON doit suivre la convention suivante : `YYYY-MM.json` où `YYYY` correspond à l'année et `MM` correspond au mois.

Le contenu des fichiers JSON doit être formatté de la manière suivante:

```
[
    {
        "PlayerName": "abcdef",
        "Score": 123456
    },
    {
        "PlayerName": "ghijkl",
        "Score": 789012
    }
]
```
