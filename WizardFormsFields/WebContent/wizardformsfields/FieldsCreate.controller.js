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

	addValuesDialogx: function(evt,obj){

		var that = this;
		var oLblValueExt  = new sap.m.Label({ text : "Código" });
		var oTxtValueExt  = new sap.m.Input({ id: "oTxtValueExt", placeholder: "Ingresa el código del valor" });
		var oLblValue     = new sap.m.Label({ text : "Descripción" });
		var oTxtValue     = new sap.m.Input({ id: "oTxtValue", placeholder: "Ingresa la descripción del valor" });
		var oLblGroup     = new sap.m.Label({ text : "Grupo de valores" });
		var oCmbGroup     = new sap.m.ComboBox({id: "oCmbGroupNew", width: "100%"});

		var oTemplateGroup = new sap.ui.core.Item({key:"{groups>groupid}",text:"{groups>grouptitle}"})
		oCmbGroup.bindAggregation("items","groups>/",oTemplateGroup);

		// Formulario de valores
		var oValueForm = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content:[oLblValueExt,oTxtValueExt,oLblValue, oTxtValue, oLblGroup, oCmbGroup]
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

	addValuesDialog: function(evt){

		var that = this;
		var oLblValueExt  = new sap.m.Label({ text : "Código" });
		var oTxtValueExt  = new sap.m.Input({ id: "oTxtValueExt", placeholder: "Ingresa el código del valor" });
		var oLblValue     = new sap.m.Label({ text : "Descripción" });
		var oTxtValue     = new sap.m.Input({ id: "oTxtValue", placeholder: "Ingresa la descripción del valor" });
		var oLblGroup     = new sap.m.Label({ text : "Grupo de valores" });
		var oCmbGroup     = new sap.m.ComboBox({id: "oCmbGroupNew", width: "100%"});


		var oListItem = "";
		var oPath     = "";
		var oId       = -1;

		try {

			oListItem = evt.getParameters().listItem;
			oPath     = oListItem.getBindingContextPath();
			oId       = parseInt(oPath.substring(oPath.lastIndexOf('/') +1));

		}catch(ex){

		}


		var app       = sap.ui.getCore().byId("app");
		var valext    = "";
		var value     = "";
		var group     = "";
		var context   = null;

		try {
			context = app.getModel('data').getData('/' + oId + '/');
			if(context.length > 0){
				value  = context[oId].value;
				valext = context[oId].valueext;
				group  = context[oId].groupid;
			}else{
				context = null
			}

		} catch(ex){
			context = null
		}

		var oTemplateGroup = new sap.ui.core.Item({key:"{groups>groupid}",text:"{groups>grouptitle}"})
		oCmbGroup.bindAggregation("items","groups>/",oTemplateGroup);

		oTxtValueExt.setValue(valext);
		oTxtValue.setValue(value);
		oCmbGroup.setSelectedKey(group);



		// Formulario de valores
		var oValueForm = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content:[oLblValueExt,oTxtValueExt,oLblValue, oTxtValue, oLblGroup, oCmbGroup ]
		}).addStyleClass("layPadding10");

		var dialog = new sap.m.Dialog({
		      title: 'Ingreso de valor para elemento',
		      content:[oValueForm],
		      beginButton: new sap.m.Button({
		          text: 'Agregar',
		          press: function (evt) {
		        	that.addValue(evt,context,oId);
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


	addValue: function(evt,context,oId){

		var oText = sap.ui.getCore().byId("oTxtValue");
		var oTextExt = sap.ui.getCore().byId("oTxtValueExt");
		var model = sap.ui.getCore().byId("app").getModel("data");
		var data  = model.getData();
		var groupid = "";
		var grouptitle = "";


		try {
			groupid = sap.ui.getCore().byId("oCmbGroupNew").getSelectedItem().getKey();
			grouptitle = sap.ui.getCore().byId("oCmbGroupNew").getSelectedItem().getText()
		}
		catch(err) {
		    //err
		}


		if(context != null){
			context[oId].value 		= oText.getValue();
			context[oId].valueext 	= oTextExt.getValue(),
			context[oId].groupid 	= groupid;
			context[oId].grouptitle = grouptitle;

			sap.ui.getCore().byId("app").getModel('data').setData(context);
			sap.m.MessageToast.show('Valor de elemento modificado');

		}else{

			data.push({
				value: oText.getValue(),
				valueext: oTextExt.getValue(),
				groupid: groupid,
				grouptitle: grouptitle
			})

			sap.ui.getCore().byId("app").getModel('data').setData(data);
			sap.m.MessageToast.show('Valor de elemento agregado');

		}

	},

	addValuex: function(evt,obj){

		var oText = sap.ui.getCore().byId("oTxtValue");
		var oTextExt = sap.ui.getCore().byId("oTxtValueExt");
		var model = sap.ui.getCore().byId("app").getModel("data");
		var data  = model.getData();
		var groupid = "";
		var grouptitle = "";

		try {
			groupid = sap.ui.getCore().byId("oCmbGroupNew").getSelectedItem().getKey();
			grouptitle = sap.ui.getCore().byId("oCmbGroupNew").getSelectedItem().getText()
		}
		catch(err) {
		    //err
		}

		data.push({
			value: oText.getValue(),
			valueext: oTextExt.getValue(),
			groupid: groupid,
			grouptitle: grouptitle
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

	deleteAllValueDialog: function(evt){
		var that = this;
		var oTable    = sap.ui.getCore().byId('oValueTableNew');
		var app       = sap.ui.getCore().byId("app");

		try {
			var context = app.getModel('data').getData();

		} catch(ex){
			window.history.go(-1);
		}

		var dialog = new sap.m.Dialog({
	      title: 'Confirmación',
	      type: 'Message',
	      content: new sap.m.Text({ text: '¿Esta seguro de eliminar todos los valores del elemento?' }),
	      beginButton: new sap.m.Button({
	        text: 'Eliminar',
	        press: function () {
	          var json = []
			  var oModel = new sap.ui.model.json.JSONModel(json);
	    	  sap.ui.getCore().byId("app").setModel(oModel,'data');
    		  sap.m.MessageToast.show('Valores del elemento eliminados');

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

	addValuesSAPDialog: function(evt){

		var that = this;
		var oLblSAPTable    = new sap.m.Label({ text : "Tabla SAP" });
		var oTxtSAPTable    = new sap.m.Input({ id: "oTxtSAPTable", placeholder: "Ingresa el nombre de la tabla de SAP" });
		var oLblSAPCode     = new sap.m.Label({ text : "Campo código" });
		var oTxtSAPCode     = new sap.m.Input({ id: "oTxtSAPCode", placeholder: "Ingresa el campo de código de valor de la tabla SAP" });
		var oLblSAPDesc     = new sap.m.Label({ text : "Campo Descripción" });
		var oTxtSAPDesc     = new sap.m.Input({ id: "oTxtSAPDesc", placeholder: "Ingresa el campo de descripción de valor de la tabla SAP" });

		// Formulario de valores
		var oValueForm = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content:[oLblSAPTable,oTxtSAPTable,oLblSAPCode,oTxtSAPCode,oLblSAPDesc,oTxtSAPDesc ]
		}).addStyleClass("layPadding10");

		var dialog = new sap.m.Dialog({
		      title: 'Carga de valores desde Tablas SAP',
		      content:[oValueForm],
		      beginButton: new sap.m.Button({
		          text: 'Agregar',
		          press: function (evt) {
		        	that.loadValueDialog(evt);
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

	loadValueDialog: function(evt){


		var that = this;

		var oGroup = sap.ui.getCore().byId("oTxtGroupNew");

		var oParameters = {
	           "option" : 'get_values',
	           "table"	: sap.ui.getCore().byId("oTxtSAPTable").getValue(),
	           "code" 	: sap.ui.getCore().byId("oTxtSAPCode").getValue(),
	           "desc" 	: sap.ui.getCore().byId("oTxtSAPDesc").getValue(),
		};

		var oModel = new myJSONModel;

		var dialog = new sap.m.Dialog({
	      title: 'Confirmación',
	      type: 'Message',
	      content: new sap.m.Text({ text: 'Esta carga puede tomar un momento,¿Esta seguro continuar?' }),
	      beginButton: new sap.m.Button({
	        text: 'Cargar',
	        press: function () {

	        	// Llamo el metodo POST para crear los datos
		    		oModel.loadDataNew("http://ex3healthcare.softlayer.com:8000/sap/bc/ibmishc/abap_forms/field_services/", function(oData){

		    			console.log(oData)


    					var oGroup  = sap.ui.getCore().byId("oTxtGroupNew");
						var model   = sap.ui.getCore().byId("app").getModel("data");
						var data    = model.getData();

						for(i = 0; i<oData.length;i++){

							data.push({
								value: oData[i].value,
								valueext: oData[i].valueext,
								groupid: "",
								grouptitle: "",
							})
						}

						sap.ui.getCore().byId("app").getModel('data').setData(data);
				    	sap.m.MessageToast.show('Valores de elemento agregados desde SAP');

		    		},function(){
		    			sap.ui.commons.MessageBox.alert('Ocurrio un error agregando los valores desde SAP, por favor revise que la tabla y los campos ingresados existan.');
		    		},oParameters, true,'GET');

    		  sap.m.MessageToast.show('Agregando valores desde SAP');

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

	addGroupDialog: function(evt){

		var that = this;
		var oTxtValueExt  = new sap.m.Input({ id: "oTxtGroupNew", placeholder: "Ingresa el nombre del grupo" });

		// Formulario de valores
		var oValueForm = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content:[oTxtValueExt]
		}).addStyleClass("layPadding10");

		var dialog = new sap.m.Dialog({
		      title: 'Ingreso de grupo de valores',
		      content:[oValueForm],
		      beginButton: new sap.m.Button({
		          text: 'Agregar',
		          press: function (evt) {
		        	that.addGroup(evt);
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

	addGroup: function(evt){


		var oGroup = sap.ui.getCore().byId("oTxtGroupNew");
		var model = sap.ui.getCore().byId("app").getModel("groups");
		var data  = model.getData();
		var groupid = 0;

		if(data.length > 0){
			groupid = data[data.length - 1].groupid + 1
		}else{
			groupid = 1
		}

		data.push({
			grouptitle: oGroup.getValue(),
			fieldid:  	"",
			groupid: 	groupid
		})

		sap.ui.getCore().byId("app").getModel('groups').setData(data);
    	sap.m.MessageToast.show('Valor de elemento agregado');
	},

	deleteGroupDialog: function(evt){


		var that = this;
		var oTable    = sap.ui.getCore().byId('oTableGroupNew');
		var oListItem = evt.getParameters().listItem;
		var oPath     = oListItem.getBindingContextPath();
		var oId       = parseInt(oPath.substring(oPath.lastIndexOf('/') +1));
		var app       = sap.ui.getCore().byId("app");

		try {
			var context = app.getModel('groups').getData();

		} catch(ex){
			window.history.go(-1);
		}

		var dialog = new sap.m.Dialog({
	      title: 'Confirmación',
	      type: 'Message',
	      content: new sap.m.Text({ text: '¿Esta seguro de eliminar este grupo?' }),
	      beginButton: new sap.m.Button({
	        text: 'Eliminar',
	        press: function () {

	          context.splice(oId,1);
	    	  sap.ui.getCore().byId("app").getModel('groups').setData(context);
    		  sap.m.MessageToast.show('Grupo de valor eliminado');

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

	deleteAllGroupDialog: function(evt){


		var that = this;
		var oTable    = sap.ui.getCore().byId('oTableGroupNew');
		var app       = sap.ui.getCore().byId("app");

		try {
			var context = app.getModel('groups').getData();

		} catch(ex){
			window.history.go(-1);
		}

		var dialog = new sap.m.Dialog({
	      title: 'Confirmación',
	      type: 'Message',
	      content: new sap.m.Text({ text: '¿Esta seguro de eliminar estos los grupos?' }),
	      beginButton: new sap.m.Button({
	        text: 'Eliminar',
	        press: function () {

	          var json = []
			  var oModel = new sap.ui.model.json.JSONModel(json);
	    	  sap.ui.getCore().byId("app").setModel(oModel,'groups');
    		  sap.m.MessageToast.show('Grupos de valor eliminados');

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
		var oTxtTecName = sap.ui.getCore().byId("oTxtTecName").getValue();
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
	           "fieldtecname"		: oTxtTecName,
	           "fieldplaceholder" 	: oTxtPlace,
	           "fieldtype" 			: oCmbType,
	           "isvalues" 			: oIsvalue
		};

		// Obtengo datos del modelo de valores // data
		var data = sap.ui.getCore().byId("app").getModel('data').getData();

		if(data.length > 0){
			var valuesJson = JSON.stringify(data);
			valuesJson = valuesJson.replace(/"value":/g, 'value:');
			valuesJson = valuesJson.replace(/"valueext":/g, 'valueext:');
			valuesJson = valuesJson.replace(/"groupid":/g, 'groupid:');
			valuesJson = valuesJson.replace(/"grouptitle":/g, 'grouptitle:');
			oParameters.values = valuesJson
		}

		// Obtengo datos del modelo de grupos // data
		var groups = sap.ui.getCore().byId("app").getModel('groups').getData();
		if(groups.length > 0){
			// Obtengo datos del modelo de grupos // dataVal
			var valuesJsonG = JSON.stringify(groups);
			valuesJsonG = valuesJsonG.replace(/"groupid":/g, 'groupid:');
			valuesJsonG = valuesJsonG.replace(/"grouptitle":/g, 'grouptitle:');
			valuesJsonG = valuesJsonG.replace(/"fieldid":/g, 'fieldid:');
			valuesJsonG = valuesJsonG.replace(/"mandt":/g, 'mandt:');
			oParameters.groups = valuesJsonG
		}

		// Llamo el metodo POST para crear los datos
		oModel.loadDataNew("http://ex3healthcare.softlayer.com:8000/sap/bc/ibmishc/abap_forms/field_services/", function(oData){

			sap.m.MessageToast.show('El elemento fue exitosamente creado');
			that.clearData();

			// Consulto los datos actualizados
			var oModel2 = new myJSONModel;

			oModel2.loadDataNew("http://ex3healthcare.softlayer.com:8000/sap/bc/ibmishc/abap_forms/field_services/", function(oData){
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
		sap.ui.getCore().byId("oTxtTecName").setValue("");
		sap.ui.getCore().byId("oTxtTitle").setValue("");
		sap.ui.getCore().byId("oTxtPlace").setValue("");
		sap.ui.getCore().byId("oCmbType").setSelectedKey("TEXT");
		sap.ui.getCore().byId("app").getModel('data').setData([]);
		sap.ui.getCore().byId("app").getModel('groups').setData([]);
	},

	validateRequiredField: function(evt){

	    var view  = sap.ui.getCore();
	    var modelFields = view.byId("app").getModel("fields").getContext('/').oModel.oData;


	    // Armo el array de campos
	    var inputs = [
	      view.byId("oTxtTecName"),
	      view.byId("oTxtTitle")
	    ];

	    // Recorro cada campo para validar
	    jQuery.each(inputs, function (i, input) {

	        if (!input.getValue()) {
	          input.setValueState("Error");
	          input.setValueStateText("Campo obligatorio");
	        }
	        else{
	        	input.setValueState("None");
	        }


	        if(input.sId == "oTxtTecName"){
	        	jQuery.each(modelFields, function (j, data) {
	        		if(data.fieldtecname === input.getValue()){
	        		  input.setValueState("Error");
	      	          input.setValueStateText("El nombre del campo ya ha sido usado");
	        		}
	        	})
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

	    view.byId("btnSaveNewField").setEnabled(canContinue);


	}

});
