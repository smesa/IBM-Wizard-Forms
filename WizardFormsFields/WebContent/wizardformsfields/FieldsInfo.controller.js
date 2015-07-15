sap.ui.controller("wizardformsfields.FieldsInfo", {

	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched,this);
	},

	_handleRouteMatched: function(evt){
		if(evt.getParameter("name") !== "FieldsInfo"){
			return;
		}
		
		this.fieldIndex = evt.getParameter("arguments").fieldIndex;			
		var app = sap.ui.getCore().byId("app");	
		
		
		try {  		
			var context = app.getModel('fields').getContext('/' + this.fieldIndex);		
			this.getView().setBindingContext(context,'fields');
		
		} catch(ex){  
			window.history.go(-1);
		}  
	},
	
	addValuesDialog: function(evt){
		
		var that = this; 
		var oLblValueExt  = new sap.m.Label({ text : "Código" });  
		var oTxtValueExt  = new sap.m.Input({ id: "oTxtValueExt", placeholder: "Ingresa el código del valor" });  
		var oLblValue     = new sap.m.Label({ text : "Descripción" }); 
		var oTxtValue     = new sap.m.Input({ id: "oTxtValue", placeholder: "Ingresa la descripción del valor" });  
		
		
		// Formulario de valores
		var oValueForm = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content:[oLblValueExt,oTxtValueExt,oLblValue, oTxtValue ]
		}).addStyleClass("layPadding10");			
		
		var dialog = new sap.m.Dialog({
		      title: 'Ingreso de valor para elemento',
		      content:[oValueForm],
		      beginButton: new sap.m.Button({
		          text: 'Agregar',
		          press: function (evt) {
		        	that.addValue(evt);
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
	
	deleteValueDialog: function(evt){	
		
		
		var that = this;
		var oTable    = sap.ui.getCore().byId('oValueTable');
		var oListItem = evt.getParameters().listItem;
		var oPath     = oListItem.getBindingContextPath();
		var oId       = parseInt(oPath.substring(oPath.lastIndexOf('/') +1));		
		var app       = sap.ui.getCore().byId("app");
		
		try {  		
			var context = app.getModel('fields').getData('/' + this.fieldIndex + '/values/' + oId + '/');
		
		} catch(ex){  
			window.history.go(-1);
		}  
		
		var dialog = new sap.m.Dialog({
	      title: 'Confirmación',
	      type: 'Message',
	      content: new sap.m.Text({ text: '¿Esta seguro de eliminar este valor?' }),
	      beginButton: new sap.m.Button({
	        text: 'Eliminar',
	        press: function () {
	        	
	          context[that.fieldIndex].values.splice(oId,1);		
	    	  sap.ui.getCore().byId("app").getModel('fields').setData(context);  
    		  sap.m.MessageToast.show('Valor de elemento eliminado');
    		  
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
	
	addValue: function(evt){
		
		var oText = sap.ui.getCore().byId("oTxtValue");	
		var oTextExt = sap.ui.getCore().byId("oTxtValueExt");	
		var model = sap.ui.getCore().byId("app").getModel("fields").getContext('/' + this.fieldIndex + '/values/');		
		var path  = evt.getSource().getBindingContext('fields').getPath();			
		var data  = model.getProperty(path);
			
		data.values.push({
			value: oText.getValue(),
			valueext: oTextExt.getValue()
		})
		
		var fields = sap.ui.getCore().byId("app").getModel("fields").getData();		
		sap.ui.getCore().byId("app").getModel('fields').setData(fields);    	
    	sap.m.MessageToast.show('Valor de elemento agregado');
	},
	
	saveData: function(evt){
		

		
		// Obtengo valores
		var oTxtTitle = sap.ui.getCore().byId("fieldtitle").getValue();
		var oTxtTecName = sap.ui.getCore().byId("fieldtecname").getValue();
		var oTxtPlace = sap.ui.getCore().byId("fieldplaceholder").getValue();
		var oCmbType  = sap.ui.getCore().byId("fieldtype").getSelectedItem().getKey();
		
		var oIcon 	  = "";
		var oIsvalue  = "";

		// Evaluo tipo para icono
		switch(oCmbType) {
		    case "TEXT":
		    	oIcon = "sap-icon://attachment-text-file"
		        break;
		    case "COMBO":
		    	oIcon = "sap-icon://drop-down-list"
		        break;
		    case "RADIO":
		    	oIcon = "sap-icon://multi-select"
		        break;
		    case "CHECK":
		    	oIcon = "sap-icon://sys-enter-2"
		        break;
		    case "CALE":
		    	oIcon = "sap-icon://calendar"
		        break;
		    case "TIME":
		    	oIcon = "sap-icon://history"
		        break;
		    case "LABEL":
		    	oIcon = "sap-icon://document-text"
		        break;
		}
		
		var model = sap.ui.getCore().byId("app").getModel("fields").getContext('/' + this.fieldIndex + '/values/');		
		var path  = evt.getSource().getBindingContext('fields').getPath();			
		var dataVal  = model.getProperty(path);
		
		// Evaluo si tiene valores // marco con x
		if(dataVal.values.length > 0){
			oIsvalue = 'X'
		}
		
		// Creo objeto del modelo
		var oModel = new myJSONModel;
		
		// Parametros del registro
		var oParameters = {
	           "fieldid" 			: dataVal.fieldid,
	           "fieldtecname"		: oTxtTecName,
	           "fieldtitle" 		: oTxtTitle,
	           "fieldplaceholder" 	: oTxtPlace,
	           "fieldtype" 			: oCmbType,
	           "isvalues" 			: oIsvalue
		};
		
		// Obtengo datos del modelo de valores // data
		var data = sap.ui.getCore().byId("app").getModel('data').getData();	
		
		if(dataVal.values.length > 0){
			// Obtengo datos del modelo de valores // dataVal	
			var valuesJson = JSON.stringify(dataVal.values);
			valuesJson = valuesJson.replace(/"value":/g, 'value:');
			valuesJson = valuesJson.replace(/"valueext":/g, 'valueext:');
			oParameters.values = valuesJson
		}	
		
		
		var dialog = new sap.m.Dialog({
		      title: 'Confirmación',
		      type: 'Message',
		      content: new sap.m.Text({ text: '¿Esta seguro de guardar estos cambios?' }),
		      beginButton: new sap.m.Button({
		        text: 'Aceptar',
		        press: function () {	        	

		    		// Llamo el metodo POST para crear los datos
		    		oModel.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/fields_data/fields/", function(oData){
		    			
		    			sap.m.MessageToast.show('Los datos fueron guardados con exito');
		    			
		    			// Consulto los datos actualizados			
		    			var oModel2 = new myJSONModel;
		    			
		    			oModel2.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/fields_data/fields/" + dataVal.fieldid , function(oData){
		    				console.log('Consulta de campos ok')
		    				sap.ui.getCore().byId("app").getModel('fields').setData(oData);
		    			},function(){
		    				sap.m.MessageToast.show('Error creando el elemento');
		    			});		
		    			
		    		},function(){
		    			sap.ui.commons.MessageBox.alert(arguments[0].statusText);
		    		},oParameters, true,'PUT');	
	    		  
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
	
	deleteData: function(evt){	
		
		var that = this;
		var model = sap.ui.getCore().byId("app").getModel("fields").getContext('/' + this.fieldIndex + '/values/');		
		var path  = evt.getSource().getBindingContext('fields').getPath();			
		var dataVal  = model.getProperty(path);		
		
		// Creo objeto del modelo
		var oModel = new myJSONModel;		
		
		// Parametros del registro
		var oParameters = {
	           "fieldid" : dataVal.fieldid
		};
		
		
		var dialog = new sap.m.Dialog({
		      title: 'Confirmación',
		      type: 'Message',
		      content: new sap.m.Text({ text: '¿Esta seguro de eliminar este elemento?' }),
		      beginButton: new sap.m.Button({
		        text: 'Aceptar',
		        press: function () {	        	

		    		// Llamo el metodo POST para crear los datos
		    		oModel.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/fields_data/fields/" + dataVal.fieldid, function(oData){
		    			
		    			sap.m.MessageToast.show('El elemento fue eliminado con exito');		    			
		    			
		    			// Consulto los datos actualizados			
		    			var oModel2 = new myJSONModel;
		    			
		    			oModel2.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/fields_data/fields/", function(oData){
		    				sap.ui.getCore().byId("app").getModel('fields').setData(oData);		
		    				that.router.navTo("Blank");
		    			},function(){
		    				sap.m.MessageToast.show('Error eliminando el elemento');
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


	}

	
});