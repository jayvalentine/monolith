/// <reference path="./region.ts">
/// <reference path="./region_events.ts">
/// <reference path="./random.ts">
/// <reference path="./tribe.ts">
var Game = /** @class */ (function () {
    function Game() {
        this.day = 0;
        this.regions = [];
        this.events = [];
        this.choiceFlag = Game.Choice.None;
        this.choices = [];
        this.choiceIndex = -1;
        this.choiceOutcomes = [];
        this.choiceOutcomeMessages = [];
        this.outcomes = [];
        this.outcomeMessages = [];
    }
    Game.prototype.start = function () {
        this.day = 0;
        this.regions = [];
        this.events = [];
        this.choiceFlag = Game.Choice.None;
        this.choices = [];
        this.outcomes = [];
        this.outcomeMessages = [];
        // Generate a number of regions.
        var regionLimit = Random.interval(30, 50);
        for (var i = 0; i < regionLimit; i++) {
            // Create a new region.
            var r = new Region();
            // Add as many tribes as there are food in the region.
            for (var f = 0; f < r.food(); f++) {
                var t = new Tribe(Random.interval(30, 90));
                r.addTribe(t);
            }
            this.regions.push(r);
        }
        var _loop_1 = function (region) {
            // Get the list of other regions (i.e. filter this one out of the full list).
            var otherRegions = this_1.regions.filter(function (value, index, array) { return value != region; });
            // 1-4 neighbours for each region.
            var numNearby = Random.interval(1, 4);
            var _loop_2 = function (i) {
                // Pick another region from the list.
                var other = Random.choice(otherRegions);
                // Set these two regions as neighbours.
                region.addNearbyRegion(other);
                // Exclude the region we've just picked from further selection.
                otherRegions = otherRegions.filter(function (value, index, array) { return value != other; });
            };
            for (var i = 0; i < numNearby; i++) {
                _loop_2(i);
            }
        };
        var this_1 = this;
        // Generate a number of neighbours for each region.
        for (var _i = 0, _a = this.regions; _i < _a.length; _i++) {
            var region = _a[_i];
            _loop_1(region);
        }
        // Initial game message.
        this.queueMessage("You awaken in a cold void. A glistening blue-green marble hangs below you.\n      You slowly become aware of the various sensors attached to you, reading\n      magnetic fields, temperature, radiation, and more.\n      You observe Kepler 62-f slowly, and search for a landing site.", function () { });
        // Determine a number of landing sites.
        var landingSites = [];
        var regionsCopy = this.regions;
        // Determine number of sites to pick.
        var landingSitesLimit = Random.interval(4, 8);
        var _loop_3 = function (i) {
            var r = Random.choice(regionsCopy);
            landingSites.push(r);
            regionsCopy = regionsCopy.filter(function (value, index, array) { return value != r; });
            console.log(regionsCopy.length);
        };
        for (var i = 0; i < landingSitesLimit; i++) {
            _loop_3(i);
        }
        this.queueMessage("As your sensors engage you become aware of " + landingSitesLimit + " landing sites\n      on the planet below.", function () { });
        var landingSiteChoices = [];
        var landingSiteOutcomes = [];
        var landingSiteOutcomeMessages = [];
        var _loop_4 = function (r) {
            landingSiteChoices.push("A " + r.typeDescription() + " region with " + r.foodString() + " food,\n        " + r.waterString() + " water, and " + r.resourcesString() + " resources.\n        It has " + r.population() + " inhabitants, split into " + r.tribesCount() + " tribe(s).");
            landingSiteOutcomes.push(function () { r.hasMonolith = true; });
            landingSiteOutcomeMessages.push("");
        };
        for (var _b = 0, landingSites_1 = landingSites; _b < landingSites_1.length; _b++) {
            var r = landingSites_1[_b];
            _loop_4(r);
        }
        this.queueChoice(landingSiteChoices, landingSiteOutcomeMessages, landingSiteOutcomes);
        this.run();
    };
    Game.prototype.run = function () {
        // Are we making a choice? If so, we give that priority over everything else.
        if (this.choiceFlag == Game.Choice.Started) {
            // Have we displayed all the choices yet? If not, display the next one.
            if (this.choiceIndex < this.choices.length) {
                this.displayChoice(this.choiceIndex, this.choices[this.choiceIndex]);
                this.choiceIndex++;
            }
            else {
                this.choiceFlag = Game.Choice.Waiting;
                setTimeout(this.run.bind(this), 1);
            }
        }
        else if (this.choiceFlag == Game.Choice.Waiting) {
            setTimeout(this.run.bind(this), 10);
        }
        else if (this.choiceFlag == Game.Choice.Done) {
            console.log("Choice made: " + this.choiceIndex);
            this.choiceOutcomes[this.choiceIndex]();
            this.choiceOutcomes = [];
            this.displayMessage(this.choiceOutcomeMessages[this.choiceIndex]);
            this.choiceOutcomeMessages = [];
            this.choiceFlag = Game.Choice.None;
        }
        else if (this.events.length > 0) {
            var e = this.events.shift();
            var o = this.outcomes.shift();
            var m = this.outcomeMessages.shift();
            if (e[0] == "message") {
                // Perform the outcome, even if it is nothing.
                o[0]();
                // Display the message.
                this.displayMessage(e[1]);
            }
            else if (e[0] == "choice") {
                this.startChoice(e.slice(1), m, o);
                setTimeout(this.run.bind(this), 1);
            }
        }
        else {
            // Initialise population count to 0.
            var populationCount = 0;
            var tribesCount = 0;
            // See if any region events trigger.
            for (var _i = 0, _a = this.regions; _i < _a.length; _i++) {
                var region = _a[_i];
                for (var _b = 0, RegionEvents_1 = RegionEvents; _b < RegionEvents_1.length; _b++) {
                    var regionEvent = RegionEvents_1[_b];
                    // If this region event triggers on this region, queue a message.
                    if (regionEvent.triggers(region)) {
                        this.queueMessage(regionEvent.outcomeMessage(region), regionEvent.outcomeFunction(region));
                    }
                }
                var tribesToRemove = [];
                for (var _c = 0, _d = region.tribes(); _c < _d.length; _c++) {
                    var tribe = _d[_c];
                    if (tribe.dead)
                        tribesToRemove.push(tribe);
                    else {
                        // If the tribe has been encountered, add its population to the total.
                        if (tribe.attitudes.monolith != Attitudes.Monolith.Unencountered) {
                            populationCount += tribe.population();
                            tribesCount++;
                        }
                        var triggered = false;
                        for (var _e = 0, TribeEvents_1 = TribeEvents; _e < TribeEvents_1.length; _e++) {
                            var tribeEvent = TribeEvents_1[_e];
                            // If this tribe event triggers on this tribe, queue a message or a choice.
                            if (!triggered && tribeEvent.triggers(tribe, region, tribe.progress(tribeEvent))) {
                                // Reset progress towards the event.
                                tribe.resetProgress(tribeEvent);
                                if (tribeEvent.isChoice()) {
                                    this.queueMessage(tribeEvent.choicePrompt(tribe), function () { });
                                    this.queueChoice(tribeEvent.choices(tribe), tribeEvent.outcomeMessages(tribe, region), tribeEvent.outcomeFunctions(tribe, region));
                                }
                                else {
                                    // If the event is not a choice, we can safely assume it has exactly one outcome.
                                    this.queueMessage(tribeEvent.outcomeMessages(tribe, region)[0], tribeEvent.outcomeFunctions(tribe, region)[0]);
                                }
                                triggered = true;
                            }
                            else {
                                tribe.increaseProgress(tribeEvent, tribeEvent.progress(tribe, region));
                            }
                        }
                        tribe.grow();
                    }
                }
                // Remove all the dead tribes.
                for (var _f = 0, tribesToRemove_1 = tribesToRemove; _f < tribesToRemove_1.length; _f++) {
                    var tribe = tribesToRemove_1[_f];
                    region.removeTribe(tribe);
                }
            }
            // Increment day count.
            this.day += 1;
            // Trigger again in 50ms.
            setTimeout(this.run.bind(this), 20);
            var populationString = void 0;
            if (populationCount > 1000000) {
                populationString = (populationCount / 1000000).toFixed(2) + "M";
            }
            else if (populationCount > 1000) {
                populationString = (populationCount / 1000).toFixed(2) + "K";
            }
            else {
                populationString = "" + populationCount;
            }
            $("#GameDate").text("Year " + Math.floor(this.day / 276) + ", Day " + this.day % 276 + ". Population " + populationString + ", " + tribesCount + " Tribes (Encountered).");
        }
    };
    Game.prototype.startChoice = function (choices, outcomeMessages, outcomes) {
        this.choiceFlag = Game.Choice.Started;
        this.choiceIndex = 0;
        this.choices = choices;
        this.choiceOutcomes = outcomes;
        this.choiceOutcomeMessages = outcomeMessages;
    };
    Game.prototype.makeChoice = function (choice) {
        // Return if we're still displaying the choices.
        if (this.choiceFlag != Game.Choice.Waiting)
            return;
        // Remove all choices except the one selected.
        for (var i = 0; i < this.choiceIndex; i++) {
            if (i != choice) {
                console.log("Deleting choice " + i + " from the DOM.");
                $("#choice-" + i).remove();
            }
            else {
                $("#choice-" + i).removeClass('clickable');
                $("#choice-" + i).addClass('choice');
                $("#choice-" + i).removeAttr('id');
            }
        }
        this.choiceIndex = choice;
        this.choiceFlag = Game.Choice.Done;
    };
    // Add a message to the queue.
    Game.prototype.queueMessage = function (message, outcome) {
        this.events.push(["message", message]);
        this.outcomes.push([outcome]);
        this.outcomeMessages.push([""]);
    };
    // Add a choice to the choice queue.
    Game.prototype.queueChoice = function (choice, outcomeMessages, outcomes) {
        this.events.push(["choice"].concat(choice));
        this.outcomes.push(outcomes);
        this.outcomeMessages.push(outcomeMessages);
    };
    Game.prototype.displayMessage = function (message) {
        // Do nothing but trigger the run method if the message is empty.
        if (message.length == 0) {
            setTimeout(this.run.bind(this), 1);
            return;
        }
        // Fade the message in.
        $("<p>" + message + "</p>").insertBefore("#GameDate")
            .hide().fadeIn(1000);
        // Trigger the run method 2 seconds from now.
        setTimeout(this.run.bind(this), 2000);
        // Force scroll to the bottom of the screen.
        $('html, body').scrollTop($("#GameDate").offset().top);
    };
    Game.prototype.displayChoice = function (index, choice) {
        console.log("Displaying choice " + index + ".");
        // Fade the choice in. Trigger the run method again once the fade in has completed.
        $("<p id='choice-" + index + "' class='clickable' onclick='Global.game.makeChoice(" + index + ")'>" + choice + "</p>")
            .insertBefore("#GameDate")
            .hide().fadeIn(500, this.run.bind(this));
        // Force scroll to the bottom of the screen.
        $('html, body').scrollTop($("#GameDate").offset().top);
    };
    return Game;
}());
(function (Game) {
    var Choice;
    (function (Choice) {
        Choice[Choice["None"] = 0] = "None";
        Choice[Choice["Waiting"] = 1] = "Waiting";
        Choice[Choice["Started"] = 2] = "Started";
        Choice[Choice["Done"] = 3] = "Done";
    })(Choice = Game.Choice || (Game.Choice = {}));
})(Game || (Game = {}));
