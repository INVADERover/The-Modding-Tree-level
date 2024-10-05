addLayer("t", {
    name: "Training",
    symbol: "T",
    position: 0,
    startData() { 
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "#4BDC13",
    requires: new Decimal(10),
    resource: "Training",
    baseResource: "points",
    baseAmount() { return player.points },
    type: "normal",
    exponent: 0.5,
    
    gainMult() {
        let mult = new Decimal(1);
        if (hasUpgrade('l', 22)) mult = mult.times(upgradeEffect('l', 22));
        if (hasUpgrade('t', 24)) mult = mult.times(upgradeEffect('t', 24));
        if (hasUpgrade('t', 25)) mult = mult.times(upgradeEffect('t', 25));
        if (hasUpgrade('l', 25)) mult = mult.times(upgradeEffect('l', 25));

        if (hasUpgrade('l', 25)) mult = mult.times(layers.c.effect());
        return mult;
    },

    gainExp() {
        return new Decimal(1);
    },
    
    row: 0,
    layerShown() { return true },

    upgrades: {
        21: { 
            title: "-T11-",
            description: "x2 EXP gain",
            cost() {return new Decimal(2).times(player.c.c1up)},
            effect() {
                let eff = new Decimal(2);
                if (hasUpgrade('l', 24)) eff = eff.add(upgradeEffect('l', 24));
                return eff;
            },
            effectDisplay() { return format(this.effect()) + "x" },
            unlocked() { return player.a.points.gte(1) },
            onPurchase() { if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }}//C12
        },
        22: { 
            title: "-T12-",
            description: "EXP boost to EXP gain",
            cost() {return new Decimal(2).times(player.c.c1up)},
            effect() { return player.points.add(1).pow(0.06) },
            effectDisplay() { return format(this.effect()) + "x" },
            unlocked() { return hasUpgrade("t", 21) },
            onPurchase() { if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }}//C12
        },
        23: { 
            title: "-T13-",
            description: "TRA boost to EXP gain",
            cost() {return new Decimal(3).times(player.c.c1up)},
            effect() { return player[this.layer].points.add(2).pow(0.1) },
            effectDisplay() { return format(this.effect()) + "x" },
            unlocked() { return hasUpgrade("t", 22) },
            onPurchase() { if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }}//C12
        },
        24: { 
            title: "-T14-",
            description: "TRA boost to TRA gain",
            cost() {return new Decimal(18).times(player.c.c1up)},
            effect() { return player[this.layer].points.add(2).pow(0.04) },
            effectDisplay() { return format(this.effect()) + "x" },
            unlocked() { return player.l.points.gte(1) && hasUpgrade("t", 23) },
            onPurchase() { if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }}//C12
        },
        25: { 
            title: "-T15-",
            description: "x4 TRA gain",
            cost() {return new Decimal(90).times(player.c.c1up)},
            effect() { return 4 },
            unlocked() { return hasUpgrade("t", 24) },
            onPurchase() { if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }}//C12
        },
        26: { 
            title: "-T16-",
            description: "x6 EXP gain",
            cost() {return new Decimal(1111).times(player.c.c1up)},
            effect() { return 6 },
            unlocked() { return hasMilestone("m", 1) && hasUpgrade("t", 25) },
            onPurchase() { if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }}//C12
        },
        27: { 
            title: "-T17-",
            description: "Meditation cost is decreased based on EXP",
            cost() {return new Decimal(1000000).times(player.c.c1up)},
            effect() { return player[this.layer].points.add(2).pow(0.04) },
            unlocked() { return hasMilestone("m", 1) && hasUpgrade("t", 26) },
            onPurchase() { if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }}//C12
        },
    },

    buyables: {
        11: {
            title: "-TB1-",
            cost(x) {
                let cost = Decimal.pow(11, x).times(player.c.c1up);

                if (hasUpgrade('p', 21)) {
                    cost = cost.div(upgradeEffect('p', 21));
                }
                return cost.ceil();
            },
            effect(x) { return Decimal.pow(2, x); },
            display() {
                return "x2 EXP gain<br><br><br>" +
                       "Amount: " + player.t.buyables[11] + "<br><br>" +
                       "effect: x" + format(tmp.t.buyables[11].effect) + "<br>" +
                       "Cost:" + format(tmp.t.buyables[11].cost) + " TRA";
            },
            canAfford() { return player.t.points.gte(tmp.t.buyables[11].cost) },
            buy() {
                let cost = this.cost();
                if (hasMilestone('p', 0)) { cost = cost.div(2) }

                player.t.points = player.t.points.sub(cost);
                if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }//C12
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            unlocked() { return hasUpgrade("l", 21) },
            style: { 'height': '150px', 'width': '150px', 'font-size': '12px' },
        },
        12: {
            title: "-TB2-",
            cost(x) { return Decimal.pow(x.add(1), x.add(1)).times(player.c.c1up) },
            effect(x) {
                let eff = Decimal.add(x)
                if (hasMilestone("c", 0)) eff = eff.times(2)
                return eff
            },
            display() {
                return "Add to gain TRA<br><br>" +
                       "Amount: " + player.t.buyables[12] + "<br><br>" +
                       "effect: +" + format(tmp.t.buyables[12].effect) + "%<br>" +
                       "Cost:" + format(tmp.t.buyables[12].cost) + " TRA";
            },
            canAfford() { return player.t.points.gte(tmp.t.buyables[12].cost) },
            buy() {
                let cost = this.cost();
                if (hasMilestone('p', 3)) { cost = cost.div(2) }

                player.t.points = player.t.points.sub(cost);
                if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }//C12
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1));
            },
            unlocked() { return hasMilestone('p', 1) },
            style: { 'height': '150px', 'width': '150px', 'font-size': '12px' },
        },
    },
    
    automate() {
        if (tmp.t.buyables[11].canAfford && player.m.autoTB1) {
            addBuyables('t', 11, 1);
            if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }//C12
            let cu1 = 0;
            if (hasMilestone('p', 0)) { cu1 += 1; }
            switch (cu1) {
                case 0:
                    player.t.points = player.t.points.sub(tmp.t.buyables[11].cost);
                    break;
                case 1:
                    player.t.points = player.t.points.sub(tmp.t.buyables[11].cost.div(2));
                    break;
            }
        }
        if (tmp.t.buyables[12].canAfford && player.m.autoTB2) {
            addBuyables('t', 12, 1);
            if (inChallenge('c', 12)) { player.c.c1up = player.c.c1up.times(10) }//C12
            let cu = 0;
            if (hasMilestone('p', 3)) { cu += 1; }
            switch (cu) {
                case 0:
                    player.t.points = player.t.points.sub(tmp.t.buyables[12].cost);
                    break;
                case 1:
                    player.t.points = player.t.points.sub(tmp.t.buyables[12].cost.div(2));
                    break;
            }
        }
    },

    tabFormat: [
        "main-display",
        "prestige-button",
        "blank",
        ["display-text", function() {
            if (hasUpgrade('l', 23)) {
                return 'Gain ' + format(upgradeEffect('l', 23)) + '% per second';
            }
        }],
        "blank",
        "buyables",
        "blank",
        "upgrades"
    ],

    passiveGeneration() {
        if (hasUpgrade('l', 23)) return upgradeEffect('l', 23).div(100);
    },

    doReset(resettingLayer) {
        if (layers[resettingLayer].row > this.row) {
            layerDataReset(this.layer);
            if (player.m.points.gte(1)) player.t.upgrades.push("21");
            if (player.m.points.gte(2)) player.t.upgrades.push("22");
            if (player.m.points.gte(3)) player.t.upgrades.push("23");
            if (player.m.points.gte(4)) player.t.upgrades.push("24");
            if (player.m.points.gte(5)) player.t.upgrades.push("25");
            if (player.m.points.gte(6)) player.t.upgrades.push("26");
            if (player.m.points.gte(7)) player.t.upgrades.push("27");
        }
    },
});

