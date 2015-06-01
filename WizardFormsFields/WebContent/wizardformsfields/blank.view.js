sap.ui.jsview("wizardformsfields.blank", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf wizardformsfields.blank
	*/ 
	getControllerName : function() {
		return "wizardformsfields.blank";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf wizardformsfields.blank
	*/ 
	createContent : function(oController) {
 		return new sap.m.Page({
			title: "Maestro de elementos para formulario",
			content: []
		});
	}

});