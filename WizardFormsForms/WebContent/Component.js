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
		                    	 pattern: "",
							     name: "Blank",
							     view: "blank",
							     targetAggregation: "detailPages",
		                     },
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
		
		
		var oModel = new myJSONModel;
		
		oModel.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/forms_data/forms/", function(oData){
			
		},function(){
			sap.ui.commons.MessageBox.alert(arguments[0].statusText);
		});
		
		oView.setModel(oModel,'forms');	
		
		
		var oModel2 = new myJSONModel;
		
		oModel2.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/fields_data/fields/", function(oData){
			
		},function(){
			sap.ui.commons.MessageBox.alert(arguments[0].statusText);
		});
		
		oView.setModel(oModel2,'fields');	
		
		
		var oParaOrders  = { "option" : "orders" };  
		
		var oModel3 = new myJSONModel;
		
		oModel3.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/forms_data/forms/", function(oData){
			
		},function(){
			sap.ui.commons.MessageBox.alert(arguments[0].statusText);
		},oParaOrders);
		
		oView.setModel(oModel3,'orders');	
		
		
		var oParaPackages  = { "option" : "packages" };  
		
		var oModel4 = new myJSONModel;
		
		oModel4.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/forms_data/forms/", function(oData){
			
		},function(){
			sap.ui.commons.MessageBox.alert(arguments[0].statusText);
		},oParaPackages);
		
		oView.setModel(oModel4,'packages');	
		
		
		return oView;
		
	},

	
	
})
