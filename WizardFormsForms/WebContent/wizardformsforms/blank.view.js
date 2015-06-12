sap.ui.jsview("wizardformsforms.blank", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf wizardformsforms.blank
	*/ 
	getControllerName : function() {
		return "wizardformsforms.blank";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf wizardformsforms.blank
	*/ 
	createContent : function(oController) {
 		return new sap.m.Image({
			    	src: "images/sap_fiori.png",
			    	width: "100%",
			    	height: "100%"
			    })
	}

});