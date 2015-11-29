jQuery.sap.declare("ibm.wizardforms.fields.Component");

sap.ui.core.UIComponent.extend("ibm.wizardforms.fields.Component",{

	metadata: {

		routing: {

			config: {
				viewType: "JS",
				viewPath: "wizardformsfields",
				targetControl: "splitApp",
				clearTarget: false,
				transition: "slide"
			},

			routes: [
			         {
				         pattern: "",
				         name: "default",
				         view: "Fields",
				         targetAggregation: "masterPages",
				         subroutes: [
				                     {
				                    	 pattern: "",
									     name: "Blank",
									     view: "blank",
									     targetAggregation: "detailPages",
				                     },
				                     {
							        	 pattern: "FieldsCreate",
								         name: "FieldsCreate",
								         view: "FieldsCreate",
								         targetAggregation: "detailPages",
							         },
				                     {
				                    	 pattern: "field/{fieldIndex}",
									     name: "FieldsInfo",
									     view: "FieldsInfo",
									     targetAggregation: "detailPages",
				                     }
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
			viewName: "wizardformsfields.App",
			type: "JS",
			viewData: {component: this}
		});


		var oModel = new myJSONModel;

		oModel.loadDataNew("/sap/bc/ibmformwizard/fields_data/fields/", function(oData){
			console.log('Consulta de campos ok')
		},function(){
			sap.ui.commons.MessageBox.alert(arguments[0].statusText);
		});

		oView.setModel(oModel,'fields');


		var json = []
		var oModel2 = new sap.ui.model.json.JSONModel(json);
		oView.setModel(oModel2,'data');

		var json2 = []
		var oModel3 = new sap.ui.model.json.JSONModel(json2);
		oView.setModel(oModel3,'groups');


		return oView;

	},



})
