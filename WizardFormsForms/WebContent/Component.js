jQuery.sap.declare("ibm.wizardforms.forms.Component");

sap.ui.core.UIComponent.extend("ibm.wizardforms.forms.Component",{

	metadata: {

		routing: {

			config: {
				viewType: "JS",
				viewPath: "wizardformsforms",
				targetControl: "splitApp",
				clearTarget: false,
				transition: "slide"
			},

			routes: [
			         {
				         pattern: "",
				         name: "Default",
				         view: "FormsMaster",
				         targetAggregation: "masterPages",
				         subroutes: [
		                     {
		                    	 pattern: "",
							     name: "Blank",
							     view: "blanco",
							     targetAggregation: "detailPages",
		                     },
							{
								pattern: "create",
							    name: "FormCreate",
							    view: "FormCreate",
							    targetAggregation: "detailPages",
							}
				         ]
			         },

		         	 {
			        	 pattern: "form/{formIndex}",
				         name: "FormsVersions",
				         view: "FormsVersions",
				         targetAggregation: "masterPages",
				         subroutes: [
		                     {
		                    	 pattern: "form/{formIndex}/{versionIndex}",
							     name: "FormsDetail",
							     view: "FormsDetail",
							     targetAggregation: "detailPages",
							     subroutes: [
					                 {
					                	pattern: "form/{formIndex}/{versionIndex}/section/{sectionIndex}",
										name: "SectionsDetail",
										view: "SectionsDetail",
										targetAggregation: "detailPages",
										subroutes: [
										      {
										    	  pattern: "form/{formIndex}/{versionIndex}/section/{sectionIndex}/field/{fieldIndex}",
												  name: "FieldDetail",
												  view: "FieldDetail",
											      targetAggregation: "detailPages",
										      },
										      {
										    	  pattern: "form/{formIndex}/{versionIndex}/section/{sectionIndex}/subsection/{subSectionIndex}",
												  name: "SubSectionsDetail",
												  view: "SubSectionsDetail",
											      targetAggregation: "detailPages",
											      subroutes: [
												      {
												    	  pattern: "form/{formIndex}/{versionIndex}/section/{sectionIndex}/subsection/{subSectionIndex}/field/{fieldIndex}",
														  name: "SubFieldDetail",
														  view: "FieldDetail",
													      targetAggregation: "detailPages",
												      }
												]

										      }
										]
					                 }
							     ]
		                     },
				         ]
		         	}

	        ]

		}

	},

	init: function() {

		jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
		jQuery.sap.require("sap.ui.core.routing.HashChanger");

		//call createContent
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		this._router = this.getRouter();

		//initlialize the router
		this._routeHandler = new sap.m.routing.RouteMatchedHandler(this._router);
		this._router.initialize();


	},

	createContent: function() {

		var oView = sap.ui.view({
			id: "app",
			viewName: "wizardformsforms.App",
			type: "JS",
			viewData: {component: this}
		});


		// Formularios
		var oModel = new myJSONModel;

		oModel.loadDataNew("http://ex3healthcare.softlayer.com:8000/sap/bc/ibmishc/abap_forms/forms_services/", function(oData){

		},function(){
			sap.ui.commons.MessageBox.alert(arguments[0].statusText);
		});

		oView.setModel(oModel,'forms');
		oView.setModel(oModel,'formsOri');


		// Elementos
		var oModel2 = new myJSONModel;

		oModel2.loadDataNew("http://ex3healthcare.softlayer.com:8000/sap/bc/ibmishc/abap_forms/field_services/", function(oData){

		},function(){
			sap.ui.commons.MessageBox.alert(arguments[0].statusText);
		});

		oView.setModel(oModel2,'fields');


		// Ordenes
		var oParaOrders  = { "option" : "orders" };

		var oModel3 = new myJSONModel;

		oModel3.loadDataNew("http://ex3healthcare.softlayer.com:8000/sap/bc/ibmishc/abap_forms/forms_services/", function(oData){

		},function(){
			sap.ui.commons.MessageBox.alert(arguments[0].statusText);
		},oParaOrders);

		oView.setModel(oModel3,'orders');

		// Paquetes
		var oParaPackages  = { "option" : "packages" };

		var oModel4 = new myJSONModel;

		oModel4.loadDataNew("http://ex3healthcare.softlayer.com:8000/sap/bc/ibmishc/abap_forms/forms_services/", function(oData){

		},function(){
			sap.ui.commons.MessageBox.alert(arguments[0].statusText);
		},oParaPackages);

		oView.setModel(oModel4,'packages');

		// Imagenes
		var oModel5 = new myJSONModel;

		/*oModel5.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/images_data/images", function(oData){

		},function(){
			sap.ui.commons.MessageBox.alert(arguments[0].statusText);
		});*/

		oView.setModel(oModel5,'images');


		var json = []
		var oModel6 = new sap.ui.model.json.JSONModel(json);
		oView.setModel(oModel6,'rules');


		var jsonv = []
		var oModel7 = new sap.ui.model.json.JSONModel(jsonv);
		oView.setModel(oModel6,'versions');

		var jsons = []
		var oModel8 = new sap.ui.model.json.JSONModel(jsons);
		oView.setModel(oModel6,'secciones');






		return oView;

	},



})
