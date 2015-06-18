sap.ui.jsview("wizardformsmime.Data", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf wizardformsmime.Data
	*/ 
	getControllerName : function() {
		return "wizardformsmime.Data";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf wizardformsmime.Data
	*/ 
	createContent : function(oController) {
		
		// Imagen
		var oImgMain = new sap.m.Image({ src: "{images>imagen}", height : "200px" });
        
		// Nombre de la imagen
		var oLblblnk  = new sap.m.Label({ text : " " });  
		var oLblIdent = new sap.m.Label({ text : "Código de imagen" });  
		var oTxtIdent = new sap.m.Input({ id   : "imgId", value:"{images>imgid}", enabled: false });
		var oLblTitle = new sap.m.Label({ text : "Nombre de la Imagen" });  
		var oTxtTitle = new sap.m.Input({ id   : "namefld", value:"{images>namefld}", enabled: false }); 
		
		// Descripción de la imagen
		var oLblDescr = new sap.m.Label({ text : "Descripción de la imagen" });  
		var oTxtDescr = new sap.m.Input({ id   : "descrimg", value:"{images>descpfld}", enabled: false }); 
		
        // Datos del usuario
		var oLblUser= new sap.m.Label({text:"Imagen cargada por "});
		var oTxtUser = new sap.m.Input({value:"{images>createuser}",enabled:false,});
		
		// Fecha de creacion
		var oLblDate = new sap.m.Label({text:"Fecha de carga de la imagen"});
        var oTxtDate = new sap.m.Input({
       	 value:{
       		 path:"images>createdate",
       		 type: 'sap.ui.model.type.Date',
       		 formatOptions: {
       	          style: 'long',
       	          source: {
       	            pattern: 'yyyyMMdd'
       	          }
   	         }
       	 },
       	 enabled:false
       });
		
		// Formulario
		var oInfoForm = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content:[oImgMain, oLblblnk, oLblIdent, oTxtIdent, oLblTitle, oTxtTitle, oLblDescr, oTxtDescr, oLblUser, oTxtUser, oLblDate, oTxtDate]
		});		 
		
		oInfoForm.addStyleClass("layPadding10");
		
		
		//Icon Tab
		var oIconTab = new sap.m.IconTabBar({
			title: "IconTab",
			showHeader: false
		})
		
		// Agrego a la pestaña el formulario
		var oItemBarInfo = new sap.m.IconTabFilter({
		        text: "Información",
		        icon:"sap-icon://hint",
		        content:[ oInfoForm ]
	     });		
		oIconTab.addItem(oItemBarInfo);		
		
		
		return new sap.m.Page({
			title: "{images>namefld}",
			
			footer: new sap.m.Bar({
				contentRight: [
								new sap.m.Button({
									text: "Eliminar",
								    icon: "sap-icon://delete",
								    type: "Reject",
									press: function(evt){
										oController.deleteData(evt)
									}
								}),
				              
	            ]
			}),
            
			// Esta linea de codigo, es la que conecta los labels y demás elementos a la vista
			content: [ oIconTab ]
			
		});
 
	}

});