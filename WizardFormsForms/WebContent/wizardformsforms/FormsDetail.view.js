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
			         new sap.m.Input({value:"{forms>formid} Versión N°. {forms>verformid} ",enabled:false}).addStyleClass("textRedBold"),
			         new sap.m.Label({text:"Nombre de formulario"}),
			         new sap.m.Input({value:"{forms>formtitle}",enabled:true}),
			         new sap.m.Label({text:"Descripción de versión"}),
			         new sap.m.TextArea({value:"{forms>descpver}",enabled:true,cols:200,rows:3}),
			         new sap.m.Label({text:"Versión modificada por"}),
			         new sap.m.Input({value:"{forms>createuser}",enabled:false,}),
			         new sap.m.Label({text:"Versión modificada el"}),
			         new sap.m.Input({
			        	 value:{
			        		 path:"forms>createdate",
			        		 type: 'sap.ui.model.type.Date',
			        		 formatOptions: {
			        	          style: 'long',
			        	          source: {
			        	            pattern: 'yyyyMMdd'
			        	          }
		        	         }
			        	 },
			        	 enabled:false
			        })
			        
			]
		}).addStyleClass("layPadding10");
		
		var oSectionsForm = new sap.ui.layout.VerticalLayout({
			width: "100%"
		}).addStyleClass("layPadding10");
		
		
		var oEnhaForm = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content:[
				new sap.m.Label({}),
				new sap.m.Label({
					 design: "Bold",
					 text:"Clase de control para ampliaciones"
				}),
				new sap.m.Input({value:"{forms>classtitle}",enabled:false}).addStyleClass("textRedBold")
			]
		}).addStyleClass("layPadding10");
		
		var oPreviewForm = new sap.ui.layout.VerticalLayout({
			width: "100%",
			height: "100%",
			content:[ ]
		});
		
	
		
		var oCustomForm = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content:[
		         new sap.m.Panel({
		        	 expandable:true,
		        	 expanded:false,
		        	 headerText:"Colores del formulario",
		        	 content: [ 
        	           	new sap.ui.layout.VerticalLayout({
        	           		width: "100%",
        	           		content: [
								new sap.m.Label({ text:"Color base", design: "Bold"	}),
								new sap.ui.layout.HorizontalLayout({
									content: [
										new sap.m.Input({
											id: "inpColorBaseText",
											liveChange: function(evt){
												var view = sap.ui.getCore();
												jQuery.sap.byId('inpColorBase-inner').css('background-color',view.byId('inpColorBaseText').getValue());												
											}
										}).addStyleClass("textRedBold"),
										new sap.m.Input({
											id: "inpColorBase",
											width: "40px",
										}),
										new sap.m.Button({
											press: function(evt){
												var dialog = new sap.m.Dialog({
												      title: 'Selección de color',
												      type: 'Message',
												      content: [
															new sap.ui.commons.ColorPicker({
																id: "oColorPickerBase",
																liveChange: function(evt){
																	var colors = evt.getParameters();
																	var view = sap.ui.getCore();
																	jQuery.sap.byId('inpColorBase-inner').css('background-color',colors.hex);
																	view.byId('inpColorBaseText').setValue(colors.hex);
																}
															})
												      ],
												      beginButton: new sap.m.Button({
												        text: 'Aceptar',
												        press: function () { 											    		  
												          dialog.close();
												        }
												      }),
												      endButton: new sap.m.Button({
												        text: 'Cancelar',
												        type: "Reject",
												        press: function () {
												          dialog.close();
												        }
												      }),
												      afterClose: function() {
												        dialog.destroy();
											      }
											    });
											    dialog.open();
												//jQuery.sap.byId('inpColorBase-inner').css('background-color',jQuery.sap.byId('inpColorBase').getValue());
											}
										}),
									]
								})
	        	           	]
        	           	})						
    	             ]
		         }),
		         new sap.m.Panel({
		        	 expandable:true,
		        	 expanded:false,
		        	 headerText:"Propiedades de textos",
		        	 content: [ ]
		         }),
		         new sap.m.Panel({
		        	 expandable:true,
		        	 expanded:false,
		        	 headerText:"Diseño de marca",
		        	 content: [ ]
		         }),
		         
		         
			]
		}).addStyleClass("layPadding10");
		
		//Icon Tab
		var oIconTab = new sap.m.IconTabBar({
			id: "TabForm",
			title: "IconTab",
			showHeader: false
		})
		
		oIconTab.attachSelect(function(evt){
			oController.selectedTab(evt)
		});
		
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
		
		var oItemBarEnhaForm = new sap.m.IconTabFilter({
	        text: "Ampliaciones",
	        icon:"sap-icon://instance",
	        width: "100%",
	        content:[ oEnhaForm ]
		});	
		
		var oItemBarPreviewForm = new sap.m.IconTabFilter({
			id: "oItemBarPreviewForm",
	        text: "Previsualizar",
	        icon:"sap-icon://show",
	        width: "100%",
	        key: "preview",	        
	        content:[ oPreviewForm ]
		});	
		
		
		var oItemBarCustomForm = new sap.m.IconTabFilter({
	        text: "Diseño",
	        icon:"sap-icon://palette",
	        width: "100%",
	        key: "customizing",	        
	        content:[ oCustomForm ]
		});	
		
		oItemBarPreviewForm.removeAllContent()
		
		oIconTab.addItem(oItemBarInfoForm);	
		oIconTab.addItem(oItemBarSectionsForm);	
		oIconTab.addItem(oItemBarEnhaForm);	
		oIconTab.addItem(oItemBarCustomForm);	
		oIconTab.addItem(oItemBarPreviewForm);	
		
		
		
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
		
		oTable.setMode(sap.m.ListMode.Delete); // delete mode  	

		oTable.bindAggregation("items","forms>sections",oTemplate);
				
		oTable.attachItemPress(function(evt){
			oController.sectionPress(evt)
		})
		
		oTable.attachDelete(function(evt){
			oController.deleteSection(evt)
		});	
		
		oSectionsForm.addContent(new sap.m.Label({}));
		oSectionsForm.addContent(oTable);
		
		
		var oTableEhn = new sap.m.Table({
			id: "oTableEhn",
			inset: false,
			infoToolbar: new sap.m.Toolbar({
				active: false,
				content:[
				         new sap.m.Label({
				        	 text: "Encienda los puntos de ampliación que desea usar para este formulario, esto afectará a todas las versiones"
				         })
				]
			}),
			columns: [
			          //Value
			          new sap.m.Column({
			        	  halign: "left",
			        	  width: "100px",
			        	  demandPopin: true,
			        	  popinDisplay: "Block",
			        	  minScreenWidth: sap.m.ScreenSize.Medium
			          }),
			          new sap.m.Column({
			        	  halign: "left",
			        	  width: "20px",
			        	  demandPopin: true,
			        	  popinDisplay: "Block",
			        	  minScreenWidth: sap.m.ScreenSize.Medium
			          }),
			          
	        ]
		});
		
		var oTemplateEhn = new sap.m.ColumnListItem({
			vAlign: "Middle",
			cells: [
			        new sap.m.ObjectIdentifier({
			        	title: "{forms>name}"
			        }),
			        new sap.m.Switch({
			        	state:"{forms>active}",
			        	customTextOn:" ", 
			        	customTextOff:" "
			        })
			        
			]
		});

		oTableEhn.bindAggregation("items","forms>enhancement",oTemplateEhn);
				
		oTableEhn.attachItemPress(function(evt){
			oController.sectionPress(evt)
		})
		
		oSectionsForm.addContent(new sap.m.Label({}));
		oSectionsForm.addContent(oTable);
		
		
		oItemBarEnhaForm.addContent(oTableEhn);
		
 		return new sap.m.Page({
			title: "Detalle de formulario",
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