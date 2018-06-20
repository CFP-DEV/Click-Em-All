class Item {
    constructor (config) {
        // Name
        this.name = config.name || 'Default Item';

        // Description
        this.description = config.description || 'Default Description';

        // Value
        this.value = config.value || 1;
    }

    use (player) {
        console.log('Wow, this item is really useless.');
    }
}

class Potion extends Item {
    constructor (config) {
        super (config);

        // Health Value
        this.healthValue = config.healthValue;
    }

    use (player) {
        player.increaseCurrentHealth(this.healthValue);
    }
}

class BookOfDamage extends Item {
    constructor (config) {
        super (config);

        // Damage
        this.damageValue = config.damageValue;
    }

    use (player) {
        player.increaseDamage(this.damageValue);
    }
}

class BookOfArmor extends Item {
    constructor (config) {
        super (config);

        // Armor
        this.armorValue = config.armorValue;
    }

    use (player) {
        player.increaseArmor(this.armorValue);
    }
}

class Store {
    constructor () {
        this.offer = [
            new Potion({ name: 'Health Potion', description: 'Restore your health (50).', value: 20, healthValue: 50}),
            new Potion({ name: 'Health Potion', description: 'Restore your health (50).', value: 80, healthValue: 250}),
            new Potion({ name: 'Health Potion', description: 'Restore your health (50).', value: 140, healthValue: 500}),
            new BookOfDamage({ name: 'Book of Damage', description: 'Increases your damage (+5).', value: 100, damageValue: 5}),
            new BookOfArmor({ name: 'Book of Armor', description: 'Increases your armor (+5).', value: 100, armorValue: 5})
        ];
    }

    // Pucharse
    pucharse (itemID) {
        if (!itemID && itemID !== 0) {
            if (!this.offer[itemID]) {
                return false;
            }
        }

        return this.offer[itemID];
    }

    // Get Offer
    getOffer () {
        return this.offer;
    }
}

class Miner {
    constructor (config) {
        // Name
        this.name = config.name || 'Default Miner';

        // Description
        this.description = config.description || 'Default Description';

        // Income
        this.income = config.income || 1;

        // Quanity
        this.quanity = config.quanity || 0;

        // Value
        this.value = config.value || 50;
    }

    // Quanity Management
    increaseQuanity () {
        this.quanity++;
    }

    // Get Income
    getIncome () {
        return this.income * this.quanity;
    }
}

class Mine {
    constructor () {
        this.miners = [
             // Peon
            this.peon = new Miner({ name: 'Peon', description: 'Me peon, me work.', income: 1, quanity: 0, value: 50 }),

            // Mine Cart
            this.mineCart = new Miner({ name: 'Mine Cart', description: 'Straight outta minecraft.', income: 5, quanity: 0, value: 250  }),

            // Drillers
            this.driller = new Miner({ name: 'Driller', description: 'Do not confuse with dealer.', income: 10, quanity: 0, value: 500  }),

            // Senior Peons
            this.seniorPeon = new Miner({ name: 'Senior Peon', description: 'Me smart, me earns a lot, me the best.', income: 50, quanity: 0, value: 2500 })
        ];  
    }

    // Get Income
    getIncome () {
        let income = 0;

        this.miners.forEach(miner => {
            income += (miner.quanity * miner.income);
        });

        return income;
    }

    // Get Miners
    getMiners () {
        return this.miners;
    }
}

class Character {
    constructor (config) {
        // Name
        this.name = config.name || 'Default Character';

        // Health
        this.maxHealth = config.maxHealth || 100;
        this.currentHealth = config.currentHealth || this.maxHealth;

        // Armor
        this.armor = config.armor || 0;
        
        // Damage
        this.damage = config.damage || 5;

        // Other
        this.isWeaken = false;
    }

    // Health
    isAlive () {
        if (this.currentHealth <= 0) {
            return true;
        }

        return false;
    }

    // Damage
    dealDamage (damage) {
       if (this.isWeaken) {
           return Math.floor(this.damage / 2);
       }

       return this.damage;
    }

    receiveDamage (damage) {
        let realDamage;

        if (this.isWeaken) {
            realDamage = damage;
        } else {
            if (damage - this.armor <= 0) {
                realDamage = 0;
            } else {
                realDamage = damage - this.armor;
            }
        }

        this.currentHealth -= realDamage;

        if (this.currentHealth <= 0) {
            this.onDeath();
        }

        // Update UI
        this.updateUI();
    }

    // Armor
    increaseArmor (armor) {
        this.armor += armor;
    }

    decreaseArmor (armor) {
        if (this.armor - armor <= 0) {
            this.armor = 0;

            return;
        }

        this.armor -= armor;
    }

