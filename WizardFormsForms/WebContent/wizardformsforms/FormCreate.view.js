sap.ui.jsview("wizardformsforms.FormCreate", {


	getControllerName : function() {
		return "wizardformsforms.FormCreate";
	},


	createContent : function(oController) {
		
		var oInputPackage = new sap.m.Input({
	       	 id:"formPackageNew",
	    	 enabled:true,			        	 
	    	 showValueHelp:true,
	    	 showSuggestion: true,
	    	 suggestionColumns: [
                 new sap.m.Column({
                   header: new sap.m.Label({
                     text: 'Paquete'
                   })
                 }),
                 new sap.m.Column({
                   header: new sap.m.Label({
                     text: 'Descripción'
                   })
                 })
             ],
	    	 placeholder:"Seleccione el paquete del formulario",
	    	 valueHelpRequest: function(evt){
	    		 oController.getPackages(evt)
	    	 },
	    	 liveChange: function(evt){
	    		 oController.validateRequiredField(evt)
	    	 }
		});
		
		var oColumnPackages = new sap.m.ColumnListItem({
		    cells: [
		      new sap.m.Label({
		        text: '{packages>devclass}'
		      }),
		      new sap.m.Label({
		        text: '{packages>ctext}'
		      })
		    ]
		  });

		oInputPackage.bindAggregation("suggestionRows", "packages>/", oColumnPackages);
		
		var oInputOrders = new sap.m.Input({
	       	 id:"formOrderNew",
	    	 enabled:true, 
	    	 showValueHelp:true,
	    	 showSuggestion: true,
	    	 suggestionColumns: [
                 new sap.m.Column({
                   header: new sap.m.Label({
                     text: 'Paquete'
                   })
                 }),
                 new sap.m.Column({
                   header: new sap.m.Label({
                     text: 'Descripción'
                   })
                 })
             ],
	    	 placeholder:"Seleccione la orden de transporte",
	    	 valueHelpRequest: function(evt){
	    		 oController.getTransportOrder(evt)
	    	 },
	    	 liveChange: function(evt){
	    		 oController.validateRequiredField(evt)
	    	 }
		});
		
		var oColumnOrders = new sap.m.ColumnListItem({
		    cells: [
		      new sap.m.Label({
		        text: '{orders>trkorr}'
		      }),
		      new sap.m.Label({
		        text: '{orders>as4text}'
		      })
		    ]
		  });

		oInputOrders.bindAggregation("suggestionRows", "orders>/", oColumnOrders);
		
		
		// Formularios
		var oInfoForm = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content:[
		         	 new sap.m.Label({}),
		         	 new sap.m.Label({text:"Paquete"}),
		         	 oInputPackage,
			         new sap.m.Label({text:"Orden de transporte"}),
			         oInputOrders,
			         new sap.m.Label({text:"Nombre de formulario"}),
			         new sap.m.Input({
			        	 id:"formTecName",
			        	 enabled:true, 
			        	 placeholder:"Ingrese un nombre técnico para el formulario",
			        	 liveChange: function(evt){
			        		 oController.validateRequiredField(evt)
			        	 }
	        		 }),
	        		 new sap.m.Label({text:"Titulo del formulario"}),
	        		 new sap.m.Input({
			        	 id:"formTitleNew",
			        	 enabled:true, 
			        	 placeholder:"Ingrese el titulo para el formulario",
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