var dictionary = [];


$(document).ready(function() {
	checkLocalStorage();
	updateList();

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
    	$(this).val('');
    	saveNewEntry(val);
    });
});

function checkLocalStorage() {
	if(typeof(Storage)!=="undefined")
  	{
  		retrieveDictionary();
  	}
	else
  	{
  		window.alert("Unfortunately, I couldn't find your local storage.");
  	}
}

function retrieveDictionary() {
	var str = localStorage["strawbListOfAmazingThings"];
	if (!str || str === 'undefined') {
		console.log("list was missing in local storage");
		dictionary = [];
	} else {
		dictionary = JSON.parse(str);
	}
}

function updateDictionary() {
	localStorage["strawbListOfAmazingThings"] = JSON.stringify(dictionary);
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
	updateList();
	clearSuggestions();
}

function updateDictionaryWith(str) {
	dictionary.push(str);
	localStorage['strawbListOfAmazingThings'] = JSON.stringify(dictionary);
}

function updateList() {
	$('#strawb_current_list ul').empty();
	if (dictionary && dictionary.length > 0) {
		dictionary.forEach(function(item){
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
	var str = item.html();
	var index = getIndexOfDictionaryItem(str);
	dictionary.splice(index, 1);
	updateDictionary();
	updateList();
}

function getIndexOfDictionaryItem(str) {
	for (var i=0; i<dictionary.length; i++) {
		var value = dictionary[i].toString();
		if (str == value) {
			return i;
		}
	}
}