    // Damage
    increaseDamage (amount) {
        this.damage += amount;
    }

    decreaseDamage (amount) {
        this.damage -= amount;
    }

    // Current Health
    // TODO: Weaken effect decreases amount of healing.
    increaseCurrentHealth (amount) {
        if (this.currentHealth + amount > this.maxHealth) {
            this.currentHealth = this.maxHealth;
        } else {
            this.currentHealth += amount;
        }

        this.updateUI();
    }

    // Set Weaken
    setWeaken (time) {
        // Clear
        clearInterval(this.isWeakenStatus);

        // Set
        this.isWeakenStatus = setInterval(() => {
            this.isWeaken = false;
        }, time);
    }
}

class Player extends Character {
    constructor (config) {
        super(config);

        // Level
        this.level = config.level || 1;

        // Experience
        this.maxExperience = config.maxExperience || 100;
        this.currentExperience = config.currentExperience || 0;

        // Gold
        this.gold = config.gold;

        // Inventory
        this.inventory = [];

        // UI
        this.interface = {
            level: document.getElementById('playerLevel'),
            name: document.getElementById('playerName'),
            experience: document.getElementById('playerExperience'),
            experienceBar: document.getElementById('playerExperienceBar'),
            health: document.getElementById('playerHealth'),
            healthBar: document.getElementById('playerHealthBar'),
            gold: document.getElementById('shop'),
        }

        // UI - Name
        this.interface.name.innerHTML = this.name;

        // UI - Initial Update
        this.updateUI();
    }

    // Experience
    inceaseExperience (amount) {
        if (this.currentExperience + amount >= this.maxExperience) {
            let leftExperience = this.currentExperience + amount - this.maxExperience;

            this.increaseLevel();

            this.currentExperience = leftExperience;
        } else {
            this.currentExperience += amount;
        }

        // Update UI
        this.updateUI();
    }

    // Gold
    increaseGold (amount) {
        this.gold += amount;

        this.updateGoldUI();
    }

    decreaseGold (amount) {
        if (this.gold - amount <= 0) {
            this.gold = 0;
        } else {
            this.gold -= amount;
        }

        this.updateGoldUI();
    }

    checkGold (amount) {
        if (amount > this.gold) {
            return false;
        }

        return true;
    }

    updateGoldUI () {
        this.interface.gold.innerHTML = `${this.gold} <span class="text--is-yellow">GOLD</span>`;
    }

    // Level
    increaseLevel (amount = 1) {
        this.level += amount;

        // Increase Maximum Experience
        this.maxExperience *= 2;

        // Update UI
        this.interface.level.innerHTML = this.level;

        // UI
        this.updateUI();
    }
    
    // UI
    updateUI () {
        // UI - Level
        this.interface.level.innerHTML = this.level;

        // Basic Experience
        let basicExperience = (this.currentExperience * 100) / this.maxExperience;

        // UI - Experience
        this.interface.experience.children[0].innerHTML = `${basicExperience}%`;
        this.interface.experience.children[1].innerHTML = `${this.currentExperience} / ${this.maxExperience}`;

        // UI - Experience Bar
        let experienceBarWidth = basicExperience * 180 / 100;
        this.interface.experienceBar.children[0].style.width = `${experienceBarWidth}px`;

        // Basic Health
        let basicHealth = (this.currentHealth * 100) / this.maxHealth;

        // UI - Health
        this.interface.health.children[0].innerHTML = `${basicHealth}%`;
        this.interface.health.children[1].innerHTML = `${this.currentHealth} / ${this.maxHealth}`;

        // UI - Health Bar
        let healthBarWidth = basicHealth * 180 / 100;
        this.interface.healthBar.children[0].style.width = `${healthBarWidth}px`;
    }

    // Death
    onDeath () {
        console.log('GAME OVER');
    }

    // Inventory
    toInventory (item) {
        if (!item) {
            return;
        }

        // Add to Inventory
        this.inventory.push(item);
    }

    getInventory () {
        return this.inventory;
    }
}

class Monster extends Character {
    constructor (config) {
        super(config);

        // Generate Monster Name
        this.monsterName = this.name;
        let monsterName = this.generateName(this.name);
        this.name = monsterName; 
       

        // Rewards
        this.reward = config.reward;

        // UI
        this.interface = {
            name: document.getElementById('monsterName'),
            health: document.getElementById('monsterHealth'),
            healthBar: document.getElementById('monsterHealthBar'),
        }

        // UI - Name
        this.interface.name.innerHTML = this.name;

        // UI - Initial Update
        this.updateUI();
    }

