sap.ui.jsview("wizardformsfields.AddElement", {

	getControllerName : function() {
		return "wizardformsfields.AddElement";
	},

	createContent : function(oController) {
		var oList = new sap.m.List({
			id: "listIdD",
			mode: sap.m.ListMode.SingleSelect,
			select: function(){
				oController.itemSelected();
			}
		});
		
		var oItemTemplate = new sap.m.StandardListItem({
			id: "sList",
			title: "{data>value}",
			description: "{data>price}",
		});
		
		oList.bindAggregation("items","data>/",oItemTemplate);
		
		
		
 		return new sap.m.Page({
			title: "Products",
			content: [oList]
		});
	}

});