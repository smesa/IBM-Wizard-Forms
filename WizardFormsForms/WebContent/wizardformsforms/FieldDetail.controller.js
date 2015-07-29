sap.ui.controller("wizardformsforms.FieldDetail", {

	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched,this);
	},

	_handleRouteMatched: function(evt){
		if(evt.getParameter("name") !== "FieldDetail"){
			return;
		}
		this.formIndex = evt.getParameter("arguments").formIndex;
		this.versionIndex = evt.getParameter("arguments").versionIndex;
		this.sectionIndex = evt.getParameter("arguments").sectionIndex;
		this.fieldIndex = evt.getParameter("arguments").fieldIndex;
		var context = sap.ui.getCore().byId("app").getModel('forms').getContext('/' + this.formIndex + '/versions/' + this.versionIndex + '/sections/' + this.sectionIndex + '/fields/' + this.fieldIndex);
		this.getView().setBindingContext(context,'forms');
		
	},
	goBack: function(){
		window.history.go(-1);
	},	
	
	
	editRule: function(evt){
		
		var that = this; 
		
		var oTable    = sap.ui.getCore().byId('oTableRules');
		var oListItem = evt.getParameters().listItem;
		var oPath     = oListItem.getBindingContextPath();
		var oId       = parseInt(oPath.substring(oPath.lastIndexOf('/') +1));		
		var app       = sap.ui.getCore().byId("app");
		this.ruleIndex = oId;
		
		try {  		
			var context = sap.ui.getCore().byId("app").getModel('forms').getContext('/' + this.formIndex + '/versions/' + this.versionIndex + '/sections/' + this.sectionIndex + '/fields/' + this.fieldIndex + '/rules/' + oId + '/');
			this.getView().setBindingContext(context,'forms');
		} catch(ex){  
			window.history.go(-1);
		}  
		
		
		
		// Formularios
		var oInfoField = new sap.ui.layout.VerticalLayout({
			width: "100%",			
			content:[
				new sap.m.Label({text:"Regla"}),
				new sap.m.Input({value:"{forms>fldruldesc}"}),					
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
	
		var dialog = new sap.m.Dialog({
		      title: 'Crear regla',
		      verticalScrolling: true,
			  contentWidth: "700px",
		      content:[oInfoField],
		      beginButton: new sap.m.Button({
		          text: 'Agregar',
		          press: function (evt) {	 
		        	
		            var context = sap.ui.getCore().byId("app").getModel('forms').getContext('/' + that.formIndex + '/versions/' + that.versionIndex + '/sections/' + that.sectionIndex + '/fields/' + that.fieldIndex);
		            that.getView().setBindingContext(context,'forms');
		    		        	  
		            dialog.close();
		          }
		        }),
		        endButton: new sap.m.Button({
		          text: 'Cerrar',
				  type: "Reject",
		          press: function () {
		        	var context = sap.ui.getCore().byId("app").getModel('forms').getContext('/' + that.formIndex + '/versions/' + that.versionIndex + '/sections/' + that.sectionIndex + '/fields/' + that.fieldIndex);
		        	that.getView().setBindingContext(context,'forms');
		            dialog.close();
		          }
		        }),
		        afterClose: function() {
		          var context = sap.ui.getCore().byId("app").getModel('forms').getContext('/' + that.formIndex + '/versions/' + that.versionIndex + '/sections/' + that.sectionIndex + '/fields/' + that.fieldIndex);
		          that.getView().setBindingContext(context,'forms');
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


		        	var otxtFldRulDesc = sap.ui.getCore().byId("oTxtFldRulDesc").getValue();
		        	var model =  sap.ui.getCore().byId("app").getModel('forms').getContext('/' + that.formIndex + '/sections/' + that.sectionIndex + '/fields/' + that.fieldIndex);
		        	var path  =  evt.getSource().getBindingContext('forms').getPath();	
		        	var data  =  model.getProperty(path);	
		        	
		        	
		        	data.rules.push({
		        		fldruldesc: otxtFldRulDesc,
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
		        			var context = sap.ui.getCore().byId("app").getModel('forms').getContext('/' + that.formIndex + '/versions/' + that.versionIndex + '/sections/' + that.sectionIndex + '/fields/' + that.fieldIndex + '/rules/' + that.ruleIndex + '/');
		        			//this.getView().setBindingContext(context,'forms');
		        		} catch(ex){  
		        			window.history.go(-1);
		        		}  
		        		
		        		var data = context.getModel('forms').getData();
		        		
		        		//data = data[0].versions[that.versionIndex].sections[that.sectionIndex].fields[that.fieldIndex].rules[that.ruleIndex];
		        		
		        		data[0].versions[that.versionIndex].sections[that.sectionIndex].fields[that.fieldIndex].rules[that.ruleIndex].conditions.push({
			      			field: oField,
			      			option: oOption,
			      			value: oValue,
			      		    connector: oConnector
			      		})
			      		
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
					var filter = new sap.ui.model.Filter("fieldtecname", sap.ui.model.FilterOperator.Contains, query);
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