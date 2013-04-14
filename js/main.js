var searchValues = { };
var queryTask, query;
var formatedResults;

// Setup after dom loaded
$(function() {
	dojo.require("esri.tasks.query");
	dojo.require("esri.map");
	dojo.ready(init);
});

function selectedSex() {
	if ( jQuery("input#search-sex-male").is(':checked') ) {
		return jQuery("input#search-sex-male").val();
	} else if ( jQuery("input#search-sex-female").is(':checked') ) {
		return jQuery("input#search-sex-female").val();
	}
	return null;
}

function captureForm() {
	searchValues['breed'] 		= jQuery("input#search-breed").val();
	searchValues['color'] 		= jQuery("input#search-color").val();
	searchValues['street']		= jQuery("input#search-street").val();
	searchValues['city']		= jQuery("input#search-city").val();
	searchValues['sex']			= selectedSex();
	execute();
	return false;
}

function init() {
	//build query
	queryTask = new esri.tasks.QueryTask("http://54.225.237.62/arcgis/rest/services/Environmental/MapServer/0");

	//build query filter
	query = new esri.tasks.Query();
	query.returnGeometry = false;
	query.outFields = ["Owner","Addr","CITY","City","Breed","Name_and_I","Sex", "Color", "Dd_Tag","Tag_Expire","Tatoo_No","Date_decla","Victim_Inf", "Comment"];
}

function execute() {
	query.text = searchValues['color'];
	query.where = buildQuery();
	//execute query
	queryTask.execute(query,showResults1);
}

function buildQuery() {
	
	var queryString = "";

	if (searchValues['breed']) {
		queryString += "Breed LIKE '" + searchValues['breed'] + "'";
	}

	if (searchValues['color']) {
		if (searchValues['breed']) {
			queryString += " or Color LIKE '" + searchValues['color'] + "'";
		} else {
			queryString += "Color LIKE '" + searchValues['color'] + "'";
		}
	}

	if (searchValues['street']) {
		if (searchValues['color']) {
			queryString += " or Street LIKE '" + searchValues['street'] + "'";
		} else {
			queryString += "Street LIKE '" + searchValues['street'] + "'";
		}
	}

	if (searchValues['city']) {
		if (searchValues['street']) {
			queryString += " or City LIKE '" + searchValues['city'] + "'";
		} else {
			queryString += "City LIKE '" + searchValues['city'] + "'";
		}
	}

	if (searchValues['sex']) {
		if (searchValues['city']) {
			queryString += " or Sex LIKE '" + searchValues['sex'] + "'";
		} else {
			queryString += "Sex LIKE '" + searchValues['sex'] + "'";
		}
	}

	// If no query string built pull everything
	if (queryString == "") {
		queryString = "1=1";
	}

	// Dirty the query with the dates or it fails on every other request
	return queryString + " and " + new Date().getTime() + "=" + new Date().getTime();
}

function showResults(results) {
	var formatedResults = "";
	for (var i=0, il=results.features.length; i<il; i++) {
	  var featureAttributes = results.features[i].attributes;
	  	  for (att in featureAttributes) {
	       
	       formatedResults += "<b>" + att + ":</b>  " + featureAttributes[att] ;
	       }
	     
	  }
	

	jQuery("#dog-info").html(formatedResults);
	$.mobile.changePage("#dog-details");
}
//----------------------------------

//Function to parse the JSON message and pass it to #employeeList listview.
function showResults1(results) {
	
		$('#employeeList li').remove();
		var employees = results.features;
		$.each(employees, function(index, feature) {
		console.log(feature);
			$('#employeeList').append('<li><a href="employeedetails.html?id=' + feature.attributes.Owner + '">' +
					
					'<h4>' + feature.attributes.Addr + '</h4>' +
					'<p>' + feature.attributes.Color + '</p>' +
					//'<p>' + feature.attributes.Sex + '</p>' +
					//'<p>' + feature.attributes.City + '</p>' +
					'<span class="ui-li-count">' + feature.attributes.Comment + '</span></a></li>');
                                       //alert(feature.attributes.Addr);
		});
		
		
		$('#employeeList').listview('refresh');
		//$.mobile.changePage("#dog-details");
	}

