class Character {
    constructor (name, level, health, currentHealth, damage, block) {
        // Name
        this.name = name;

        // Level
        this.level = level;

        // Health
        this.health = health;
        this.currentHealth = currentHealth || this.health;

        // Damage
        this.damage = damage;

        // Block
        this.block = block;

        // Weaken
        this.weaken = false;
    }

    // Deal DMG
    dealDamage () {
        if (!this.weaken) {
            return Math.floor(this.damage / 2);
        }

        return this.damage;
    }

    // Get DMG
    getDamage (locDamage) {
        if (!this.weaken) {
            this.currentHealth -= Math.floor(locDamage - this.block);
        
            return true;
        }

        this.currentHealth -= locDamage;

        return true;
    }

    // isAlive
    isAlive () {
        if (this.currentHealth <= 0) {
            return false;
        }

        return true;
    }

    isCapped () {
        if (this.currentHealth >= this.health) {
            this.currentHealth = this.health;

            return true;
        }

        return false;
    }
}

class Player extends Character {
    constructor (playerInfo) {
        super(...playerInfo);
    }
}

class Monster extends Character {
    constructor (monsterInfo) {
        super(...monsterInfo);
    }
}

class Game {
    init () {
        // Create User

        // Create Monster
    }
}

window.onload = function () {
    const Clicker = new Game();
    Clicker.init();
}