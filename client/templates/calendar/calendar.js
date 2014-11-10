var isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

var changeCalendar = function(input) {
  input = input.split(" ");

  var month = input[0];
  var year = input[1];

  var dictionary = {
    "january": "01",
    "february": "02",
    "march": "03",
    "april": "04",
    "may": "05",
    "june": "06",
    "july": "07",
    "august": "08",
    "september": "09",
    "october": "10",
    "november": "11",
    "december": "12"
  };

  var title = "Date Input";
  if (input.length > 2) {
    return swal(title, "You need to enter a month in it's full name and a year. Ex: November 2014", "error");
  } else if (dictionary[month] === undefined) {
    return swal(title, "You need to enter a month in it's full name. Ex: November", "error");
  } else if (!isNumeric(year)) {
    return swal(title, "You need to enter a number for the year. Ex: 2014", "error");
  } else if (year.length !== 4) {
    return swal(title, "The year needs to be four digits long. Ex: 2014", "error");
  }

  return Router.go("/" + year + "/" + dictionary[month]);
};

var numberToString = {
	"1": "one",
	"2": "two",
	"3": "three",
	"4": "four",
	"5": "five",
	"6": "six",
	"7": "seven"
};

Template.calendar.helpers({
  "weeks": function() {
		var year = this.year;
    var month = this.month;
		
    if (month.length === 1 && month.charAt(0) !== "0") {
      month = "0" + month;
      return Router.go("/" + year + "/" + month);
    }

    var incorrectYear = function() {
      return swal({
          title: "Date error",
          text: "The year needs to be four digits long and a number.",
          type: "error"
        },
        function() {
          Router.go("/");
        });
    };
    if (year.toString().length !== 4) {
      return incorrectYear();
    } else if (!isNumeric(year)) {
      return incorrectYear();
    }

    var names = [ 'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat' ];
    var date = new Date(year, month-1, 1);
    var days = [];
    while (date.getMonth() == month-1) {
      var day = {
        date: date.getDate(),
        week: names[date.getDay()]
      };

      if (moment().date() === day.date && moment().year() === year && moment().month() === month-1) {
        day.today = true;
			} else {
				day.today = false;
			}

      days.push(day);
      date.setDate(date.getDate()+1);
    }

    var weeks = [];
    var daysIndex = 0;
    var firstDayWeek = names.indexOf(days[0].week);
    var firstWeek = [];
    for (i = firstDayWeek;i < names.length; i++) {
      var day = days[daysIndex];
      day.start = true;
      firstWeek.push(days[daysIndex]);
      daysIndex ++;
    }
    weeks.push(firstWeek);

    while (daysIndex < days.length) {
      var week = [];
      var dayInWeek = 1;

      while (dayInWeek <= 7) {
        if (days[daysIndex] !== undefined) {
					days[daysIndex].start = false;
          week.push(days[daysIndex]);
				}

        dayInWeek ++;
        daysIndex ++;
      }

      weeks.push(week);
    }
    
    Session.set("weeks", weeks);
    return weeks;
  },

  headerTitle: function() {
    return moment(this.year + "-" + this.month + "-01").format("MMMM, YYYY");
  },

  previousYear: function() {
    return parseInt(this.year) - 1;
  },

  nextYear: function() {
    return parseInt(this.year) + 1;
  },
  
  initialActiveStyle: function() {
    var weeks = Session.get("weeks");
		
		var wrongWeeks = function() {
			return swal({
				title: "Error",
				text: "Weeks is not an Array",
				type: "error"
			}, function() {
				return location.reload();	
			});
		};
		
    if (weeks.constructor !== Array || weeks.length === 0) {
			return wrongWeeks();
    }
		
		var row = 0;
		var column = 0;
		for (var i = 0; i < weeks.length; i++) {
			var week = weeks[i];
			
			if (week.constructor !== Array || week.length === 0) {
				return wrongWeeks();
			}
			
			for (var l = 0; l < week.length; l++) {
				var day = week[l]
				try {
					check(day, {
						date: Number,
						start: Boolean,
						today: Boolean,
						week: String
					});
				} catch(e) {
					return wrongWeeks();	
				}
				if (day.today) {
					row = i + 1;
					column = l + 1;
				}
			}
		}
		
		if (row === 0 || column === 0)
			return "display: none;";
		
		return "top: " + activePositions.top[row] + ";left: " + activePositions.left[numberToString[column.toString()]] + ";";
  },
	
	calendarEvents: function() {
		return this.events;
	}
});

Template.calendar.events({
  "dblclick .month-header": function(e) {
    if (!e.target.getAttribute("contenteditable")) {
      if (document.selection !== undefined) {
        document.selection.empty();
      } else {
        window.getSelection().removeAllRanges()
      }
    }

    e.target.setAttribute("contenteditable", true);

    e.target.focus();
  },

  "blur .month-header": function(e) {
    e.target.setAttribute("contenteditable", false);

    changeCalendar(e.target.innerText.toLowerCase().replace(",", ""));
  },

  "keydown .month-header": function(e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      e.target.setAttribute("contenteditable", false);

      // Prevents enter keypress event from being sent to sweet alert
      setTimeout(function() {
        changeCalendar(e.target.innerText.toLowerCase().replace(",", ""));
      }, 200);
    }
  },

  "click .next-year": function() {
    var nextYear = parseInt(this.year) + 1;
    Router.go("/" + nextYear + "/" + this.month);
  },

  "click .last-year": function() {
    var lastYear = parseInt(this.year) - 1;
    Router.go("/" + lastYear + "/" + this.month);
  },
	
	"click .arrow.next": function() {
		var nextMonth = parseInt(this.month) + 1;
		if (nextMonth <= 12) {
			Router.go("/" + this.year + "/" + nextMonth);
		} else {
			var nextYear = this.year + 1;
			nextMonth = 1;
			Router.go("/" + nextYear + "/" + nextMonth);
		}
	},
	
	"click .arrow.previous": function() {
		var previousMonth = parseInt(this.month) - 1;
		if (previousMonth > 0) {
			Router.go("/" + this.year + "/" + previousMonth);
		} else {
			var previousYear = this.year - 1;
			previousMonth = 12;
			Router.go("/" + previousYear + "/" + previousMonth);
		}
	},
	
	"click button.add": function(e) {
		var list = e.target.parentElement.previousElementSibling;
		if (list === null)
			var list = e.target.parentElement.parentElement.previousElementSibling;
		
    var selectedDay = document.querySelector(".calendar span.active");
    if (selectedDay === null)
      return swal("No Day", "You need to select a dy on the calendar first", "warning");
    
		Events.insert({userId: Meteor.userId(), day: parseInt(selectedDay.innerText), year: this.year, month: this.month, title: "New Event"}, function(err, _id) {
			if (err)
				swal("Calendar Event", "Error creating new event", "error");
		});
	}
});
