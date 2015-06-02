sap.ui.controller("wizardformsforms.FormsDetail", {

	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched,this);
	},

	_handleRouteMatched: function(evt){
		if(evt.getParameter("name") !== "FormsDetail"){
			return;
		}
		
		this.formIndex = evt.getParameter("arguments").formIndex;			
		var app = sap.ui.getCore().byId("app");	
		
		
		try {  		
			var context = app.getModel('forms').getContext('/' + this.formIndex);		
			this.getView().setBindingContext(context,'forms');
		
		} catch(ex){  
			window.history.go(-1);
		}  
	},
	
	sectionPress: function(oEvent){		
		
		var oTable       = sap.ui.getCore().byId('oTableSections');
		var oListItem    = oEvent.getParameters().listItem;
		var oPath        = oListItem.getBindingContextPath();
		var start        = oPath.lastIndexOf('/') + 1;
		var sectionIndex = oPath.substring(start,oPath.length);		
		this.router.navTo("SectionsDetail",{formIndex:this.formIndex, sectionIndex: sectionIndex});
	},
	
	deleteSection: function(evt){
		
		
		var that = this;
		
		var oTable    = sap.ui.getCore().byId('oTableSections');
		var oListItem = evt.getParameters().listItem;
		var oPath     = oListItem.getBindingContextPath();
		var oId       = parseInt(oPath.substring(oPath.lastIndexOf('/') +1));		
		var app       = sap.ui.getCore().byId("app");
		
		try {  		
			var context = app.getModel('forms').getData('/' + this.formIndex + '/sections/' + oId + '/');
		
		} catch(ex){  
			window.history.go(-1);
		}  
		
		var dialog = new sap.m.Dialog({
	      title: 'Confirmación',
	      type: 'Message',
	      content: new sap.m.Text({ text: '¿Esta seguro de eliminar esta sección?' }),
	      beginButton: new sap.m.Button({
	        text: 'Eliminar',
	        press: function () {
	        	
	          context[that.formIndex].sections.splice(oId,1);		
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
	
	addSection: function(evt){
		
		var that = this; 
		// Formularios
		var oInfoSection = new sap.ui.layout.VerticalLayout({
			width: "100%",			
			content:[
		         	 new sap.m.Label({}),
			         new sap.m.Label({text:"Titulo de la sección"}),
			         new sap.m.Input({id:"oSectionTitle",required: true}),
			         new sap.m.Label({text:"Nro de columnas de la sección"}),
			         new sap.m.ComboBox({
			        	  id:"oSectionColumns",
			        	  selectedKey:"1",
						  width: "100%",
						  items: [
			                          new sap.ui.core.ListItem({text: "1 Columna",key:"1"}).bindProperty("text","StatusText").bindProperty("key","Status"),
			                          new sap.ui.core.ListItem({text: "2 Columnas",key:"2"}),
			                          new sap.ui.core.ListItem({text: "3 Columnas",key:"3"}),
			                          new sap.ui.core.ListItem({text: "4 Columnas",key:"4"})
			                     ]
			        }).bindProperty("value","StatusText")
			         
			]
		}).addStyleClass("layPadding10");
	
		var dialog = new sap.m.Dialog({
		      title: 'Creación de nueva sección',
		      content:[oInfoSection],
		      beginButton: new sap.m.Button({
		          text: 'Agregar',
		          press: function (evt) {
		        	
		        	  
		        	var oTitle    = sap.ui.getCore().byId("oSectionTitle");	
		        	var oColumns  = sap.ui.getCore().byId("oSectionColumns").getSelectedItem().getKey();
		        	
		      		var model = sap.ui.getCore().byId("app").getModel("forms").getContext('/' + this.formIndex);
		      		var path  = evt.getSource().getBindingContext('forms').getPath();			
		      		var data  = model.getProperty(path);
		      			
		      		data.sections.push({
		      			sectiontitle: 	sap.ui.getCore().byId("oSectionTitle").getValue(),
		      			sectioncolumn:  sap.ui.getCore().byId("oSectionColumns").getSelectedItem().getKey()					
		      		})
		      		
		      		var forms = sap.ui.getCore().byId("app").getModel("forms").getData();		
		      		sap.ui.getCore().byId("app").getModel('forms').setData(forms);    	
		          	sap.m.MessageToast.show('Seccion creada');  
		        	  
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