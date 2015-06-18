sap.ui.jsview("wizardformsmime.MimeCreate", {


	getControllerName : function() {
		return "wizardformsmime.MimeCreate";
	},


	createContent : function(oController) {

		// Formularios
		var oInfoForm = new sap.ui.layout.VerticalLayout({
			width: "100%",
             content:[
			         	 new sap.m.Label({}),
			         	 new sap.m.Label({text:"Imagen:"}),
			         	 new sap.m.Image({
			         		 id: "imageMime"
			         	 }),
			         	new sap.m.Label({text:"Tamaño:"}),
		        		new sap.m.Input({
				        	 id:"mimeSize",
				        	 enabled:false, 
				        	 placeholder:"Tamaño del archivo",
		        		 }),
			         	new sap.ui.unified.FileUploader({
			                id:"mimeUploader",
			                name:"mimeUploader",
			                mimeType: ["image/jpeg", "image/png"],
			                fileType: ["jpg", "png"],
			                style: "Accept",
			                buttonOnly: true,
			                uploadOnChange: true,
			                buttonText: "Seleccione una imagen desde la computadora...",
			                uploadComplete: function(evt){
			                	var fSize = evt.getParameter("fileSize");
			                	oController.uploadData(evt)
			                },
			                
			               }),
			              /*
			         	 new sap.ui.unified.FileUploader({
			         		id: "mimeUploader",
			        		name: "mimeUploader",  
			        		//width: "100%",
			        		fileType: ["png ,jpg"],
			        		mimeType: ["image/png", "image/jpg"],
			        		style: "Accept",
			        		buttonOnly: true,
			                uploadOnChange: true,
			                buttonText: "Presione para cargar una imagen: ",
			                uploadComplete: function(evt){
			                      oController.uploadData(evt)
			                },
			        	 }),*/
		        		 new sap.m.Label({text:"Nombre:"}),
		        		 new sap.m.Input({
				        	 id:"mimeName",
				        	 enabled:true, 
				        	 placeholder:"Nombre de la imagen",
		        		 }),
				         new sap.m.Label({text:"Descripción:"}),
				         new sap.m.Input({
				        	 id:"mimeDescp",
				        	 enabled:true, 
				        	 placeholder:"Ingrese la descripción de la imagen",
		        		 }),
			         ]
		 }).addStyleClass("layPadding10");
		
		//Icon Tab
		var oIconTab = new sap.m.IconTabBar({
			title: "IconTab",
			showHeader: false
		})
		
		// Agrego a la pestaña el formulario
		var oItemBarInfoForm = new sap.m.IconTabFilter({
		        text: "Información",
		        icon:"sap-icon://hint",
		        content:[ oInfoForm ]
	    });
		
		oIconTab.addItem(oItemBarInfoForm);	
		
 		return new sap.m.Page({
 			title: "Carga de imágenes",
			footer: new sap.m.Bar({
				contentRight: [
								new sap.m.Button({
									text: "Guardar",
									icon: "sap-icon://save",
									press: function(evt){
										oController.saveData(evt)
									}
								}),
				              
	            ]
			}),
			content: [oIconTab]
		});
		
	}

});