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
		         	 new sap.m.Label({text:"Nombre del formulario"}),
			         new sap.m.Input({value:"{forms>formtecname}",enabled:false}).addStyleClass("textRedBold"),
			         new sap.m.Label({text:"Versión"}),
			         new sap.m.Input({value:"N°. {forms>verformid} ",enabled:false}).addStyleClass("textRedBold"),			         
			         new sap.m.Label({text:"Titulo del formulario"}),
			         new sap.m.Input({value:"{forms>formtitle}",enabled:true}),
			         new sap.m.Label({text:"Descripción de versión"}),
			         new sap.m.TextArea({value:"{forms>descpver}",enabled:true,cols:200,rows:3}),
			         //new sap.m.Label({text:"Instrucciones/Introducción"}),
				     //new sap.m.TextArea ({value:"{forms>formintroduction}",width: "100%",rows: 4, enabled:true,placeholder: "Ingrese una introducción o un texto de instrucciones para el formulario"}),
					 //new sap.m.Label({text:"Pie de pagina"}),
					 //new sap.m.TextArea({value:"{forms>formfooter}",width: "100%",rows: 4, enabled:true, placeholder: "Ingrese un pie de pagina para el formulario"}),
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
			width: "100%",
			content: [ ]
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
		
		
		var oColorBase = new sap.ui.layout.VerticalLayout({
       		width: "100%",
       		content: [
				new sap.m.Label({ text:"Color base", design: "Bold"	}),
				new sap.ui.layout.HorizontalLayout({
					content: [
						new sap.m.Input({
							id: "inpColorBaseText",
							value:"{forms>colorbase}",
							liveChange: function(evt){
								var view = sap.ui.getCore();
								jQuery.sap.byId('inpColorBase-inner').css('background-color',view.byId('inpColorBaseText').getValue());												
							}
						}).addStyleClass("textRedBold").addStyleClass("#inpColorBase-inner{background-color:#232055 !important }"),
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
							}
						}),
					]
				})
           	]
       	});
		
		var oColorFondo = new sap.ui.layout.VerticalLayout({
       		width: "100%",
       		content: [
				new sap.m.Label({ text:"Color de fondo", design: "Bold"	}),
				new sap.ui.layout.HorizontalLayout({
					content: [
						new sap.m.Input({
							id: "inpColorFondoText",
							value:"{forms>colorfondo}",
							liveChange: function(evt){
								var view = sap.ui.getCore();
								jQuery.sap.byId('inpColorFondo-inner').css('background-color',view.byId('inpColorFondoText').getValue());												
							}
						}).addStyleClass("textRedBold"),
						new sap.m.Input({
							id: "inpColorFondo",
							width: "40px",
						}),
						new sap.m.Button({
							press: function(evt){
								var dialog = new sap.m.Dialog({
								      title: 'Selección de color',
								      type: 'Message',
								      content: [
											new sap.ui.commons.ColorPicker({
												liveChange: function(evt){
													var colors = evt.getParameters();
													var view = sap.ui.getCore();
													jQuery.sap.byId('inpColorFondo-inner').css('background-color',colors.hex);
													view.byId('inpColorFondoText').setValue(colors.hex);
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
							}
						}),
					]
				})
           	]
       	});
		
		var oColorHead = new sap.ui.layout.VerticalLayout({
       		width: "100%",
       		content: [
				new sap.m.Label({ text:"Color de cabecera formulario", design: "Bold"	}),
				new sap.ui.layout.HorizontalLayout({
					content: [
						new sap.m.Input({
							id: "inpColorHeadText",
							value:"{forms>colorhead}",
							liveChange: function(evt){
								var view = sap.ui.getCore();
								jQuery.sap.byId('inpColorHead-inner').css('background-color',view.byId('inpColorHeadText').getValue());												
							}
						}).addStyleClass("textRedBold"),
						new sap.m.Input({
							id: "inpColorHead",
							width: "40px",
						}),
						new sap.m.Button({
							press: function(evt){
								var dialog = new sap.m.Dialog({
								      title: 'Selección de color',
								      type: 'Message',
								      content: [
											new sap.ui.commons.ColorPicker({
												liveChange: function(evt){
													var colors = evt.getParameters();
													var view = sap.ui.getCore();
													jQuery.sap.byId('inpColorHead-inner').css('background-color',colors.hex);
													view.byId('inpColorHeadText').setValue(colors.hex);
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
							}
						}),
					]
				})
           	]
       	});
		
		var oColorSections = new sap.ui.layout.VerticalLayout({
       		width: "100%",
       		content: [
				new sap.m.Label({ text:"Color de cabecera secciones", design: "Bold"	}),
				new sap.ui.layout.HorizontalLayout({
					content: [
						new sap.m.Input({
							id: "inpColorSectionText",
							value:"{forms>colorsections}",
							liveChange: function(evt){
								var view = sap.ui.getCore();
								jQuery.sap.byId('inpColorSection-inner').css('background-color',view.byId('inpColorSectionText').getValue());												
							}
						}).addStyleClass("textRedBold"),
						new sap.m.Input({
							id: "inpColorSection",
							width: "40px",
						}),
						new sap.m.Button({
							press: function(evt){
								var dialog = new sap.m.Dialog({
								      title: 'Selección de color',
								      type: 'Message',
								      content: [
											new sap.ui.commons.ColorPicker({
												liveChange: function(evt){
													var colors = evt.getParameters();
													var view = sap.ui.getCore();
													jQuery.sap.byId('inpColorSection-inner').css('background-color',colors.hex);
													view.byId('inpColorSectionText').setValue(colors.hex);
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
							}
						}),
					]
				})
           	]
       	});
		
		
		var oTextOptions = new sap.ui.layout.VerticalLayout({
       		width: "100%",
       		content: [
				new sap.m.Label({ text:"Mostrar título cabecera", design: "Bold"	}),
				new sap.m.Switch({
						state:"{forms>showtitle}",
						customTextOn:"Si", 
						customTextOff:"No",
						change: function(evt){
					}
				}),
				new sap.m.Label({ text:"Tamaño de título cabecera", design: "Bold"	}),
				new sap.m.ComboBox({
		        	  selectedKey:"{forms>sizetitlehead}",
					  items: [
		                          new sap.ui.core.ListItem({text: "H1 - Texto Bold 36px",key:"H1"}).bindProperty("text","StatusText").bindProperty("key","Status"),
		                          new sap.ui.core.ListItem({text: "H2 - Texto Bold 30px",key:"H2"}),
		                          new sap.ui.core.ListItem({text: "H3 - Texto Bold 24px",key:"H3"}),
		                          new sap.ui.core.ListItem({text: "H4 - Texto Bold 18px",key:"H4"}),
		                          new sap.ui.core.ListItem({text: "H5 - Texto Bold 14px",key:"H5"}),
		                          new sap.ui.core.ListItem({text: "H6 - Texto Bold 12px",key:"H6"}),
		                     ]
		        }).bindProperty("value","StatusText"),
		        new sap.m.Label({ text:"Mostrar títulos en secciones", design: "Bold"	}),
				new sap.m.Switch({
						state:"{forms>showtitlesection}",
						customTextOn:"Si", 
						customTextOff:"No",
						change: function(evt){
					}
				}),
		        new sap.m.Label({ text:"Tamaño de título secciones", design: "Bold"	}),
				new sap.m.ComboBox({
					  selectedKey:"{forms>sizetitlesections}",
					  items: [
		                          new sap.ui.core.ListItem({text: "H1 - Texto Bold 36px",key:"H1"}).bindProperty("text","StatusText").bindProperty("key","Status"),
		                          new sap.ui.core.ListItem({text: "H2 - Texto Bold 30px",key:"H2"}),
		                          new sap.ui.core.ListItem({text: "H3 - Texto Bold 24px",key:"H3"}),
		                          new sap.ui.core.ListItem({text: "H4 - Texto Bold 18px",key:"H4"}),
		                          new sap.ui.core.ListItem({text: "H5 - Texto Bold 14px",key:"H5"}),
		                          new sap.ui.core.ListItem({text: "H6 - Texto Bold 12px",key:"H6"}),
		                     ]
		        }).bindProperty("value","StatusText"),				
           	]
       	});
		
		var oImageOptions = new sap.ui.layout.VerticalLayout({
       		width: "100%",
       		content: [
				new sap.m.Label({ text:"Logo compañia", design: "Bold"	}),
				new sap.ui.layout.HorizontalLayout({
					content: [
						new sap.m.Input({
							id: "inpImageLogo",
							value:"{forms>logo}",
							width: "400px",
							liveChange: function(evt){
								var view = sap.ui.getCore();
																		
							}
						}).addStyleClass("textRedBold"),
						new sap.m.Button({
							icon: "sap-icon://picture",
							press: function(evt){
								oController.getLogo(evt)
							}
						}),
					]
				}),	
				new sap.m.Image({
					id:"imgLogo",
					width: "50%",
					src: "{forms>logoimg}",
				}),				
			]
       	});
		
		
		
	
		
		var oCustomForm = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content:[
		         new sap.m.Panel({
		        	 expandable:true,
		        	 expanded:false,
		        	 headerText:"Colores del formulario",
		        	 content: [ oColorBase, oColorFondo, oColorHead, oColorSections ]
		         }),
		         new sap.m.Panel({
		        	 expandable:true,
		        	 expanded:false,
		        	 headerText:"Propiedades de textos",
		        	 content: [ oTextOptions ]
		         }),
		         new sap.m.Panel({
		        	 expandable:true,
		        	 expanded:false,
		        	 headerText:"Diseño de marca",
		        	 content: [ oImageOptions ]
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
		            new sap.m.Column({
						width: "10%",
						header: new sap.m.Label({
							text:"Viñeta",
						})
					}),
					new sap.m.Column({
						width: "50%",
						header: new sap.m.Label({
							text:"Titulo subsección",
						})
					}),
					new sap.m.Column({
						width: "20%",
						header: new sap.m.Label({
							text:"Nro.Columnas",
						})
					}),


	        ]
		});
		
		
		
		var oTemplate = new sap.m.ColumnListItem({
			type: sap.m.ListType.Active ,
			cells: [
					new sap.m.Input({
			        	value: "{forms>sectionvi}"
			        }),
			        new sap.m.Input({
			        	value: "{forms>sectiontitle}"
			        }),
			        new sap.m.ComboBox({
						  selectedKey:"{forms>sectioncolumn}",
						  width: "100%",
						  items: [
			                          new sap.ui.core.ListItem({text: "1 Columna", key:"1"}),
			                          new sap.ui.core.ListItem({text: "2 Columnas",key:"2"}),
			                          new sap.ui.core.ListItem({text: "3 Columnas",key:"3"}),
			                          new sap.ui.core.ListItem({text: "4 Columnas",key:"4"})
			                     ]
			        }).bindProperty("value","StatusText")
			        
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
	            	icon : "sap-icon://upload",
	            	tooltip: "Copiar sección de un formulario",
	            	press: function(evt){
	            		oController.addSectionCopy(evt)
	            	}
	            }),
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
		
		that = this;
		
 		return new sap.m.Page({
			title: "Detalle de formulario",
			footer: new sap.m.Bar({
				contentRight: [
								new sap.m.Button({
									text: "Eliminar",
								    icon: "sap-icon://delete",
								    type: "Reject",
								    press: function(evt){
									  oController.deleteData(that)
								  }
								}),
								new sap.m.Button({
									text: "Guardar",
									icon: "sap-icon://save",
									press: function(evt){
										oController.saveData(that)
									}
								}),
				              
	            ]
			}),
			content: [oIconTab]
		});
	}

});