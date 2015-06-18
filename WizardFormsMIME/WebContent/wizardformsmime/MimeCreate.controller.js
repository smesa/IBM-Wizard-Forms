sap.ui.controller("wizardformsmime.MimeCreate", {

	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched,this);
	},
	
	_handleRouteMatched: function(evt){
		if(evt.getParameter("name") !== "FormCreate"){
			return;
		}
	},
	
	saveData: function(evt){
		
		var that = this;
		 
		// images se define en el Component
		var model        = sap.ui.getCore().byId("app").getModel("images").getContext('/');		
  		var data         = model.getProperty(model.sPath);    		
  		var oModel       = new myJSONModel;
  		var namefld      = sap.ui.getCore().byId("mimeName").getValue();
  		var fldlength    = sap.ui.getCore().byId("mimeSize").getValue();
  		var descpfld     = sap.ui.getCore().byId("mimeDescp").getValue();
  		var imgWidth     = sap.ui.getCore().byId("imageMime").getWidth();
  		var imgHeight    = sap.ui.getCore().byId("imageMime").getHeight();
  		var image        = sap.ui.getCore().byId("imageMime").getSrc();
  		
  		// Asigna los parametros que se le entregaran a SAP
  		var oParameters = {
 	           "namefld" 		    : namefld,
 	           "descpfld"           : descpfld,
 	           "imagen"             : image,
 	           "fldlength"          : fldlength
 		};
  		
  		// Se define la variable de proceso en espera
  		var busyDialog = new sap.m.BusyDialog();
  		
  		// se ajusta la información para cargarla a SAP
  		
  		var dialog = new sap.m.Dialog({
		      title: 'Confirmación',
		      type: 'Message',
		      content: new sap.m.Text({ text: '¿Esta seguro que desea cargar esta imagen?' }),
		      beginButton: new sap.m.Button({
		        text: 'Aceptar',
		        press: function () {	
		        
		      		// limpia el campo indicado
			      		sap.ui.getCore().byId("mimeName").setValue("");
			      		sap.ui.getCore().byId("mimeSize").setValue("");
			      		sap.ui.getCore().byId("mimeDescp").setValue("");
			      		sap.ui.getCore().byId("imageMime").setSrc("");
			      		sap.ui.getCore().byId("mimeUploader").setValue("");

		    		// Llamo el metodo POST para crear los datos
		    		oModel.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/images_data/images/", function(oData){
		    			
		    			// Consulto los datos actualizados			
		    			var oModel2 = new myJSONModel;
		    			
		    			oModel2.attachRequestSent(function(){busyDialog.open();}); 
		    			oModel2.attachRequestCompleted(function(){busyDialog.close();}); 	
		    			
		    			oModel2.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/images_data/images/", function(oData){
		    				sap.ui.getCore().byId("app").getModel('images').setData(oData);
		    				
			    			var model        = sap.ui.getCore().byId("app").getModel("images").getContext('/');		
			    	  		var data         = model.getProperty(model.sPath);  
			    	  		var newLength    = data.length;
			    	  		
			    	  		/*
			    	  		if(newLength > actLength){
			    	  			newLength = newLength - 1;
			    	  			that.router.navTo("image",{formIndex:newLength,versionIndex: '0'});
			    	  		}*/
			    	  		sap.m.MessageToast.show('Los datos fueron guardados con exito');
			    	  		that.router.navTo("Blank");
		    				
		    			},function(){
		    				sap.m.MessageToast.show('Error creando el elemento');
		    			});		
		    			

		    			
		    		},function(){
		    			sap.ui.commons.MessageBox.alert(arguments[0].statusText);
		    		},oParameters, true,'POST');	
	    		  
		          dialog.close();
		        }
		      }),
		      endButton: new sap.m.Button({
		        text: 'Cancelar',
		        press: function () {
		          dialog.close();
		        }
		      }),
		      afterClose: function() {
		        dialog.destroy();
	      }
	    });

	    dialog.open();	
		
	},
	
	uploadData: function(evt){
		
		/*
		var file = sap.ui.getCore().byId("mimeUploader").getValue();
		console.log(file);
		*/

		  //Obtengo lo que se cargo
		  var file = jQuery.sap.domById(sap.ui.getCore().byId("mimeUploader").getId() + "-fu").files[0]; 
		  
		  //Creo un Reader de lo que se cargo
		  var reader = new FileReader();
		  
		  //Implemento el metodo de onload del reader
		  reader.onload = function (loadEvent) {
		         //Muevo el valor de la imagen en base 64
		         var result = loadEvent.target.result;
		         var fdsize = loadEvent.loaded;
		         
		         var image = sap.ui.getCore().byId("imageMime").setSrc(result);
		         var size  = sap.ui.getCore().byId("mimeSize").setValue(fdsize);
		         var imagedat = sap.ui.getCore().byId("mimeUploader").getWidth();
		         
		        };
		  
		  //LLamo la carga desde la URL
		  reader.readAsDataURL( file );
		
	}

});