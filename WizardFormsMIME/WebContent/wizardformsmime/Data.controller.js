sap.ui.controller("wizardformsmime.Data", {

    onInit: function() {
		  this.router = sap.ui.core.UIComponent.getRouterFor(this);
		  this.router.attachRoutePatternMatched(this._handleRouteMatched,this);
	},
	
	// Manejador
	_handleRouteMatched: function(evt){
		if(evt.getParameter("name") !== "image"){
			return;
		}
		
		this.imageIndex = evt.getParameter("arguments").imageIndex;			
		var app = sap.ui.getCore().byId("app");	
		
		
		try {  		
			var context = app.getModel('images').getContext('/' + this.imageIndex);		
			this.getView().setBindingContext(context,'images');
		
		} catch(ex){  
			window.history.go(-1);
		}  
	},
	
	deleteData: function(evt){	
		
		var that = this;
		 
		// images se define en el Component
		var model        = sap.ui.getCore().byId("app").getModel("images").getContext('/');		
  		var data         = model.getProperty(model.sPath);    		
  		var oModel       = new myJSONModel;
  		var imgid        = sap.ui.getCore().byId("imgId").getValue();	
		
		// Parametros del registro
		var oParameters = {
	           "imgid" : imgid
		};
		
		var dialog = new sap.m.Dialog({
		      title: 'Confirmación',
		      type: 'Message',
		      content: new sap.m.Text({ text: '¿Esta seguro que desea eliminar esta imagen?' }),
		      beginButton: new sap.m.Button({
		        text: 'Aceptar',
		        press: function () {	        	
                    
		    		// Llamo el metodo POST para crear los datos
		    		oModel.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/images_data/images/", function(oData){
		    			
		    					    			
		    			
		    			// Consulto los datos actualizados			
		    			var oModel2 = new myJSONModel;
		    			
		    			oModel2.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/images_data/images/", function(oData){
		    				sap.ui.getCore().byId("app").getModel('images').setData(oData);	
		    				sap.m.MessageToast.show('La imagen ha sido eliminada exitosamente');
		    				that.router.navTo("Blank");
		    			},function(){
		    				sap.m.MessageToast.show('Problemas durante la eliminación de la imagen');
		    			});	
		    			 
		    				
		    		},function(){
		    			sap.ui.commons.MessageBox.alert(arguments[0].statusText);
		    		},oParameters, false,'DELETE');	
	    		  
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

});