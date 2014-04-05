var dictionary = [];
var currentList = [];


$(document).ready(function() {
	checkLocalStorage();
	refreshListDisplay();
	addStyles();
	changeNav();
	$(window).on('hashchange', function() {
		changeNav();
	});
	

	//bind to input change event
    $('#strawb_search_input').bind('input', function() { 
    	var val = $(this).val();
    	checkForSuggestions(val);
	});

    //save item if enter hit
	$('#strawb_search_input').keypress(function(event) {
        if (event.keyCode == 13) {
        	var val = $(this).val();
        	$(this).val('');
            saveNewEntry(val);
        }
    });
    //handle check click event, add typed entry into list
    $('#strawb_submit_entry_button').click(function(event){
    	var val = $('#strawb_search_input').val();
    	$('#strawb_search_input').val('');
    	saveNewEntry(val);
    });

    //to adjust scrollbar height and background color, listen to resize event
    $(window).resize(function () {
    	addStyles();
	});
});

function addStyles() {
	$(".strawb-main").css('min-height', window.innerHeight);
}

function changeNav() {
	var h = window.location.hash;
	if (!h) {
		h = "#strawb_home";
	}

	var divs = ['#strawb_home', '#strawb_feedback', '#strawb_history', '#strawb_thanks'];
	for (var i=0; i<divs.length; i++) {
		if (h == divs[i]) {
			$(divs[i]).show();
		} else {
			$(divs[i]).hide();
		}
	}

	// $('#strawb_footer_home_button').click(function(event){
	// 	$('#strawb_home').show();
	// 	$('#strawb_feedback').hide();
	// 	$('#strawb_history').hide();
	// });

	// $('#strawb_footer_feedback_button').click(function(event){
	// 	$('#strawb_home').hide();
	// 	$('#strawb_feedback').show();
	// 	$('#strawb_history').hide();
	// });

	// $('#strawb_footer_history_button').click(function(event){
	// 	$('#strawb_home').hide();
	// 	$('#strawb_feedback').hide();
	// 	$('#strawb_history').show();
	// });

}

function checkLocalStorage() {
	if(typeof(Storage)!=="undefined")
  	{
  		retrieveDictionary();
  		retrieveList();
  	}
	else
  	{
  		window.alert("Unfortunately, I couldn't find your local storage.");
  	}
}

function retrieveList() {
	var list = localStorage["strawbListOfAmazingThings"];
	if (!list || list === 'undefined') {
		console.log("list was missing in local storage");
		currentList = [];
	} else {
		currentList = JSON.parse(list);
	}
}

function retrieveDictionary() {
	var dict = localStorage["strawbDictionary"];
	if (!dict || dict === 'undefined') {
		console.log("list was missing in local storage");
		dictionary = [];
	} else {
		dictionary = JSON.parse(dict);
	}
}

function updateDictionary() {
	localStorage["strawbDictionary"] = JSON.stringify(dictionary);
}

function updateList() {
	localStorage["strawbListOfAmazingThings"] = JSON.stringify(currentList);
}

function checkForSuggestions(val) {
	var matches = [];
	matches = findEntriesStartingWith(val);
	clearSuggestions();
	if (matches) {
		showSuggestions(matches);
	}
}

function findEntriesStartingWith(str) {
	var results = [];
	if (str.length == 0 || !dictionary) {
		return results;
	}

  	for (var i=0; i<dictionary.length; i++) {
		var match = (new RegExp(str)).test(dictionary[i])
    	if (match) {
      		results.push(dictionary[i]);
    	}
  	}
  	return results;
}

function clearSuggestions() {
	$('#strawb_search_suggestion ul').empty();
	$('#strawb_search_suggestion').hide();
}

function showSuggestions(arr) {
	for (var i=0; i<arr.length; i++){
		var li = $('<li>');
		li.text(arr[i]);
		li.click(function(event){
			var val = ($(this).text());
			$('#strawb_search_input').val('');
			saveNewEntry(val);
			clearSuggestions();
		});
		$('#strawb_search_suggestion ul').append(li);
	}
	if (arr.length > 0) {
		$('#strawb_search_suggestion').show();
	} 	
}

function saveNewEntry(str) {
	if (str.length < 1) {
		return;
	}
	updateDictionaryWith(str);
	currentList.push(str);
	updateList();
	clearSuggestions();
	refreshListDisplay();
}

function updateDictionaryWith(str) {
	var i = getIndexOfDictionaryItem(str);
	if (!(i>-1)) {
		dictionary.push(str);
		updateDictionary();
	}
}

function refreshListDisplay() {
	$('#strawb_current_list ul').empty();
	if (currentList && currentList.length > 0) {
		currentList.forEach(function(item){
			var str = item.toString();
			buildItem(str);
		});
	}
}

function buildItem(str) {
	var li = $('<li>');
	var div = $('<div class="strawb-item-text">');
 	div.text(str);
 	var removeButton = getDeleteButton();
 	li.append(div);
 	li.append(removeButton);
	$('#strawb_current_list ul').append(li);
}

function getDeleteButton() {
	var button = $('<input class="btn strawb-delete-item-button"></input>');
	button.click(function(event){
		var item = $(this).parent();
		removeItem(item);
	});
	return button;
}

function removeItem(item) {
	var str = $(item).find('div').text();
	var index = getIndexOfListItem(str);
	currentList.splice(index, 1);
	updateList();
	refreshListDisplay();
}

function getIndexOfListItem(str) {
	for (var i=0; i<currentList.length; i++) {
		var value = currentList[i].toString();
		// console.log(str + " " + value);
		if (str == value) {
			return i;
		}
	}
}

function getIndexOfDictionaryItem(str) {
	for (var i=0; i<dictionary.length; i++) {
		console.log(dictionary[i]);
		var value = dictionary[i];
		if (str == value) {
			return i;
		}
	}
}

