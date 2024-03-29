sap.ui.jsview("wizardformsfields.FieldsInfo", {

	getControllerName : function() {
		return "wizardformsfields.FieldsInfo";
	},

	createContent : function(oController) {
		
		// Nombre de elemento
		var oLblblnk  = new sap.m.Label({ text : " " });  
		
		var oLblTecName = new sap.m.Label({ text : "Nombre técnico del elemento" });  
		var oTxtTecName = new sap.m.Input({id:"fieldtecname" , value:"{fields>fieldtecname}", enabled: false}).addStyleClass("textRedBold");  
		
		var oLblTitle = new sap.m.Label({ text : "Nombre del elemento" });  
		var oTxtTitle = new sap.m.Input({ id   : "fieldtitle", value:"{fields>fieldtitle}" });  
		
		// Placeholder
		var oLblPlace = new sap.m.Label({ text : "Marcador" });  
		var oTxtPlace = new sap.m.Input({ id   : "fieldplaceholder",value:"{fields>fieldplaceholder}" }); 
		
		// Tipo
		var oLblType  = new sap.m.Label({ text : "Tipo de elemento" }); 		
		var oCmbType = new sap.m.ComboBox({
			  id: "fieldtype",
			  selectedKey:"{fields>fieldtype}",
			  width: "100%",
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
		});		
		
		oInfoForm.addStyleClass("layPadding10");
		
		
		//===== Grupos de valores
		var oTableGroup = new sap.m.Table({
			id: "oTableGroup",
			inset: false,
			columns: [
			          new sap.m.Column({
						width: "30%",
						header: new sap.m.Label({
							text:"Código",
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
		
		var oTemplateGroup = new sap.m.ColumnListItem({
			type: sap.m.ListType.Active ,
			cells: [
					new sap.m.ObjectIdentifier({
						title: "{fields>groupid}"
					}),	
			        new sap.m.ObjectIdentifier({
			        	title: "{fields>grouptitle}"
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
	            	icon : "sap-icon://delete",
	            	tooltip: 'Eliminar todos los grupos',
	            	press: function(evt){
	            		oController.deleteAllGroupDialog(evt)
	            	}
	            }), 
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

		oTableGroup.bindAggregation("items","fields>groups",oTemplateGroup);
				
	
		oTableGroup.attachDelete(function(evt){
			oController.deleteGroupDialog(evt)
		});			
		
		
		
		oInfoForm.addContent(oTableGroup);
		
		
		// Tabla de valores		
		var oTable = new sap.m.Table({
			id: "oValueTable",
			inset: false,
			columns: [
					new sap.m.Column({
						width: "30%",
						header: new sap.m.Label({
							text:"Valor",
							demandPopin: true,
				        	popinDisplay: "Block",
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
			        	text: "{fields>valueext}",
			        }),
			        new sap.m.ObjectIdentifier({
			        	text: "{fields>value}",
			        }),
			        new sap.m.Text({
			        	text: "{fields>grouptitle}",
			        }),
	        ]
		});
		

		// Toolbar de la tabla
		var oHeader = new sap.m.Toolbar({
			content : [ 
	            new sap.m.Label({
	            	text : "Lista de valores del elemento"
	            }), 
	            new sap.m.ToolbarSpacer({}), 
	            new sap.m.Button({
	            	icon : "sap-icon://upload",
	            	tooltip: 'Agregar desde tablas SAP',
	            	press: function(evt){
	            		oController.addValuesSAPDialog(evt)
	            	}
	            }),
	            new sap.m.Button({
	            	icon : "sap-icon://delete",
	            	tooltip: 'Eliminar todos los valores',
	            	press: function(evt){
	            		oController.deleteAllValueDialog(evt)
	            	}
	            }),
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

		oTable.bindAggregation("items","fields>values",oTemplate);
		
		oTable.attachDelete(function(evt){
			oController.deleteValueDialog(evt)
		});		
		
		oTable.attachItemPress(function(evt){
			oController.addValuesDialog(evt)
		})
		
		// Adiciono tabla al form
		oInfoForm.addContent(oTable);	
		
		
		// Tabla de valores	desde tablas SAP	
		/*var oTableSAP = new sap.m.Table({
			id: "oValueTableSAP",
			inset: false,
			columns: [
					new sap.m.Column({
						width: "30%",
						header: new sap.m.Label({
							text:"Tabla",
						})
					}),
					  //Value
					new sap.m.Column({
						header: new sap.m.Label({
							text:"Campo Clave",
						})
					}),
					new sap.m.Column({
						header: new sap.m.Label({
							text:"Campo Descripción",
						})
					})
	        ]
		});
		
		var oTemplateSAP = new sap.m.ColumnListItem({
			cells: [
			        new sap.m.Text({
			        	textAlign: sap.ui.core.TextAlign.Center,
			        	text: "{fields>valueext}",
			        }),
			        new sap.m.Text({
			        	text: "{fields>value}",
			        }),
			        new sap.m.Text({
			        	text: "{fields>grouptitle}",
			        }),
	        ]
		});
		

		// Toolbar de la tabla
		var oHeaderSAP = new sap.m.Toolbar({
			content : [ 
	            new sap.m.Label({
	            	text : "Valores desde tablas SAP"
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
		
		oTableSAP.setHeaderToolbar(oHeaderSAP);			
		oTableSAP.setMode(sap.m.ListMode.Delete); // delete mode  	

		oTableSAP.bindAggregation("items","fields>values",oTemplateSAP);
		
		oTableSAP.attachDelete(function(evt){
			oController.deleteValueDialog(evt)
		});		
		
		
		// Adiciono tabla al form
		oInfoForm.addContent(oTableSAP);*/
		
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
			title: "Detalle de elemento",
			
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