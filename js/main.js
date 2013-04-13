var searchValues = {};

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
	searchValues['zipCode']		= jQuery("input#search-zipcode").val();
	searchValues['sex']			= selectedSex();
	return false;
}
