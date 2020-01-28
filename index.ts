/**
 * Einführung:
 * 
 * Ein Inventar besitzt einen 
 * - unqiue key (number), 
 * - einen Besitzer (string), 
 * - einen InventarTypen (string)
 * - Data String (json-string)
 * 
 * Der Data String speichert dann ein array, mit folgender Zuordnung:
 * 
 * Itemname (string) -> Item (json)
 * 
 * Das Item kann dann x-beliebige Eigenschaften, wie zum Beispiel Munition, Seriennummer usw. haben
 * 
 */

/**
 * Diese Klasse beinhaltet jegliche Funktionen, inklusive die mysql query syntax um jeweilgs die Inventare zu speichern
 * 
 * Die Klasse besitzt einen Konstruktor mit folgenden Eigenschaften
 * - table_name (string)
 * 
 * Der table_name ist nicht mehr als der name der verwendeten Tabelle in der Datenbank
 * 
 */
 export class InventoryAPI {
    table_name: string

    constructor(table_name: string) {
        if (table_name == undefined) table_name = 'tb_inventories'

        this.table_name = table_name
    }

    /**
     * Diese Methode gibt die Query wieder, mit welcher die Tabelle für die Inventare erstellt wird
     * 
     */
    getTableCreationQuery (): string {
        return `CREATE TABLE IF NOT EXISTS ${this.table_name} (id INT(20) AUTO_INCREMENT, owner VARCHAR(255) NOT NULL, type VARCHAR(100) NOT NULL DEFAULT 'player', data TEXT, PRIMARY KEY (id))`
    }

    /**
     * Diese Methode gibt die Query wieder, um ein Inventar neu in der Tabelle anzulegen
     * 
     * @param inventory meint das Inventar Objekt, von welchem der Inventar-Owner, type und data bezogen wird  
     * 
     */
    getInventoryInsertQuery (inventory: Inventory): string {
        if (inventory == undefined) throw 'Bitte gib ein Inventar an!'

        return `INSERT INTO ${this.table_name} (owner, type, data) VALUES ('${inventory.owner}', '${inventory.type}', '${inventory.data}')`
    }

    /**
     * Diese Methode gibt die Query wieder, um die data eines bereits bestehenden Inventars zu verändern
     * 
     * @param inventory meint das Inventar, von welchem die Data, der Owner und der Type des Inventars bezogen wird
     *  
     */
    getInventoryUpdateQuery (inventory: Inventory): string {
        if (inventory == undefined) throw 'Bitte gib ein Inventar an!'

        return `UPDATE ${this.table_name} SET data = '${inventory.data}' WHERE owner = '${inventory.owner}' AND type = '${inventory.type}'`
    }

    /**
     * Diese Methode gibt die Query wieder, um das ResultSet für ein Inventar zu erhalten
     * 
     * @param owner meint den Inhaber des zu erwartenden Inventares 
     * @param type meint den Type des Inventares
     * 
     */
    getInventoryLoadQuery (owner: string, type: string): string {
        return `SELECT * FROM ${this.table_name} WHERE owner = '${owner}' AND type = '${type}'`
    }

    /**
     * Diese Methode verarbeitet ein result_set zu einem Inventar Objekt
     * 
     * @param result_set meint das ResultSet, welches verarbeitet wird
     *  
     */
    getParsedInventory (result_set): Inventory {
        return new Inventory(result_set.owner, result_set.type, result_set.data)
    }
 }

 /**
  * Diese Klasse beinhaltet jegliche Funktionen und Eigenschaften eines Inventarres
  * 
  */
 export class Inventory {
     /* Inventar Inhaber */
    owner: string

    /* Inventar Type */
    type: string

    /* Inventar Data */
    data: string = '{}'

    /**
     * Konstruktor des Inventars, um die globalen Variables zu setzen
     * 
     * @param owner meint den Inventar Inhaber 
     * @param type  meint den Inventar type
     * @param data  meint den Inventar Strorage
     * 
     */
    constructor(owner: string, type: string, data?: string) {
        this.owner = owner
        this.type = type
    
        if (data) this.data = data
    }
    
    /**
     * Fügt ein neues Item zum Inventar hinzu
     * 
     * @param item_name der name des Items
     * @param item_data der properties des Items
     * 
     */
    addItem (item_name: string, item_data): void {
        if (item_data.amount == undefined) item_data.amount = 1

        let rawItems = JSON.parse(this.data)

        if (rawItems[item_name] == null) {
            rawItems[item_name] = item_data
        } else {
            rawItems[item_name].amount = rawItems[item_name].amount + item_data.amount
        }
        this.data = JSON.stringify(rawItems)
    }

    /**
     * Entfernt ein Item aus dem Inventar
     * 
     * @param item_name der Name des Inventars, dass entfernt wird 
     * @param item_amount die Anzahl, welche vom Item entfernt wird
     * 
     */
    removeItem (item_name: string, item_amount: number): void {
        let rawItems = JSON.parse(this.data)

        if (rawItems[item_name] == null) {
            rawItems[item_name] = 0
        } else {
            rawItems[item_name].amount = rawItems[item_name].amount - item_amount
        }
        this.data = JSON.stringify(rawItems)
    }

    /**
     * Verändert jegliche Properties des Items
     * 
     * @param item_name der Name des Items, welches verändert wird 
     * @param item_data die neuen Properties des Items
     * 
     */
    changeItem (item_name: string, item_data): void {
        let rawItems = JSON.parse(this.data)

        rawItems[item_name] = item_data
        this.data = JSON.stringify(rawItems)
    }

    /**
     * Gibt jegliche Properties eines Items wieder
     * 
     * @param item_name der Name des Items, desses Properties wieder gegeben werden
     *  
     */
    getItem (item_name: string) {
        let rawItems = JSON.parse(this.data)

        return rawItems[item_name]
    }
 }