class Item {
    constructor (config) {
        // Name
        this.name = config.name || 'Default Item';

        // Description
        this.description = config.description || 'Default Description';

        // Value
        this.value = config.value || 1;

        // Item ID
        this.itemID = config.itemID;
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
            new Potion({ itemID: 1, name: 'Health Potion', description: 'Restore your health (50).', value: 20, healthValue: 50}),
            new Potion({ itemID: 2, name: 'Health Potion', description: 'Restore your health (50).', value: 80, healthValue: 250}),
            new Potion({ itemID: 3, name: 'Health Potion', description: 'Restore your health (50).', value: 140, healthValue: 500}),
            new BookOfDamage({ itemID: 4, name: 'Book of Damage', description: 'Increases your damage (+5).', value: 100, damageValue: 5}),
            new BookOfArmor({ itemID: 5, name: 'Book of Armor', description: 'Increases your armor (+5).', value: 100, armorValue: 5})
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

    getItem (itemID) {
        if (!itemID){
            return false;
        }

        let searchedItem = this.offer.filter(item => item.itemID === itemID);

        if (searchedItem.length === 0) {
            return;
        }

        return searchedItem[0];
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

        // Miner ID
        this.minerID = config.minerID;
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
            this.peon = new Miner({ minerID: 1, name: 'Peon', description: 'Me peon, me work.', income: 1, quanity: 0, value: 50 }),

            // Mine Cart
            this.mineCart = new Miner({ minerID: 2, name: 'Mine Cart', description: 'Straight outta minecraft.', income: 5, quanity: 0, value: 250  }),

            // Drillers
            this.driller = new Miner({ minerID: 3, name: 'Driller', description: 'Do not confuse with dealer.', income: 10, quanity: 0, value: 500  }),

            // Senior Peons
            this.seniorPeon = new Miner({ minerID: 4, name: 'Senior Peon', description: 'Me smart, me earns a lot, me the best.', income: 50, quanity: 0, value: 2500 })
        ];  
    }

    // Set Miner
    setMiner (minerID, quanity) {
        if (!minerID || !quanity) {
            return false;
        }

        for (let i = 0; i < this.miners.length; i++) {
            if (this.miners[i].minerID === minerID) {
                this.miners[i].quanity = quanity;
            }
        }
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

    getMinersToSave () {
        let miners = [];

        this.miners.forEach(miner => {
            miners.push({
                minerID: miner.minerID,
                quanity: miner.quanity,
            });
        })
        
        return miners;
    }

    // Get Miner
    getMiner (minerID) {
        if (!minerID) {
            return false;
        }

        let miner = this.miners.filter(miner => miner.minerID === minerID);

        if (miner.length === 0) {
            return false;
        }

        return miner[0];
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

        // Total Gold
        this.totalGold = config.totalGold || this.gold;

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
        this.totalGold += amount;

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

        // Increase Maximum Health
        this.maxHealth = Math.floor(this.maxHealth * 1.5);

        // Restore Health
        this.currentHealth = this.maxHealth;

        // Increase Damage
        this.increaseDamage(2);

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
        let basicExperience = Math.floor((this.currentExperience * 100) / this.maxExperience);

        // UI - Experience
        this.interface.experience.children[0].innerHTML = `${basicExperience}%`;
        this.interface.experience.children[1].innerHTML = `${this.currentExperience} / ${this.maxExperience}`;

        // UI - Experience Bar
        let experienceBarWidth = basicExperience * 180 / 100;
        this.interface.experienceBar.children[0].style.width = `${experienceBarWidth}px`;

        // Basic Health
        let basicHealth = Math.floor((this.currentHealth * 100) / this.maxHealth);

        // UI - Health
        this.interface.health.children[0].innerHTML = `${basicHealth}%`;
        this.interface.health.children[1].innerHTML = `${this.currentHealth} / ${this.maxHealth}`;

        // UI - Health Bar
        let healthBarWidth = basicHealth * 180 / 100;
        this.interface.healthBar.children[0].style.width = `${healthBarWidth}px`;
    }

    // Death
    onDeath () {
        let onDeath = new CustomEvent('onDeath', {
            detail: {
                level: this.level,
                totalGold: this.totalGold,
            }
        });

        document.dispatchEvent(onDeath);
    }

    // Inventory
    toInventory (item) {
        if (!item) {
            return;
        }

        // Add to Inventory
        this.inventory.push(item);
    }

    fromInventory (itemID) {
        if (!itemID && itemID !== 0) {
            return;
        }

        // Remove from Inventory
        this.inventory.splice(itemID, 1);
    }

    getInventory () {
        return this.inventory;
    }

    getInventoryToSave () {
        return this.inventory.map(item => item.itemID);
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
         let basicHealth = Math.floor((this.currentHealth * 100) / this.maxHealth);
 
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
            changeProfile: document.getElementById('changeProfile'),
            newProfile: document.getElementById('newProfile'),
            profile: document.getElementById('profile'),
            navigation: document.getElementById('navigation'),
            footerNavigation: document.getElementById('footerNavigation'),
            highscores: document.getElementById('highscores'),
        }

        // Scenes
        this.scenes = {
            game: document.getElementById('gameScene'),
            mine: document.getElementById('mineScene'),
            shop: document.getElementById('shopScene'),
            inventory: document.getElementById('inventoryScene'),
            death: document.getElementById('deathScene'),
            profileSelection: document.getElementById('profileSelectionScene'),
            highscores: document.getElementById('highscoresScene'),
        }

        // Active Scene
        this.activeScene = 'profileSelection';

        // UI Active
        this.uiActive = true;
    }

