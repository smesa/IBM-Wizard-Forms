sap.ui.controller("wizardformsforms.FormsVersions", {

	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched,this);
	},
	
	_handleRouteMatched: function(evt){
		
		this.formIndex = evt.getParameter("arguments").formIndex;			
		var app = sap.ui.getCore().byId("app");			
		
		try {  		
			var context = app.getModel('forms').getContext('/' + this.formIndex);		
			this.getView().setBindingContext(context,'forms');
		
		} catch(ex){  
			window.history.go(-1);
		}
	},
	
	goBack: function(){
		this.router.navTo("FormsMaster")
	},
	
	onChangeSearch: function(evt){
		var filters = [];
		var query = evt.getParameter("newValue");
		if (query && query.length > 0) {
			var filter = new sap.ui.model.Filter("verformid", sap.ui.model.FilterOperator.Contains, query);
			filters.push(filter);	}
		
		// update list binding
		var list = this.getView().oTableVersion;
		var binding = list.getBinding("items");
		binding.filter(filters);
	},
	
	versionPress: function(evt){
		var oBindingContext = evt.getSource().getBindingContext('forms');
		var sPath = oBindingContext.sPath;		
		var start = sPath.lastIndexOf("/") + 1;
		var versionIndex = sPath.substring(start,sPath.length);
		this.router.navTo("FormsDetail",{formIndex: this.formIndex, versionIndex: versionIndex});		
	},
	
	activeVersion: function(evt){
		var that 			= this;
		var oBindingContext = evt.getSource().getBindingContext('forms');
		var path            = oBindingContext.sPath;
		var start 		    = path.lastIndexOf('/') + 1;
		var versionIndex    = path.substring(start,path.length);	
		var status  	 	= evt.getParameter("state");		
		var app     	 	= sap.ui.getCore().byId("app")
		var context 	 	= app.getModel('forms').getData('/' + this.formIndex + '/');
		var version 	 	= context[this.formIndex].versions[versionIndex].verformid;
		var form    	 	= context[this.formIndex].formid;
		
		var mensaje         = "";
		
		if(status === true){
			mensaje = 'Si activa esta versión las otras versiones quedaran inactivas,¿Esta seguro de continuar?'
		}else{
			mensaje = 'Si desactiva esta versión no quedara ninguna versión activa para el formulario,¿Esta seguro de continuar?'
		}		
		
		
		var oModel       = new myJSONModel;  		
  		var oParameters  = {
 	           "formid" 			: form,
 	           "verformid"			: version,
 	           "option"				: "active-version"
 		};  		
		
		var dialog = new sap.m.Dialog({
		      title: 'Confirmación',
		      type: 'Message',
		      content: new sap.m.Text({ text: mensaje }), 
		      beginButton: new sap.m.Button({
		        text: 'Aceptar',
		        press: function () {	        	

		      		oModel.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/forms_data/forms/", function(oData){
		    			
		    			sap.m.MessageToast.show('Versión modificada');
		    			
		    			// Consulto los datos actualizados			
		    			var oModel2 = new myJSONModel;
		    			
		    			oModel2.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/forms_data/forms/", function(oData){
		    				sap.ui.getCore().byId("app").getModel('forms').setData(oData);
		    			},function(){
		    				sap.m.MessageToast.show('Error activando la versión');
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
		        	// Consulto los datos actualizados			
	    			var oModel2 = new myJSONModel;
	    			
	    			oModel2.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/forms_data/forms/", function(oData){
	    				sap.ui.getCore().byId("app").getModel('forms').setData(oData);
	    			},function(){
	    				sap.m.MessageToast.show('Error activando la versión');
	    			});	
		          dialog.close();
		        }
		      }),
		      afterClose: function() {
		        dialog.destroy();
	      }
	    });

	    dialog.open();		
		
	}


});