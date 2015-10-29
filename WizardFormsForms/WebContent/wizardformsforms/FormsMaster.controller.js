sap.ui.controller("wizardformsforms.FormsMaster", {

	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched,this);
	},

	_handleRouteMatched: function(evt){
		if(evt.getParameter("name") !== "FormsMaster"){
			return;
		}

	},

	fieldListItemPress: function(oEvent){
		var oBindingContext = oEvent.getSource().getBindingContext('forms');
		var path = oBindingContext.sPath;
		var start = path.lastIndexOf('/') + 1;
		var formIndex = path.substring(start,path.length);
		this.router.navTo("FormsVersions",{formIndex:formIndex});

	},

	onChangeSearch: function(evt){
		var filters = [];
		var query = evt.getParameter("newValue");

		// update list binding
		var list = this.getView().oList;
		var binding = list.getBinding("items");

		binding.filter( [ new sap.ui.model.Filter([
      new sap.ui.model.Filter("formtitle", sap.ui.model.FilterOperator.Contains, query ),
      new sap.ui.model.Filter("formtecname", sap.ui.model.FilterOperator.Contains, query )
   ],false)])

	},

	onBeforeRendering: function(){
		this.bindingList();
	},

	bindingList: function(){

		var that = this;

		this.getView().oList.bindItems({
			path: "forms>/",
			template: new sap.m.StandardListItem({
				icon:"sap-icon://form",
				title:"{forms>formtecname}",
				description:"{forms>formtitle}",
				type: sap.m.ListType.Navigation,
				press: function(evt){
					that.fieldListItemPress(evt);
				}
			})
		})
	},

	handleResponsivePopoverPress: function (oEvent) {
		var that = this;
	    if (! this._oPopover) {
	    	this._oPopover = new sap.m.ActionSheet({
	    		title: "Acciones formularios",
	    		showCancelButton: true,
	    		placement: "Bottom",
	    		buttons: [
	    		    new sap.m.Button({
	    		    	text: "Crear formulario",
	    		    	icon: "sap-icon://add",
	    		    	press:function(evt){
	    		    		ibm.wizardforms.forms.common.addNewPress(oEvent,that)
	    		    	}
	    		    }),
	    		    new sap.m.Button({
	    		    	text: "Duplicar formulario",
	    		    	icon: "sap-icon://duplicate",
	    		    	press:function(evt){
	    		    		that.duplicateForm(evt)
	    		    	}
	    		    }),
	    		    new sap.m.Button({
	    		    	text: "Crear orden de transporte",
	    		    	icon: "sap-icon://bus-public-transport",
	    		    	press:function(evt){
	    		    		that.createTransport(evt)
	    		    	}
	    		    }),
	    		]
	    	})

	      this.getView().addDependent(this._oPopover);
	    }

	    this._oPopover.openBy(oEvent.getSource());
	  },

    handleCloseButton: function (oEvent) {
	    this._oPopover.close();
    },

	duplicateForm: function(evt){

		var that 	= this;
	    var oModel  = new myJSONModel;

		that.formOri = new sap.m.Input({
	       	 id:"formOri",
	    	 enabled:true,
	    	 showValueHelp:true,
	    	 placeholder:"Seleccione el formulario origen",
	    	 valueHelpRequest: function(evt){
	    		 that.getForms(evt)
	    	 },
	    	 liveChange: function(evt){
        		 that.validateRequiredField(evt)
        	 }
		});

		that.oInputPackage = new sap.m.Input({
	       	 id:"formPackageNewDup",
	    	 enabled:true,
	    	 showValueHelp:true,
	    	 placeholder:"Seleccione el paquete del formulario",
	    	 valueHelpRequest: function(evt){
	    		 that.getPackages(evt)
	    	 },
	    	 liveChange: function(evt){
	    		 that.validateRequiredField(evt)
	    	 }
		});

		that.oInputOrders = new sap.m.Input({
	       	 id:"formOrderNewDup",
	    	 enabled:true,
	    	 showValueHelp:true,
	    	 placeholder:"Seleccione la orden de transporte",
	    	 valueHelpRequest: function(evt){
	    		 that.getTransportOrder(evt)
	    	 },
	    	 liveChange: function(evt){
	    		 that.validateRequiredField(evt)
	    	 }
		});

		// Formularios
		that.oInfoDuplicate = new sap.ui.layout.VerticalLayout({
			id: "oTypeVersion",
			width: "100%",
			placeholder: "Seleccione una opción",
			content:[
		         	new sap.m.Label({ text : "Formulario origen" }),
		         	that.formOri,
		         	new sap.m.Label({ text : "Formulario nuevo" }),
		         	new sap.m.Input({
		         		id:"formDest",
		         		placeholder:"Ingrese el nombre del nuevo formulario",
			   	    	liveChange: function(evt){
			           	  that.validateRequiredField(evt)
			           	}
		         	}),
		         	new sap.m.Label({text:"Paquete"}),
		         	that.oInputPackage,
			        new sap.m.Label({text:"Orden de transporte"}),
			        that.oInputOrders,
			]
		}).addStyleClass("layPadding10");


		var dialog = new sap.m.Dialog({
		      title: 'Duplicar formulario',
		      verticalScrolling: true,
			  contentWidth: "500px",
		      content:[that.oInfoDuplicate],
		      beginButton: new sap.m.Button({
		    	  id: "btnSaveNewDup",
		          text: 'Crear',
		          enabled: false,
		          press: function (evt) {


		      		var oParameters = {
		 	 	           "formori" 		: sap.ui.getCore().byId("formOri").getValue(),
		 	 	           "formdest"  		: sap.ui.getCore().byId("formDest").getValue(),
		 	 	           "order"	   		: sap.ui.getCore().byId("formOrderNewDup").getValue(),
		 	 	           "package"    	: sap.ui.getCore().byId("formPackageNewDup").getValue(),
		 	 	           "option"			: 'duplicate-form',
		      		};

		        	// Llamo el metodo POST para crear los datos
			    		oModel.loadDataNew("http://ex3healthcare.softlayer.com:8000/sap/bc/ibmishc/abap_forms/forms_services/", function(oData){

			    			sap.m.MessageToast.show('Formulario creado exitosamente');

			    			// Consulto los datos actualizados
			    			var oModel2 = new myJSONModel;

			    			oModel2.loadDataNew("http://ex3healthcare.softlayer.com:8000/sap/bc/ibmishc/abap_forms/forms_services/", function(oData){

			    				sap.ui.getCore().byId("app").getModel('forms').setData(oData);

				    			var model        = sap.ui.getCore().byId("app").getModel("forms").getContext('/');

				    			// Limpio los campos
				    	  		sap.ui.getCore().byId("formOri").setValue("");
				    	  		sap.ui.getCore().byId("formDest").setValue("");
				    	  		sap.ui.getCore().byId("formOrderNewDup").setValue("");
				    	  		sap.ui.getCore().byId("formPackageNewDup").setValue("");



			    			},function(){
			    				sap.m.MessageToast.show('Error creando el formulario');
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
	},

	validateRequiredField: function(evt){
		var that = this;
	    var view  = sap.ui.getCore();
	    var modelForm = view.byId("app").getModel("forms").getContext('/').oModel.oData;
	    var modelPack = view.byId("app").getModel("packages").getContext('/').oModel.oData;
	    var modelOrde = view.byId("app").getModel("orders").getContext('/').oModel.oData;

	    // Armo el array de campos
	    var inputs = [
	      view.byId("formPackageNewDup"),
	      view.byId("formOrderNewDup"),
	      view.byId("formOri"),
	      view.byId("formDest"),
	    ];

	    // Armo el array de campos
	    var inputsOT = [
	      view.byId("otDesc")
	    ];


	    // Recorro cada campo para validar

	    if(inputsOT.length){
		    jQuery.each(inputsOT, function (i, input) {
		    	if(input){
		    	    if (!input.getValue()) {
		    	    	input.setValueState("Error");
		    	    	input.setValueStateText("Campo obligatorio");
			        }
			        else{
			        	input.setValueState("None");
			        }

					// Valido si algun campo tiene error
				    var canContinueOT = true;
				    jQuery.each(inputsOT, function (i, input) {
				      if ("Error" === input.getValueState()) {
				    	  canContinueOT = false;
				        return false;
				      }
				    });

				    view.byId("btnSaveNewOT").setEnabled(canContinueOT);

		    	}
		    });


		};

	    // Recorro cada campo para validar
		if(inputs.length){
		    jQuery.each(inputs, function (i, input) {
		    	if(input){

			        if (!input.getValue()) {
			          input.setValueState("Error");
			          input.setValueStateText("Campo obligatorio");
			        }
			        else{
			        	input.setValueState("None");
			        }


			        if(input.sId == "formDest"){
			        	jQuery.each(modelForm, function (j, data) {
			        		if(data.formtecname === input.getValue()){
			        		  input.setValueState("Error");
			      	          input.setValueStateText("El nombre del formulario ya ha sido usado");
			        		}
			        	})
			        }

			        if(input.sId == "formOri"){
			        	input.setValueState("Error");
		    	        input.setValueStateText("Formulario invalido o inexistente");
			        	jQuery.each(modelForm, function (j, data) {
			        		if(data.formtecname === input.getValue()){
			        		  input.setValueState("None");
			        		}
			        	})
			        }


			        if(input.sId == "formPackageNewDup"){
			        	input.setValueState("Error");
		    	        input.setValueStateText("Paquete invalido o inexistente");
			        	jQuery.each(modelPack, function (j, data) {
			        		if(data.devclass === input.getValue()){
			        		  input.setValueState("None");
			        		}
			        	})
			        }

			        if(input.sId == "formOrderNewDup"){
			        	input.setValueState("Error");
		    	        input.setValueStateText("Orden invalida o inexistente");
			        	jQuery.each(modelOrde, function (j, data) {
			        		if(data.trkorr === input.getValue()){
			        			input.setValueState("None");
			        		}
			        	})
			        }

				    // Valido si algun campo tiene error
				    var canContinue = true;
				    jQuery.each(inputs, function (i, input) {
				      if ("Error" === input.getValueState()) {
				        canContinue = false;
				        return false;
				      }
				    });

				    view.byId("btnSaveNewDup").setEnabled(canContinue);

		    	}

		    });

		}

	},

	getPackages: function(evt){

		var that = this;

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
				that.validateRequiredField(evt)

		    },
		    confirm: function(evt){
		    	var oSelectedItem = evt.getParameter("selectedItem");

		        if (oSelectedItem) {
		          var packageInput =  sap.ui.getCore().byId("formPackageNewDup");
		          packageInput.setValue(oSelectedItem.getTitle());
		          packageInput.setValueState("None");

		        }
		        evt.getSource().getBinding("items").filter([]);
		    },
		    cancel: function(evt){
		    	var oSelectedItem = evt.getParameter("selectedItem");
		        if (oSelectedItem) {
		          var packageInput =  sap.ui.getCore().byId("formPackageNewDup");
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

		var that = this;

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
		          var orderInput =  sap.ui.getCore().byId("formOrderNewDup");
		          orderInput.setValue(oSelectedItem.getTitle());
		          orderInput.setValueState("None");
		        }
		        evt.getSource().getBinding("items").filter([]);
		        that.validateRequiredField(evt)
		    },
		    cancel: function(evt){
		    	var oSelectedItem = evt.getParameter("selectedItem");
		        if (oSelectedItem) {
		          var orderInput =  sap.ui.getCore().byId("formOrderNewDup");
		          orderInput.setValue(oSelectedItem.getTitle());
		        }
		        evt.getSource().getBinding("items").filter([]);
		    }
		});

		dialog.bindAggregation("items", "orders>/", itemTemplate);

	    this.getView().addDependent(dialog);
	    dialog.open();

	},

	getForms: function(evt){

		var itemTemplate = new sap.m.StandardListItem({
			title: "{forms>formtecname}",
			description: "{forms>formtitle}",
			active: true
		});

		var dialog = new sap.m.SelectDialog({
			title:"Formularios",
		    class:"sapUiPopupWithPadding",
		    liveChange: function(evt){

		    	var filters = [];
				var query = evt.getParameter("value");
				if (query && query.length > 0) {
					var filter = new sap.ui.model.Filter("formtitle", sap.ui.model.FilterOperator.Contains, query);
					filters.push(filter);
				}
				evt.getSource().getBinding("items").filter(filters);

		    },
		    confirm: function(evt){
		    	var oSelectedItem = evt.getParameter("selectedItem");
		        if (oSelectedItem) {
		          var orderInput =  sap.ui.getCore().byId("formOri");
		          orderInput.setValue(oSelectedItem.getTitle());
		        }
		        evt.getSource().getBinding("items").filter([]);
		    },
		    cancel: function(evt){
		    	var oSelectedItem = evt.getParameter("selectedItem");
		        if (oSelectedItem) {
		          var orderInput =  sap.ui.getCore().byId("formOri");
		          orderInput.setValue(oSelectedItem.getTitle());
		        }
		        evt.getSource().getBinding("items").filter([]);
		    }
		});

		dialog.bindAggregation("items", "forms>/", itemTemplate);

	    this.getView().addDependent(dialog);
	    dialog.open();

	},

	createTransport: function(evt){

		var that 	= this;
	    var oModel  = new myJSONModel;

		// Formularios
		that.oInfoDuplicate = new sap.ui.layout.VerticalLayout({
			width: "100%",
			//placeholder: "Crear orden de tranporte",
			content:[
		         	new sap.m.Label({ text : "Descripción de la orden" }),
		         	new sap.m.Input({
		         		id:"otDesc",
		         		placeholder:"Ingrese una descripción para la orden",
		         		liveChange: function(evt){
		         			that.validateRequiredField(evt)
		         		}
		         	})
			]
		}).addStyleClass("layPadding10");


		var dialog = new sap.m.Dialog({
		      title: 'Crear orden de transporte',
		      verticalScrolling: true,
			  contentWidth: "500px",
		      content:[that.oInfoDuplicate],
		      beginButton: new sap.m.Button({
		    	  id: "btnSaveNewOT",
		          text: 'Crear',
		          enabled: false,
		          press: function (evt) {


		      		var oParameters = {
		 	 	           "text" 		: sap.ui.getCore().byId("otDesc").getValue(),
	 	 	               "option"		: 'create-ot',
		      		};

		        	// Llamo el metodo POST para crear los datos
			    		oModel.loadDataNew("http://ex3healthcare.softlayer.com:8000/sap/bc/ibmishc/abap_forms/forms_services/", function(oData){

			    			sap.m.MessageToast.show('Orden creada exitosamente');


			    			// Ordenes
			    			var oParaOrders  = { "option" : "orders" };

			    			var oModel2 = new myJSONModel;

			    			oModel2.loadDataNew("http://ex3healthcare.softlayer.com:8000/sap/bc/ibmishc/abap_forms/forms_services/", function(oData){

		    					sap.ui.getCore().byId("app").getModel('orders').setData(oData);

				    			var model = sap.ui.getCore().byId("app").getModel("orders").getContext('/');

				    			// Limpio los campos
				    	  		sap.ui.getCore().byId("otDesc").setValue("");

			    			},function(){
			    				sap.ui.commons.MessageBox.alert(arguments[0].statusText);
			    			},oParaOrders);




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
	},

});
