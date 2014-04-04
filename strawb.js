var dictionary = [];
var currentList = [];


$(document).ready(function() {
	checkLocalStorage();
	refreshListDisplay();

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
});

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
		li.html(arr[i]);
		li.click(function(event){
			var val = $(this).html();
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
 	div.html(str);
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
	var str = $(item).find('div').html();
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
		var value = dictionary[i].toString();
		if (str == value) {
			return i;
		}
	}
}

