var searchValues = {};
var queryTask, query;

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
	searchValues['color'] 		= jQuery("input#search-color").val() || null;
	searchValues['street']		= jQuery("input#search-street").val();
	searchValues['city']		= jQuery("input#search-city").val();
	searchValues['sex']			= selectedSex();
	execute();
	return true;
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
	queryTask.execute(query, showResults);
}

function buildQuery() {
	
	var queryString = "";

	if (searchValues['breed']) {
		queryString += "Breed LIKE '" + searchValues['breed'] + "'";
	}

	if (searchValues['color']) {
		queryString += " Color LIKE '" + searchValues['color'] + "'";
	}

	if (searchValues['street']) {
		queryString += " Street LIKE '" + searchValues['street'] + "'";
	}

	if (searchValues['city']) {
		queryString += " City LIKE '" + searchValues['city'] + "'";
	}

	if (searchValues['sex']) {
		queryString += " Sex LIKE '" + searchValues['sex'] + "'";
	}
	alert(queryString);
	return queryString;
}

function showResults(results) {
	var s = "";
	for (var i=0, il=results.features.length; i<il; i++) {
	  var featureAttributes = results.features[i].attributes;
	  for (att in featureAttributes) {
	    s = s + "<b>" + att + ":</b>  " + featureAttributes[att] + "<br />";
	  }
	}
	alert(s);
	// jQuery("#info").html(s);
	// dojo.byId("info").innerHTML = s;
}

