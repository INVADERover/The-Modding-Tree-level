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
        if (hasUpgrade('p', 25)) mult = mult.times(upgradeEffect('p', 25))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonus
        mult = new Decimal(1)
        return mult
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return true},
    
    upgrades: {
        21: { title: "-T11-",
            description: "x1.5 EXP gain",
            cost: new Decimal(2),
            effect() {
                let eff = Decimal.add(1.5)

                if (hasUpgrade('l', 14)) eff = eff.add(player.p.upgrades.length)
                return eff},
            
            effectDisplay() {return format(this.effect())+"x"},
            unlocked(){
            if ((player.a.points.gte(1))){return true}}
            },

        22: { title: "-T12-",
            description: "EXP boost to EXP gain",
            cost: new Decimal(2),
            effect() {return player.points.add(1).pow(0.06)},
            effectDisplay() {return format(this.effect())+"x"},
            unlocked(){return hasUpgrade("p",21)}
            },

        23: { title: "-T13-",
            description: "TRA boost to EXP gain",
            cost: new Decimal(3),
            effect() {return player[this.layer].points.add(2).pow(0.1)},
            effectDisplay() {return format(this.effect())+"x"},
            unlocked(){return hasUpgrade("p",22)}
            },
            
        24: { title: "-T14-",
            description: "TRA boost to TRA gain",
            cost: new Decimal(18),
            effect() {return player[this.layer].points.add(2).pow(0.04)},
            effectDisplay() {return format(this.effect())+"x"},
            unlocked(){
                if ((player.l.points.gte(1)) && (hasUpgrade("p",23))){return true}},
            },

        25: { title: "-T15-",
            description: "x4 TRA gain",
            cost: new Decimal(100),
            effect() {return 4},
            unlocked(){return hasUpgrade("p",24)},
            },
    },

    buyables: {
        11: {
            title: "Running", // Optional, displayed at the top in a larger font
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
            style: {'height':'150px'},
        },
    },

    passiveGeneration(){if (hasUpgrade('l', 13))return upgradeEffect('l', 13).div(100)},

    doReset(resettingLayer){
        if(layers[resettingLayer].row > this.row) {
        layerDataReset(this.layer)
        if (player.ac.points.gte(1))player.p.upgrades.push("21")
        if (player.ac.points.gte(2))player.p.upgrades.push("22")
        if (player.ac.points.gte(3))player.p.upgrades.push("23")
        if (player.ac.points.gte(4))player.p.upgrades.push("24")
        if (player.ac.points.gte(5))player.p.upgrades.push("25")

    }},

    clickables: {
        11: {
            display() {return "T+100"},
            canClick() {return true},
            onClick() {player[this.layer].points = player[this.layer].points.add(100)}
        }
    }
},
)

addLayer("ac", {
    name: "ACT", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ACT", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(2000), // Can be a function that takes requirement increases into account
    resource: "Action", // Name of prestige currency
    baseResource:  "Training", // Name of resource prestige is based on
    baseAmount() {return player.p.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonus
        mult = new Decimal(1)
        return mult
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return hasAchievement("a", 13)},
    
    upgrades: {
        21: {
            title: "-A11-",
            description: "ACT boost to EXP gain",
            cost: new Decimal(2),
            effect() {return Decimal.pow(1.5,player.ac.points).add(2)},
            effectDisplay() {return format(this.effect())+"x"},
            },
    },

    milestones: {
        0: { requirementDescription: "1 ACT",
            effectDescription: "Keep TRA upgrades based on ACT<br>Add ACT to the effect of LVL.3",
            done() { return player.ac.points.gte(1) }
        },
        1: { requirementDescription: "2 ACT",
            effectDescription: "Keep TRA upgrades based on ACT<br>Add ACT to the effect of LVL.3",
            done() { return player.ac.points.gte(2) }
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
            effect() {return Decimal.pow(1.2,player.l.points)},
            effectDisplay() {return format(this.effect())+"x"},
            onPurchase(){player[this.layer].points = player[this.layer].points.add(1)},
            unlocked(){return hasUpgrade("l",11)},
            },

        13: {
            title: "Lvl.3",
            description: "Generate TRA based on LVL",
            currencyDisplayName:"TRA",
            currencyInternalName:"points",
            currencyLayer:"p",
            cost: new Decimal(50),
            effect() {
                let eff = player.l.points.add(2).add(player.ac.points)
                if (hasAchievement("a", 14)) eff = eff.add(player.a.points)
                
                return eff},
            effectDisplay() {return format(this.effect())+"%"},
            onPurchase(){player[this.layer].points = player[this.layer].points.add(1)},
            unlocked(){return hasUpgrade("l",12)},
            },

        14: {
            title: "Lvl.4",
            description: "-T11- is boosted by other TRA upgrades.",
            currencyDisplayName:"EXP",
            currencyInternalName:"points",
            cost: new Decimal(30000),
            onPurchase(){player[this.layer].points = player[this.layer].points.add(1)},
            unlocked(){return hasUpgrade("l",13)},
            },
        
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
            name: "The long training begins",
            done() {return hasUpgrade("p",23)},
            tooltip: "Purchase -T13-<br>Reward: Unlock LevelUp",
            onComplete() {player[this.layer].points = player[this.layer].points.add(1)}
        },
        13: {
            name: "Next layer",
            done() {return hasUpgrade("p",25)},
            tooltip: "Purchase -T15-<br>Reward: Unlock new layer",
            onComplete() {player[this.layer].points = player[this.layer].points.add(1)}
        },
        14: {
            name: "Efficient Training",
            done() {return player.ac.points.gte(3)},
            tooltip: "Reach 3 ACT<br>Reward: Add ACP to the effect of LVL.3",
            onComplete() {player[this.layer].points = player[this.layer].points.add(1)}
        },
        
    },
},
)