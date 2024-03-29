sap.ui.jsview("wizardformsmime.Images", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf wizardformsmime.Images
	*/ 
	getControllerName : function() {
		return "wizardformsmime.Images";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf wizardformsmime.Images
	*/ 
	createContent : function(oController) {
		
		// crear lista
		this.oList = new sap.m.List({
			id : "listId",
		});		
		
// Se definen los datos de inicialización de la vista
 		return new sap.m.Page({
			title: "Repositorio MIME",
			subHeader: new sap.m.Bar({
				
				contentMiddle: [
				   // campo de busqueda en la lista
			       new sap.m.SearchField({
			    	   
			    	   width: "100%",
			    	   placeholder: "Filtro de imagen",
			    	   liveChange: function (evt){
			    		   
			    		   oController.onChangeSearch(evt);
			    		   
			    	   },
			    	   width:"100%",
					   placeholder:"Buscar Imagen",
			    	   
			       })         
				                
                ],
                 // Se agrega un pulsador a la derecha del campo de búsqueda
                contentRight:[
      						new sap.m.Button({
      							icon : "sap-icon://add",
      							press: function(evt){
      								ibm.wizardforms.mime.common.addNewPress(evt,oController);
      							}
      						}),
      				]
				
			}),
			content: [this.oList]
		});

	}

});