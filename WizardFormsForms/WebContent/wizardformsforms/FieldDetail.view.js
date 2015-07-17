sap.ui.jsview("wizardformsforms.FieldDetail", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf wizardformsforms.SectionsDetail
	*/ 
	getControllerName : function() {
		return "wizardformsforms.FieldDetail";
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
			         new sap.m.Label({text:"Nombre del elemento"}),
			         new sap.m.Input({value:"{forms>fieldtecname}", enabled:false}).addStyleClass("textRedBold"),
			         new sap.m.Label({text:"Titulo del elemento"}),
			         new sap.m.Input({value:"{forms>fieldtitle}", enabled:false}).addStyleClass("textRedBold"),
			         new sap.m.Label({text:"Marcador del elemento"}),
			         new sap.m.Input({value:"{forms>fieldplaceholder}", enabled:false}).addStyleClass("textRedBold"),
			         new sap.m.Label({text:"Tipo de elemento"}),
			         new sap.m.Input({value:"{forms>fieldtype}", enabled:false}).addStyleClass("textRedBold"),
			        			         
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
		
		var oItemBarRulesForm = new sap.m.IconTabFilter({
	        text: "Reglas",
	        icon:"sap-icon://chalkboard",
	        width: "100%",
	        key: "rules",	        
	        content:[ ]
		});	
		
		oIconTab.addItem(oItemBarRulesForm);	
		
		
		var oTableRules = new sap.m.Table({
			id: "oTableRules",
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
		
		var oTemplateRules = new sap.m.ColumnListItem({
			type: sap.m.ListType.Active ,
			cells: [
			        new sap.m.ObjectIdentifier({
			        	title: "{forms>value}"
			        }),
			        
			]
		});
		
		var oHeaderRules = new sap.m.Toolbar({
			content : [ 
	            new sap.m.Label({
	            	text : "Condiciones para asignación de valor"
	            }), 
	            new sap.m.ToolbarSpacer({}), 
	            new sap.m.Button({
	            	icon : "sap-icon://add",
	            	press: function(evt){
	            		oController.addRule(evt)
	            	}
	            })
            ]
		});
		
		oTableRules.setHeaderToolbar(oHeaderRules);	
		
		oTableRules.setMode(sap.m.ListMode.Delete); // delete mode  	

		oTableRules.bindAggregation("items","forms>values",oTemplateRules);
				
		oTableRules.attachItemPress(function(evt){
			oController.sectionPress(evt)
		})
		
		oTableRules.attachDelete(function(evt){
			oController.deleteSection(evt)
		});
				
		oTableRules.attachItemPress(function(evt){
			oController.sectionPress(evt)
		})
		
		oItemBarRulesForm.addContent(oTableRules);
		
		
		var oTable = new sap.m.Table({
			//id: "oTableFields",
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
			cells: [
			        new sap.m.ObjectIdentifier({
			        	title: "{forms>valueext} - {forms>value}"
			        }),
			        
			]
		});
		
		
		// Toolbar de la tabla
		var oHeader = new sap.m.Toolbar({
			content : [ 
	            new sap.m.Label({
	            	text : "Valores del elemento"
	            })
            ]
		});
		
		oTable.setHeaderToolbar(oHeader);	
		
		oTable.bindAggregation("items","forms>values",oTemplate);
		
		oTable.attachDelete(function(evt){
			oController.deleteField(evt)
		});	
		oTable.attachItemPress(function(evt){
			oController.sectionPress(evt)
		})
		oInfoSections.addContent(oTable);
		
		
 		return new sap.m.Page({
			title: "Detalle de sección",
			showNavButton: true,
			navButtonPress: function(){
				oController.goBack();
			},
			footer: new sap.m.Bar({
				contentRight: [ ]
			}),
			content: [oIconTab]
		});
	}

});