sap.ui.controller("wizardformsforms.FieldDetail", {

	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched,this);
	},

	_handleRouteMatched: function(evt){
		if(evt.getParameter("name") !== "FieldDetail" && evt.getParameter("name") !== "SubFieldDetail"){
			return;
		}


		if(evt.getParameter("name") == "FieldDetail"){
			this.formIndex = evt.getParameter("arguments").formIndex;
			this.versionIndex = evt.getParameter("arguments").versionIndex;
			this.sectionIndex = evt.getParameter("arguments").sectionIndex;
			this.fieldIndex = evt.getParameter("arguments").fieldIndex

			var context = sap.ui.getCore().byId("app").getModel('forms').getContext('/' + this.formIndex + '/versions/' + this.versionIndex + '/sections/' + this.sectionIndex + '/fields/' + this.fieldIndex);
			this.getView().setBindingContext(context,'forms');
		}


		if(evt.getParameter("name") == "SubFieldDetail"){
			this.formIndex = evt.getParameter("arguments").formIndex;
			this.versionIndex = evt.getParameter("arguments").versionIndex;
			this.sectionIndex = evt.getParameter("arguments").sectionIndex;
			this.fieldIndex = evt.getParameter("arguments").fieldIndex
			this.subSectionIndex = evt.getParameter("arguments").subSectionIndex;

			var context = sap.ui.getCore().byId("app").getModel('forms').getContext('/' + this.formIndex + '/versions/' + this.versionIndex + '/sections/' + this.sectionIndex + '/subsections/' + this.subSectionIndex + '/fields/' + this.fieldIndex);
			this.getView().setBindingContext(context,'forms');
		}

	},
	goBack: function(){
		window.history.go(-1);
	},

	deleteRule: function(evt){


		var that = this;

		var oTable    = sap.ui.getCore().byId('oTableRules');
		var oListItem = evt.getParameters().listItem;
		var oPath     = oListItem.getBindingContextPath();
		var oId       = parseInt(oPath.substring(oPath.lastIndexOf('/') +1));
		var app       = sap.ui.getCore().byId("app");

		if(!that.subSectionIndex){
			try {
				var context = app.getModel('forms').getData('/' + this.formIndex + '/versions/' + this.versionIndex + '/sections/' + this.sectionIndex + '/fields/' + this.fieldIndex + '/rules/' + oId);

			} catch(ex){
				window.history.go(-1);
			}
		}else{
			try {
				var context = app.getModel('forms').getData('/' + this.formIndex + '/versions/' + this.versionIndex + '/sections/' + this.sectionIndex + '/subsections/' + this.subSectionIndex + '/fields/' + this.fieldIndex + '/rules/' + oId);

			} catch(ex){
				window.history.go(-1);
			}
		}

		var dialog = new sap.m.Dialog({
	      title: 'Confirmación',
	      type: 'Message',
	      content: new sap.m.Text({ text: '¿Esta seguro de eliminar esta regla?' }),
	      beginButton: new sap.m.Button({
	        text: 'Eliminar',
	        press: function () {
	        	if(!that.subSectionIndex){
	        		context[that.formIndex].versions[that.versionIndex].sections[that.sectionIndex].fields[that.fieldIndex].rules.splice(oId,1);
	        	}else{
	        		context[that.formIndex].versions[that.versionIndex].sections[that.sectionIndex].subsections[that.subSectionIndex].fields[that.fieldIndex].rules.splice(oId,1);
	        	}
	    		sap.ui.getCore().byId("app").getModel('forms').setData(context);
    			sap.m.MessageToast.show('Regla eliminada');

	          dialog.close();
	        }
	      }),
	      endButton: new sap.m.Button({
	        text: 'Cancelar',
	        press: function () {
	          dialog.close();
	        }
	      }),
	      afterClose: function() {
	        dialog.destroy();
	      }
	    });

	    dialog.open();

	},

	deleteCondition: function(evt){


		var that = this;

		var oTable    = sap.ui.getCore().byId('oTableCondition');
		var oListItem = evt.getParameters().listItem;
		var oPath     = oListItem.getBindingContextPath();
		var oId       = parseInt(oPath.substring(oPath.lastIndexOf('/') +1));
		var app       = sap.ui.getCore().byId("app");

		if(!that.subSectionIndex){
			try {
				var context = app.getModel('forms').getData('/' + this.formIndex + '/versions/' + this.versionIndex + '/sections/' + this.sectionIndex + '/fields/' + this.fieldIndex + '/rules/' + this.ruleIndex + '/conditions/' + oId);

			} catch(ex){
				window.history.go(-1);
			}
		}else{
			try {
				var context = app.getModel('forms').getData('/' + this.formIndex + '/versions/' + this.versionIndex + '/sections/' + this.sectionIndex + '/subsections/' + this.subSectionIndex + '/fields/' + this.fieldIndex + '/rules/' + this.ruleIndex + '/conditions/' + oId);

			} catch(ex){
				window.history.go(-1);
			}
		}



		var dialog = new sap.m.Dialog({
	      title: 'Confirmación',
	      type: 'Message',
	      content: new sap.m.Text({ text: '¿Esta seguro de eliminar esta condición?' }),
	      beginButton: new sap.m.Button({
	        text: 'Eliminar',
	        press: function () {

	        	if(!that.subSectionIndex){
	        		context[that.formIndex].versions[that.versionIndex].sections[that.sectionIndex].fields[that.fieldIndex].rules[that.ruleIndex].conditions.splice(oId,1);
	        	}else{
	        		context[that.formIndex].versions[that.versionIndex].sections[that.sectionIndex].subsections[that.subSectionIndex].fields[that.fieldIndex].rules[that.ruleIndex].conditions.splice(oId,1);
	        	}

	          	sap.ui.getCore().byId("app").getModel('forms').setData(context);
	    		sap.m.MessageToast.show('Condición eliminada');

	          dialog.close();
	        }
	      }),
	      endButton: new sap.m.Button({
	        text: 'Cancelar',
	        press: function () {
	          dialog.close();
	        }
	      }),
	      afterClose: function() {
	        dialog.destroy();
	      }
	    });

	    dialog.open();

	},


	editRule: function(evt){

		var that = this;

		var oTable    = sap.ui.getCore().byId('oTableRules');
		var oListItem = evt.getParameters().listItem;
		var oPath     = oListItem.getBindingContextPath();
		var oId       = parseInt(oPath.substring(oPath.lastIndexOf('/') +1));
		var app       = sap.ui.getCore().byId("app");
		this.ruleIndex = oId;

		if(!that.subSectionIndex){
			try {
				var context = sap.ui.getCore().byId("app").getModel('forms').getContext('/' + this.formIndex + '/versions/' + this.versionIndex + '/sections/' + this.sectionIndex + '/fields/' + this.fieldIndex + '/rules/' + oId + '/');
				this.getView().setBindingContext(context,'forms');
			} catch(ex){
				window.history.go(-1);
			}
		}else{

			try {
				var context = sap.ui.getCore().byId("app").getModel('forms').getContext('/' + this.formIndex + '/versions/' + this.versionIndex + '/sections/' + this.sectionIndex + '/subsections/' + this.subSectionIndex + '/fields/' + this.fieldIndex + '/rules/' + oId + '/');
				this.getView().setBindingContext(context,'forms');
			} catch(ex){
				window.history.go(-1);
			}
		}



		// Formularios
		var oInfoField = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content:[
				new sap.m.Label({text:"Regla"}),
				new sap.m.Input({value:"{forms>fldruldesc}"}),
				new sap.m.Label({text:"Acción a tomar"}),
				new sap.m.ComboBox({
						  id: "oCmbActionEdit",
						  width: "100%",
						  items: [
			                          new sap.ui.core.ListItem({text: "Asignar valor", key:"VALUE"}).bindProperty("text","StatusText").bindProperty("key","Status"),
			                          new sap.ui.core.ListItem({text: "Hacer obligatorio",key:"REQUIRED"}),
			                          new sap.ui.core.ListItem({text: "Hacer de solo lectura",key:"READ"}),
			                          new sap.ui.core.ListItem({text: "Hacer de escritura/lectura",key:"INPUT"}),
	                     ],
	                     selectionChange: function(evt){

	                     	switch ( this.getSelectedKey() ) {

	                     		case 'VALUE':
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacionEdit").setVisible(true);
	                     			sap.ui.getCore().byId("oLbFldRulAsignacionEdit").setVisible(true);
	                     			break;
	                     		case 'HIDE':
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacionEdit").setVisible(false);
	                     			sap.ui.getCore().byId("oLbFldRulAsignacionEdit").setVisible(false);
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacionEdit").setValue("HIDE");
	                     			break;
	                     		case 'SHOW':
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacionEdit").setVisible(false);
	                     			sap.ui.getCore().byId("oLbFldRulAsignacionEdit").setVisible(false);
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacionEdit").setValue("SHOW");
	                     			break;
	                     		case 'READ':
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacionEdit").setVisible(false);
	                     			sap.ui.getCore().byId("oLbFldRulAsignacionEdit").setVisible(false);
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacionEdit").setValue("READ");
	                     			break;
                     			case 'INPUT':
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacionEdit").setVisible(false);
	                     			sap.ui.getCore().byId("oLbFldRulAsignacionEdit").setVisible(false);
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacionEdit").setValue("INPUT");
	                     			break;
	                     		case 'REQUIRED':
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacionEdit").setVisible(false);
	                     			sap.ui.getCore().byId("oLbFldRulAsignacionEdit").setVisible(false);
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacionEdit").setValue("REQUIRED");
	                     			break;
	                     	}

	                     }

		        }).bindProperty("value","StatusText"),
				new sap.m.Label({id: "oLbFldRulAsignacionEdit", text:"Valor a asignar ( Para hacerlo obligatorio escribe REQUIRED )"}),
				new sap.m.Input({id: "oTxtFldRulAsignacionEdit", value:"{forms>fldasignacion}", placeholder:"Ingrese el valor que se asignara al campo en caso de que se cumpla las condiciones"})
			]
		}).addStyleClass("layPadding10");


		if(!that.subSectionIndex){
			var dato = sap.ui.getCore().byId("app").getModel('forms').getData('/' + this.formIndex + '/versions/' + this.versionIndex + '/sections/' + this.sectionIndex + '/fields/' + this.fieldIndex + '/rules/' + oId + '/');
			var valor = dato[this.formIndex].versions[this.versionIndex].sections[this.sectionIndex].fields[this.fieldIndex].rules[oId].fldasignacion;
		}else{
			var dato = sap.ui.getCore().byId("app").getModel('forms').getData('/' + this.formIndex + '/versions/' + this.versionIndex + '/sections/' + this.sectionIndex + '/subsections/' + this.subSectionIndex + '/fields/' + this.fieldIndex + '/rules/' + oId + '/');
			var valor = dato[0].versions[this.versionIndex].sections[this.sectionIndex].subsections[this.subSectionIndex].fields[this.fieldIndex].rules[oId].fldasignacion;
		}


		switch ( valor ) {

     		case 'HIDE':
     			sap.ui.getCore().byId("oTxtFldRulAsignacionEdit").setVisible(false);
     			sap.ui.getCore().byId("oLbFldRulAsignacionEdit").setVisible(false);
     			sap.ui.getCore().byId("oCmbActionEdit").setSelectedKey("HIDE");
     			break;
     		case 'SHOW':
     			sap.ui.getCore().byId("oTxtFldRulAsignacionEdit").setVisible(false);
     			sap.ui.getCore().byId("oLbFldRulAsignacionEdit").setVisible(false);
     			sap.ui.getCore().byId("oCmbActionEdit").setSelectedKey("SHOW");
     			break;
     		case 'READ':
     			sap.ui.getCore().byId("oTxtFldRulAsignacionEdit").setVisible(false);
     			sap.ui.getCore().byId("oLbFldRulAsignacionEdit").setVisible(false);
     			sap.ui.getCore().byId("oCmbActionEdit").setSelectedKey("READ");
     			break;
 			case 'INPUT':
     			sap.ui.getCore().byId("oTxtFldRulAsignacionEdit").setVisible(false);
     			sap.ui.getCore().byId("oLbFldRulAsignacionEdit").setVisible(false);
     			sap.ui.getCore().byId("oCmbActionEdit").setSelectedKey("INPUT");
     			break;
     		case 'REQUIRED':
     			sap.ui.getCore().byId("oTxtFldRulAsignacionEdit").setVisible(false);
     			sap.ui.getCore().byId("oLbFldRulAsignacionEdit").setVisible(false);
     			sap.ui.getCore().byId("oCmbActionEdit").setSelectedKey("REQUIRED");
     			break;

     		default:
     			sap.ui.getCore().byId("oCmbActionEdit").setSelectedKey("VALUE");
     			sap.ui.getCore().byId("oTxtFldRulAsignacionEdit").setVisible(true);
     			sap.ui.getCore().byId("oLbFldRulAsignacionEdit").setVisible(true);
     	}


		var oTable = new sap.m.Table({
			inset: false,
			id: "oTableCondition",
			columns: [
	            new sap.m.Column({
	            	header: new sap.m.Label({
	            		text:"Campo"
	            	})
	            }),
	            new sap.m.Column({
	            	header: new sap.m.Label({
	            		text:"Opción"
	            	})
	            }),
	            new sap.m.Column({
	            	header: new sap.m.Label({
	            		text:"Valor"
	            	})
	            }),
	            new sap.m.Column({
	            	header: new sap.m.Label({
	            		text:"Conector"
	            	})
	            })
			]
		})

		var oTemplate = new sap.m.ColumnListItem({
			cells: [
			        new sap.m.ObjectIdentifier({
			        	title: "{forms>field}"
			        }),
			        new sap.m.ObjectIdentifier({
			        	title: "{forms>option}"
			        }),
			        new sap.m.ObjectIdentifier({
			        	title: "{forms>value}"
			        }),
			        new sap.m.ObjectIdentifier({
			        	title: "{forms>connector}"
			        })
			]
		});

		var oHeader = new sap.m.Toolbar({
			content : [
	            new sap.m.Label({
	            	text : "Condiciones"
	            }),
	            new sap.m.ToolbarSpacer({}),
	            new sap.m.Button({
	            	icon : "sap-icon://add",
	            	press: function(evt){
	            		that.addCondition(evt,'E')
	            	}
	            })
            ]
		});

		oTable.setHeaderToolbar(oHeader);
		oTable.setMode(sap.m.ListMode.Delete); // delete mode
		oTable.bindAggregation("items","forms>conditions",oTemplate);
		oInfoField.addContent(oTable);

		oTable.attachDelete(function(evt){
			that.deleteCondition(evt)
		});

		var dialog = new sap.m.Dialog({
		      title: 'Editar regla',
		      verticalScrolling: true,
			  contentWidth: "700px",
		      content:[oInfoField],
		        endButton: new sap.m.Button({
		          text: 'Cerrar',
				  type: "Reject",
		          press: function () {

		          	if(!that.subSectionIndex){
		          		var context = sap.ui.getCore().byId("app").getModel('forms').getContext('/' + that.formIndex + '/versions/' + that.versionIndex + '/sections/' + that.sectionIndex + '/fields/' + that.fieldIndex);
		        		that.getView().setBindingContext(context,'forms');
		          	}else{
						var context = sap.ui.getCore().byId("app").getModel('forms').getContext('/' + that.formIndex + '/versions/' + that.versionIndex + '/sections/' + that.sectionIndex + '/subsections/' + that.subSectionIndex + '/fields/' + that.fieldIndex);
		        		that.getView().setBindingContext(context,'forms');
		          	}

		            dialog.close();
		          }
		        }),
		        afterClose: function() {
		         	if(!that.subSectionIndex){
		          		var context = sap.ui.getCore().byId("app").getModel('forms').getContext('/' + that.formIndex + '/versions/' + that.versionIndex + '/sections/' + that.sectionIndex + '/fields/' + that.fieldIndex);
		        		that.getView().setBindingContext(context,'forms');
		          	}else{
						var context = sap.ui.getCore().byId("app").getModel('forms').getContext('/' + that.formIndex + '/versions/' + that.versionIndex + '/sections/' + that.sectionIndex + '/subsections/' + that.subSectionIndex + '/fields/' + that.fieldIndex);
		        		that.getView().setBindingContext(context,'forms');
	          		}
		          	dialog.destroy();
		        }
		    });
		    this.getView().addDependent(dialog);
		    dialog.open();
	},


	addRule: function(evt){

		var that = this;

		sap.ui.getCore().byId("app").getModel('rules').setData([]);

		// Formularios
		var oInfoField = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content:[
				new sap.m.Label({text:"Titulo de la regla"}),
				new sap.m.Input({id:"oTxtFldRulDesc",placeholder:"Ingrese un titulo descriptivo para la regla"}),
				new sap.m.Label({text:"Acción a tomar"}),
				new sap.m.ComboBox({
						  //selectedKey:"{forms>sectioncolumn}",
						  width: "100%",
						  items: [
			                          new sap.ui.core.ListItem({text: "Asignar valor", key:"VALUE"}).bindProperty("text","StatusText").bindProperty("key","Status"),
			                          new sap.ui.core.ListItem({text: "Hacer obligatorio",key:"REQUIRED"}),
			                          new sap.ui.core.ListItem({text: "Hacer de solo lectura",key:"READ"}),
			                          new sap.ui.core.ListItem({text: "Hacer de escritura/lectura",key:"INPUT"}),
	                     ],
	                     selectionChange: function(evt){

	                     	switch ( this.getSelectedKey() ) {

	                     		case 'VALUE':
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacion").setVisible(true);
	                     			sap.ui.getCore().byId("oLbFldRulAsignacion").setVisible(true);
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacion").setValue("");
	                     			break;
	                     		case 'HIDE':
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacion").setVisible(false);
	                     			sap.ui.getCore().byId("oLbFldRulAsignacion").setVisible(false);
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacion").setValue("HIDE");
	                     			break;
	                     		case 'SHOW':
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacion").setVisible(false);
	                     			sap.ui.getCore().byId("oLbFldRulAsignacion").setVisible(false);
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacion").setValue("SHOW");
	                     			break;
	                     		case 'READ':
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacion").setVisible(false);
	                     			sap.ui.getCore().byId("oLbFldRulAsignacion").setVisible(false);
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacion").setValue("READ");
	                     			break;
                     			case 'INPUT':
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacion").setVisible(false);
	                     			sap.ui.getCore().byId("oLbFldRulAsignacion").setVisible(false);
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacion").setValue("INPUT");
	                     			break;
	                     		case 'REQUIRED':
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacion").setVisible(false);
	                     			sap.ui.getCore().byId("oLbFldRulAsignacion").setVisible(false);
	                     			sap.ui.getCore().byId("oTxtFldRulAsignacion").setValue("REQUIRED");
	                     			break;
	                     	}

	                     }

		        }).bindProperty("value","StatusText"),
				new sap.m.Label({id: "oLbFldRulAsignacion", text:"Valor a asignar ( Para hacerlo obligatorio escribe REQUIRED )"}),
				new sap.m.Input({id:"oTxtFldRulAsignacion",placeholder:"Ingrese el valor que se asignara al campo en caso de que se cumpla las condiciones"})
			]
		}).addStyleClass("layPadding10");

		var oTable = new sap.m.Table({
			inset: false,
			columns: [
	            new sap.m.Column({
	            	header: new sap.m.Label({
	            		text:"Campo"
	            	})
	            }),
	            new sap.m.Column({
	            	header: new sap.m.Label({
	            		text:"Opción"
	            	})
	            }),
	            new sap.m.Column({
	            	header: new sap.m.Label({
	            		text:"Valor"
	            	})
	            }),
	            new sap.m.Column({
	            	header: new sap.m.Label({
	            		text:"Conector"
	            	})
	            })
			]
		})

		var oTemplate = new sap.m.ColumnListItem({
			cells: [
			        new sap.m.ObjectIdentifier({
			        	title: "{rules>field}"
			        }),
			        new sap.m.ObjectIdentifier({
			        	title: "{rules>option}"
			        }),
			        new sap.m.ObjectIdentifier({
			        	title: "{rules>value}"
			        }),
			        new sap.m.ObjectIdentifier({
			        	title: "{rules>connector}"
			        })
			]
		});

		var oHeader = new sap.m.Toolbar({
			content : [
	            new sap.m.Label({
	            	text : "Condiciones"
	            }),
	            new sap.m.ToolbarSpacer({}),
	            new sap.m.Button({
	            	icon : "sap-icon://add",
	            	press: function(evt){
	            		that.addCondition(evt,'N')
	            	}
	            })
            ]
		});

		oTable.setHeaderToolbar(oHeader);
		oTable.setMode(sap.m.ListMode.Delete); // delete mode
		oTable.bindAggregation("items","rules>/",oTemplate);
		oInfoField.addContent(oTable);

		var dialog = new sap.m.Dialog({
		      title: 'Crear regla',
		      verticalScrolling: true,
			  contentWidth: "700px",
		      content:[oInfoField],
		      beginButton: new sap.m.Button({
		          text: 'Agregar',
		          press: function (evt) {


		        	var oTxtFldRulDesc 		 = sap.ui.getCore().byId("oTxtFldRulDesc").getValue();
		        	var oTxtFldRulAsignacion = sap.ui.getCore().byId("oTxtFldRulAsignacion").getValue();
		        	var model =  sap.ui.getCore().byId("app").getModel('forms').getContext('/' + that.formIndex + '/sections/' + that.sectionIndex + '/fields/' + that.fieldIndex);
		        	var path  =  evt.getSource().getBindingContext('forms').getPath();
		        	var data  =  model.getProperty(path);


		        	data.rules.push({
		        		fldruldesc: oTxtFldRulDesc,
		        		fldasignacion: oTxtFldRulAsignacion,
		        		conditions: sap.ui.getCore().byId("app").getModel("rules").getData()
		    		})

		    		sap.ui.getCore().byId("app").getModel('forms').setData(sap.ui.getCore().byId("app").getModel("forms").getData());
		        	sap.m.MessageToast.show('Regla agregada');

		            dialog.close();
		          }
		        }),
		        endButton: new sap.m.Button({
		          text: 'Cerrar',
				  type: "Reject",
		          press: function () {
		            dialog.close();
		          }
		        }),
		        afterClose: function() {
		          dialog.destroy();
		        }
		    });
		    this.getView().addDependent(dialog);
		    dialog.open();
	},

	addCondition: function(evt,opt){

		var that = this;

		// Formularios
		var oInfoField = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content:[
				new sap.m.Label({text:"Campo"}),
				new sap.m.Input({
					 id: "ruleField",
			    	 enabled:true,
			    	 showValueHelp:true,
			    	 placeholder:"Seleccione el campo para la condición",
			    	 valueHelpRequest: function(evt){
			    		 that.getFields(evt)
			    	 },
			    	 liveChange: function(evt){
			    		 that.validateRequiredField(evt)
			    	 }
				}),
				new sap.m.Label({text:"Opción"}),
				new sap.m.ComboBox({
				      id:"ruleOption",
					  width: "100%",
					  items: [
		                          new sap.ui.core.ListItem({text: "EQ - Igual",key:"EQ"}).bindProperty("text","StatusText").bindProperty("key","Status"),
		                          new sap.ui.core.ListItem({text: "NE - Diferente",key:"NE"}),
		                          new sap.ui.core.ListItem({text: "LE - Menor o Igual",key:"LE"}),
		                          new sap.ui.core.ListItem({text: "LT - Menor que",key:"LT"}),
		                          new sap.ui.core.ListItem({text: "GE - Mayor o igual",key:"GE"}),
		                          new sap.ui.core.ListItem({text: "GT - Mayor que",key:"GT"}),
		                          new sap.ui.core.ListItem({text: "IN - Contenido en",key:"IN"}),
		                          new sap.ui.core.ListItem({text: "NOT IN - No contenido en",key:"NIN"}),
		              ],
		              selectionChange: function(evt){
				    	 that.validateRequiredField(evt)
				      }
		        }).bindProperty("value","StatusText"),
				new sap.m.Label({text:"Valor"}),
				new sap.m.Input({
					id:"ruleValue",
					placeholder:"Ingrese el valor de la condicion, para varios valores separe por coma",
					liveChange: function(evt){
				    	 that.validateRequiredField(evt)
				    }
				}),
				new sap.m.Label({text:"Conector"}),
				new sap.m.ComboBox({
					  id: "ruleConn",
					  width: "100%",
					  items: [
		                          new sap.ui.core.ListItem({text: "AND - Y",key:"AND"}).bindProperty("text","StatusText").bindProperty("key","Status"),
		                          new sap.ui.core.ListItem({text: "OR - O",key:"OR"}),
		              ],
		              selectionChange: function(evt){
					   	 that.validateRequiredField(evt)
					  }
		        }).bindProperty("value","StatusText"),
			]
		}).addStyleClass("layPadding10");



		var dialog = new sap.m.Dialog({
		      title: 'Agregar condición',
		      verticalScrolling: true,
			  contentWidth: "700px",
		      content:[oInfoField],
		      beginButton: new sap.m.Button({

		    	  id: "btnAddCond",
		          text: 'Agregar',
		          enabled:false,
		          press: function (evt) {

		        	var oField     = sap.ui.getCore().byId("ruleField").getValue();
		        	var oOption    = sap.ui.getCore().byId("ruleOption").getSelectedKey();
		        	var oValue 	   = sap.ui.getCore().byId("ruleValue").getValue();
		        	var oConnector = sap.ui.getCore().byId("ruleConn").getSelectedKey();

		        	if(opt == 'N'){

			        	var model = sap.ui.getCore().byId("app").getModel("rules");
			      		var data  = model.getData();

			      		data.push({
			      			field: oField,
			      			option: oOption,
			      			value: oValue,
			      		    connector: oConnector
			      		})

			      		sap.ui.getCore().byId("app").getModel('rules').setData(data);

		        	} else{

		        		try {
		        			if(!that.subSectionIndex){
		        				var context = sap.ui.getCore().byId("app").getModel('forms').getContext('/' + that.formIndex + '/versions/' + that.versionIndex + '/sections/' + that.sectionIndex + '/fields/' + that.fieldIndex + '/rules/' + that.ruleIndex + '/');
		        			}else{
		        				var context = sap.ui.getCore().byId("app").getModel('forms').getContext('/' + that.formIndex + '/versions/' + that.versionIndex + '/sections/' + that.sectionIndex + '/subsections/' + that.subSectionIndex + '/fields/' + that.fieldIndex + '/rules/' + that.ruleIndex + '/');
		        			}

		        		} catch(ex){
		        			window.history.go(-1);
		        		}

		        		var data = context.getModel('forms').getData();

		        		//data = data[0].versions[that.versionIndex].sections[that.sectionIndex].fields[that.fieldIndex].rules[that.ruleIndex];

		        		if(!that.subSectionIndex){
			        		data[that.formIndex].versions[that.versionIndex].sections[that.sectionIndex].fields[that.fieldIndex].rules[that.ruleIndex].conditions.push({
				      			field: oField,
				      			option: oOption,
				      			value: oValue,
				      		    connector: oConnector
				      		})
			      		}else{
			      			data[that.formIndex].versions[that.versionIndex].sections[that.sectionIndex].subsections[that.subSectionIndex].fields[that.fieldIndex].rules[that.ruleIndex].conditions.push({
				      			field: oField,
				      			option: oOption,
				      			value: oValue,
				      		    connector: oConnector
				      		})
			      		}

			      		that.getView().getModel('forms').setData(data);

		        	}

		          	sap.m.MessageToast.show('Condicion agregada');

		            dialog.close();
		          }
		        }),
		        endButton: new sap.m.Button({
		          text: 'Cerrar',
				  type: "Reject",
		          press: function () {
		            dialog.close();
		          }
		        }),
		        afterClose: function() {
		          dialog.destroy();
		        }
		    });
		    this.getView().addDependent(dialog);
		    dialog.open();
	},

	getFields: function(evt){

		var that = this;


		var contextfield = JSON.parse(JSON.stringify(sap.ui.getCore().byId("app").getModel('fields').getData('/')));
		var oModel = new sap.ui.model.json.JSONModel(contextfield);
		this.getView().setModel(oModel,'fields');

		var fields   	=  this.getView().getModel('fields').getData('/');
		var sections 	=  sap.ui.getCore().byId("app").getModel('forms').getData('/')[this.formIndex].versions[this.versionIndex].sections;
		var fieldsUsed 	=  [];

		// Saco los campos que se han usado en otras secciones
		for(i = 0; i < sections.length; i++){
			for(j = 0; j < sections[i].fields.length; j++){
				fieldsUsed.push(sections[i].fields[j]);
			}

			for(j = 0; j < sections[i].subsections.length; j++){

				for(x = 0; x < sections[i].subsections[j].fields.length; x++){
					fieldsUsed.push(sections[i].subsections[j].fields[x]);
				}
			}
		}


		// Recorro los campos para eliminar los que estan usados en las secciones
		for(i = 0; i < fields.length; i++){

			var finded = false;

			for(j = 0; j < fieldsUsed.length; j++){

				// Existe lo elimino del array
				if(fields[i].fieldid == fieldsUsed[j].fieldid){
					finded = true;
				}
			}

			if(!finded){
				fields.splice(i,1);
				i = 0;
			}

		}


		var itemTemplate = new sap.m.StandardListItem({
			title: "{fields>fieldtecname}",
			description: "{fields>fieldtitle}",
			active: true
		});

		var dialog = new sap.m.SelectDialog({
			title:"Elementos del formulario",
		    class:"sapUiPopupWithPadding",
		    liveChange: function(evt){

		    	var filters = [];
				var query = evt.getParameter("value");
				if (query && query.length > 0) {

					var filter = new sap.ui.model.Filter([
						new sap.ui.model.Filter("fieldtitle", sap.ui.model.FilterOperator.Contains, query ),
						new sap.ui.model.Filter("fieldtecname", sap.ui.model.FilterOperator.Contains, query )
					],false)

					//var filter = new sap.ui.model.Filter("fieldtecname", sap.ui.model.FilterOperator.Contains, query);
					filters.push(filter);
				}
				evt.getSource().getBinding("items").filter(filters);

		    },
		    confirm: function(evt){
		    	var oSelectedItem = evt.getParameter("selectedItem");
		        if (oSelectedItem) {
		          var ruleField =  sap.ui.getCore().byId("ruleField");
		          ruleField.setValue(oSelectedItem.getTitle());
		        }
		        evt.getSource().getBinding("items").filter([]);
		        that.validateRequiredField(evt)
		    },
		    cancel: function(evt){
		    	var oSelectedItem = evt.getParameter("selectedItem");
		        if (oSelectedItem) {
		          var ruleField =  sap.ui.getCore().byId("ruleField");
		          ruleField.setValue(oSelectedItem.getTitle());
		        }
		        evt.getSource().getBinding("items").filter([]);
		        that.validateRequiredField(evt)
		    }
		});

		dialog.bindAggregation("items", "fields>/", itemTemplate);

	    this.getView().addDependent(dialog);
	    dialog.open();

	},


	validateRequiredField: function(evt){

	    var view  = sap.ui.getCore();
	    var modelFields = view.byId("app").getModel("fields").getContext('/').oModel.oData;

	    // Armo el array de campos
	    var inputs = [
	      view.byId("ruleField"),
	      view.byId("ruleOption"),
	      view.byId("ruleValue")
	    ];

	    // Recorro cada campo para validar
	    jQuery.each(inputs, function (i, input) {
	        if (!input.getValue()) {
	          input.setValueState("Error");
	          input.setValueStateText("Campo obligatorio");
	        }
	        else{
	        	input.setValueState("None");
	        }

	        if(input.sId == "ruleField"){
	        	input.setValueState("Error");
    	        input.setValueStateText("Campo invalido o inexistente");
	        	jQuery.each(modelFields, function (j, data) {
	        		if(data.fieldtecname === input.getValue()){
	        			input.setValueState("None");
	        		}
	        	})
	        }
	    });

	    // Valido si algun campo tiene error
	    var canContinue = true;
	    jQuery.each(inputs, function (i, input) {
	      if ("Error" === input.getValueState()) {
	        canContinue = false;
	        return false;
	      }
	    });

	    view.byId("btnAddCond").setEnabled(canContinue);


	}




});
