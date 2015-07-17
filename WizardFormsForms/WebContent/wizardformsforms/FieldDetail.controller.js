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
	
	
	addRule: function(evt){
		
		var that = this; 
		
		// Formularios
		var oInfoField = new sap.ui.layout.VerticalLayout({
			width: "100%",			
			content:[
				new sap.m.Label({text:"Titulo de la regla"}),
				new sap.m.Input({placeholder:"Ingrese un titulo descriptivo para la regla"}),					
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
			        	title: "{forms>value}"
			        }),
			        new sap.m.ObjectIdentifier({
			        	title: "{forms>value}"
			        }),
			        new sap.m.ObjectIdentifier({
			        	title: "{forms>value}"
			        }),
			        new sap.m.ObjectIdentifier({
			        	title: "{forms>value}"
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
	            		that.addCondition(evt)
	            	}
	            })
            ]
		});
		
		oTable.setHeaderToolbar(oHeader);	
		oTable.setMode(sap.m.ListMode.Delete); // delete mode  
		oTable.bindAggregation("items","forms>values",oTemplate);
		oInfoField.addContent(oTable);
	
		var dialog = new sap.m.Dialog({
		      title: 'Crear regla',
		      verticalScrolling: true,
			  contentWidth: "700px",
		      content:[oInfoField],
		      beginButton: new sap.m.Button({
		          text: 'Agregar',
		          press: function (evt) {	 
		        	  
		    		        	  
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
	
	addCondition: function(evt){
		
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
			    		 oController.validateRequiredField(evt)
			    	 }
				}),
				new sap.m.Label({text:"Opción"}),
				new sap.m.ComboBox({
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
		                     ]
		        }).bindProperty("value","StatusText"),
				new sap.m.Label({text:"Valor"}),
				new sap.m.Input({placeholder:"Ingrese el valor de la condicion, para varios valores separe por coma"}),	
				new sap.m.Label({text:"Conector"}),
				new sap.m.ComboBox({
					  width: "100%",
					  items: [
		                          new sap.ui.core.ListItem({text: "AND - Y",key:"AND"}).bindProperty("text","StatusText").bindProperty("key","Status"),
		                          new sap.ui.core.ListItem({text: "OR - O",key:"OR"}),
		                     ]
		        }).bindProperty("value","StatusText"),	
			]
		}).addStyleClass("layPadding10");
		
		
	
		var dialog = new sap.m.Dialog({
		      title: 'Agregar condición',
		      verticalScrolling: true,
			  contentWidth: "700px",
		      content:[oInfoField],
		      beginButton: new sap.m.Button({
		          text: 'Agregar',
		          press: function (evt) {	 
		        	  
		    		        	  
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
		    },
		    cancel: function(evt){
		    	var oSelectedItem = evt.getParameter("selectedItem");
		        if (oSelectedItem) {
		          var ruleField =  sap.ui.getCore().byId("ruleField");
		          ruleField.setValue(oSelectedItem.getTitle());
		        }
		        evt.getSource().getBinding("items").filter([]);
		    }
		});
		
		dialog.bindAggregation("items", "fields>/", itemTemplate);
	
	    this.getView().addDependent(dialog);
	    dialog.open();

	},
	

	

});