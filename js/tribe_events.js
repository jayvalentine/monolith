/// <reference path="./tribe.ts">
/// <reference path="./random.ts">
/// <reference path="./tribe_events_discovery.ts">
/// <reference path="./tribe_events_disasters.ts">
var EncounterEvent = /** @class */ (function () {
    function EncounterEvent() {
    }
    EncounterEvent.triggers = function (tribe, region, progress) {
        if (tribe.attitudes.monolith != Attitudes.Monolith.Unencountered)
            return false;
        else if (region.hasMonolith)
            return true;
        return false;
    };
    EncounterEvent.progress = function (tribe, region) {
        return 0;
    };
    EncounterEvent.isChoice = function () {
        return false;
    };
    EncounterEvent.choices = function (tribe) {
        return [];
    };
    EncounterEvent.choicePrompt = function (tribe) {
        return "";
    };
    EncounterEvent.outcomeMessages = function (tribe, region) {
        var roll = Random.interval(0, 2);
        switch (roll) {
            case 0:
                EncounterEvent.newAttitude = Attitudes.Monolith.Curious;
                break;
            case 1:
                EncounterEvent.newAttitude = Attitudes.Monolith.Superstitious;
                break;
            case 2:
                EncounterEvent.newAttitude = Attitudes.Monolith.Fearful;
                break;
        }
        return ["You encounter a tribe of " + tribe.population() + " people.\n    They are " + tribe.attitudes.othersString() + ", " + tribe.attitudes.worldString() + ",\n    and " + tribe.attitudes.selfString() + ".\n    They seem " + Attitudes.MonolithString(EncounterEvent.newAttitude) + " towards you."];
    };
    EncounterEvent.outcomeFunctions = function (tribe, region) {
        var attitude = EncounterEvent.newAttitude;
        return [function () {
                tribe.attitudes.monolith = attitude;
                console.log("Direct encounter: set tribe attitude to " + Attitudes.MonolithString(attitude));
            }];
    };
    EncounterEvent.id = "EncounterEvent";
    return EncounterEvent;
}());
var IndirectEncounterEvent = /** @class */ (function () {
    function IndirectEncounterEvent() {
    }
    IndirectEncounterEvent.triggers = function (tribe, region, progress) {
        if (tribe.attitudes.monolith != Attitudes.Monolith.Unencountered)
            return false;
        // Get any other encountered tribes in the region.
        var otherTribes = region.tribes().filter(function (value, index, array) {
            return (value != tribe) && (value.attitudes.monolith != Attitudes.Monolith.Unencountered);
        });
        if (otherTribes.length > 0)
            return true;
        else
            return false;
    };
    IndirectEncounterEvent.progress = function (tribe, region) {
        return 0;
    };
    IndirectEncounterEvent.isChoice = function () {
        return false;
    };
    IndirectEncounterEvent.choices = function (tribe) {
        return [];
    };
    IndirectEncounterEvent.choicePrompt = function (tribe) {
        return "";
    };
    IndirectEncounterEvent.outcomeMessages = function (tribe, region) {
        // Get any tribes in the region that have been encountered.
        var otherTribes = region.tribes().filter(function (value, index, array) {
            return (value != tribe) && (value.attitudes.monolith != Attitudes.Monolith.Unencountered);
        });
        // Choose one at random.
        IndirectEncounterEvent.otherTribe = Random.choice(otherTribes);
        var attitude = Attitudes.MonolithString(IndirectEncounterEvent.otherTribe.attitudes.monolith);
        return [tribe.titleCapitalized() + " has encountered a new tribe of " + tribe.population() + " people.\n    After hearing of you, they seem " + attitude + "."];
    };
    IndirectEncounterEvent.outcomeFunctions = function (tribe, region) {
        var attitude = IndirectEncounterEvent.otherTribe.attitudes.monolith;
        return [function () {
                tribe.attitudes.monolith = attitude;
                console.log("Indirect encounter: set " + tribe.title() + " attitude to " + Attitudes.MonolithString(attitude));
            }];
    };
    IndirectEncounterEvent.id = "IndirectEncounterEvent";
    return IndirectEncounterEvent;
}());
var TribeDestroyedEvent = /** @class */ (function () {
    function TribeDestroyedEvent() {
    }
    TribeDestroyedEvent.triggers = function (tribe, region, progress) {
        if (tribe.population() <= 0)
            return true;
        else
            return false;
    };
    TribeDestroyedEvent.progress = function (tribe, region) {
        return 0;
    };
    TribeDestroyedEvent.isChoice = function () {
        return false;
    };
    TribeDestroyedEvent.choices = function (tribe) {
        return [];
    };
    TribeDestroyedEvent.choicePrompt = function (tribe) {
        return "";
    };
    TribeDestroyedEvent.outcomeMessages = function (tribe, region) {
        if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered) {
            return [""];
        }
        else {
            return ["You sense a great loss. " + tribe.titleCapitalized() + " is no more."];
        }
    };
    TribeDestroyedEvent.outcomeFunctions = function (tribe, region) {
        return [function () { tribe.dead = true; console.log(tribe.title() + " has died."); }];
    };
    TribeDestroyedEvent.id = "TribeDestroyedEvent";
    return TribeDestroyedEvent;
}());
var AttackEvent = /** @class */ (function () {
    function AttackEvent() {
    }
    AttackEvent.triggers = function (tribe, region, progress) {
        var c = 0.0001;
        if (tribe.attitudes.others == Attitudes.Others.Aggressive)
            c = 0.0002;
        // Are there any other tribes in this region?
        var otherTribes = region.tribes().filter(function (value, index, array) { return value != tribe; });
        // Defensive tribes will attack if relationship is -1 or lower.
        // Any other non-aggressive tribe will attack if -2 or lower.
        if (tribe.attitudes.others == Attitudes.Others.Defensive) {
            otherTribes = otherTribes.filter(function (v, i, a) { return tribe.relationship(v) <= -1; });
        }
        else if (tribe.attitudes.others != Attitudes.Others.Aggressive) {
            otherTribes = otherTribes.filter(function (v, i, a) { return tribe.relationship(v) <= -2; });
        }
        if (otherTribes.length == 0)
            return false;
        // Triggers with chance 0.0001.
        if (Random.chance(c)) {
            AttackEvent.defender = Random.choice(otherTribes);
            return true;
        }
        else {
            return false;
        }
    };
    AttackEvent.progress = function (tribe, region) {
        return 0;
    };
    AttackEvent.isChoice = function () {
        return false;
    };
    AttackEvent.choices = function (tribe) {
        return [];
    };
    AttackEvent.choicePrompt = function (tribe) {
        return "";
    };
    AttackEvent.outcomeMessages = function (tribe, region) {
        var attacker = tribe;
        var attackerRoll = (Random.interval(1, 10) + attacker.attack()) * Math.floor(attacker.population() * 0.1);
        var defenderRoll = (Random.interval(1, 10) + AttackEvent.defender.defense()) * Math.floor(AttackEvent.defender.population() * 0.1);
        AttackEvent.outcome = (attackerRoll - defenderRoll);
        // Silent message if none of the tribes involved have been encountered.
        if ((attacker.attitudes.monolith == Attitudes.Monolith.Unencountered)
            && (AttackEvent.defender.attitudes.monolith == Attitudes.Monolith.Unencountered)) {
            return [""];
        }
        var outcomeMessage;
        var lossesMessage = "";
        if (AttackEvent.outcome > 0) {
            var defenderLosses = Math.min(AttackEvent.defender.population(), AttackEvent.outcome);
            outcomeMessage = "The attack was successful.";
            if (defenderLosses == AttackEvent.defender.population()) {
                lossesMessage = "The defenders have been wiped out.";
            }
            else {
                lossesMessage = "The defenders have lost " + defenderLosses + " people in the attack.";
            }
        }
        else if (AttackEvent.outcome < 0) {
            var attackerLosses = Math.min(attacker.population(), -AttackEvent.outcome);
            outcomeMessage = "The attack was repulsed.";
            if (attackerLosses == attacker.population()) {
                lossesMessage = "The attackers have been wiped out.";
            }
            else {
                lossesMessage = "The attackers have lost " + attackerLosses + " people in the attack.";
            }
        }
        else {
            outcomeMessage = "The attack ended in a stalemate.";
        }
        return [attacker.titleCapitalized() + " has attacked " + AttackEvent.defender.title() + ".\n    " + outcomeMessage + "\n    " + lossesMessage];
    };
    AttackEvent.outcomeFunctions = function (tribe, region) {
        var defender = AttackEvent.defender;
        var outcome = AttackEvent.outcome;
        if (outcome > 0) {
            return [function () {
                    console.log("attack: success (" + outcome + ")");
                    defender.decreasePopulation(outcome);
                    tribe.increasePopulation(Math.floor(outcome / 2));
                }];
        }
        else if (outcome < 0) {
            return [function () {
                    console.log("attack: failure (" + outcome + ")");
                    tribe.decreasePopulation(-outcome);
                }];
        }
        else {
            return [function () {
                    console.log("attack: stalemate");
                }];
        }
    };
    AttackEvent.id = "AttackEvent";
    return AttackEvent;
}());
var MigrationEvent = /** @class */ (function () {
    function MigrationEvent() {
    }
    MigrationEvent.triggers = function (tribe, region, progress) {
        return tribe.migrate();
    };
    MigrationEvent.progress = function (tribe, region) {
        return 0;
    };
    MigrationEvent.isChoice = function () {
        return false;
    };
    MigrationEvent.choices = function (tribe) {
        return [];
    };
    MigrationEvent.choicePrompt = function (tribe) {
        return "";
    };
    MigrationEvent.outcomeMessages = function (tribe, region) {
        var otherRegions = region.nearby();
        MigrationEvent.migrateRegion = Random.choice(otherRegions);
        if (tribe.attitudes.monolith != Attitudes.Monolith.Unencountered) {
            return [
                tribe.titleCapitalized() + " has migrated from a " + region.typeDescription() + " region to\n        a " + MigrationEvent.migrateRegion.typeDescription() + " region."
            ];
        }
        else
            return [""];
    };
    MigrationEvent.outcomeFunctions = function (tribe, region) {
        var migrateRegion = MigrationEvent.migrateRegion;
        return [function () {
                region.removeTribe(tribe);
                migrateRegion.addTribe(tribe);
                console.log(tribe.title() + " has migrated from " + region.typeString() + " to " + migrateRegion.typeString() + ".");
            }];
    };
    MigrationEvent.id = "MigrationEvent";
    return MigrationEvent;
}());
var TribeWorshipsMonolithEvent = /** @class */ (function () {
    function TribeWorshipsMonolithEvent() {
    }
    TribeWorshipsMonolithEvent.triggers = function (tribe, region, progress) {
        if (tribe.attitudes.monolith != Attitudes.Monolith.Superstitious)
            return false;
        if (!region.hasMonolith)
            return false;
        // This event does not trigger if the tribe already worships the monolith.
        if (tribe.hasCulture("worshipsMonolith")) {
            return false;
        }
        return Random.progressiveChance(0.0001, progress, 0.1);
    };
    TribeWorshipsMonolithEvent.progress = function (tribe, region) {
        return Random.interval(0, 2);
    };
    TribeWorshipsMonolithEvent.isChoice = function () {
        return true;
    };
    TribeWorshipsMonolithEvent.choices = function (tribe) {
        return [
            "I am not their god.",
            "I am their god, and I am good.",
            "I am their god, and they should fear me."
        ];
    };
    TribeWorshipsMonolithEvent.choicePrompt = function (tribe) {
        return tribe.titleCapitalized() + " has taken a great interest in you. Tribe members regularly visit you, bringing\n    small offerings and prostrating themselves at your base. It becomes obvious that this is a form of primitive worship.";
    };
    TribeWorshipsMonolithEvent.outcomeMessages = function (tribe, region) {
        return [
            "The tribe is confused, but seems to accept the fact that you are not a supernatural being.",
            "The tribe rejoices, pleased to have your approval. The visits become more frequent.",
            "The tribe is terrified of you, and while they begin bringing larger offerings, it is clear that the reasons\n      for their reverance have changed."
        ];
    };
    TribeWorshipsMonolithEvent.outcomeFunctions = function (tribe, region) {
        return [
            function () {
                // 50% chance for tribe to become curious.
                // 50% chance for tribe to migrate.
                if (Random.chance(0.5)) {
                    tribe.attitudes.monolith = Attitudes.Monolith.Curious;
                }
                else {
                    var otherRegions = region.nearby();
                    var migrateRegion = Random.choice(otherRegions);
                    region.removeTribe(tribe);
                    migrateRegion.addTribe(tribe);
                }
            },
            function () {
                // Tribe stays superstitious and migration chance reduces to 0.
                tribe.attitudes.monolith = Attitudes.Monolith.Superstitious;
                tribe.addCulture("worshipsMonolith");
                tribe.setMigrationChance(0);
            },
            function () {
                // Tribe becomes fearful.
                tribe.attitudes.monolith = Attitudes.Monolith.Fearful;
                tribe.addCulture("worshipsMonolith");
                tribe.addCulture("fearsMonolith");
            }
        ];
    };
    TribeWorshipsMonolithEvent.id = "TribeWorshipsMonolithEvent";
    return TribeWorshipsMonolithEvent;
}());
var TribeCuriousOfMonolithEvent = /** @class */ (function () {
    function TribeCuriousOfMonolithEvent() {
    }
    TribeCuriousOfMonolithEvent.triggers = function (tribe, region, progress) {
        if (tribe.attitudes.monolith != Attitudes.Monolith.Curious)
            return false;
        if (!region.hasMonolith)
            return false;
        // This event does not trigger if the tribe already worships the monolith.
        if (tribe.hasCulture("curiousOfMonolith")) {
            return false;
        }
        return Random.progressiveChance(0.0001, progress, 0.1);
    };
    TribeCuriousOfMonolithEvent.progress = function (tribe, region) {
        return Random.interval(0, 2);
    };
    TribeCuriousOfMonolithEvent.isChoice = function () {
        return true;
    };
    TribeCuriousOfMonolithEvent.choices = function (tribe) {
        return [
            "I am merely a machine.",
            "They should not be so curious."
        ];
    };
    TribeCuriousOfMonolithEvent.choicePrompt = function (tribe) {
        return "You notice that members of " + tribe.title() + " have been observing you cautiously since your landing.\n    Every now and then some of them visit you, studying your metal exterior. They are obviously wondering what\n    exactly you are.";
    };
    TribeCuriousOfMonolithEvent.outcomeMessages = function (tribe, region) {
        return [
            "The tribe doesn't understand, but seems even more curious about you now.",
            "The tribe is afraid, and stops visiting you."
        ];
    };
    TribeCuriousOfMonolithEvent.outcomeFunctions = function (tribe, region) {
        return [
            function () {
                tribe.addCulture("curiousOfMonolith");
            },
            function () {
                tribe.attitudes.monolith = Attitudes.Monolith.Fearful;
            }
        ];
    };
    TribeCuriousOfMonolithEvent.id = "TribeCuriousOfMonolithEvent";
    return TribeCuriousOfMonolithEvent;
}());
var TribeFearsMonolithEvent = /** @class */ (function () {
    function TribeFearsMonolithEvent() {
    }
    TribeFearsMonolithEvent.triggers = function (tribe, region, progress) {
        if (tribe.attitudes.monolith != Attitudes.Monolith.Fearful)
            return false;
        if (!region.hasMonolith)
            return false;
        // This event does not trigger if the tribe already worships the monolith.
        if (tribe.hasCulture("fearsMonolith")) {
            return false;
        }
        return Random.progressiveChance(0.0001, progress, 0.1);
    };
    TribeFearsMonolithEvent.progress = function (tribe, region) {
        return Random.interval(0, 2);
    };
    TribeFearsMonolithEvent.isChoice = function () {
        return false;
    };
    TribeFearsMonolithEvent.choices = function (tribe) {
        return [];
    };
    TribeFearsMonolithEvent.choicePrompt = function (tribe) {
        return "";
    };
    TribeFearsMonolithEvent.outcomeMessages = function (tribe, region) {
        return [
            "Members of " + tribe.title() + " are taking turns observing you while the rest of the tribe\n      sleeps. They are very clearly afraid of you."
        ];
    };
    TribeFearsMonolithEvent.outcomeFunctions = function (tribe, region) {
        return [
            function () {
                tribe.addCulture("fearsMonolith");
            }
        ];
    };
    TribeFearsMonolithEvent.id = "TribeFearsMonolithEvent";
    return TribeFearsMonolithEvent;
}());
var TribeAsksMonolithPurposeEvent = /** @class */ (function () {
    function TribeAsksMonolithPurposeEvent() {
    }
    TribeAsksMonolithPurposeEvent.triggers = function (tribe, region, progress) {
        if (tribe.attitudes.monolith != Attitudes.Monolith.Curious)
            return false;
        if (!region.hasMonolith)
            return false;
        if (!tribe.hasCulture("curiousOfMonolith"))
            return false;
        if (!tribe.hasTechnology("language"))
            return false;
        if (tribe.hasCulture("touchedByAliens"))
            return false;
        if (tribe.hasCulture("acceptsMonolith"))
            return false;
        return Random.progressiveChance(0.00001, progress, 0.05);
    };
    TribeAsksMonolithPurposeEvent.progress = function (tribe, region) {
        if (tribe.attitudes.monolith != Attitudes.Monolith.Curious)
            return 0;
        if (!region.hasMonolith)
            return 0;
        if (!tribe.hasCulture("curiousOfMonolith"))
            return 0;
        if (!tribe.hasTechnology("language"))
            return 0;
        if (tribe.hasCulture("touchedByAliens"))
            return 0;
        if (tribe.hasCulture("acceptsMonolith"))
            return 0;
        return 1;
    };
    TribeAsksMonolithPurposeEvent.isChoice = function () {
        return true;
    };
    TribeAsksMonolithPurposeEvent.choices = function (tribe) {
        return [
            "I came from another world.",
            "I am merely a machine.",
            "I am a part of this world."
        ];
    };
    TribeAsksMonolithPurposeEvent.choicePrompt = function (tribe) {
        return "One day a strange thing happens. A single member of " + tribe.title() + " approaches\n    you, and kneels at your base. They place one hand on your metal exterior, and then ask you a question:\n    \"What are you, great stone?\"";
    };
    TribeAsksMonolithPurposeEvent.outcomeMessages = function (tribe, region) {
        return [
            "The tribesperson is confused, as they do not know that there are other worlds like this one.\n      However, your interaction seems to plant a seed in their mind, as they consider what you just told them.",
            "The tribesperson seems to understand - you are like their tools and buildings, only different.",
            "The tribesperson seems to understand - you are a natural formation, like the trees and stones around them."
        ];
    };
    TribeAsksMonolithPurposeEvent.outcomeFunctions = function (tribe, region) {
        return [
            function () {
                tribe.addCulture("touchedByAliens");
            },
            function () {
                tribe.addCulture("acceptsMonolith");
            },
            function () {
                tribe.addCulture("acceptsMonolith");
            }
        ];
    };
    TribeAsksMonolithPurposeEvent.id = "TribeAsksMonolithPurposeEvent";
    return TribeAsksMonolithPurposeEvent;
}());
var TribeBuildsTempleEvent = /** @class */ (function () {
    function TribeBuildsTempleEvent() {
    }
    TribeBuildsTempleEvent.triggers = function (tribe, region, progress) {
        // Does not trigger if:
        // Tribe is not in same region as the monolith
        // Tribe does not have the 'worships monolith' culture
        // Tribe does not have construction
        if (!region.hasMonolith)
            return false;
        if (!tribe.hasCulture("worshipsMonolith"))
            return false;
        if (!tribe.hasTechnology("construction"))
            return false;
        // Only triggers once per game.
        if (TribeBuildsTempleEvent.triggered)
            return false;
        if (Random.progressiveChance(0.00001, progress, 0.05)) {
            TribeBuildsTempleEvent.triggered = true;
            return true;
        }
        else {
            return false;
        }
    };
    TribeBuildsTempleEvent.progress = function (tribe, region) {
        if (!region.hasMonolith)
            return 0;
        if (!tribe.hasCulture("worshipsMonolith"))
            return 0;
        if (!tribe.hasTechnology("construction"))
            return 0;
        if (TribeBuildsTempleEvent.triggered)
            return 0;
        return 1;
    };
    TribeBuildsTempleEvent.isChoice = function () {
        return true;
    };
    TribeBuildsTempleEvent.choices = function (tribe) {
        return [
            "I am not worthy of their worship.",
            "They are right to revere me."
        ];
    };
    TribeBuildsTempleEvent.choicePrompt = function (tribe) {
        return "You notice that members of " + tribe.title() + " have begun bringing construction equipment and materials to you.\n    Before long a handful of standing stones, obviously fashioned in your image, surrounds the rim of the crater where you\n    have landed.";
    };
    TribeBuildsTempleEvent.outcomeMessages = function (tribe, region) {
        return [
            "The tribe is confused, as you had told them you were their god.\n      They are worried that building the temple has disturbed you,\n      and leave your landing site in peace, with the temple only half-finished.",
            "The tribe continues constructing the temple, celebrating once it is finished."
        ];
    };
    TribeBuildsTempleEvent.outcomeFunctions = function (tribe, region) {
        return [
            function () {
                region.addStructure("partialMonolithTemple");
                var otherRegions = region.nearby();
                var migrateRegion = Random.choice(otherRegions);
                region.removeTribe(tribe);
                migrateRegion.addTribe(tribe);
            },
            function () {
                tribe.addCulture("celebratesMonolith");
                tribe.addCulture("templeBuilders");
                region.addStructure("monolithTemple");
            }
        ];
    };
    TribeBuildsTempleEvent.id = "TribeBuildsTempleEvent";
    TribeBuildsTempleEvent.triggered = false;
    return TribeBuildsTempleEvent;
}());
var TribeAttacksMonolithEvent = /** @class */ (function () {
    function TribeAttacksMonolithEvent() {
    }
    TribeAttacksMonolithEvent.triggers = function (tribe, region, progress) {
        if (tribe.attitudes.monolith != Attitudes.Monolith.Fearful)
            return false;
        if (!region.hasMonolith)
            return false;
        if (!tribe.hasCulture("fearsMonolith"))
            return false;
        if (!tribe.hasTechnology("tools"))
            return false;
        // This event does not trigger if the monolith is already damaged.
        if (region.hasStructure("damagedMonolith")) {
            return false;
        }
        // This event only triggers once.
        if (TribeAttacksMonolithEvent.triggered)
            return false;
        if (Random.progressiveChance(0.00001, progress, 0.01)) {
            TribeAttacksMonolithEvent.triggered = true;
            return true;
        }
        else {
            return false;
        }
    };
    TribeAttacksMonolithEvent.progress = function (tribe, region) {
        if (tribe.attitudes.monolith != Attitudes.Monolith.Fearful)
            return 0;
        if (!region.hasMonolith)
            return 0;
        if (!tribe.hasCulture("fearsMonolith"))
            return 0;
        if (!tribe.hasTechnology("tools"))
            return 0;
        // This event does not trigger if the monolith is already damaged.
        if (region.hasStructure("damagedMonolith")) {
            return 0;
        }
        // This event only triggers once.
        if (TribeAttacksMonolithEvent.triggered)
            return 0;
        return 1;
    };
    TribeAttacksMonolithEvent.isChoice = function () {
        return true;
    };
    TribeAttacksMonolithEvent.choices = function (tribe) {
        return [
            "They will pay for this.",
            "I am not a threat to them."
        ];
    };
    TribeAttacksMonolithEvent.choicePrompt = function (tribe) {
        return "A large group of people from " + tribe.title() + " have gathered around you.\n    Many of them are carrying large stone hammers, or even simply rocks. They begin to attack\n    your metal exterior with them. You are helpless to respond as they make dents in your surface.\n    Once the attack is over, you find that you are thankfully not seriously damaged.";
    };
    TribeAttacksMonolithEvent.outcomeMessages = function (tribe, region) {
        return [
            "Other tribes in the area seem angry at them for attacking you.",
            "The tribe realises that you are not here to harm them, as otherwise you would have responded to their attack.\n      They still seem afraid, but begin to wonder why you are here."
        ];
    };
    TribeAttacksMonolithEvent.outcomeFunctions = function (tribe, region) {
        // Get list of all other non-fearful tribes in the region.
        var otherTribes = region.tribes().filter(function (v, i, a) {
            return (v != tribe) && (v.attitudes.monolith != Attitudes.Monolith.Fearful);
        });
        return [
            function () {
                for (var _i = 0, otherTribes_1 = otherTribes; _i < otherTribes_1.length; _i++) {
                    var t = otherTribes_1[_i];
                    t.changeRelationship(tribe, -2);
                }
                region.addStructure("damagedMonolith");
            },
            function () {
                tribe.attitudes.monolith = Attitudes.Monolith.Curious;
                region.addStructure("damagedMonolith");
            }
        ];
    };
    TribeAttacksMonolithEvent.id = "TribeAttacksMonolithEvent";
    TribeAttacksMonolithEvent.triggered = false;
    return TribeAttacksMonolithEvent;
}());
var TribeRebuildsMonolithEvent = /** @class */ (function () {
    function TribeRebuildsMonolithEvent() {
    }
    TribeRebuildsMonolithEvent.triggers = function (tribe, region, progress) {
        if (tribe.attitudes.monolith != Attitudes.Monolith.Curious)
            return false;
        if (!region.hasMonolith)
            return false;
        if (!tribe.hasCulture("curiousOfMonolith"))
            return false;
        if (!tribe.hasTechnology("construction"))
            return false;
        if (!region.hasStructure("damagedMonolith"))
            return false;
        // This event does not trigger if the monolith is already damaged.
        if (region.hasStructure("rebuiltMonolith")) {
            return false;
        }
        // This event only triggers once.
        if (TribeRebuildsMonolithEvent.triggered)
            return false;
        if (Random.progressiveChance(0.00001, progress, 0.01)) {
            TribeRebuildsMonolithEvent.triggered = true;
            return true;
        }
        else {
            return false;
        }
    };
    TribeRebuildsMonolithEvent.progress = function (tribe, region) {
        if (tribe.attitudes.monolith != Attitudes.Monolith.Curious)
            return 0;
        if (!region.hasMonolith)
            return 0;
        if (!tribe.hasCulture("curiousOfMonolith"))
            return 0;
        if (!tribe.hasTechnology("construction"))
            return 0;
        if (!region.hasStructure("damagedMonolith"))
            return 0;
        // This event does not trigger if the monolith is already damaged.
        if (region.hasStructure("rebuiltMonolith")) {
            return 0;
        }
        // This event only triggers once.
        if (TribeRebuildsMonolithEvent.triggered)
            return 0;
        return 1;
    };
    TribeRebuildsMonolithEvent.isChoice = function () {
        return false;
    };
    TribeRebuildsMonolithEvent.choices = function (tribe) {
        return [];
    };
    TribeRebuildsMonolithEvent.choicePrompt = function (tribe) {
        return "";
    };
    TribeRebuildsMonolithEvent.outcomeMessages = function (tribe, region) {
        return [tribe.titleCapitalized() + " have begun bringing stone slabs and wooden planks to your\n    landing site. Before long a group of tribespeople are using stone tools to erect a shell\n    around the parts of your surface that were dented in the attack. They seem unhappy to have seen you\n    damaged."];
    };
    TribeRebuildsMonolithEvent.outcomeFunctions = function (tribe, region) {
        return [
            function () {
                region.addStructure("rebuiltMonolith");
            }
        ];
    };
    TribeRebuildsMonolithEvent.id = "TribeRebuildsMonolithEvent";
    TribeRebuildsMonolithEvent.triggered = false;
    return TribeRebuildsMonolithEvent;
}());
var FirstStoriesEvent = /** @class */ (function () {
    function FirstStoriesEvent() {
    }
    FirstStoriesEvent.triggers = function (tribe, region, progress) {
        // Does not trigger if:
        // Tribe is unencountered.
        // Tribe does not have language.
        // Tribe does not have agriculture.
        if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered)
            return false;
        if (!tribe.hasTechnology("language"))
            return false;
        if (!tribe.hasTechnology("agriculture"))
            return false;
        if (tribe.hasCulture("stories"))
            return false;
        return Random.progressiveChance(0.00001, progress, 0.005);
    };
    FirstStoriesEvent.progress = function (tribe, region) {
        if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered)
            return 0;
        if (!tribe.hasTechnology("language"))
            return 0;
        if (!tribe.hasTechnology("agriculture"))
            return 0;
        if (tribe.hasCulture("stories"))
            return 0;
        return Random.interval(0, 3);
    };
    FirstStoriesEvent.isChoice = function () {
        return false;
    };
    FirstStoriesEvent.choices = function (tribe) {
        return [];
    };
    FirstStoriesEvent.choicePrompt = function (tribe) {
        return "";
    };
    FirstStoriesEvent.outcomeMessages = function (tribe, region) {
        var othersTheme = "";
        switch (tribe.attitudes.others) {
            case Attitudes.Others.Aggressive:
                othersTheme = "heroes of war";
                break;
            case Attitudes.Others.Defensive:
                othersTheme = "defenders of their people";
                break;
            case Attitudes.Others.Diplomatic:
                othersTheme = "friendship with other tribes";
                break;
            case Attitudes.Others.Insular:
                othersTheme = "fear of other tribes";
                break;
        }
        var worldTheme = "";
        switch (tribe.attitudes.world) {
            case Attitudes.World.Exploit:
                worldTheme = "exploitation of their environment";
                break;
            case Attitudes.World.Explore:
                worldTheme = "exploration of the unknown";
                break;
            case Attitudes.World.Harmony:
                worldTheme = "living in harmony with nature";
                break;
            case Attitudes.World.Survival:
                worldTheme = "surviving in their dangerous environment";
                break;
        }
        var selfTheme = "";
        switch (tribe.attitudes.self) {
            case Attitudes.Self.Hierarchical:
                selfTheme = "their rightful rulers";
                break;
            case Attitudes.Self.Egalitarian:
                selfTheme = "their egalitarian society";
                break;
        }
        // We don't have to handle the unencountered attitude as we guard against that when
        // deciding if the event triggers.
        var monolithTheme = "";
        switch (tribe.attitudes.monolith) {
            case Attitudes.Monolith.Curious:
                monolithTheme = "their curiosity about the Great Stone";
                break;
            case Attitudes.Monolith.Superstitious:
                monolithTheme = "their reverance of the Great Stone";
                break;
            case Attitudes.Monolith.Fearful:
                monolithTheme = "their fear of the Great Stone";
                break;
        }
        return [
            tribe.titleCapitalized() + " has begun telling stories in the evenings once all their\n      work for the day is done. The major themes of their stories are " + othersTheme + ", " + worldTheme + ",\n      " + selfTheme + ", and " + monolithTheme + "."
        ];
    };
    FirstStoriesEvent.outcomeFunctions = function (tribe, region) {
        return [
            function () {
                tribe.addCulture("stories");
                console.log(tribe.title() + " has begun writing stories.");
            }
        ];
    };
    FirstStoriesEvent.id = "FirstStoriesEvent";
    return FirstStoriesEvent;
}());
var OralHistoryEvent = /** @class */ (function () {
    function OralHistoryEvent() {
    }
    OralHistoryEvent.triggers = function (tribe, region, progress) {
        // Does not trigger if:
        // Tribe is unencountered.
        // Tribe does not have stories.
        // Tribe does not have > 400 population.
        if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered)
            return false;
        if (!tribe.hasCulture("stories"))
            return false;
        if (tribe.population() < 400)
            return false;
        if (tribe.hasCulture("oralHistory"))
            return false;
        if (tribe.hasCulture("noHistory"))
            return false;
        return Random.progressiveChance(0.00001, progress, 0.005);
    };
    OralHistoryEvent.progress = function (tribe, region) {
        if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered)
            return 0;
        if (!tribe.hasCulture("stories"))
            return 0;
        if (tribe.population() < 400)
            return 0;
        if (tribe.hasCulture("oralHistory"))
            return 0;
        if (tribe.hasCulture("noHistory"))
            return 0;
        return Random.interval(0, 3);
    };
    OralHistoryEvent.isChoice = function () {
        return true;
    };
    OralHistoryEvent.choices = function (tribe) {
        return [
            "The past is not important.",
            "The past should be remembered."
        ];
    };
    OralHistoryEvent.choicePrompt = function (tribe) {
        return "The simple stories of " + tribe.title() + " have evolved into more complex tales,\n    often depicting events that occurred in the tribe's past. These tales\n    form an oral history through which the tribe remembers its origins.";
    };
    OralHistoryEvent.outcomeMessages = function (tribe, region) {
        return [
            "The tribe is not interested in the past, and the tales reflect this, no longer emphasising the\n      tribe's history.",
            "The tales become a central part of the tribe's culture, with all members gathering regularly\n      to hear about the events of the past."
        ];
    };
    OralHistoryEvent.outcomeFunctions = function (tribe, region) {
        return [
            function () {
                tribe.addCulture("noHistory");
                console.log(tribe.title() + " rejects oral history.");
            },
            function () {
                tribe.addCulture("oralHistory");
                console.log(tribe.title() + " has begun oral history.");
            }
        ];
    };
    OralHistoryEvent.id = "OralHistoryEvent";
    return OralHistoryEvent;
}());
var PriestClassEvent = /** @class */ (function () {
    function PriestClassEvent() {
    }
    PriestClassEvent.triggers = function (tribe, region, progress) {
        // Does not trigger if:
        // Tribe is unencountered.
        // Tribe has oral history (i.e. doesn't have the no-history culture).
        // Tribe is not supersitious or hierarchical.
        if (tribe.attitudes.monolith != Attitudes.Monolith.Superstitious)
            return false;
        if (!tribe.hasCulture("noHistory"))
            return false;
        if (!tribe.hasCulture("worshipsMonolith"))
            return false;
        if (tribe.hasCulture("priestsRule"))
            return false;
        return Random.progressiveChance(0.00001, progress, 0.005);
    };
    PriestClassEvent.progress = function (tribe, region) {
        if (tribe.attitudes.monolith != Attitudes.Monolith.Superstitious)
            return 0;
        if (!tribe.hasCulture("noHistory"))
            return 0;
        if (!tribe.hasCulture("worshipsMonolith"))
            return 0;
        if (tribe.hasCulture("priestsRule"))
            return 0;
        return Random.interval(0, 3);
    };
    PriestClassEvent.isChoice = function () {
        return true;
    };
    PriestClassEvent.choices = function (tribe) {
        return [
            "The priests do not speak for me.",
            "The priests are my messengers."
        ];
    };
    PriestClassEvent.choicePrompt = function (tribe) {
        return "A priestly class has developed in " + tribe.title() + ", with a select group of priests\n    claiming to be your messengers and acting in accordance with your will. The priests use stories\n    and myths to influence the other tribespeople, who, without any understanding of their history,\n    have no reason not to believe them.";
    };
    PriestClassEvent.outcomeMessages = function (tribe, region) {
        return [
            "The priests convince the rest of the tribe that your displeasure is the result of some\n      wrongdoing on their part. Before long, the tribespeople are desperate for the guidance of their\n      religious leaders, who are all too happy to oblige.",
            "With your blessing, the priests continue their rule over the other tribespeople."
        ];
    };
    PriestClassEvent.outcomeFunctions = function (tribe, region) {
        return [
            function () {
                tribe.addCulture("priestsRule");
                tribe.attitudes.self = Attitudes.Self.Hierarchical;
            },
            function () {
                tribe.addCulture("priestsRule");
                tribe.attitudes.self = Attitudes.Self.Hierarchical;
            }
        ];
    };
    PriestClassEvent.id = "PriestClassEvent";
    return PriestClassEvent;
}());
var GroupBreaksAwayFromInsularTribeEvent = /** @class */ (function () {
    function GroupBreaksAwayFromInsularTribeEvent() {
    }
    GroupBreaksAwayFromInsularTribeEvent.triggers = function (tribe, region, progress) {
        // Does not trigger if:
        // Tribe is not insular.
        // Tribe is explorative.
        // Tribe has not been encountered.
        // Tribe has the 'no outside contact' culture.
        if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered)
            return false;
        if (tribe.attitudes.others != Attitudes.Others.Insular)
            return false;
        if (tribe.attitudes.world == Attitudes.World.Explore)
            return false;
        if (tribe.hasCulture("noOutsideContact"))
            return false;
        return Random.chance(0.0005);
    };
    GroupBreaksAwayFromInsularTribeEvent.progress = function (tribe, region) {
        return 0;
    };
    GroupBreaksAwayFromInsularTribeEvent.isChoice = function () {
        return true;
    };
    GroupBreaksAwayFromInsularTribeEvent.choices = function (tribe) {
        return [
            "They should not be allowed to leave.",
            "They can explore the world if they wish."
        ];
    };
    GroupBreaksAwayFromInsularTribeEvent.choicePrompt = function (tribe) {
        return "A small group from " + tribe.title() + " are unhappy with the tribe's insular nature,\n    and have decided they want to break away and form their own tribe. Many of the other tribe members\n    are unhappy with the group's choice, fearing that they will come to harm if they leave.";
    };
    GroupBreaksAwayFromInsularTribeEvent.outcomeMessages = function (tribe, region) {
        var newName = [];
        // Set name of new tribe if the old tribe has one.
        if (tribe.name().length > 0) {
            // Get descriptor for tribe.
            var roll = Random.interval(0, 4);
            var descriptor = void 0;
            switch (roll) {
                case 0:
                    descriptor = "exile";
                    break;
                case 1:
                    descriptor = "fugitive";
                    break;
                case 2:
                    descriptor = "displaced";
                    break;
                case 3:
                    descriptor = "rejected";
                    break;
                case 4:
                    descriptor = "outcast";
                    break;
            }
            // Build up the new name.
            var first = true;
            for (var _i = 0, _a = tribe.name(); _i < _a.length; _i++) {
                var n = _a[_i];
                if (first) {
                    newName.push(new Noun(n.base, n.plural, true, n.adjectives));
                }
                else {
                    newName.push(new Noun(n.base, n.plural, n.genitive, n.adjectives));
                }
            }
            newName = [new Noun(descriptor, true, false, [])].concat(newName);
        }
        GroupBreaksAwayFromInsularTribeEvent.newTribeName = newName;
        if (newName.length > 0) {
            return [
                "The small group is forced to stay against their will. Knowing that there is no way to overpower the\n        will of the others, they resign themselves to life in the tribe. The tribe avoids contact with the outside world,\n        fearing that otherwise this will happen again.",
                "The rest of the tribe is unhappy, but ultimately willing to let the group forge their own path.\n        The new tribe calls themselves " + Language.toTitle(tribe.language().translate(newName)) + "."
            ];
        }
        else {
            return [
                "The small group is forced to stay against their will. Knowing that there is no way to overpower the\n        will of the others, they resign themselves to life in the tribe. The tribe avoids contact with the outside world,\n        fearing that otherwise this will happen again.",
                "The rest of the tribe is unhappy, but ultimately willing to let the group forge their own path."
            ];
        }
    };
    GroupBreaksAwayFromInsularTribeEvent.outcomeFunctions = function (tribe, region) {
        var newName = GroupBreaksAwayFromInsularTribeEvent.newTribeName;
        return [
            function () {
                tribe.addCulture("noOutsideContact");
            },
            function () {
                var newTribe = tribe.split([0.8, 0.2])[0];
                // Set the new tribe's name if it has one.
                if (newName.length > 0) {
                    newTribe.setName(newName);
                }
                // New tribe is diplomatic and explorative.
                newTribe.attitudes.others = Attitudes.Others.Diplomatic;
                newTribe.attitudes.world = Attitudes.World.Explore;
                // Set new tribe's migration chance.
                newTribe.setMigrationChance(0.00001);
                // New tribe migrates to another region.
                var otherRegions = region.nearby();
                var migrateRegion = Random.choice(otherRegions);
                migrateRegion.addTribe(newTribe);
            }
        ];
    };
    GroupBreaksAwayFromInsularTribeEvent.id = "GroupBreaksAwayFromInsularTribeEvent";
    return GroupBreaksAwayFromInsularTribeEvent;
}());
var DiplomaticEnvoyEvent = /** @class */ (function () {
    function DiplomaticEnvoyEvent() {
    }
    DiplomaticEnvoyEvent.triggers = function (tribe, region, progress) {
        // Does not trigger if:
        // Tribe is not diplomatic.
        // Tribe has not been encountered.
        // Tribe doesn't have language.
        if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered)
            return false;
        if (tribe.attitudes.others != Attitudes.Others.Diplomatic)
            return false;
        if (!tribe.hasTechnology("language"))
            return false;
        // Only triggers if there is another tribe in the region with language.
        var otherTribes = region.tribes().filter(function (v, i, a) {
            return (v != tribe) && (v.hasTechnology("language")) && (tribe.relationship(v) == 0);
        });
        if (otherTribes.length == 0)
            return false;
        // Select the other tribe to be the target of the envoy.
        if (Random.chance(0.0005)) {
            DiplomaticEnvoyEvent.otherTribe = Random.choice(otherTribes);
            return true;
        }
        else
            return false;
    };
    DiplomaticEnvoyEvent.progress = function (tribe, region) {
        return 0;
    };
    DiplomaticEnvoyEvent.isChoice = function () {
        return true;
    };
    DiplomaticEnvoyEvent.choices = function (tribe) {
        var other = DiplomaticEnvoyEvent.otherTribe;
        // If other tribe is aggressive, they attack the envoy.
        // If other tribe is defensive, increase in relationship.
        // If other tribe is diplomatic, large increase in relationship.
        // If other tribe is insular, nothing happens.
        if (other.attitudes.others == Attitudes.Others.Aggressive) {
            return [
                "The dead must be avenged.",
                "The aggressors should be avoided."
            ];
        }
        else if (other.attitudes.others == Attitudes.Others.Defensive) {
            return [
                "They would make valuable allies.",
                "They should be left in peace."
            ];
        }
        else if (other.attitudes.others == Attitudes.Others.Diplomatic) {
            return [
                "They would make valuable friends.",
                "Their kindness is appreciated."
            ];
        }
        else {
            return [
                "How dare they reject the envoys?",
                "Their isolation should be respected."
            ];
        }
    };
    DiplomaticEnvoyEvent.choicePrompt = function (tribe) {
        var other = DiplomaticEnvoyEvent.otherTribe;
        var message = tribe.titleCapitalized() + " has decided to send a small group of envoys to a nearby tribe,\n    " + other.title() + ", in the hopes of getting to know them better. A group of tribespeople leave one morning,\n    bearing gifts for their neighbours.";
        if (other.attitudes.others == Attitudes.Others.Aggressive) {
            message += " " + other.titleCapitalized() + " are aggressive toward the envoys. Shortly after arriving in their camp,\n      they are all brutally killed.";
        }
        else if (other.attitudes.others == Attitudes.Others.Defensive) {
            message += " " + other.titleCapitalized() + " seem suspicious of the envoys. They are allowed to enter the camp,\n      and after a short while the tribe realizes that they mean no harm. The gifts seem appreciated, and the envoys\n      return to their home.";
        }
        else if (other.attitudes.others == Attitudes.Others.Diplomatic) {
            message += " " + other.titleCapitalized() + " are welcoming of the envoys, and seem pleased to have met another tribe.\n      The gifts are greatly appreciated, and the envoys return to their home. A few days later, a group of envoys from\n      " + other.title() + " arrive at the camp of " + tribe.title() + ", bearing gifts in return.";
        }
        else {
            message += " " + other.titleCapitalized() + " are deeply suspicious of the envoys, refusing to allow them anywhere near\n      the camp. The envoys are disappointed, but decide it is better to leave in peace than risk provoking anyone.";
        }
        return message;
    };
    DiplomaticEnvoyEvent.outcomeMessages = function (tribe, region) {
        var other = DiplomaticEnvoyEvent.otherTribe;
        if (other.attitudes.others == Attitudes.Others.Aggressive) {
            return [
                tribe.titleCapitalized() + " are angry at the loss of their envoys, and the tribespeople swear\n        that their deaths shall be avenged.",
                tribe.titleCapitalized() + " are angry at the loss of their envoys, but realise that to escalate\n        the conflict would only result in further deaths."
            ];
        }
        else if (other.attitudes.others == Attitudes.Others.Defensive) {
            return [
                tribe.titleCapitalized() + " are pleased to have made contact with " + other.title() + ",\n        and decide that it would be good to further improve their relations.",
                tribe.titleCapitalized() + " are pleased to have made contact with " + other.title() + ",\n        but decide it would be better if they were left in peace."
            ];
        }
        else if (other.attitudes.others == Attitudes.Others.Diplomatic) {
            return [
                tribe.titleCapitalized() + " are pleased to have made contact with " + other.title() + ",\n        and both tribes decide that they would like to improve their relations.",
                tribe.titleCapitalized() + " appreciate the kindness of " + other.title() + ", and are\n        glad to know of other tribes that have the same views as them."
            ];
        }
        else {
            return [
                tribe.titleCapitalized() + " are offended at their envoys being rejected.",
                tribe.titleCapitalized() + " are disappointed at their envoys being rejected, but\n        decide that it is better to leave " + other.title() + " in peace."
            ];
        }
    };
    DiplomaticEnvoyEvent.outcomeFunctions = function (tribe, region) {
        var other = DiplomaticEnvoyEvent.otherTribe;
        if (other.attitudes.others == Attitudes.Others.Aggressive) {
            return [
                function () {
                    tribe.changeRelationship(other, -2);
                    other.changeRelationship(tribe, -2);
                },
                function () {
                    tribe.changeRelationship(other, -1);
                    other.changeRelationship(tribe, -1);
                }
            ];
        }
        else if (other.attitudes.others == Attitudes.Others.Defensive) {
            return [
                function () {
                    tribe.changeRelationship(other, 2);
                    other.changeRelationship(tribe, 2);
                },
                function () {
                    tribe.changeRelationship(other, 1);
                    other.changeRelationship(tribe, 1);
                }
            ];
        }
        else if (other.attitudes.others == Attitudes.Others.Diplomatic) {
            return [
                function () {
                    tribe.changeRelationship(other, 3);
                    other.changeRelationship(tribe, 3);
                },
                function () {
                    tribe.changeRelationship(other, 2);
                    other.changeRelationship(tribe, 2);
                }
            ];
        }
        else {
            return [
                function () {
                    tribe.changeRelationship(other, -2);
                    other.changeRelationship(tribe, -2);
                },
                function () {
                    tribe.changeRelationship(other, -1);
                    other.changeRelationship(tribe, -1);
                }
            ];
        }
    };
    DiplomaticEnvoyEvent.id = "DiplomaticEnvoyEvent";
    return DiplomaticEnvoyEvent;
}());
var TribeCelebratesMonolithEvent = /** @class */ (function () {
    function TribeCelebratesMonolithEvent() {
    }
    TribeCelebratesMonolithEvent.triggers = function (tribe, region, progress) {
        // Does not trigger if:
        // Tribe is not in same region as the monolith
        // Tribe does not have the 'celebrates monolith' culture
        // Tribe does not have language
        // There is no temple.
        if (!region.hasMonolith)
            return false;
        if (!tribe.hasCulture("celebratesMonolith"))
            return false;
        if (!tribe.hasTechnology("language"))
            return false;
        if (!region.hasStructure("monolithTemple"))
            return false;
        // Triggers semi-regularly.
        if (progress > 400) {
            return Random.chance(0.05);
        }
        else
            return false;
    };
    TribeCelebratesMonolithEvent.progress = function (tribe, region) {
        // Does not trigger if:
        // Tribe is not in same region as the monolith
        // Tribe does not have the 'celebrates monolith' culture
        // Tribe does not have language
        // There is no temple.
        if (!region.hasMonolith)
            return 0;
        if (!tribe.hasCulture("celebratesMonolith"))
            return 0;
        if (!tribe.hasTechnology("language"))
            return 0;
        if (!region.hasStructure("monolithTemple"))
            return 0;
        return 1;
    };
    TribeCelebratesMonolithEvent.isChoice = function () {
        return true;
    };
    TribeCelebratesMonolithEvent.choices = function (tribe) {
        if (tribe.hasCulture("humanSacrifice")) {
            return [
                "This is horrible.",
                "This is a worthy sacrifice."
            ];
        }
        else {
            return [
                "Their songs and offerings please me.",
                "Their songs and offerings are not enough."
            ];
        }
    };
    TribeCelebratesMonolithEvent.choicePrompt = function (tribe) {
        if (tribe.hasCulture("humanSacrifice")) {
            if (tribe.hasCulture("templeBuilders")) {
                return tribe.titleCapitalized() + " have gathered at the temple they built in your name.\n        Many of them have brought offerings to place at your base in the hope that they will be blessed\n        by you. Once all the offerings have been made, they stand in a circle around you and sing songs of worship.\n        After the songs are complete, two of the tribe's priests bring a young man to you.\n        \"We offer this sacrifice in the hope that it pleases you, great stone,\" they say, as they slit the man's throat.";
            }
            else {
                return tribe.titleCapitalized() + " has made a pilgramage to your temple.\n        Many of them have brought offerings to place at your base in the hope that they will be blessed\n        by you. Once all the offerings have been made, they stand in a circle around you and sing songs of worship.\n        After the songs are complete, two of the tribe's priests bring a young man to you.\n        \"We offer this sacrifice in the hope that it pleases you, great stone,\" they say, as they slit the man's throat.";
            }
        }
        else {
            if (tribe.hasCulture("templeBuilders")) {
                return tribe.titleCapitalized() + " have gathered at the temple they built in your name.\n        Many of them have brought offerings to place at your base in the hope that they will be blessed\n        by you. Once all the offerings have been made, they stand in a circle around you and sing songs of worship.";
            }
            else {
                return tribe.titleCapitalized() + " has made a pilgramage to your temple.\n        Many of them have brought offerings to place at your base in the hope that they will be blessed\n        by you. Once all the offerings have been made, they stand in a circle around you and sing songs of worship.";
            }
        }
    };
    TribeCelebratesMonolithEvent.outcomeMessages = function (tribe, region) {
        if (tribe.hasCulture("humanSacrifice")) {
            return [
                "The tribe is confused as to what they must do to please you.",
                "The tribe is glad that this sacrifice pleases you."
            ];
        }
        else {
            return [
                "The tribe is glad to have earned your favour.",
                "The tribe is scared that they have displeased you.\n        As they leave the temple, their priests discuss what must be done to earn\n        your favour."
            ];
        }
    };
    TribeCelebratesMonolithEvent.outcomeFunctions = function (tribe, region) {
        if (tribe.hasCulture("humanSacrifice")) {
            return [
                function () {
                    tribe.decreasePopulation(1);
                    if (Random.chance(0.2))
                        tribe.removeCulture("humanSacrifice");
                },
                function () {
                    tribe.decreasePopulation(1);
                }
            ];
        }
        else {
            return [
                function () {
                },
                function () {
                    tribe.addCulture("humanSacrifice");
                }
            ];
        }
    };
    TribeCelebratesMonolithEvent.id = "TribeCelebratesMonolithEvent";
    return TribeCelebratesMonolithEvent;
}());
var WarlordsTakePowerEvent = /** @class */ (function () {
    function WarlordsTakePowerEvent() {
    }
    WarlordsTakePowerEvent.triggers = function (tribe, region, progress) {
        // Does not trigger if:
        // Tribe is not aggressive
        // Tribe is not hierarchical
        // Tribe has < 150 population
        // Tribe has not been encountered
        if (tribe.attitudes.others != Attitudes.Others.Aggressive)
            return false;
        if (tribe.attitudes.self != Attitudes.Self.Hierarchical)
            return false;
        if (tribe.population() < 150)
            return false;
        if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered)
            return false;
        if (tribe.hasCulture("warlordsRule"))
            return false;
        return Random.progressiveChance(0.00001, progress, 0.005);
    };
    WarlordsTakePowerEvent.progress = function (tribe, region) {
        // Does not trigger if:
        // Tribe is not aggressive
        // Tribe is not hierarchical
        // Tribe has < 150 population
        // Tribe has not been encountered
        if (tribe.attitudes.others != Attitudes.Others.Aggressive)
            return 0;
        if (tribe.attitudes.self != Attitudes.Self.Hierarchical)
            return 0;
        if (tribe.population() < 150)
            return 0;
        if (tribe.attitudes.monolith == Attitudes.Monolith.Unencountered)
            return 0;
        if (tribe.hasCulture("warlordsRule"))
            return 0;
        return 1;
    };
    WarlordsTakePowerEvent.isChoice = function () {
        return true;
    };
    WarlordsTakePowerEvent.choices = function (tribe) {
        return [
            "The warlords have no right to rule.",
            "The warlords are the rightful rulers."
        ];
    };
    WarlordsTakePowerEvent.choicePrompt = function (tribe) {
        return "A small group of warlords from " + tribe.title() + " have decided that they are the tribe's\n    rightful rulers. They have proven themselves on the battlefield and feel that they are most capable of\n    leading the tribe.";
    };
    WarlordsTakePowerEvent.outcomeMessages = function (tribe, region) {
        return [
            "The tribe attempts to force the warlords out of their settlement, but they refuse, preferring to fight.\n      In the ensuing battle, a number of tribespeople are killed, as are all of the warlords.",
            "The warlords take their place as the rightful rulers of the tribe."
        ];
    };
    WarlordsTakePowerEvent.outcomeFunctions = function (tribe, region) {
        return [
            function () {
                var upperLimit = Math.floor(tribe.population() * 0.3);
                var lowerLimit = Math.floor(tribe.population() * 0.1);
                tribe.decreasePopulation(Random.interval(lowerLimit, upperLimit));
                tribe.attitudes.self = Attitudes.Self.Egalitarian;
            },
            function () {
                tribe.addCulture("warlordsRule");
            }
        ];
    };
    WarlordsTakePowerEvent.id = "WarlordsTakePowerEvent";
    return WarlordsTakePowerEvent;
}());
var TribeEvents = [
    TribeDestroyedEvent,
    EncounterEvent,
    IndirectEncounterEvent,
    TribeWorshipsMonolithEvent,
    TribeCuriousOfMonolithEvent,
    TribeFearsMonolithEvent,
    TribeBuildsTempleEvent,
    TribeAsksMonolithPurposeEvent,
    TribeAttacksMonolithEvent,
    TribeRebuildsMonolithEvent,
    GroupBreaksAwayFromInsularTribeEvent,
    TribeCelebratesMonolithEvent,
    DiplomaticEnvoyEvent,
    FireSpreadsEvent,
    DroughtEvent,
    PlagueEvent,
    FirstStoriesEvent,
    OralHistoryEvent,
    PriestClassEvent,
    WarlordsTakePowerEvent,
    AttackEvent,
    MigrationEvent,
    DiscoverFireEvent,
    DiscoverToolsEvent,
    DiscoverConstructionEvent,
    DiscoverLanguageEvent,
    DiscoverAgricultureEvent,
];
