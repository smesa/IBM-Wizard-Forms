sap.ui.controller("wizardformsforms.FormCreate", {

	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched,this);
	},
	
	_handleRouteMatched: function(evt){
		if(evt.getParameter("name") !== "FormCreate"){
			return;
		}
	},
	
	saveData: function(evt){
		
		var that = this;
		
		var model        = sap.ui.getCore().byId("app").getModel("forms").getContext('/');		
  		var data         = model.getProperty(model.sPath);    		
  		var oModel       = new myJSONModel;
  		var formtitle    = sap.ui.getCore().byId("formTitleNew").getValue();
  		var actLength    = data.length;
  		
  		var oParameters = {
 	           "formtitle" 		    : formtitle
 		};
  		
  		sap.ui.getCore().byId("formTitleNew").setValue("");
  		
  		var dialog = new sap.m.Dialog({
		      title: 'Confirmación',
		      type: 'Message',
		      content: new sap.m.Text({ text: '¿Esta seguro de crear este formulario?' }),
		      beginButton: new sap.m.Button({
		        text: 'Aceptar',
		        press: function () {	        	

		    		// Llamo el metodo POST para crear los datos
		    		oModel.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/forms_data/forms/", function(oData){
		    			
		    			sap.m.MessageToast.show('Los datos fueron guardados con exito');
		    			
		    			// Consulto los datos actualizados			
		    			var oModel2 = new myJSONModel;
		    			
		    			oModel2.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/forms_data/forms/", function(oData){
		    				sap.ui.getCore().byId("app").getModel('forms').setData(oData);
		    				
			    			var model        = sap.ui.getCore().byId("app").getModel("forms").getContext('/');		
			    	  		var data         = model.getProperty(model.sPath);  
			    	  		var newLength    = data.length;
			    	  		
			    	  		
			    	  		if(newLength > actLength){
			    	  			newLength = newLength - 1;
			    	  			that.router.navTo("FormsDetail",{formIndex:newLength});
			    	  		}
		    				
		    			},function(){
		    				sap.m.MessageToast.show('Error creando el elemento');
		    			});		
		    			

		    			
		    		},function(){
		    			sap.ui.commons.MessageBox.alert(arguments[0].statusText);
		    		},oParameters, true,'POST');	
	    		  
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