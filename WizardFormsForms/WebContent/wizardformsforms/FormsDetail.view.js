sap.ui.jsview("wizardformsforms.FormsDetail", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf wizardformsforms.FormsDetail
	*/ 
	getControllerName : function() {
		return "wizardformsforms.FormsDetail";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf wizardformsforms.FormsDetail
	*/ 
	createContent : function(oController) {
		
		
		// Formularios
		var oInfoForm = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content:[
		         	 new sap.m.Label({}),
			         new sap.m.Label({text:"Código de formulario"}),
			         new sap.m.Input({value:"{forms>formid}",enabled:false}),
			         new sap.m.Label({text:"Nombre de formulario"}),
			         new sap.m.Input({value:"{forms>formtitle}",enabled:true}),
			         new sap.m.Label({text:"Usuario creador"}),
			         new sap.m.Input({value:"{forms>createuser}",enabled:false}),
			         new sap.m.Label({text:"Fecha de creación"}),
			         new sap.m.Input({value:"{forms>createdate}",enabled:false}),
			]
		}).addStyleClass("layPadding10");
		
		var oSectionsForm = new sap.ui.layout.VerticalLayout({
			width: "100%"
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
		
		var oItemBarSectionsForm = new sap.m.IconTabFilter({
	        text: "Secciones",
	        icon:"sap-icon://Chart-Tree-Map",
	        content:[ oSectionsForm ]
		});	
		
		oIconTab.addItem(oItemBarInfoForm);	
		oIconTab.addItem(oItemBarSectionsForm);	
		
		var oTable = new sap.m.Table({
			id: "oTableSections",
			inset: false,
			columns: [
			          //Value
			          new sap.m.Column({
			        	  halign: "left",
			        	  width: "100px",
			        	  demandPopin: true,
			        	  popinDisplay: "Block",
			        	  minScreenWidth: sap.m.ScreenSize.Medium
			          })
	        ]
		});
		
		
		
		var oTemplate = new sap.m.ColumnListItem({
			type: sap.m.ListType.Active ,
			cells: [
			        new sap.m.ObjectIdentifier({
			        	title: "{forms>sectiontitle}"
			        }),
			        
			]
		});
		
		
		// Toolbar de la tabla
		var oHeader = new sap.m.Toolbar({
			content : [ 
	            new sap.m.Label({
	            	text : "Secciones del formulario"
	            }), 
	            new sap.m.ToolbarSpacer({}), 
	            new sap.m.Button({
	            	icon : "sap-icon://add",
	            	press: function(evt){
	            		oController.addSection(evt)
	            	}
	            })
            ]
		});
		
		oTable.setHeaderToolbar(oHeader);	
		//oTable.setMode(sap.m.ListMode.SingleSelect);
		oTable.setMode(sap.m.ListMode.Delete); // delete mode  	

		oTable.bindAggregation("items","forms>sections",oTemplate);
		
		oTable.attachDelete(function(evt){
			oController.deleteSection(evt)
		});	
		oTable.attachItemPress(function(evt){
			oController.sectionPress(evt)
		})
		
		oSectionsForm.addContent(new sap.m.Label({}));
		oSectionsForm.addContent(oTable);
		
 		return new sap.m.Page({
			title: "Detalle de formulario",
			footer: new sap.m.Bar({
				contentRight: [
								new sap.m.Button({
									text: "Eliminar",
								    icon: "sap-icon://delete",
								    type: "Reject",
								    press: function(evt){
									  //oController.deleteData(evt)
								  }
								}),
								new sap.m.Button({
									text: "Guardar",
									icon: "sap-icon://save",
									press: function(evt){
										//Controller.saveData(evt)
									}
								}),
				              
	            ]
			}),
			content: [oIconTab]
		});
	}

});