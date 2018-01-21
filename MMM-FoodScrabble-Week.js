'use strict';

Module.register("MMM-FoodScrabble-Week", {

  result: {},
  defaults: {
    title: 'FoodScrabble',
    url: '',
    updateInterval: 600000,
  },

  start: function() {
    this.getStats();
    this.scheduleUpdate();
  },

  isEmpty: function(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key)) {
        return false;
      }
    }

    return true;
  },

  getDom: function() {
    var wrapper = document.createElement("ticker");
    wrapper.className = 'dimmed small';

    var data = this.result;
    var statElement =  document.createElement("header");
    var title = this.config.title;
    statElement.innerHTML = title;
    wrapper.appendChild(statElement);

    if (data && !this.isEmpty(data)) {
      var tableElement = document.createElement("table");
        for (var day in data) {
            var row = document.createElement("tr");
            var dateCell = document.createElement("td");
            dateCell.appendChild(day.date);
            row.appendChild(dateCell);
            tableElement.appendChild(row);
        }
      wrapper.appendChild(tableElement);
    } else {
      var error = document.createElement("span");
      error.innerHTML = "Error fetching stats.";
      wrapper.appendChild(error);
    }

    return wrapper;
  },

  scheduleUpdate: function(delay) {
    var nextLoad = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay;
    }

    var self = this;
    setInterval(function() {
      self.getStats();
    }, nextLoad);
  },

  getStats: function () {
    this.sendSocketNotification('GET_STATS', this.config.url);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "STATS_RESULT") {
      this.result = payload;
      var fade = 500;
      console.log("fade: " + fade);
      this.updateDom(fade);
    }
  },

});
