sap.ui.controller("wizardformsmime.Images", {

	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched,this);
	},
	
	_handleRouteMatched: function(evt){
		if(evt.getParameter("name") !== "Images"){
			return;
		}
		
	},
	
	listItemPress: function(oEvent){
		
		// Reacciones para el momento de presionar alguno de los elementos de la lista
		var oBindingContext = oEvent.getSource().getBindingContext('images');
		var path = oBindingContext.sPath;
		var start = path.lastIndexOf('/') + 1;
		var imageIndex = path.substring(start,path.length);	
        // La ruta o el dato entre comillas debe hacer referencia a el nombre que se le asigno a la vista en el objeto Component.js
		this.router.navTo("image",{imageIndex:imageIndex}); 
		//this.router.navTo("image",{
			
			//prdIndex: imageIndex
		//})
		
	},	
	
	onChangeSearch: function(evt){
		// Reacciones para el campo de búsqueda de la lista
		var filters = [];
		var query = evt.getParameter("newValue");
		if (query && query.length > 0) {
			var filter = new sap.ui.model.Filter("namefld", sap.ui.model.FilterOperator.Contains, query);
			filters.push(filter);
	}
		
		// update list binding
		var list = this.getView().oList;
		var binding = list.getBinding("items");
		binding.filter(filters);
	},

	onBeforeRendering: function(){
		this.bindingList();
	},
	
	bindingList: function(){
		
		var that = this;
		
		this.getView().oList.bindItems({
			path: "images>/",
			template: new sap.m.StandardListItem({
				//icon:"sap-icon://form",
				title:"{images>namefld}",
				description:"{images>descpfld}",
				type: sap.m.ListType.Navigation,
				press: function(evt){
					that.listItemPress(evt);
				}
			})
		})		
	}

});