addLayer("m", {
    name: "Meditation",
    symbol: "M",
    position: 1,
    startData() { 
        return {
            unlocked: 0,
            points: new Decimal(0),
        }
    },
    color: "#65BBE9",
    requires: new Decimal(2000),
    resource: "Meditation",
    baseResource: "Training",
    baseAmount() { return player.t.points },
    type: "static",
    exponent: 2,
    base: 2,
    gainMult() {
        let mult = new Decimal(1)
        return mult
    },
    gainExp() {
        let mult = new Decimal(1)
        return mult
    },
    row: 1,
    layerShown() { return hasAchievement("a", 13) },
    
    upgrades: {
        21: {
            title: "-M11-",
            description: "MED boost to EXP gain",
            cost: new Decimal(1),
            effect() { return Decimal.pow(1.5, player.m.points).add(1) },
            effectDisplay() { return format(this.effect()) + "x" },
        },
        22: {
            title: "-M12-",
            description: "x2 PHY gain",
            cost: new Decimal(4),
            effect() { return Decimal.add(2) },
            unlocked() { 
                return hasUpgrade("m", 21) && hasUpgrade("l", 25)
            },
        },
    },

    milestones: {
        0: { 
            requirementDescription: "1 MED",
            effectDescription: "Keep TRA upgrades based on Med<br>Gain TRA per second by MED",
            done() { return player.m.points.gte(1) }
        },
        1: { 
            requirementDescription: "2 MED",
            effectDescription: "2 New TRA Upgrade",
            done() { return player.m.points.gte(2) }
        },
        2: { 
            requirementDescription: "3 MED",
            effectDescription: "Gain TRA per second by ACP",
            done() { return player.m.points.gte(3) }
        },
    },
})