    saveProfile () {
        // Find Profile
        let profile;
        let profileID;
        for (let i = 0; i < this.profiles.length; i++) {
            if (this.profiles[i].name === this.player.name) {
                profile = this.profiles[i];
                profileID = i;

                break;
            }
        }

        // Change Data
        profile.level = this.player.level;
        profile.currentHealth = this.player.currentHealth;
        profile.maxHealth = this.player.maxHealth;
        profile.currentExperience = this.player.currentExperience;
        profile.maxExperience = this.player.maxExperience;
        profile.armor = this.player.armor;
        profile.damage = this.player.damage;
        profile.gold = this.player.gold;
        profile.totalGold = this.player.totalGold;
        profile.inventory = this.player.getInventoryToSave();
        profile.miners = this.mine.getMinersToSave();

        // Save
        this.profiles[profileID] = profile;

        // Update
        localStorage.setItem('profiles', JSON.stringify(this.profiles));
    }

    init (profile) {
        // Hide Profile Selection
        this.closeScene();

        this.activeScene = 'game';
        this.scenes.game.style.display = 'flex';

        // Show UI
        this.interface.profile.style.display = 'flex';
        this.interface.navigation.style.display = 'flex';
        this.interface.footerNavigation.style.display = 'flex';

        // Create User
        let playerConfig = {
            name: profile.name,
            level: profile.level,
            currentHealth: 10,
            maxHealth: profile.maxHealth,
            currentExperience: profile.currentExperience,
            maxExperience: profile.maxExperience,
            armor: profile.armor,
            damage: profile.damage,
            gold: profile.gold,
            totalGold: profile.totalGold,
        }

        this.player = new Player(playerConfig);

        // Create Enemy
        let enemyConfig = {
            name: 'Orc',
            currentHealth: 80,
            maxHealth: 80,
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
    
        // Load Miners
        profile.miners.forEach(miner => {
            this.mine.setMiner(miner.minerID, miner.quanity);
        });

        this.createMine();

        // Load Inventory
        profile.inventory.forEach(itemID => {
            let item = this.store.getItem(itemID);

            if (item) {
                this.player.toInventory(item);
            }
        });

        // Create Inventory
        this.createInventory();

        // Income function
        clearInterval(this.mining);
        this.mining = setInterval(() => {
            this.player.increaseGold(this.mine.getIncome());
        }, 10000);

        // Initialize UI
        this.initUI();
    }

    initUI () {
        // Monster Events
        this.enemy.interface.name.addEventListener('click', (e) => {
            if (!this.uiActive){
                return;
            }

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

            // Save
            this.saveProfile();
        });

        // Player Death
        document.addEventListener('onDeath', (e) => {
            this.closeScene();

            // Save Profile
            this.saveProfile();

            // Update High Scores
            if (!localStorage.getItem('scores') || JSON.parse(localStorage.getItem('scores')).length === 0) {
                localStorage.setItem('scores', JSON.stringify([{ name: this.player.name, gold: this.player.totalGold}]));
            } else {
                let scores = JSON.parse(localStorage.getItem('scores'));
                scores.push({
                    name: this.player.name,
                    gold: this.player.totalGold
                });
                localStorage.setItem('scores', JSON.stringify(scores));
            }

            // Remove Profile
            let profiles = JSON.parse(localStorage.getItem('profiles'));
            let newProfiles = profiles.filter(profile => profile.name !== this.player.name);

            // Update Profiles
            localStorage.setItem('profiles', JSON.stringify(newProfiles));

            // Show Death Screen
            this.activeScene = 'death';
            this.scenes.death.style.display = 'flex';

            // UI Active
            this.uiActive = false;
        });

        // Game (Fight)
        this.interface.game.addEventListener('click', (e) => {
            if (!this.uiActive){
                return;
            }
            
            this.closeScene();

            // Show Game
            this.activeScene = 'game';
            this.scenes.game.style.display = 'flex';

            // Save
            this.saveProfile();
        });
    
        // Inventory
        this.interface.inventory.addEventListener('click', (e) => {
            if (!this.uiActive){
                return;
            }
            
            this.closeScene();

            // Refresh Inventory
            this.createInventory();

            // Show Inventory
            this.activeScene = 'inventory';
            this.scenes.inventory.style.display = 'flex';

            // Save
            this.saveProfile();
        });

        // Mine
        this.interface.mine.addEventListener('click', (e) => {
            if (!this.uiActive){
                return;
            }
            
            this.closeScene();

            // Show Mine
            this.activeScene = 'mine';
            this.scenes.mine.style.display = 'flex';

            // Save
            this.saveProfile();
        });

        // Shop
        this.interface.shop.addEventListener('click', (e) => {
            if (!this.uiActive){
                return;
            }
            
            this.closeScene();

            // Show Shop
            this.activeScene = 'shop';
            this.scenes.shop.style.display = 'flex';

            // Save
            this.saveProfile();
        });

        // Profile Selection
        this.interface.changeProfile.addEventListener('click', (e) => {
            if (!this.uiActive){
                return;
            }
            
            this.closeScene();

            // Show Profile Selection
            this.activeScene = 'profileSelection';
            this.scenes.profileSelection.style.display = 'flex';

            // Save
            this.saveProfile();
        });

        this.interface.newProfile.addEventListener('click', (e) => {
            location.reload();
        });

        this.interface.highscores.addEventListener('click', (e) => {
            this.closeScene();

            // Update Scores
            this.showScores();

            // Show Scores
            this.activeScene ='highscores';
            this.scenes.highscores.style.display = 'flex';

            // Save Profile
            if (this.uiActive) {
                this.saveProfile();
            }
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
            case 'death':
                this.scenes.death.style.display = 'none';
                break;
            case 'profileSelection':
                this.scenes.profileSelection.style.display = 'none';
                break;
            case 'highscores':
                this.scenes.highscores.style.display = 'none';
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

                // Save
                this.saveProfile();
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

            // Append Message
            document.getElementById('inventoryScene').appendChild(message);

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

   initProfileSelection () {
        // Load Profiles
        this.profiles = [];
        let fetchedProfiles = localStorage.getItem('profiles');

        if (fetchedProfiles) {
            this.profiles = JSON.parse(fetchedProfiles);
        }

        // List Profiles
        this.showProfiles();

        // New Profile
        let profileName = document.getElementById('profileName');

        document.getElementById('createProfile').addEventListener('click', (e) => {
            // Validate
            if (profileName.value.length === 0 || profileName.value.length >= 16) {
                return;
            }
            
            // Check if profile name is available
            let isAvailable = true;
            this.profiles.forEach(profile => {
                if (profile.name === profileName.value) {
                    isAvailable = false;
                }
            });

            if (!isAvailable) {
                return;
            }

            // Create Profile
            this.profiles.push({
                name: profileName.value,
                level: 1,
                currentHealth: 100,
                maxHealth: 100,
                currentExperience: 0,
                maxExperience: 100,
                armor: 3,
                damage: 10,
                gold: 0,
                totalGold: 0,
                inventory: [],
                miners: [],
            });

            // Update Profiles in localStorage
            localStorage.setItem('profiles', JSON.stringify(this.profiles));

            // Reset Form
            profileName.value = '';

            // Rerender
            this.showProfiles();
        });
   }

   showProfiles () {
        // Profile List
        let profileList = document.getElementById('profile-list');

        // Reset DOM
        profileList.innerHTML = '';

        this.profiles.forEach(profile => {
            // Create Element
            let profileElement = document.createElement('li');
            profileElement.classList.add('profile-list__profile');

            // Set Content
            profileElement.innerHTML = `
                <div class="profile-list__profile__name">
                    ${profile.name}
                </div>
                <button class="profile-list__profile__run btn btn--is-outline">
                    RUN
                </button>
            `;

            // Event Listener
            profileElement.children[profileElement.children.length - 1].addEventListener('click', (e) => {
                this.init(profile);

                this.closeScene();

                // Show Game
                this.activeScene = 'game';
                this.scenes.game.style.display = 'flex';
            });

            profileList.appendChild(profileElement);
        });
   }

   showScores () {
        // Profile List
        let scoresList = document.getElementById('scores-list');

        // Reset DOM
        scoresList.innerHTML = '';

        if (!localStorage.getItem('scores')) {
            return;
        }

        JSON.parse(localStorage.getItem('scores')).forEach(score => {
            // Create Element
            let profileElement = document.createElement('li');
            profileElement.classList.add('profile-list__profile');
    
            // Set Content
            profileElement.innerHTML = `
                <div class="profile-list__profile__name">
                    ${score.name}
                </div>
                <div class="profile-list__profile__score">
                    TOTAL GOLD: ${score.gold}
                </div>
            `;
    
            scoresList.appendChild(profileElement);
        });
    }
}

window.onload = function () {
    const Clicker = new Game();
    Clicker.initProfileSelection();
}
