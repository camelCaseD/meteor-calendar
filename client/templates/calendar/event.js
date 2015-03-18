Template.event.events({
	"dblclick li": function(e) {
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
	
	"blur li": function(e) {
		e.target.setAttribute("contenteditable", false);
	},
	
	"keydown li": function(e) {
		if (e.keyCode === 46) {
			e.preventDefault()
			
			Events.remove({_id: this._id});
		} else if (e.keyCode === 13) {
			e.preventDefault();
			
			Events.update({_id: this._id}, {$set: {title: escapeHtml(e.target.innerText)}}, function(err, _id) {
				if (err)
					swal ("Error", "Error updating event", "error");
				
				e.target.blur();
			});	
		} else if (e.which === 8 && e.ctrlKey) {
			e.preventDefault()
			
			Events.remove({_id: this._id});
		}
	}
});
