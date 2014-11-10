Router.configure({
  layoutTemplate: "layout",
	loadingTemplate: "loading"
});

CalendarHomeController = RouteController.extend({
	template: "calendar",
	year: function() {
		return moment().year()
	},
	month: function() {
		return moment().month()+1
	},
	
	waitOn: function() {
		return Meteor.subscribe("events", Meteor.userId(), this.month());
	},
	
	data: function() {
		if (typeof(Session.get("day")) === "number" && Session.get("day") !== undefined && Session.get("day") > 0 && Session.get("day") <= 31 && Session.get("day") % 1 === 0) {
			return {
				events: Events.find({day: Session.get("day")}),
				year: this.year(),
				month: this.month()
			};
		} else {
			return {
				events: Events.find({day: moment().date()}),
				year: this.year(),
				month: this.month()
			};
		}
	}
});

CalendarHomeTunedController = CalendarHomeController.extend({
	year: function() {
		return parseInt(this.params.year);
	},
	month: function() {
		return parseInt(this.params.month);
	}
});

Router.route("/", {
	name: "home",
	controller: CalendarHomeController
});

Router.route("/:year/:month", {
	name: "homeTuned",
	controller: CalendarHomeTunedController
});