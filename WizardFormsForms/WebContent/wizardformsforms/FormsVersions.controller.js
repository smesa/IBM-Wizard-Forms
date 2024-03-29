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

		      		oModel.loadDataNew("http://ex3healthcare.softlayer.com:8000/sap/bc/ibmishc/abap_forms/forms_services/", function(oData){

		    			sap.m.MessageToast.show('Versión modificada');

		    			// Consulto los datos actualizados
		    			var oModel2 = new myJSONModel;

		    			oModel2.loadDataNew("http://ex3healthcare.softlayer.com:8000/sap/bc/ibmishc/abap_forms/forms_services/", function(oData){
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

	    			oModel2.loadDataNew("http://ex3healthcare.softlayer.com:8000/sap/bc/ibmishc/abap_forms/forms_services/", function(oData){
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

	},

	newVersion: function(evt){

		var that = this;
		that.oTypeVersion = new sap.m.ComboBox({
			  width: "100%",
  			  selectedKey: "EMPTY",
  			  items: [
                    new sap.ui.core.ListItem({text: "Versión vacia",key:"EMPTY"}).bindProperty("text","StatusText").bindProperty("key","Status"),
                    new sap.ui.core.ListItem({text: "Basada en ultima versión creada",key:"LAST"})
              ]
          }).bindProperty("value","StatusText");


		var model =  sap.ui.getCore().byId("app").getModel('forms').getContext('/' + that.formIndex);
		var path  =  evt.getSource().getBindingContext('forms').getPath();
		that.data  = model.getProperty(path);

		// Formularios
		var oInfoVersion = new sap.ui.layout.VerticalLayout({
			id: "oTypeVersion",
			width: "100%",
			placeholder: "Seleccione una opción",
			content:[
		         	new sap.m.Label({ text : "Seleccione una forma de crear la versión" }),
		         	that.oTypeVersion,
			]
		}).addStyleClass("layPadding10");

		var dialog = new sap.m.Dialog({
		      title: 'Crear versión',
		      verticalScrolling: true,
			  contentWidth: "500px",
		      content:[oInfoVersion],
		      beginButton: new sap.m.Button({
		          text: 'Crear',
		          press: function (evt) {

		        	var oModel       = new myJSONModel;

	        		var oParameters = {
		        		 "formid" 	: that.data.formid,
		                 "typever" 	: that.oTypeVersion.getSelectedItem().getKey(),
		                 "option"	: "new-version"
	        		};

	        		// Llamo el metodo POST para crear los datos
		    		oModel.loadDataNew("http://ex3healthcare.softlayer.com:8000/sap/bc/ibmishc/abap_forms/forms_services/", function(oData){

		    			sap.m.MessageToast.show('Versión creada exitosamente');

		    			// Consulto los datos actualizados
		    			var oModel2 = new myJSONModel;

		    			oModel2.loadDataNew("http://ex3healthcare.softlayer.com:8000/sap/bc/ibmishc/abap_forms/forms_services/", function(oData){
		    				sap.ui.getCore().byId("app").getModel('forms').setData(oData);
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
		    dialog.open();


	}


});
