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
  		var devclass     = sap.ui.getCore().byId("formPackageNew").getValue();
  		var trkorr       = sap.ui.getCore().byId("formOrderNew").getValue();
  		var actLength    = data.length;
  		
  		var oParameters = {
 	           "formtitle" : formtitle,
 	           "devclass"  : devclass,
 	           "trkorr"	   : trkorr
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
			    	  			//that.router.navTo("FormsDetailC",{formIndex:newLength, versionIndex: '0'});
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
	
	getPackages: function(evt){
		
			var itemTemplate = new sap.m.StandardListItem({
				title: "{packages>devclass}",
				description: "{packages>ctext}",
				active: true
			});
			
			var dialog = new sap.m.SelectDialog({
				title:"Paquetes",
			    class:"sapUiPopupWithPadding",
			    liveChange: function(evt){
			    	
			    	var filters = [];
					var query = evt.getParameter("value");
					if (query && query.length > 0) {
						var filter = new sap.ui.model.Filter("devclass", sap.ui.model.FilterOperator.Contains, query);
						filters.push(filter);
					}
					evt.getSource().getBinding("items").filter(filters);
					
			    },
			    confirm: function(evt){
			    	var oSelectedItem = evt.getParameter("selectedItem");
			        if (oSelectedItem) {
			          var packageInput =  sap.ui.getCore().byId("formPackageNew");
			          packageInput.setValue(oSelectedItem.getTitle());
			        }
			        evt.getSource().getBinding("items").filter([]);
			    },
			    cancel: function(evt){
			    	var oSelectedItem = evt.getParameter("selectedItem");
			        if (oSelectedItem) {
			          var packageInput =  sap.ui.getCore().byId("formPackageNew");
			          packageInput.setValue(oSelectedItem.getTitle());
			        }
			        evt.getSource().getBinding("items").filter([]);
			    }
			});
			
			dialog.bindAggregation("items", "packages>/", itemTemplate);
		
		    this.getView().addDependent(dialog);
		    dialog.open();

	},
	
	getTransportOrder: function(evt){
		
		var itemTemplate = new sap.m.StandardListItem({
			title: "{orders>trkorr}",
			description: "{orders>as4text}",
			active: true
		});
		
		var dialog = new sap.m.SelectDialog({
			title:"Ordenes de tranporte",
		    class:"sapUiPopupWithPadding",
		    liveChange: function(evt){
		    	
		    	var filters = [];
				var query = evt.getParameter("value");
				if (query && query.length > 0) {
					var filter = new sap.ui.model.Filter("devclass", sap.ui.model.FilterOperator.Contains, query);
					filters.push(filter);
				}
				evt.getSource().getBinding("items").filter(filters);
				
		    },
		    confirm: function(evt){
		    	var oSelectedItem = evt.getParameter("selectedItem");
		        if (oSelectedItem) {
		          var orderInput =  sap.ui.getCore().byId("formOrderNew");
		          orderInput.setValue(oSelectedItem.getTitle());
		        }
		        evt.getSource().getBinding("items").filter([]);
		    },
		    cancel: function(evt){
		    	var oSelectedItem = evt.getParameter("selectedItem");
		        if (oSelectedItem) {
		          var orderInput =  sap.ui.getCore().byId("formOrderNew");
		          orderInput.setValue(oSelectedItem.getTitle());
		        }
		        evt.getSource().getBinding("items").filter([]);
		    }
		});
		
		dialog.bindAggregation("items", "orders>/", itemTemplate);
	
	    this.getView().addDependent(dialog);
	    dialog.open();

	},
	
	validateRequiredField: function(evt){
		
	    var view = sap.ui.getCore();
	    
	    // Armo el array de campos
	    var inputs = [
	      view.byId("formPackageNew"),
	      view.byId("formOrderNew"),
	      view.byId("formTitleNew"),
	    ];
	    
	    // Recorro cada campo para validar
	    jQuery.each(inputs, function (i, input) {
	        if (!input.getValue()) {
	          input.setValueState("Error");
	        }
	        else{
	        	input.setValueState("None");
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

	    view.byId("btnSaveNew").setEnabled(canContinue);

	    
	}
	
	
	
});