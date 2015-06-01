jQuery.sap.declare("ibm.wizardforms.fields.common");

ibm.wizardforms.fields.common = {
		
		addNewPress: function(evt,obj){
			var router = sap.ui.core.UIComponent.getRouterFor(obj);
			router.navTo("FieldsCreate");	
		}
		
}