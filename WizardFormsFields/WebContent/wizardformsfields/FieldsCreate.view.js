sap.ui.jsview("wizardformsfields.FieldsCreate", {


	getControllerName : function() {
		return "wizardformsfields.FieldsCreate";
	},

	createContent : function(oController) {
		

		// Nombre de elemento
		var oLblblnk  = new sap.m.Label({ text : " " });  
		var oLblTecName = new sap.m.Label({ text : "Nombre técnico del elemento" });  
		var oTxtTecName = new sap.m.Input({
			id:"oTxtTecName",
			liveChange: function(evt){
       		 	oController.validateRequiredField(evt)
       	 	}
		});  
		
		var oLblTitle = new sap.m.Label({ text : "Titulo del elemento" });  
		var oTxtTitle = new sap.m.Input({
			id:"oTxtTitle",
			liveChange: function(evt){
       		 	oController.validateRequiredField(evt)
       	 	}
		});  
		
		// Placeholder
		var oLblPlace = new sap.m.Label({ text : "Marcador" });  
		var oTxtPlace = new sap.m.Input({ id:"oTxtPlace"}); 
		
		// Tipo
		var oLblType  = new sap.m.Label({ text : "Tipo de elemento" }); 		
		var oCmbType = new sap.m.ComboBox({
			  id:"oCmbType",
			  width: "100%",
			  selectedKey: "TEXT",
			  items: [
                          new sap.ui.core.ListItem({text: "Text Input",key:"TEXT"}).bindProperty("text","StatusText").bindProperty("key","Status"),
                          new sap.ui.core.ListItem({text: "Combo Box",key:"COMBO"}),
                          new sap.ui.core.ListItem({text: "Radio Button",key:"RADIO"}),
                          new sap.ui.core.ListItem({text: "Check Box",key:"CHECK"}),
                          new sap.ui.core.ListItem({text: "Calendario",key:"CALE"}),
                          new sap.ui.core.ListItem({text: "Hora",key:"TIME"})
                     ]
        }).bindProperty("value","StatusText");
		
		
		// Formulario
		var oInfoForm = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content:[oLblblnk, oLblTecName,oTxtTecName, oLblTitle,oTxtTitle,oLblPlace,oTxtPlace,oLblType,oCmbType]
		}).addStyleClass("layPadding10");
		
		
		//===== Grupos de valores
		var oTableGroup = new sap.m.Table({
			id: "oTableGroupNew",
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
		
		var oTemplateGroup = new sap.m.ColumnListItem({
			type: sap.m.ListType.Active ,
			cells: [
			        new sap.m.ObjectIdentifier({
			        	title: "{groups>grouptitle}"
			        }),			        
			]
		});
		
		
		// Toolbar de la tabla
		var oHeaderGroup = new sap.m.Toolbar({
			content : [ 
	            new sap.m.Label({
	            	text : "Grupos de valores"
	            }), 
	            new sap.m.ToolbarSpacer({}), 
	            new sap.m.Button({
	            	icon : "sap-icon://add",
	            	press: function(evt){
	            		oController.addGroupDialog(evt)
	            	}
	            })
            ]
		});
		
		oTableGroup.setHeaderToolbar(oHeaderGroup);	
		
		oTableGroup.setMode(sap.m.ListMode.Delete); // delete mode  	

		oTableGroup.bindAggregation("items","groups>/",oTemplateGroup);
				
	
		oTableGroup.attachDelete(function(evt){
			oController.deleteGroupDialog(evt)
		});		
		
		oInfoForm.addContent(oTableGroup);
	
		
		
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
		
		
		// Tabla de valores		
		var oTable = new sap.m.Table({
			id: "oValueTableNew",
			inset: false,
			columns: [
			          //Value
			        new sap.m.Column({
						width: "30%",
						header: new sap.m.Label({
							text:"Valor",
						})
					}),
					  //Value
					new sap.m.Column({
						header: new sap.m.Label({
							text:"Descripción",
						})
					}),
					new sap.m.Column({
						header: new sap.m.Label({
							text:"Grupo",
						})
					})
	        ]
		});	
		
		
		
		var oTemplate = new sap.m.ColumnListItem({
			type: sap.m.ListType.Active ,
			cells: [
			        new sap.m.ObjectIdentifier({
			        	textAlign: sap.ui.core.TextAlign.Center,
			        	text: "{data>valueext}",
			        }),
			        new sap.m.ObjectIdentifier({
			        	text: "{data>value}",
			        }),
			        new sap.m.ObjectIdentifier({
			        	text: "{data>grouptitle}",
			        }),
	        ]
		});
		
		
		
		oTable.bindAggregation("items","data>/",oTemplate);	



		// Toolbar de la tabla
		var oHeader = new sap.m.Toolbar({
			content : [ 
	            new sap.m.Label({
	            	text : "Lista de valores del elemento"
	            }), 
	            new sap.m.ToolbarSpacer({}), 
	            new sap.m.Button({
	            	icon : "sap-icon://add",
	            	press: function(evt){
	            		oController.addValuesDialog(evt)
	            	}
	            }) 
            ]
		});
		
		oTable.setHeaderToolbar(oHeader);			
		oTable.setMode(sap.m.ListMode.Delete); // delete mode  	

		
		
		oTable.attachDelete(function(evt){
			oController.deleteValueDialog(evt)
		});		
		
		oTable.attachItemPress(function(evt){
			oController.addValuesDialog(evt)
		})
		
		// Adiciono tabla al form
		oInfoForm.addContent(oTable);
		
 		return new sap.m.Page({
 			title: "Creación de elemento",			
			footer: new sap.m.Bar({
				contentRight: [								
								new sap.m.Button({
									id: "btnSaveNewField",
									enabled: false,
									text: "Guardar",
									icon: "sap-icon://save",
									press: function(evt){
									  oController.saveData(evt);
									}
								}),
				              
	            ]
			}),
			content: [oIconTab]
		});
	}

});