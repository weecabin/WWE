/*
 * The MIT License - http://www.opensource.org/licenses/mit-license
 * Copyright (c) 2016 Bruce Schubert.
 */

/*global WorldWind*/

define([
    'text!libs/milsymbol/2525C warfighting.json',
    'text!libs/milsymbol/2525C signals-intelligence.json',
    'text!libs/milsymbol/2525C stability-operations.json',
    'text!libs/milsymbol/2525C emergency-managment.json',
    'knockout',
    'jquery',
    'jqueryui',
    'text'],
    function (
        warfighting2525c,
        signalsIntel2525c,
        stabilityOps2525c,
        emergencyMgmt2525c,
        ko,
        $) {
        "use strict";
        /**
         * @constructor
         * @param {String} viewFragment HTML
         * @returns {TacticalSymbolEditor}
         */
        function TacticalSymbolEditor(viewFragment) {
            var self = this,
                warfighting = JSON.parse(warfighting2525c),
                signals = JSON.parse(signalsIntel2525c),
                stability = JSON.parse(stabilityOps2525c),
                emergency = JSON.parse(emergencyMgmt2525c);

            // Load the view fragment into the DOM's body.
            // Wrap the view in a hidden div for use in a JQuery UI dialog.
            var $view = $('<div style="display: none"></div>')
                .append(viewFragment)
                .appendTo($('body'));
            this.view = $view.children().first().get(0);

            // The symbol object to be edited 
            this.symbol = ko.observable({});

            // Coding scheme options
            this.schemes = ko.observableArray([warfighting, signals, stability, emergency]);
            this.selectedScheme = ko.observable();

            this.options = ko.observableArray([]);
            this.selectedOption = ko.observable();

            this.icons = ko.observableArray([]);
            this.selectedIcon = ko.observable();

            this.modifiers1 = ko.observableArray([]);
            this.selectedModifier1 = ko.observable();

            this.modifiers2 = ko.observableArray([]);
            this.selectedModifier2 = ko.observable();

            this.selectedScheme.subscribe(function (newScheme) {
                self.options.removeAll();
                for (var obj in newScheme) {
                    if (newScheme[obj].name) {
                        self.options.push(newScheme[obj]);
                    }
                }
            });

            this.selectedOption.subscribe(function (newOption) {
                var icons, modifiers, obj;

                self.icons.removeAll();
                self.modifiers1.removeAll();
                self.modifiers2.removeAll();

                if (newOption) {
//                self.icons(newOption["main icon"]);
                    icons = newOption["main icon"];
                    for (obj in icons) {
                        self.icons.push(icons[obj]);
                    }

                    modifiers = newOption["modifier 1"];
                    for (obj in modifiers) {
                        self.modifiers1.push(modifiers[obj]);
                    }

                    modifiers = newOption["modifier 2"];
                    for (obj in modifiers) {
                        self.modifiers2.push(modifiers[obj]);
                    }
                }
            });


            this.open = function (symbol) {
                console.log("Open Symbol: " + symbol.name());
                // Update observable(s)
                self.symbol(symbol);
                // Open the dialog
                var $symbolEditor = $(self.view);
                $symbolEditor.dialog({
                    autoOpen: false,
                    title: "Edit Symbol"
                });
                $symbolEditor.dialog("open");
            };


            // Binds the view to this view model.
            ko.applyBindings(this, this.view);
        }

        return TacticalSymbolEditor;
    }
);