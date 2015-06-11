jQuery.sap.declare("ibm.wizardforms.mime.Component");

sap.ui.core.UIComponent.extend("ibm.wizardforms.mime.Component", {
	
	metadata: {
		
		routing: {
			
			config: {
				
				viewType: "JS",
				viewPath: "wizardformsmime",
				targetControl: "splitApp",
				clearTarget: false,
				transition: "slide"
				
			},
			 routes: [
			 
			    {
			    	
			    	pattern: "",
			    	name: "default",
			    	view: "Images",
			    	targetAggregation: "masterPages",
			    	subroutes: [
			    	            
			    	   {
			    		   
			    		   pattern: "",
					       name: "welcome",
					       view: "Initial",
					       targetAggregation: "detailPages", 
					       
			    		   
			    	   }         
			    	            
    	            ]
			    	
			    },
			    
			   {
			    	
			    	pattern: "product/{prdIndex}",
			    	name: "product",
			    	view: "Data",
			    	targetAggregation: "detailPages",
			    	
			   }
			          
	         ]
			
			
		}
		
	},
	
	init: function(){
		
		  jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
		  jQuery.sap.require("sap.ui.core.routing.HashChanger");
		  
		  //call createContent
		  sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
		  
		  this._router = this.getRouter();
		  
		  //initlialize the router
		  this._routeHandler = new sap.m.routing.RouteMatchedHandler(this._router);
		  this._router.initialize();
		
	},
	
	createContent: function(){
		
		var oView = sap.ui.view({
			
			id: "app",
			viewName: "pruebaui.App",
			type: "JS",
			viewData: { component: this }
			
		});
		
		var oModel = new sap.ui.model.json.JSONModel("model/Product.json");
		
		oView.setModel(oModel, "products"); // contexto de datos, modelo
		
        return oView;
		
	}
	
});
