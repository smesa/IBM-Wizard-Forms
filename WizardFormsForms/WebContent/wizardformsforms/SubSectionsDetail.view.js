sap.ui.jsview("wizardformsforms.SubSectionsDetail", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf wizardformsforms.SectionsDetail
	*/ 
	getControllerName : function() {
		return "wizardformsforms.SubSectionsDetail";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf wizardformsforms.SectionsDetail
	*/ 
	createContent : function(oController) {
		
		var oInfoSections = new sap.ui.layout.VerticalLayout({
			width: "100%",			
			content:[
		         	 new sap.m.Label({}),
			         new sap.m.Label({text:"Titulo de la subsección"}),
			         new sap.m.Input({value:"{forms>sectiontitle}"}),
			         new sap.m.Label({text:"Nro de columnas de la sección"}),
			         new sap.m.ComboBox({
						  selectedKey:"{forms>sectioncolumn}",
						  width: "100%",
						  items: [
			                          new sap.ui.core.ListItem({text: "1 Columna", key:"1"}).bindProperty("text","StatusText").bindProperty("key","Status"),
			                          new sap.ui.core.ListItem({text: "2 Columnas",key:"2"}),
			                          new sap.ui.core.ListItem({text: "3 Columnas",key:"3"}),
			                          new sap.ui.core.ListItem({text: "4 Columnas",key:"4"})
			                     ]
			        }).bindProperty("value","StatusText")			         
			]
		}).addStyleClass("layPadding10");
		
		//Icon Tab
		var oIconTab = new sap.m.IconTabBar({
			title: "IconTab",
			showHeader: false
		})
		
		// Agrego a la pestaña el formulario
		var oItemBarSectionsForm = new sap.m.IconTabFilter({
		        text: "Información",
		        icon:"sap-icon://hint",
		        content:[ oInfoSections ]
	    });	
		
		oIconTab.addItem(oItemBarSectionsForm);	
		

		
		// Elementos de la seccion
		
		var oTable = new sap.m.Table({
			id: "oTableFieldsSub",
			inset: false,
			columns: [
			          
					new sap.m.Column({
						width: "30%",
						header: new sap.m.Label({
							text:"Elemento",
						})
					}),
			          //Value
			        new sap.m.Column({
			        	header: new sap.m.Label({
							text:"Descripción",
						})
			        })
	        ]
		});
		
		
		var oTemplate = new sap.m.ColumnListItem({
			type: sap.m.ListType.Active ,
			cells: [
			        new sap.m.ObjectIdentifier({
			        	title: "{forms>fieldtecname}"
			        }),
			        
			        new sap.m.ObjectIdentifier({
			        	title: "{forms>fieldtitle}"
			        }),			        
			]
		});	
		
		
		// Toolbar de la tabla
		var oHeader = new sap.m.Toolbar({
			content : [ 
	            new sap.m.Label({
	            	text : "Elementos de la subsección"
	            }), 
	            new sap.m.ToolbarSpacer({}), 
	            new sap.m.Button({
	            	icon : "sap-icon://add",
	            	press: function(evt){
	            		oController.addField(evt)
	            	}
	            })
            ]
		});
		
		oTable.setHeaderToolbar(oHeader);	
		
		oTable.setMode(sap.m.ListMode.Delete); // delete mode  	

		oTable.bindAggregation("items","forms>fields",oTemplate);
		
		oTable.attachDelete(function(evt){
			oController.deleteField(evt)
		});	
		oTable.attachItemPress(function(evt){
			oController.fieldPress(evt)
		})
		
		oInfoSections.addContent(new sap.m.Label({}));
		oInfoSections.addContent(oTable);
		
		that = this;
		
 		return new sap.m.Page({
			title: "Detalle de subsección",
			showNavButton: true,
			navButtonPress: function(){
				oController.goBack();
			},
			footer: new sap.m.Bar({
				contentRight: [
					new sap.m.Button({
						text: "Eliminar",
					    icon: "sap-icon://delete",
					    type: "Reject",
					    press: function(evt){
						  sap.ui.controller("wizardformsforms.FormsDetail").deleteData(that);
					  }
					}),
					new sap.m.Button({
						text: "Guardar",
						icon: "sap-icon://save",
						press: function(evt){
							sap.ui.controller("wizardformsforms.FormsDetail").saveData(that);
						}
					}),
				]
			}),
			content: [oIconTab]
		});
	}

});