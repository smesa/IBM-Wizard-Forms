jQuery.sap.declare("ibm.wizardforms.forms.common");

ibm.wizardforms.forms.common = {
		
		addNewPress: function(evt,obj){
			var router = sap.ui.core.UIComponent.getRouterFor(obj);
			router.navTo("FormCreate");	
		}
		
}