addLayer("p", {
    name: "Physical",
    symbol: "P",
    position: 3,
    startData() { 
        return {
            unlocked: 0,
            points: new Decimal(0),
        }
    },
    effect() { 
        return player.p.points.add(1).pow(0.2) 
    },
    effectDescription() { 
        return "<br>x" + format(this.effect()) + " EXP gain" 
    },
    color: "#F15A22",
    requires: new Decimal(200000),
    resource: "Physical",
    baseResource: "TRA",
    baseAmount() { return player.t.points },
    type: "normal",
    exponent: 0.4,
    gainMult() {
        let mult = new Decimal(1)
        if (hasMilestone('p', 2)) mult = mult.times(1.5)
        if (hasUpgrade('m', 22)) mult = mult.times(upgradeEffect('m', 22))
        return mult
    },
    gainExp() {
        let mult = new Decimal(1)
        return mult
    },
    row: 1,
    layerShown() { return hasUpgrade('l', 25) },
    
    upgrades: {
        21: {
            title: "-P11-",
            description: "Divide TB1 cost by Med",
            cost: new Decimal(5),
            effect() { return player.m.points.add(1) },
            effectDisplay() { return "/" + format(this.effect()) },
        },
    },

    milestones: {
        0: { 
            requirementDescription: "1 Phy -PM1-",
            effectDescription: function() {
                if (hasMilestone('p', 3)) {
                    return "Autobuy TB1&2<br>Buying TB1&2 uses half the resources."
                } else {
                    return "Autobuy TB1<br>Buying TB1 uses half the resources."
                }
            
            },

            done() { 
                return player.p.points.gte(1);
            },
            toggles: function() {
                let data = [["m", "autoTB1"]];
                if (hasMilestone('p', 3)) {
                    data.push(["m", "autoTB2"]);
                }
                return data;
            },
        },
        1: { 
            requirementDescription: "2 Phy -PM2-",
            effectDescription: "Unlock a new buyable to Training",
            done() { return player.p.points.gte(2) },
        },
        2: { 
            requirementDescription: "3 Phy -PM3-",
            effectDescription: "x1.5 PHY gain",
            done() { return player.p.points.gte(3) },
        },
        3: { 
            requirementDescription: "15 Phy -PM4-",
            effectDescription: "Add TB2 to the effect of Physical milestone 1",
            done() { return player.p.points.gte(15) },
        },
    },
})

