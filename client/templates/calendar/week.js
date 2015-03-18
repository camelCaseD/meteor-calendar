Template.week.helpers({
  days: function() {
    return this;
  }
});

Template.week.events({
  "click span": function(e) {
    if (document.querySelector("#currentRow") !== null) {
      document.querySelector("#currentRow").id = ""
    }
    e.target.parentNode.id = "currentRow";
    
	if (document.querySelector("span.active") !== null)
		document.querySelector("span.active").classList.remove("active");
    e.target.classList.add("active");
    
    var siblings = getSiblings(e.target.parentNode);
    var foundSelf = false;
    var i = 0;
    var elderSiblings = [];
    
    while(!foundSelf) {
      if (siblings[i].id !== "currentRow") {
        elderSiblings.push(siblings[i]);
      } else {
        foundSelf = true;
      }
      
      i ++;
    }
    
    var column = e.target.id.replace("day-", "");
    var row = (elderSiblings.length + 1).toString();
    var active = document.querySelector("div.active");
    
    active.setAttribute("style", "top: " + activePositions.top[row] + ";left: " + activePositions.left[column] + ";");
    Session.set("day", parseInt(e.target.innerText));
  }
});
