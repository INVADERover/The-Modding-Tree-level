addLayer("t", {
    name: "Training", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "T", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10),
    resource: "Training", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('l', 12)) mult = mult.times(upgradeEffect('l', 12))
        if (hasUpgrade('t', 24)) mult = mult.times(upgradeEffect('t', 24))
        if (hasUpgrade('t', 25)) mult = mult.times(upgradeEffect('t', 25))
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
                if (hasUpgrade('l', 14)) eff = eff.add(upgradeEffect('l', 14))
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
            unlocked(){return hasUpgrade("t",21)}
        },

        23: { title: "-T13-",
            description: "TRA boost to EXP gain",
            cost: new Decimal(3),
            effect() {return player[this.layer].points.add(2).pow(0.1)},
            effectDisplay() {return format(this.effect())+"x"},
            unlocked(){return hasUpgrade("t",22)}
        },
            
        24: { title: "-T14-",
            description: "TRA boost to TRA gain",
            cost: new Decimal(18),
            effect() {return player[this.layer].points.add(2).pow(0.04)},
            effectDisplay() {return format(this.effect())+"x"},
            unlocked(){
                if ((player.l.points.gte(1)) && (hasUpgrade("t",23))){return true}},
        },

        25: { title: "-T15-",
            description: "x4 TRA gain",
            cost: new Decimal(90),
            effect() {return 4},
            unlocked(){return hasUpgrade("t",24)},
        },
        
        26: { title: "-T16-",
            description: "x4 EXP gain",
            cost: new Decimal(1111),
            effect() {return 4},
            unlocked(){if ((hasMilestone("m", 1)) && (hasUpgrade("t",25))){return true}},
        },

        27: { title: "-T17-",
            description: "Meditation cost is decreased based on EXP",
            cost: new Decimal(4000),
            effect() {return player[this.layer].points.add(2).pow(0.04)},
            unlocked(){if ((hasMilestone("m", 1)) && (hasUpgrade("t",26))){return true}},
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
            style: {'height':'150px', 'width':'150px', 'font-size':'12px',},
        },
    },

    passiveGeneration(){if (hasUpgrade('l', 13))return upgradeEffect('l', 13).div(100)},

    doReset(resettingLayer){
        if(layers[resettingLayer].row > this.row) {
        layerDataReset(this.layer)
        if (player.m.points.gte(1))player.t.upgrades.push("21")
        if (player.m.points.gte(2))player.t.upgrades.push("22")
        if (player.m.points.gte(3))player.t.upgrades.push("23")
        if (player.m.points.gte(4))player.t.upgrades.push("24")
        if (player.m.points.gte(5))player.t.upgrades.push("25")
        if (player.m.points.gte(6))player.t.upgrades.push("26")
        if (player.m.points.gte(7))player.t.upgrades.push("27")

    }},
    },
)

addLayer("m", {
    name: "Meditation", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: 0,
		points: new Decimal(0),
    }},
    color: " #9d5b8b",
    requires: new Decimal(2000), // Can be a function that takes requirement increases into account
    resource: "Meditation", // Name of prestige currency
    baseResource:  "Training", // Name of resource prestige is based on
    baseAmount() {return player.t.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)

        mult = mult.divide(3)
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
            description: "MED boost to EXP gain",
            cost: new Decimal(1),
            effect() {return Decimal.pow(1.5,player.m.points).add(0.5)},
            effectDisplay() {return format(this.effect())+"x"},
            },
    },

    milestones: {
        0: { requirementDescription: "1 MED",
            effectDescription: "Keep TRA upgrades based on MED<br>Add MED to the effect of LVL.3",
            done() { return player.m.points.gte(1) }
        },
        1: { requirementDescription: "2 MED",
            effectDescription: "2 New Rocket Upgrade",
            done() { return player.m.points.gte(2) }
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
            description: "Unlock a new buyable to Training",
            currencyDisplayName:"EXP",
            currencyInternalName:"points",
            cost: new Decimal(50),
            onPurchase(){player[this.layer].points = player[this.layer].points.add(1)},
            },

        12: {
            title: "Lvl.2",
            description: "LVL boost to TRA gain",
            currencyDisplayName:"EXP",
            cur00rencyInternalName:"points",
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
            currencyLayer:"t",
            cost: new Decimal(50),
            effect() {
                let eff = player.l.points.add(2).add(player.m.points)
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
            cost: new Decimal(300000),
            effect() { return Decimal.add(player.t.upgrades.length).div(2)},
            effectDisplay() {return format(this.effect())+"+"},
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
            done() {return player.t.points.gte(1)},
            tooltip: "Get a 1 Tra<br><br>Reward: Add ACP to the effect of BASE_EXP",
            onComplete() {player[this.layer].points = player[this.layer].points.add(1)}
        },
        12: {
            name: "The long training begins",
            done() {return hasUpgrade("t",23)},
            tooltip: "Purchase -T13-<br><br>Reward: Unlock LevelUp",
            onComplete() {player[this.layer].points = player[this.layer].points.add(1)}
        },
        13: {
            name: "Next layer",
            done() {return hasUpgrade("t",25)},
            tooltip: "Purchase -T15-<br><br>Reward: Unlock new layer",
            onComplete() {player[this.layer].points = player[this.layer].points.add(1)}
        },        
        14: {
            name: "Efficient Training",
            done() {return player.m.points.gte(3)},
            tooltip: "Reach 3 MED<br><br>Reward: Add ACP to the effect of LVL.3",
            onComplete() {player[this.layer].points = player[this.layer].points.add(1)}
        },
        
    },
},
)