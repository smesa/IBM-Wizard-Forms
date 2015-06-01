sap.ui.controller("wizardformsfields.FieldsCreate", {

	onInit: function() {
		
		//Asigno rutero
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched,this);
	},

	_handleRouteMatched: function(evt){
		if(evt.getParameter("name") !== "FieldsCreate"){
			return;
		}
	},
	
	addValuesDialog: function(evt,obj){
		
		var that = this; 
		var oTxtValue  = new sap.m.Input({ id: "oTxtValue", placeholder: "Ingresa un valor para el elemento" });  
		
		// Formulario de valores
		var oValueForm = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content:[oTxtValue]
		}).addStyleClass("layPadding10");			
		
		var dialog = new sap.m.Dialog({
		      title: 'Ingreso de valor para elemento',
		      content:[oValueForm],
		      beginButton: new sap.m.Button({
		          text: 'Agregar',
		          press: function (evt,obj) {
		        	that.addValue(evt,obj);
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
	
	addValue: function(evt,obj){
		
		var oText = sap.ui.getCore().byId("oTxtValue");
		var model = sap.ui.getCore().byId("app").getModel("data");
		var data  = model.getData();
			
		data.push({
			value: oText.getValue()					
		})
		
		sap.ui.getCore().byId("app").getModel('data').setData(data);    	
    	sap.m.MessageToast.show('Valor de elemento agregado');

	},
	
	deleteValueDialog: function(evt){		
		var that = this;
		var oTable    = sap.ui.getCore().byId('oValueTableNew');
		var oListItem = evt.getParameters().listItem;
		var oPath     = oListItem.getBindingContextPath();
		var oId       = parseInt(oPath.substring(oPath.lastIndexOf('/') +1));		
		var app       = sap.ui.getCore().byId("app");
		
		try {  		
			var context = app.getModel('data').getData();
		
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
	        	
	          context.splice(oId,1);		
	    	  sap.ui.getCore().byId("app").getModel('data').setData(context);  
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
	
	saveData: function(evt){
		
		var that = this;

				
		// Obtengo valores
		var oTxtTitle = sap.ui.getCore().byId("oTxtTitle").getValue();
		var oTxtPlace = sap.ui.getCore().byId("oTxtPlace").getValue();
		var oCmbType  = sap.ui.getCore().byId("oCmbType").getSelectedItem().getKey();
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
		
		// Evaluo si tiene valores // marco con x
		if(sap.ui.getCore().byId("app").getModel('data').getData().length > 0){
			oIsvalue = 'X'
		}
		
		// Creo objeto del modelo
		var oModel = new myJSONModel;
	
		
		// Parametros del registro
		var oParameters = {
	           "fieldid" 			: "",
	           "fieldtitle" 		: oTxtTitle,
	           "fieldplaceholder" 	: oTxtPlace,
	           "fieldtype" 			: oCmbType,
	           "isvalues" 			: oIsvalue	
		};
		
		// Obtengo datos del modelo de valores // data
		var data = sap.ui.getCore().byId("app").getModel('data').getData();	
		
		if(data.length > 0){
			var valuesJson = JSON.stringify(data);
			valuesJson = valuesJson.replace(/"value":/g, 'value:');
			oParameters.values = valuesJson
		}		
		
		// Llamo el metodo POST para crear los datos
		oModel.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/fields_data/fields/", function(oData){
			
			sap.m.MessageToast.show('El elemento fue exitosamente creado');
			that.clearData();
			
			// Consulto los datos actualizados			
			var oModel2 = new myJSONModel;
			
			oModel2.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/fields_data/fields/", function(oData){
				console.log('Consulta de campos ok')
				sap.ui.getCore().byId("app").getModel('fields').setData(oData);
			},function(){
				sap.m.MessageToast.show('Error creando el elemento');
			});			
			
		},function(){
			sap.ui.commons.MessageBox.alert(arguments[0].statusText);
		},oParameters, true, 'PUT');	
	},
	
	clearData: function(){
		sap.ui.getCore().byId("oTxtTitle").setValue("");
		sap.ui.getCore().byId("oTxtPlace").setValue("");
		sap.ui.getCore().byId("oCmbType").setSelectedKey("TEXT");	
		sap.ui.getCore().byId("app").getModel('data').setData([]);
	}

});