    generateName (name) {
        let adjectives = [
            'Dangerous',
            'Super',
            'Sweet',
            'Brutal',
            'Magic',
            'Nerd',
            'Beautiful',
            'Young',
            'LIL',
            'Ruthless',
        ];

        return '<span class="text--is-red">' + adjectives[Math.floor(Math.random() * (adjectives.length - 1))] + '</span><span>' + name + '</span>';
    }

    // Reward
    getReward () {
        return this.reward;
    }

    // UI
    updateUI () {
         // Basic Health
         let basicHealth = (this.currentHealth * 100) / this.maxHealth;
 
         // UI - Health
         this.interface.health.children[0].innerHTML = `${basicHealth}%`;
         this.interface.health.children[1].innerHTML = `${this.currentHealth} / ${this.maxHealth}`;
 
         // UI - Health Bar
         let healthBarWidth = basicHealth * 180 / 100;
         this.interface.healthBar.children[0].style.width = `${healthBarWidth}px`;
    }

    // Death
    onDeath () {
        // Respawn
        this.currentHealth = this.maxHealth;

        // New Name
        this.name = this.generateName(this.monsterName);

        // UI - Name
        this.interface.name.innerHTML = this.name;

        // Update UI
        this.updateUI();

        // Trigger Event
        let event = new CustomEvent('monsterDeath', { detail: this.getReward() });
        document.dispatchEvent(event);
    }
}

class Game {
    constructor () {
        // Interface
        this.interface = {
            game: document.getElementById('game'),
            inventory: document.getElementById('inventory'),
            mine: document.getElementById('mine'),
            shop: document.getElementById('shop'),
        }

        // Scenes
        this.scenes = {
            game: document.getElementById('gameScene'),
            mine: document.getElementById('mineScene'),
            shop: document.getElementById('shopScene'),
            inventory: document.getElementById('inventoryScene'),
        }

        // Active Scene
        this.activeScene = 'game';
    }

    init () {
        // Create User
        let playerConfig = {
            name: 'CFP',
            level: 1,
            currentHealth: 100,
            maxHealth: 100,
            currentExperience: 0,
            armor: 2,
            damage: 10,
            gold: 0,
        }

        this.player = new Player(playerConfig);

        // Create Enemy
        let enemyConfig = {
            name: 'Orc',
            currentHealth: 100,
            maxHealth: 100,
            armor: 0,
            damage: 5,
            reward: {
                gold: 10,
                experience: 20,
            }
        }
        
        this.enemy = new Monster(enemyConfig);

        // Create Store
        this.store = new Store();
        this.createStore();

        // Create Mine
        this.mine = new Mine();
        this.createMine();

        // Create Inventory
        this.createInventory();

        // Income function
        setInterval(() => {
            this.player.increaseGold(this.mine.getIncome());
        }, 10000);

        // Initialize UI
        this.initUI();
    }

    initUI () {
        // Monster Events
        this.enemy.interface.name.addEventListener('click', (e) => {
            // Monster Turn
            this.player.receiveDamage(this.enemy.dealDamage());

            // Player Turn
            this.enemy.receiveDamage(this.player.dealDamage());
        });

        // Monster Death
        document.addEventListener('monsterDeath', (e) => {
            // Incerease Gold
            this.player.increaseGold(e.detail.gold);

            // Increase Experience
            this.player.inceaseExperience(e.detail.experience);
        });

        // Game (Fight)
        this.interface.game.addEventListener('click', (e) => {
            this.closeScene();

            // Show Game
            this.activeScene = 'game';
            this.scenes.game.style.display = 'flex';
        });
    
        // Inventory
        this.interface.inventory.addEventListener('click', (e) => {
            this.closeScene();

            // Show Inventory
            this.activeScene = 'inventory';
            this.scenes.inventory.style.display = 'flex';
        });

        // Mine
        this.interface.mine.addEventListener('click', (e) => {
            this.closeScene();

            // Show Mine
            this.activeScene = 'mine';
            this.scenes.mine.style.display = 'flex';
        });

        // Shop
        this.interface.shop.addEventListener('click', (e) => {
            this.closeScene();

            // Show Shop
            this.activeScene = 'shop';
            this.scenes.shop.style.display = 'flex';
        });
    }

    closeScene () {
        switch (this.activeScene) {
            case 'game':
                this.scenes.game.style.display = 'none';
                break;
            case 'mine':
                this.scenes.mine.style.display = 'none';
                break;
            case 'shop':
                this.scenes.shop.style.display = 'none';
                break;
            case 'inventory':
                this.scenes.inventory.style.display = 'none';
                break;
        }
    }

