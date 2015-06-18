// Este archivo se debe crear de forma manual es uno de los controladores del programa

jQuery.sap.declare("ibm.wizardforms.mime.common");

ibm.wizardforms.mime.common = {
		
		addNewPress: function(evt,obj){
			var router = sap.ui.core.UIComponent.getRouterFor(obj);
			router.navTo("MimeCreate");	
		}
		
}