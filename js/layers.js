addLayer("p", {
    name: "TRA", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "TRA", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Training", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('l', 12)) mult = mult.times(upgradeEffect('l', 12))
        if (hasUpgrade('p', 24)) mult = mult.times(upgradeEffect('p', 24))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonus
        mult = new Decimal(1)
        return mult
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for Training points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    
    upgrades: {
        21: {
            title: "-11-",
            description: "x1.5 EXP gain",
            cost: new Decimal(2),
            effect() {return 1.5},
            unlocked(){
            if ((player.a.points.gte(1))){return true}}
            },

        22: {
            title: "-12-",
            description: "EXP boost to EXP gain",
            cost: new Decimal(2),
            effect() {return player.points.add(1).pow(0.04)},
            effectDisplay() {return format(this.effect())+"x"},
            unlocked(){return hasUpgrade("p",21)}
            },

        23: {
            title: "-13-",
            description: "TRA boost to EXP gain",
            cost: new Decimal(3),
            effect() {return player[this.layer].points.add(1).pow(0.1)},
            effectDisplay() {return format(this.effect())+"x"},
            unlocked(){return hasUpgrade("p",22)}
            },
            
        24: {title: "-14-",
            description: "TRA boost to TRA gain",
            cost: new Decimal(24),
            effect() {return player[this.layer].points.add(1).pow(0.08)},
            effectDisplay() {return format(this.effect())+"x"},
            unlocked(){
                if ((player.l.points.gte(1)) && (hasUpgrade("p",23))){return true}},
            },            
    },

    buyables: {
        11: {
            title: "Running*n", // Optional, displayed at the top in a larger font
            cost(x) { // cost for buying xth buyable, can be an object if there are multiple currencies
                return  Decimal.pow(11, x)
            },
            effect(x) { // Effects of owning x of the items, x is a decimal
                return Decimal.pow(2, x);
            },
            display() { // Everything else displayed in the buyable button after the title
                let data = tmp[this.layer].buyables[this.id]
                return "x2 exp gain \n\n\
                Cost: " + format(data.cost) + " Tra\n\n\
                Amount: " + player[this.layer].buyables[this.id] + "\n\
                Currently: x" + format(data.effect)
            },
            unlocked() { return hasUpgrade("l",11)},
            canAfford() {
                return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)},
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            buyMax() {}, // You'll have to handle this yourself if you want
            style: {'height':'170px'},
        },
    },

    clickables: {
        11: {
            display() {return "T+100"},
            canClick() {return true},
            onClick() {player[this.layer].points = player[this.layer].points.add(100)}
        }
    }
},
)

addLayer("l", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        level_cost: new Decimal(0),
    }},
    color: "green",
    resource: "LVL", 
    row: "side",

    upgrades: {
        11: {
            title: "Lvl.1",
            description: "Unlock a new buyable to TRA",
            currencyDisplayName:"EXP",
            currencyInternalName:"points",
            cost: new Decimal(50),
            onPurchase(){player[this.layer].points = player[this.layer].points.add(1)},
            },

        12: {
            title: "Lvl.2",
            description: "LVL boost to TRA gain",
            currencyDisplayName:"EXP",
            currencyInternalName:"points",
            cost: new Decimal(300),
            effect() {return Decimal.pow(1.2,player.l.points,)},
            effectDisplay() {return format(this.effect())+"x"},
            onPurchase(){player[this.layer].points = player[this.layer].points.add(1)},
            }
        },

    layerShown() { return hasAchievement("a", 12)},
    milestonePopups: false,
},)

addLayer("a", {
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "yellow",
    resource: "ACP", 
    row: "side",
    tooltip() { // Optional, tooltip displays when the layer is locked
        return ("Achievements")
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "The first step",
            done() {return player.p.points.gte(1)},
            tooltip: "Get a 1 Tra<br>Reward: base EXP increases according to ACP",
            onComplete() {player[this.layer].points = player[this.layer].points.add(1)}
        },
        12: {
            name: "TThe long training begins",
            done() {return hasUpgrade("p",23)},
            tooltip: "Purchase TRA Upgrade 13<br>Reward: Unlock LevelUp",
            onComplete() {player[this.layer].points = player[this.layer].points.add(1)}
        },
    },
},
)