    // Create Mine
    createMine () {
        // Reset DOM
        document.getElementById('mineScene').innerHTML = '';

        // Create Update DOM
        let minersList = document.createElement('ul');
        minersList.classList.add('miners-list');

        // List Miners
        this.mine.getMiners().forEach(miner => {
            // DOM Element
            let minerElement = document.createElement('li');
            minerElement.classList.add('miners-list__item');
            minerElement.classList.add('miner');

            // Content
            minerElement.innerHTML = `
                <div class="miner__info">
                    <div class="miner__info__name">
                        ${miner.name}
                    </div>
                    <div class="miner__info__description">
                        ${miner.description}
                    </div>
                </div>
                <div class="miner__quanity">
                    <div>
                        Hired
                    </div>
                    <div>
                        ${miner.quanity}
                    </div>
                </div>
                <div class="miner__income">
                    <div>
                        Income
                    </div>
                    <div>
                        ${miner.income}
                    </div>
                </div>
                <div class="miner__cost">
                    <div>
                        Cost
                    </div>
                    <div>
                        ${miner.value}
                    </div>
                </div>
                <button class="miner__action btn btn--is-outline">
                    BUY
                </button>
            `;

            // Action Bind
            minerElement.children[minerElement.children.length - 1].addEventListener('click', (e) => {
                // Check if players has enough gold
                if (!this.player.checkGold(miner.value)) {
                    console.log('Not enough gold.')

                    return;
                }

                // Decreasee Gold
                this.player.decreaseGold(miner.value);

                // Increase Quanity
                miner.increaseQuanity();

                // Rerender
                this.createMine();
            });

            // Append
            minersList.appendChild(minerElement);
        });

        // Append List
        document.getElementById('mineScene').appendChild(minersList);
    }

    // Create Shop
    createStore () {
         // Reset DOM
         document.getElementById('shopScene').innerHTML = '';

         // Create Update DOM
         let itemList = document.createElement('ul');
         itemList.classList.add('item-list');
 
         // List Miners
         this.store.getOffer().forEach((item, itemID) => {
             // DOM Element
             let itemElement = document.createElement('li');
             itemElement.classList.add('item-list__item');
             itemElement.classList.add('item');
 
             // Content
             itemElement.innerHTML = `
                 <div class="item__info">
                     <div class="item__info__name">
                         ${item.name}
                     </div>
                     <div class="item__info__description">
                         ${item.description}
                     </div>
                 </div>
                 <div class="item__cost">
                     <div>
                         Cost
                     </div>
                     <div>
                         ${item.value}
                     </div>
                 </div>
                 <button class="item__action btn btn--is-outline">
                     BUY
                 </button>
             `;
 
             // Action Bind
             itemElement.children[itemElement.children.length - 1].addEventListener('click', (e) => {
                 // Check if players has enough gold
                 if (!this.player.checkGold(item.value)) {
                     console.log('Not enough gold.')
 
                     return;
                 }
 
                 // Decreasee Gold
                 this.player.decreaseGold(item.value);
 
                 // Increase Quanity
                 this.player.toInventory(this.store.pucharse(itemID));
             });
 
             // Append
             itemList.appendChild(itemElement);
         });
 
         // Append List
         document.getElementById('shopScene').appendChild(itemList);
    }

    // Create Shop
    createInventory () {
        // Reset DOM
        document.getElementById('inventoryScene').innerHTML = '';

        // Create Update DOM
        let itemList = document.createElement('ul');
        itemList.classList.add('item-list');

        // List Miners
        if (this.player.getInventory().length === 0) {
            // Display Message
            let message = document.createElement('div');
            message.innerHTML = 'Your inventory is empty.';

            return;
        }

        // Display Inventory
        this.player.getInventory().forEach((item, itemID) => {
            // DOM Element
            let itemElement = document.createElement('li');
            itemElement.classList.add('item-list__item');
            itemElement.classList.add('item');

            // Content
            itemElement.innerHTML = `
                <div class="item__info">
                    <div class="item__info__name">
                        ${item.name}
                    </div>
                    <div class="item__info__description">
                        ${item.description}
                    </div>
                </div>
                <button class="item__action btn btn--is-outline">
                    USE
                </button>
            `;

            // Action Bind
            itemElement.children[itemElement.children.length - 1].addEventListener('click', (e) => {
                // Use Item
                item.use(this.player);

                // Increase Quanity
                this.player.fromInventory(itemID);

                // Rerender
                this.createInventory();
            });

            // Append
            itemList.appendChild(itemElement);
        });

        // Append List
        document.getElementById('inventoryScene').appendChild(itemList);
   }
}

window.onload = function () {
    const Clicker = new Game();
    Clicker.init();
}
