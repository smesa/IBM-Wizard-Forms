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
					       
			    		   
			    	   } ,
{
			    		   
							pattern: "create",
						    name: "MimeCreate",
						    view: "MimeCreate",
						    targetAggregation: "detailPages",
					       
			    		   
			    	   } ,
			    	   
					   {
					    	
					    	pattern: "image/{imageIndex}",
					    	name: "image",
					    	view: "Data",
					    	targetAggregation: "detailPages",
					    	
					   }			    	            
    	            ]
			    	
			    },
			          
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
			viewName: "wizardformsmime.App",
			type: "JS",
			viewData: { component: this }
			
		});
		
		var oModel = new myJSONModel;
		
		oModel.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/images_data/images/", function(oData){
			
		},function(){
			sap.ui.commons.MessageBox.alert(arguments[0].statusText);
		});
		
		oView.setModel(oModel,'images');	
		
        return oView;
		
	}
	
});
