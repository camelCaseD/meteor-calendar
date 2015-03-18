Template.day.helpers({
  dayOfWeek: function() {
    var  weekToDay = {
      "sun": "one",
      "mon": "two",
      "tue": "three",
      "wed": "four",
      "thu": "five",
      "fri": "six",
      "sat": "seven"
    };

    return weekToDay[this.week];
  },

  cssClass: function() {
    var val = "";
    var event = Events.findOne({day: parseInt(this.date)});
    if (this.date >= 10) {
      val += " double";
    }
    if (this.start) {
      val += " start";
    }
    if (this.today) {
      val += " active";
    }
    if (event !== undefined) {
	val += " has-events";
    }

    return val;
  }
});
