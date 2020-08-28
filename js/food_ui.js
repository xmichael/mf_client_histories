var utils = {
    get_translated_property: function(prop, key){
	if (window.location.search=="?lang=cy"){
	    return prop[`${key} (CY)`];
	}
	return prop[`${key} (EN)`];
    }
};

var descriptions = {
    createHTML: function(feature){

	var props = feature.properties;
	// image path is base/picture[X]_scaled.jpg
	var base = props["ID"];
	var name = utils.get_translated_property(props,"Name");
	var contact_name = props["Contact name"];
	var address = props["Address"];
	var description = utils.get_translated_property(props,"Description");
	var keywords = props["Keywords"].join();
	// var date = props["Date of Recording"];
	var pics = props["Picture title"];
	var telephone = props["Telephone"];
	var email = props["Email"];
	var website = props["Website"];
	var facebook = props["Facebook"];

	
	/* create carousel section when there are pictures available */
	var _carousel_html = "";
	if (pics.length > 0){
	    _carousel_html = `<h5 class="text-muted">Pictures</h5>
                    <hr>
    <div id="carouselPictures" class="carousel" data-interval="false" data-ride="carousel">
              <div class="carousel-inner">`;
	    for (var i=0; i<pics.length; i++){
		if ( i == "0"){
		    _carousel_html += `<div class="carousel-item active">`;
		}
		else{
		    _carousel_html += `<div class="carousel-item">`;
		}
		_carousel_html += `
                <img class="d-block w-100" src="data/food/pictures/${base}/${pics[i]}_scaled.jpg" alt="Slide ${i}">
                    <div class="carousel-caption d-none d-md-block bg-dark mb-4">
                      <h5>${pics[i]}</h5>
                    </div>
                </div>`;
	    }
	    
	    //only add carousel prev-next controls when there is more than one image
	    if (pics.length > 1){
		_carousel_html += `
              <a class="carousel-control-prev" href="#carouselPictures" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
              </a>
              <a class="carousel-control-next" href="#carouselPictures" role="button" data-slide="next">
                 <span class="carousel-control-next-icon" aria-hidden="true"></span>
                 <span class="sr-only">Next</span>
              </a>`;
	    }
	    _carousel_html += `
                  </div> <!--carousel-->`;
	}
	
	//onlt add "produce" section when keywords are defined
	var _produce_html = "";
	if (keywords.length > 0){
	    _produce_html = `                    <h5 class="text-muted">Produce</h5>
                    <hr>
                    <span class="font-italic">${keywords}</span>`;
	}
	
	//only add "follow" section if facebook is defined
	var _follow_html = "";
	if (facebook.length > 0){
	    _follow_html = `<h5 class="text-muted">Follow</h5>
                    <hr>
                    <a href="${facebook}"><i class="fa fa-facebook-square fa-2x"></i></a>`;
	}


	console.log(telephone);
	var __contact_name_html = contact_name != "" ? `<b>${contact_name}</b><br>` : "";
	var __telephone_html = telephone != "" ? `<i>${telephone}</i><br>` : "";
	var __homepage_html = website != "" ? `<a href="${website}">homepage</a><br>` : "";
	var __address_html = address != "" ? `${address}<br>` : "";
	var __email_html = email != "" ? `<a href="mailto:${email}">${email}</a><br>` : "";
	    
	//add contact section (even if empty)
	var _contact_html =` <h5 class="text-muted">Contact</h5>
                    <hr>
                    ${__contact_name_html}
                    <small>                    
                    ${__address_html}
                    ${__telephone_html}
                    ${__homepage_html}
                    ${__email_html}
                    </small>
<p>
`;
	
	var html=`
      <!-- modal-{sm,lg,xl} NOTE: overriden with mw-100 & w-75 (for 75% width) -->
      <div class="modal-dialog modal-lg mw-100 w-75" role="document">
        <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${name}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-sm-6">
                      ${_produce_html}
                    <h5 class="pt-3 text-muted">Description</h5>
                    <hr>
                      ${description}
                  </div>
                  <div class="col-sm-6">
                    ${_carousel_html}
                    ${_contact_html}
                    ${_follow_html}
                  </div>
                </div>
              </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
          </div>
       </div>
      </div> <!-- modal-dialog -->
    `;
	return html;
    },
    createTestHTML: function(feature){

	/** Assumes paths are ./{ID}/{picture title[0]}_scaled.jpg */
	var html=`
      <!-- modal-{sm,lg,xl} NOTE: overriden with mw-100 -->
      <div class="modal-dialog modal-lg mw-100" role="document">
        <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Name, location</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
             Hello
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="close btn btn-primary" data-dismiss="modal">Close</button>
          </div>
       </div>
      </div> <!-- modal-dialog -->
    `;
	return html;
    },
    // Example: modal("description_modal", feature)
    modal: function(modal_id, feature){
	var html = this.createHTML(feature);
	$('#' + modal_id).html(html).modal();
    }
}

var keywords = {
    // create a keyword set from all GeoJSON features
    // example: createSet( features, "Keywwords-cy")
    createSet: function (geojson, property){
	var set = new Set();
	for ( var f of geojson["features"] ){
	    for ( var k of f["properties"][property]){
		set.add(k);
	    }
	}
	return set;
    },
    /* html from keywords
     * kw_set: Set of keywords that will become checkboxes
     * enabled: Subset of kw_set that will be enabled by default
     */
    createHTML: function( kw_set, enabled ){
	var enabled = enabled || new Set();

	var html='<legend>Produce:</legend>';
	for ( var k of kw_set){
	    if (k === ""){
		continue;
	    }
	    html+=`
      <div>`;
	    if ( enabled.has(k)){
		html+= `<input type="checkbox" id="${k}" name="keyword" value="${k}" checked>`;
	    }else{
		html+=`<input type="checkbox" id="${k}" name="keyword" value="${k}">`;
	    }
	    html+=`
         <label for="${k}">${k}</label>
       </div>
      `;
	}
	return html;
    }, /* bind handler function that takes a set of all selected checkboxes */
    bind: function(handler){
	$("input[name='keyword']").on('change',()=>
				      {
					  var set = this.getSelected();
					  handler(set);
				      });
    },
    getSelected: function(){
	var set = new Set();
	for ( var k of $("input[name='keyword']:checked") ){
	    set.add(k.value);
	}
	return set;
    }
};

export {utils, descriptions, keywords};
