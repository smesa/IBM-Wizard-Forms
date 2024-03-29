sap.ui.controller("wizardformsfields.Fields", {

	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched,this);
	},

	_handleRouteMatched: function(evt){
		if(evt.getParameter("name") !== "Fields"){
			return;
		}
		//var context = sap.ui.getCore().byId("app").getModel('fields').getContext('/');
		//this.getView().setBindingContext(context,'fields');

	},

	fieldListItemPress: function(oEvent){
		var oBindingContext = oEvent.getSource().getBindingContext('fields');
		var path = oBindingContext.sPath;
		var start = path.lastIndexOf('/') + 1;
		var fieldIndex = path.substring(start,path.length);
		this.router.navTo("FieldsInfo",{fieldIndex:fieldIndex});

	},

	onChangeSearch: function(evt){
		var filters = [];
		var query = evt.getParameter("newValue");

		// update list binding
		var list = this.getView().oList;
		var binding = list.getBinding("items");

		binding.filter( [ new sap.ui.model.Filter([
			new sap.ui.model.Filter("fieldtitle", sap.ui.model.FilterOperator.Contains, query ),
			new sap.ui.model.Filter("fieldtecname", sap.ui.model.FilterOperator.Contains, query )
	  ],false)])

	},

	onBeforeRendering: function(){
		this.bindingList();
	},

	bindingList: function(){

		var that = this;

		this.getView().oList.bindItems({
			path: "fields>/",
			template: new sap.m.StandardListItem({
				icon:"{fields>fieldicon}",
				title:"{fields>fieldtecname}",
				description:"{fields>fieldtitle}",
				type: sap.m.ListType.Navigation,
				press: function(evt){
					that.fieldListItemPress(evt);
				}
			})
		})
	}



});
