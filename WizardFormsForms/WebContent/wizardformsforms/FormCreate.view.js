sap.ui.jsview("wizardformsforms.FormCreate", {


	getControllerName : function() {
		return "wizardformsforms.FormCreate";
	},


	createContent : function(oController) {
		
		// Formularios
		var oInfoForm = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content:[
		         	 new sap.m.Label({}),
		         	 new sap.m.Label({text:"Paquete"}),
			         new sap.m.Input({
			        	 id:"formPackageNew",
			        	 enabled:true, 
			        	 showSuggestion:true,
			        	 showValueHelp:true,
			        	 placeholder:"Seleccione el paquete del formulario",
			        	 valueHelpRequest: function(evt){
			        		 oController.getPackages(evt)
			        	 },
			        	 liveChange: function(evt){
			        		 oController.validateRequiredField(evt)
			        	 }
	        		 }),
			         new sap.m.Label({text:"Orden de transporte"}),
			         new sap.m.Input({
			        	 id:"formOrderNew",
			        	 enabled:true, 
			        	 showSuggestion:true,
			        	 showValueHelp:true,
			        	 placeholder:"Seleccione la orden de transporte",
			        	 valueHelpRequest: function(evt){
			        		 oController.getTransportOrder(evt)
			        	 },
			        	 liveChange: function(evt){
			        		 oController.validateRequiredField(evt)
			        	 }
	        		 }),
			         new sap.m.Label({text:"Nombre de formulario"}),
			         new sap.m.Input({
			        	 id:"formTitleNew",
			        	 enabled:true, 
			        	 placeholder:"Ingrese el nombre del formulario",
			        	 liveChange: function(evt){
			        		 oController.validateRequiredField(evt)
			        	 }
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
 			title: "Creación de formulario",
			footer: new sap.m.Bar({
				contentRight: [
								new sap.m.Button({
									id: "btnSaveNew",
									text: "Guardar",
									icon: "sap-icon://save",
									enabled: false,
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