addLayer("c", {
    name: "Challenge",
    symbol: "C",
    position: 2,
    row: 1,
    color: "#FFD700",
    resource: "Challenge",
    startData() { 
        return {
            unlocked: true,
            points: new Decimal(0),
            c1up: new Decimal(1),
        }
    },
    effect() { 
        return player.c.points.pow(2,player.c.points).add(1)
    },
    effectDescription() { 
        return "<br>x" + format(this.effect()) + " TRA gain" 
    },

    challenges: {
        11: {
            name: "-C1-",
            completionLimit: 3,
            challengeDescription() {//回数による表記設定
                let dbuf = new Decimal(0)
                switch (challengeCompletions('c', 11)) {
                    case 0:
                        dbuf = new Decimal(100)
                        break;
                    case 1:
                        dbuf = new Decimal(1000)
                        break;
                }
                return "complete: " + challengeCompletions('c', 11) + "/3<br><br>The price of Training upgrades and buyable is multiplied by " + Decimal.pow(10, challengeCompletions('c', 11) + 2) + "<br>and all Training upgrades reset.<br>"
            },
            goalDescription: "100,000,000 EXP<br>",
            
            canComplete(){return player.points.gte(100000000) },

            rewardDescription: "Get 1 Challenge point",

            onEnter() {
                player.points = new Decimal(0)
                player.t.points = new Decimal(0)
                player.t.upgrades = []
                player.t.buyables[11] = new Decimal(0)
                player.t.buyables[12] = new Decimal(0)
                player.c.c1up = Decimal.pow(10, challengeCompletions('c', 11) + 2)//upgrade倍率コンプリート回数
            },
            onExit() {
                player.c.c1up = new Decimal(1)
            },
            onComplete() {
                player.c.points = player.c.points.add(1)
            },
        },

        12: {
            name: "-C2-",
            completionLimit: 3,
            challengeDescription() {return "Each time you purchase a TB, its cost is multiplied by 10." },
            goalDescription: "100,000,000 EXP<br>",
            
            canComplete(){return player.points.gte(100000000) },

            rewardDescription: "Get 1 Challenge point",

            onEnter() {
                player.points = new Decimal(0)
                player.t.points = new Decimal(0)
                player.t.upgrades = []
                player.t.buyables[11] = new Decimal(0)
                player.t.buyables[12] = new Decimal(0)
            },
            onExit() {
                player.c.c1up = new Decimal(1)
            },
            onComplete() {
                player.c.points = player.c.points.add(1)
            },
        },
    },

    milestones: {
        0: { 
            requirementDescription: "1 Cha -CM1-",
            effectDescription: "Double TB2 effect",
            done() { 
                return player.c.points.gte(1);
            },
        },
    },

    tabFormat: [
        "main-display",
        "challenges",
        "blank",
        "milestones"
    ],

    layerShown() { return hasUpgrade('l', 31) },
})

