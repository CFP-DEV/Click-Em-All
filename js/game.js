class Character {
    constructor (config) {
        // Name
        this.name = config.name || 'Default Character';

        // Health
        this.maxHealth = config.maxHealth || 100;
        this.currentHealth = config.currentHealth || this.maxHealth;

        // Armor
        this.armor = config.armor || 2;
        
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

        // Alive Check
        isAlive();
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

        // UI
        this.interface = {
            level: document.getElementById('playerLevel'),
            name: document.getElementById('playerName'),
            experience: document.getElementById('playerExperience'),
            experienceBar: document.getElementById('playerExperienceBar'),
            health: document.getElementById('playerHealth'),
            healthBar: document.getElementById('playerHealthBar'),
        }

        // UI - Name
        this.interface.name.innerHTML = this.name;

        // UI - Initial Update
        this.updateUI();
    }

    // Experience
    inceaseExperience (amount) {
        if (this.experience + amount >= this.maxExperience) {
            let leftExperience = this.experience + amount - this.maxExperience;

            this.increaseLevel();

            this.experience += leftExperience;
        }

        this.experience += amount;

        // Update UI
        this.updateUI();
    }

    // Gold
    increaseGold (amount) {
        this.gold += amount;
    }

    decreaseGold (amount) {
        this.gold -= amount;
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
}

class Monster extends Character {
    constructor (config) {
        super(config);

        // Generate Monster Name
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
}

class Game {
    init () {
        // Create User
        let playerConfig = {
            name: 'CFP',
            level: 1,
            currentHealth: 100,
            maxHealth: 100,
            currentExperience: 0,
            armor: 2,
            damage: 5,
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

        // Initialize UI
        this.initUI();
    }

    initUI () {
        //
    }
}

window.onload = function () {
    const Clicker = new Game();
    Clicker.init();
}