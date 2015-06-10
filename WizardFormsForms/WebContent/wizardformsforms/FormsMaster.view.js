sap.ui.jsview("wizardformsforms.FormsMaster", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf wizardformsforms.FormsMaster
	*/ 
	getControllerName : function() {
		return "wizardformsforms.FormsMaster";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf wizardformsforms.FormsMaster
	*/ 
	createContent : function(oController) {
		this.oList = new sap.m.List({
			id: "listId"
		});	
			
 		return new sap.m.Page({
			title: "Lista de formularios",
			subHeader: new sap.m.Bar({
				contentMiddle: [
					new sap.m.SearchField({
						liveChange:function(evt){
							oController.onChangeSearch(evt);
						},
					    width:"100%",
					    placeholder:"Buscar formulario",
					}),	
					
				],
				contentRight:[
						new sap.m.Button({
							icon : "sap-icon://add",
							press: function(evt){
								ibm.wizardforms.forms.common.addNewPress(evt,oController);
							}
						}),
				]
			}),
			content: [this.oList]
		});
	}

});