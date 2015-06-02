sap.ui.controller("wizardformsforms.SectionsDetail", {

	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched,this);
	},

	_handleRouteMatched: function(evt){
		if(evt.getParameter("name") !== "SectionsDetail"){
			return;
		}
		this.formIndex = evt.getParameter("arguments").formIndex;
		this.sectionIndex = evt.getParameter("arguments").sectionIndex;
		var context = sap.ui.getCore().byId("app").getModel('forms').getContext('/' + this.formIndex + '/sections/' + this.sectionIndex);
		this.getView().setBindingContext(context,'forms');
	},
	goBack: function(){
		window.history.go(-1);
	},
	
	deleteField: function(evt){
		
		
		var that = this;
		
		var oTable    = sap.ui.getCore().byId('oTableFields');
		var oListItem = evt.getParameters().listItem;
		var oPath     = oListItem.getBindingContextPath();
		var oId       = parseInt(oPath.substring(oPath.lastIndexOf('/') +1));		
		var app       = sap.ui.getCore().byId("app");
		
		try {  		
			var context = app.getModel('forms').getData('/' + this.formIndex + '/sections/' + this.sectionIndex + '/fields/' + oId + '/');
		
		} catch(ex){  
			window.history.go(-1);
		}  
		
		var dialog = new sap.m.Dialog({
	      title: 'Confirmación',
	      type: 'Message',
	      content: new sap.m.Text({ text: '¿Esta seguro de eliminar este elemento?' }),
	      beginButton: new sap.m.Button({
	        text: 'Eliminar',
	        press: function () {
	        	
	          context[that.formIndex].sections[that.sectionIndex].fields.splice(oId,1);		
	    	  sap.ui.getCore().byId("app").getModel('forms').setData(context);  
    		  sap.m.MessageToast.show('Sección eliminada');
    		  
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
	
	addField: function(evt){
		
		var that = this; 
		
		// Formularios
		var oInfoField = new sap.ui.layout.VerticalLayout({
			width: "100%",			
			content:[
					new sap.m.Bar({
						contentMiddle: [
							new sap.m.SearchField({
								liveChange:function(evt,obj){
									var filters = [];
									var query = evt.getParameter("newValue");
									if (query && query.length > 0) {
										var filter = new sap.ui.model.Filter("fieldtitle", sap.ui.model.FilterOperator.Contains, query);
										filters.push(filter);
									}
									var binding = sap.ui.getCore().byId('listFieldSection').getBinding("items");
									binding.filter(filters);
								},
							    width:"100%",
							    placeholder:"Filtro de elementos",
							}),							
						]
					}),
					new sap.m.List({
						id: "listFieldSection",	
						mode: sap.m.ListMode.MultiSelect,
					}).bindItems({
						path: "fields>/",
						template: new sap.m.StandardListItem({
							icon:"{fields>fieldicon}",
							title:"{fields>fieldtitle}",
						})					
					})
					
			]
		}).addStyleClass("layPadding10");
	
		var dialog = new sap.m.Dialog({
		      title: 'Seleccione los elementos para la sección',
		      verticalScrolling: true,
			  contentHeight: "400px",
		      content:[oInfoField],
		      beginButton: new sap.m.Button({
		          text: 'Agregar',
		          press: function (evt) {	 
		        	  
		        	  var model =  sap.ui.getCore().byId("app").getModel('forms').getContext('/' + that.formIndex + '/sections/' + that.sectionIndex);
		      		  var path  =  evt.getSource().getBindingContext('forms').getPath();			
		      		  var data  = model.getProperty(path);		        	  
		        	  var items = sap.ui.getCore().byId('listFieldSection').getSelectedItems();	 
		        	  
		        	  for	(index = 0; index < items.length; index++) {		        		  
	        			
		        			var fieldIndx = items[index].getBindingContextPath().substring(items[index].getBindingContextPath().lastIndexOf('/') + 1,items[index].getBindingContextPath().length)
		        		  	var field = sap.ui.getCore().byId("app").getModel('fields').getData('/')[fieldIndx];	
		        			data.fields.push(field)
		        	  }	
		        	  
		      		  sap.ui.getCore().byId("app").getModel('forms').setData(sap.ui.getCore().byId("app").getModel("forms").getData());    	
		          	  sap.m.MessageToast.show('Los elementos fueron agregados');  
		        	  
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
	}

});