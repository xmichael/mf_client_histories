var descriptions = {
    createHTML: function(feature){

	var props = feature.properties;
	// image path is base/picture[X].jpg
	var base = props["Base"];
	var name = props["Name"];
	var address = props["Address"];
	var description = props["Description"];
	var keywords = props["Keywords"].join();
	// var date = props["Date of Recording"];
	var pics = props["Pictures"].length>0 ? props["Pictures"]:
            ["No image available"];
	/** Assumes paths are ./base/pictures[0].jpg */

	/* create carousel html for all pictures */
	var _carousel_html = `
    <div id="carouselPictures" class="carousel" data-interval="false" data-ride="carousel">
                          <ol class="carousel-indicators my-4">
                          `;
	for (var i=0; i<pics.length; i++){
	    if ( i == 0){
		_carousel_html += `
        <li data-target="#carouselPictures" data-slide-to="0" class="active"></li>
        `;
	    }
	    else{
		_carousel_html += `
        <li data-target="#carouselPictures" data-slide-to="${i}"></li>
        `;
	    }
	}

	_carousel_html += `</ol><div class="carousel-inner">`;
	for (var i=0; i<pics.length; i++){
	    if ( i == "0"){
		_carousel_html += `<div class="carousel-item active">`;
	    }
	    else{
		_carousel_html += `<div class="carousel-item">`;
	    }
	    _carousel_html += `
                <img class="d-block w-100" src="data/histories/pictures/${base}/${pics[i]}.jpg" alt="Slide ${i}">
                    <div class="carousel-caption d-none d-md-block bg-dark mb-4">
                      <h5>${pics[i]}</h5>
                    </div>
          </div>
          `;
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
        </div> <!--carousel-->
        `;

	var html=`
      <!-- modal-{sm,lg,xl} NOTE: overriden with mw-100 -->
      <div class="modal-dialog modal-lg mw-100" role="document">
        <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${farmer}, ${farm}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-sm-6">
                    <h5>${date}</h5>
                    <h5>Keywords:</h5>
                    <div class="font-italic">
                      ${keywords}
                    </div>
                    <hr>
                    <h5>Description</h5>
                    <div id="detailed-description">
                      ${description}
                    </div>
                  </div>
                  <div class="col-sm-6">
                    ${_carousel_html}
                    <hr>
                    <h5>Related Material</h5>
                    Not currently available
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

	/** Assumes paths are ./base/pictures[0].jpg */
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

	var html='<legend>Filter:</legend>';
	for ( var k of kw_set){
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

export {descriptions, keywords};