addLayer("l", {
    startData() { 
        return {
            unlocked: true,
            points: new Decimal(0),
            level_cost: new Decimal(0),
        }
    },
    color: "green",
    resource: "LVL",
    row: "side",

    upgrades: {
        21: {
            title: "Lvl.1",
            description: "Unlock a new buyable to Training",
            currencyDisplayName: "Exp",
            currencyInternalName: "points",
            cost: new Decimal(50),
            onPurchase() { player.l.points = player.l.points.add(1) },
        },
        22: {
            title: "Lvl.2",
            description: "LVL boost to Tra gain",
            currencyDisplayName: "Exp",
            currencyInternalName: "points",
            cost: new Decimal(300),
            effect() { return Decimal.pow(1.2, player.l.points) },
            effectDisplay() { return format(this.effect()) + "x" },
            onPurchase() { player.l.points = player.l.points.add(1) },
            unlocked() { return hasUpgrade("l", 21) },
        },
        23: {
            title: "Lvl.3",
            description: "Gain TRA per second by LVL",
            currencyDisplayName: "Tra",
            currencyInternalName: "points",
            currencyLayer: "t",
            cost: new Decimal(50),
            effect() {
                let eff = Decimal.add(player.l.points, 2)
                if (hasMilestone("m", 0)) eff = eff.add(player.m.points)
                if (hasMilestone("m", 2)) eff = eff.add(player.a.points)
                eff = eff.add(buyableEffect("t", 12))

                return eff
            },
            onPurchase() { player.l.points = player.l.points.add(1) },
            unlocked() { return hasUpgrade("l", 22) },
        },
        24: {
            title: "Lvl.4",
            description: "-T11- is boosted by other Tra upgrades.",
            currencyDisplayName: "Exp",
            currencyInternalName: "points",
            cost: new Decimal(500000),
            effect() { return Decimal.add(player.t.upgrades.length).div(2) },
            effectDisplay() { return format(this.effect()) + "+" },
            onPurchase() { player.l.points = player.l.points.add(1) },
            unlocked() { return hasUpgrade("l", 23) },
        },
        25: {
            title: "Lvl.5",
            description: "Unlock new layer<br>&<br>x2 Tra gain",
            currencyDisplayName: "Med",
            currencyInternalName: "points",
            currencyLayer: "m",
            cost: new Decimal(3),
            effect() { return 2 },
            onPurchase() { player.l.points = player.l.points.add(1) },
            unlocked() { return hasUpgrade("l", 24) },
        },
        31: {
            title: "Lvl.6",
            description: "Unlock new layer",
            currencyDisplayName: "Phy",
            currencyInternalName: "points",
            currencyLayer: "p",
            cost: new Decimal(20),
            onPurchase() { player.l.points = player.l.points.add(1) },
            unlocked() { return hasUpgrade("l", 25) },
        },
    },

    layerShown() { return hasAchievement("a", 12) },
    milestonePopups: false,
})

addLayer("a", {
    startData() { 
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },
    color: "yellow",
    resource: "ACP",
    row: "side",
    tooltip() {
        return ("Achievements")
    },
    achievementPopups: true,
    achievements: {
        11: {
            name: "Reach 1 Tra",
            done() { return player.t.points.gte(1) },
            tooltip: "Reward: Add ACP to the effect of BASE_EXP",
            onComplete() { player.a.points = player.a.points.add(1) }
        },
        12: {
            name: "Purchase -T13-",
            done() { return hasUpgrade("t", 23) },
            tooltip: "Reward: Unlock LevelUp",
            onComplete() { player.a.points = player.a.points.add(1) }
        },
        13: {
            name: "Purchase -T15-",
            done() { return hasUpgrade("t", 25) },
            tooltip: "Reward: Unlock new layer",
            onComplete() { player.a.points = player.a.points.add(1) }
        },
        14: {
            name: "Reach Lvl.5",
            done() { return hasUpgrade("l", 25) },
            onComplete() { player.a.points = player.a.points.add(1) }
        },
        15: {
            name: "Reach 5 Phy",
            done() { return player.p.points.gte(5) },
            onComplete() { player.a.points = player.a.points.add(1) }
        },
        16: {
            name: "Complete One Challenge",
            done() { return player.c.points.gte(1) },
            onComplete() { player.a.points = player.a.points.add(1) }
        },
    },
})
