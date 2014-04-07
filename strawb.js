var dictionary = [];
var currentList = [];


$(document).ready(function() {
	checkLocalStorage();
	refreshListDisplay();
	refreshHistoryDisplay();
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

	var divs = ['#strawb_home', '#strawb_feedback', '#strawb_history'];
	for (var i=0; i<divs.length; i++) {
		if (h == divs[i]) {
			$(divs[i]).show();
		} else {
			$(divs[i]).hide();
		}
	}

	if (h == "#strawb_history") {
		refreshHistoryDisplay();
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

function loadHistory() {
	refreshHistoryDisplay();
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

function updateAndRefreshAll() {
	updateList();
	updateDictionary();
	refreshListDisplay();
	refreshHistoryDisplay();
}

function refreshListDisplay() {
	$('#strawb_current_list ul').empty();
	if (currentList && currentList.length > 0) {
		currentList.forEach(function(item){
			if (item == null) {
				item = '';
			}  
			var str = item.toString();
			buildListItem(str, '#strawb_current_list ul');
		});
	} else {
		var div = $("<div class='strawb-list-placeholder'>( your list )</div>");
		$('#strawb_current_list ul').append(div);
	}
}

function refreshHistoryDisplay() {
	$('#strawb_history ul').empty();
	if (dictionary && dictionary.length > 0) {
		dictionary.forEach(function(item){
			if (item == null) {
				item = '';
			}  
			var str = item.toString();
			buildHistoryItem(str, '#strawb_history ul');
		});
	} else {
		var div = $("<div class='strawb-list-placeholder'>( your history )</div>");
		$('#strawb_history ul').append(div);
	}	
}

// function buildItem(str, destination, arr) {
// 	var li = $('<li>');
// 	var div = $('<div class="strawb-item-text">');
//  	div.text(str);
//  	li.append(div);

//  	if (arr == dictionary) {
//  		var addButton = getAddButton(currentList);
//  		li.append(addButton);
//  	}

//  	var removeButton = getDeleteButton(arr);
//  	li.append(removeButton);

// 	$(destination).append(li);
// }

function buildListItem(str, destination) {
	var li = $('<li>');
	var div = $('<div class="strawb-item-text">');
 	div.text(str);

 	var completedButton = getCompletedButton(currentList);
 	li.append(div);
 	li.append(completedButton);
	$(destination).append(li);
}

function buildHistoryItem(str, destination) {
	var li = $('<li>');
	var div = $('<div class="strawb-item-text">');
 	div.text(str);
	var addButton = getAddButton(currentList);
 	var removeButton = getDeleteButton(dictionary);

 	li.append(div);
	li.append(addButton);
 	li.append(removeButton);
	$(destination).append(li);	
}

function getCompletedButton(arr) {
	var button = $('<input class="btn strawb-completed-item-button" type="submit" value=""></input>');
	button.click(function(event){
		var item = $(this).parent();
		removeListItem(item, arr);
	});
	return button;	
}

function getDeleteButton(arr) {
	var button = $('<input class="btn strawb-delete-item-button" type="submit" value=""></input>');
	button.click(function(event){
		var item = $(this).parent();
		removeDictionaryItem(item);
	});
	return button;
}

function getAddButton(arrDestination) {
	var button = $('<input class="btn strawb-add-item-button" type="submit" value=""></input>');
	button.click(function(event){
		var item = $(this).parent().find('div').text();
		saveNewEntry(item);
	});
	return button;	
}

function removeListItem(item) {
	var str = $(item).find('div').text();
	var index = getIndexOfItem(str);
	currentList.splice(index, 1);

	updateAndRefreshAll();
}

function removeDictionaryItem(item) {
	var str = $(item).find('div').text();
	var index = getIndexOfDictionaryItem(str);
	dictionary.splice(index, 1);

	updateAndRefreshAll();
}

function getIndexOfItem(str) {
	for (var i=0; i<currentList.length; i++) {
		//cure if corrupted
		if (currentList[i] == null) {
			currentList[i] = "";
		}  	

		var value = currentList[i].toString();
		if (str == value) {
			return i;
		}
	}
}

function getIndexOfDictionaryItem(str) {
	for (var i=0; i<dictionary.length; i++) {
		//cure if corrupted
		if (dictionary[i] == null) {
			dictionary[i] = "";
		}  

		var value = dictionary[i];
		if (str == value) {
			return i;
		}
	}
}

