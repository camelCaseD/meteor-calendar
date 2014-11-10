getSiblings = function (elem) {
    var siblings = [];
    var sibling = elem.parentNode.firstChild;
    for ( ; sibling; sibling = sibling.nextSibling ) {
        if ( sibling.nodeType === 1 ) {
            siblings.push( sibling );
        }
    }
    return siblings;
};

var entityMap = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': '&quot;',
	"'": '&#39;',
	"/": '&#x2F;'
};

escapeHtml = function(string) {
	return String(string).replace(/[&<>"'\/]/g, function (s) {
		return entityMap[s];
	});
}

activePositions = {
  top: {
    "1": "222px",
    "2": "277px",
    "3": "330px",
    "4": "383px",
    "5": "435px",
    "6": "488px"
  },
  
  left: {
    one: "80px",
    two: "168px",
    three: "262px",
    four: "349px",
    five: "443px",
    six: "533px",
    seven: "615px"
  }
};