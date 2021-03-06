/*
 * This program is free software; you can redistribute it and/or modify it under the
 * terms of the GNU Lesser General Public License, version 2.1 as published by the Free Software
 * Foundation.
 *
 * You should have received a copy of the GNU Lesser General Public License along with this
 * program; if not, you can obtain a copy at http://www.gnu.org/licenses/old-licenses/lgpl-2.1.html
 * or from the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 *
 * Copyright 2016 - 2017 Hitachi Vantara. All rights reserved.
 */
define([
  "module",
  "d3",
  "./click-d3",
  "pentaho/visual/scene/Base",
  "css!./css/view-d3"
], function(module, d3, d3ClickController, Scene) {
  "use strict";

  return [
    "pentaho/visual/base/view",
    "./model",
    "pentaho/visual/action/execute",
    "pentaho/visual/action/select",
    function(BaseView, BarModel, ExecuteAction, SelectAction) {
      // Create the Bar View subclass
      var BarView = BaseView.extend({
        $type: {
          id: module.id,
          props: [
            // Specialize the inherited model property to the Bar model type
            {
              name: "model",
              valueType: BarModel
            }
          ]
        },

        /**
         * Performs a full update of the visualization.
         *
         * The D3 code was adapted from https://bl.ocks.org/mbostock/3885304.
         *
         * @return {Promise} A promise that is resolved when the update operation has completed or, _nully_,
         * if it completed synchronous and with no errors.
         *
         * @protected
         * @override
         */
        _updateAll: function() {
          // Part 1

          // The Bar model
          var model = this.model;

          var dataTable = model.data;

          // Build a list of scenes, one per category
          var scenes = Scene.buildScenesFlat(this).children;

          // The div where rendering takes place
          var container = d3.select(this.domContainer);

          // Part 2
          container.selectAll("*").remove();

          var margin = {top: 50, right: 30, bottom: 30, left: 75};

          // Note use of the view's width and height properties
          var width = this.width - margin.left - margin.right;
          var height = this.height - margin.top - margin.bottom;

          var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
          var y = d3.scaleLinear().rangeRound([height, 0]);

          x.domain(scenes.map(function(scene) { return scene.vars.category.formatted; }));
          y.domain([0, d3.max(scenes, function(scene) { return scene.vars.measure.value; })]);

          var svg = container.append("svg")
            .attr("width", this.width)
            .attr("height", this.height);

          // Title
          var title = model.measure.mapper.label + " per " + model.category.mapper.label;

          svg.append("text")
            .attr("class", "title")
            .attr("y", margin.top / 2)
            .attr("x", this.width / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(title);

          var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          // X axis
          g.append("g")
            .attr("class", "axis axis-x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

          // Y axis
          g.append("g")
            .attr("class", "axis axis-y")
            .call(d3.axisLeft(y).ticks(10));

          // Bars
          var bandWidth = x.bandwidth();
          var barWidth = Math.min(model.barSize, bandWidth);
          var barOffset = bandWidth / 2 - barWidth / 2 + 0.5;

          var selectColor = function(scene) {
            return model.palette.colors.at(scene.index % model.palette.colors.count).value;
          };

          var bar = g.selectAll(".bar")
            .data(scenes)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("fill", selectColor)
            .attr("stroke", selectColor)
            .attr("x", function(scene) { return x(scene.vars.category.formatted) + barOffset; })
            .attr("y", function(scene) { return y(scene.vars.measure.value); })
            .attr("width", barWidth)
            .attr("height", function(scene) { return height - y(scene.vars.measure.value); });

          // Part 3
          var view = this;

          var cc = d3ClickController();
          bar.call(cc);

          cc.on("dblclick", function(event, scene) {
            // A filter that selects the data that the bar visually represents.
            var filter = scene.createFilter();

            // Create the action.
            var action = new ExecuteAction({dataFilter: filter});

            // Dispatch the action through the view.
            view.act(action);
          });

          // Part 4
          cc.on("click", function(event, scene) {
            // A filter that selects the data that the bar visually represents.
            var filter = scene.createFilter();

            // Create the action.
            var action = new SelectAction({
              dataFilter: filter,
              selectionMode: event.ctrlKey || event.metaKey ? "toggle" : "replace"
            });

            // Dispatch the action through the view.
            view.act(action);
          });

          // Part 5
          bar.classed("selected", function(scene) {
            var sf = view.selectionFilter;
            return !!sf && dataTable.filterMatchesRow(sf, scene.index);
          });
        }
      });

      return BarView;
    }
  ];
});
