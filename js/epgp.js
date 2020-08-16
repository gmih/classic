var lh,
LootHistory;

LootHistory = {
	settings: {
		lootHistory: {},
		loot: {},
		searchBox: $('#search-loot')

	},

	init: function(url) {
		lh = LootHistory.settings;
		LootHistory.bindUIActions();
		LootHistory.getLootHistory(url);
	},

	bindUIActions: function() {

		lh.searchBox.on("input", function(e) {
				var term = lh.searchBox.val();
				LootHistory.searchLoot(term);
		});

	},

	getLootHistory: function (instance) {
		var url = "/epgp/rclc-history.json";
		$.getJSON( url, function( data ) {
			lh.lootHistory = data.filter(function(item) {
				if (instance === "t1-loot-history") {
					return (item.instance === "Molten Core-40 Player" || item.instance === "Onyxia's Lair-40 Player") && parseInt(item.response, 10);
				} else if (instance === "t2-loot-history") {
					return item.instance === "Blackwing Lair-40 Player" && parseInt(item.response, 10);
				} // else if (instance === "t3-loot-history") {
				// 	return item.instance === "Blackwing Lair-40 Player" && parseInt(item.response, 10);
				// }
			}).map(function(filteredItem) {
				var timestamp = new Date(filteredItem.date + " " + filteredItem.time).getTime() / 1000;
				return [timestamp, filteredItem.player, filteredItem.itemString, filteredItem.response];
			}).sort(function(x, y) {
				return x[0] - y[0];
			})

		// [timestamp, name, wowhead link thing, gp]
				$.getJSON( '/epgp/ext-raiders.json', function( raiders ) { 
					LootHistory.display(lh.lootHistory, raiders);
					LootHistory.searchLoot(lh.searchBox.val());
				});
		});




	},

	display: function(items, raiders) {
		for (var i=0; i<items.length; i++) {

			var item = items[i];
			if (item[1] !== 'EP') {

				if (item[1] === 'GP') {
					if (!item[3].startsWith('Decay')) {
						var displayContainer = $('<tr>', {
							"class": "display-container"
						}).insertAfter($('#loot-history'));
			
						var displayDate = $('<td>', {
							"class": "display-date",
							"data-timestamp": item[0],
							"text": LootHistory.parseDate(item[0])
						}).appendTo(displayContainer);


						var name = LootHistory.stripName(item[2]);
						var correctName;
						if (raiders[name]) {
							correctName = raiders[name];
						} else {
							correctName = name;
						}
						var displayName = $('<td>', {
							"class": "display-name",
							"text": correctName
						}).appendTo(displayContainer);

						var displayLink = $('<td>', {
							"class": "display-link"
						}).appendTo(displayContainer);
			
						var displayItem = $('<a>', {
							"class": "display-item",
							"href": LootHistory.formatItem(item[3]),
							"text": LootHistory.formatItem(item[3])
						}).appendTo(displayLink);
			
						var displayGP = $('<td>', {
							"class": "display-gp",
							"text": item[4]
						}).appendTo(displayContainer);
					}
				} else {



					var displayContainer = $('<tr>', {
						"class": "display-container"
					}).insertAfter($('#loot-history'));
		
					var displayDate = $('<td>', {
						"class": "display-date",
						"data-timestamp": item[0],
						"text": LootHistory.parseDate(item[0])
					}).appendTo(displayContainer);


					var name = LootHistory.stripName(item[1]);
					var correctName;
					if (raiders[name]) {
						correctName = raiders[name];
					} else {
						correctName = name;
					}
					var displayName = $('<td>', {
						"class": "display-name",
						"text": correctName
					}).appendTo(displayContainer);
		
					var displayLink = $('<td>', {
						"class": "display-link"
					}).appendTo(displayContainer);
		
					var displayItem = $('<a>', {
						"class": "display-item",
						"href": LootHistory.formatItem(item[2]),
						"text": LootHistory.formatItem(item[2])
					}).appendTo(displayLink);
		
					var displayGP = $('<td>', {
						"class": "display-gp",
						"text": item[3]
					}).appendTo(displayContainer);
				}
			}
		}


	},

	parseDate: function(timestamp) {
		var date = new Date(timestamp*1000);

		var month = date.getMonth() + 1;
		var day = date.getDate();
		var year = date.getFullYear();

		var formattedTime = month +'/' + day + '/' + year;
		return formattedTime;
	},

	stripName: function(name) {
		return name.split('-')[0];
	},

	formatItem: function(item_string) {
		var item = item_string.split(':');
		var itemID = item[1];
		var link = "http://classic.wowhead.com/item=" + itemID;

		return link;
	},

	searchLoot: function(term) {
	  // Declare variables 
	  var table, tr, displayName, lootItem, i, filter;
	  table = $(".loot-history");
	  tr = $(".display-container");
	  filter = term.toUpperCase();

	  // Loop through all table rows, and hide those who don't match the search query
	  for (i = 0; i < tr.length; i++) {
	    displayName = tr[i].getElementsByClassName("display-name");
	    lootItem = tr[i].getElementsByClassName("display-item");
	    if (displayName || lootItem) {
	      if (displayName[0].innerHTML.toUpperCase().indexOf(filter) > -1 || lootItem[0].innerText.toUpperCase().indexOf(filter) > -1) {
	        tr[i].style.display = "";
	      } else {
	        tr[i].style.display = "none";
	      }
	    } 
	  }
	}
};