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
		if (query && query.length > 0) {
			var filter = new sap.ui.model.Filter("formtitle", sap.ui.model.FilterOperator.Contains, query);
			filters.push(filter);
			//var filter = new sap.ui.model.Filter("formid", sap.ui.model.FilterOperator.Contains, query);
			filters.push(filter);		}
		
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
			path: "forms>/",
			template: new sap.m.StandardListItem({
				icon:"sap-icon://form",
				title:"Formulario N°. {forms>formid}",
				description:"{forms>formtitle}",
				type: sap.m.ListType.Navigation,
				press: function(evt){
					that.fieldListItemPress(evt);
				}
			})
		})		
	}

});