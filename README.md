# Widget Jakartowns pour Web Appbuilder Developer Edition

![demo_widget_jakartowns_wab_light](https://user-images.githubusercontent.com/15694700/181111158-99e3a379-fbd9-4303-9d02-14ddbd0f3b43.gif)


ESRI ne permet malheureusement pas de simplement ajouter le widget Jakartowns dans une application construite avec la version en ligne intégrée de Web Appbuilder. Vous devez utiliser la version Developer pour installer le widget Jakartowns dans votre application.

Prérequis : 
- Être connecté à Jakartowns
- Une application construite avec Web Appbuilder Developer Edition disponible dans le contenu de votre portail d’organisation, dans laquelle vous souhaitez intégrer le widget Jakartowns.
- Avoir accès à votre dossier d'installation local de Web Appbuilder Developer Edition 


Pour intégrer le widget dans votre application WAB : 

Copier le dossier Jakartowns (à l’intérieur du dossier dézippé) dans le dossier contenant tous les widgets 2D : `~\VotreDossierArcGISWebAppBuilder\client\stemapp\widgets`. 

Puis redémarrez votre serveur local Node.js afin que le constructeur d’applications WAB tienne compte du changement dans votre dossier `~\client`. 

Une fois le constructeur d’application ouvert dans votre navigateur, dans l’onglet Widgets de la fenêtre, vous pouvez ajouter un nouveau widget dans un espace disponible. Jakartowns se trouve dans la liste des widgets. Ajoutez-le à votre application et sauvegardez celle-ci. 

Votre application intègre désormais le widget Jakartowns. Elle est disponible comme telle pour tous les utilisateurs qui y ont accès dans votre organisation ArcGIS Online.
