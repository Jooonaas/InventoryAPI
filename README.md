Bei diesem Projekt handelt es sich um eine einfache InventoryAPI, welche für die Benutzung eines Rage:MP Projektes / Server verwendet werden darf.
Dabei darf der Code auf jede Art und Weise verändert und vervielfälltigt werden.

Weitere Erklärungen sind im SourceCode zu finden

Installation:

1. Solltest du noch kein NodeJS Projekt besitzen: npm init
2. Nur wenn 1 der Fall war: Jegliche Werte Eintragen

3. npm install --save https://github.com/Jooonaas/InventoryAPI.git#master

Beispiel:

import 'inventory-api'                      #Zwingend erforderlich, um die API zu importieren

let inventory: Inventory = new Inventory('beispiel', 'player')

inventory.addItem('beispiel_item', { amount: 1 } )