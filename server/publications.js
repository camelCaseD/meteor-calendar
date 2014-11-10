Meteor.publish("events", function(userId, month) {
	return Events.find({"userId": userId, "month": month});
});