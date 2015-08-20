angular.module('input', ['ngRoute', 'mgcrea.ngStrap'])
 

.config(function($routeProvider, $datepickerProvider) {
  $routeProvider
    .when('/', {      
      templateUrl:'views/input.html',
      controller:'PreviewCtrl'
    })
    .when('/get/:formid/:verformid/:inputs', {      
      templateUrl:'views/input.html',
      controller:'InputCtrl'
    })
    .otherwise({
      redirectTo:'/'
    });
  
  angular.extend($datepickerProvider.defaults, {
	    dateFormat: 'dd/MM/yyyy',
	    startWeek: 1
  });
  
  // Calendario en español
  $.fn.datepicker.dates['ES'] = {
		    days: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
		    daysShort: ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"],
		    daysMin: ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"],
		    months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
		    monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
		    today: "Hoy",
		    clear: "Borrar"
	};
  
})

.controller('InputCtrl', function($scope, $compile, $routeParams, $http) {
	
	
	var formid 			= $routeParams.formid;
	var verformid		= $routeParams.verformid;
	var inputs          = $routeParams.inputs;
	var panel 			= $("#ppal");
	
	$scope.message 		= "Prueba de mensaje";

	
	
	$scope.submit = function(){
		
		var dataSave = formid + '#-|-#' + verformid + '#-|-#';
		
		angular.forEach($scope.data.versions[0].sections, function(section){
			
			angular.forEach(section.fields, function(field){				
				dataSave = dataSave +  field.fieldid + '#-:-#' + $scope['model'+field.fieldid] + '#-,-#';					
			})	
		})
		
		dataSave = dataSave.substring(0, dataSave.length - 5);
		
		var sURL  = 'http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/forms_data/forms';
		var oParameters = {
	           "data" 			: dataSave,
	           "option"		    : 'save-data',
	           "_method"		: 'POST',
		 };
	
		jQuery.ajax({
			  url: sURL,
			  async: true,
			  dataType: 'json',
			  data: oParameters,
			  type: 'GET',
			  
			  success: function(oData) {
				  
				  if(oData[0].messagetype == 'S'){
					  $scope.message = oData[0].message ;
					  $('#modalok').modal('show')
				  }else{
					  $('#modalerror').modal('show')
				  }		
				  
				  angular.forEach($scope.data.versions[0].sections, function(section){
						
						angular.forEach(section.fields, function(field){				
							$scope['model'+field.fieldid] = ' ';				
						})	
				  })
				  
				  $scope.$apply();

			  },
			  error: function(XMLHttpRequest, textStatus, errorThrown){
				  
				  $scope.message = "The following problem occurred: " + textStatus, XMLHttpRequest.responseText + ","	+ XMLHttpRequest.status + "," + XMLHttpRequest.statusText;
				  $('#modalerror').modal('show')
			  }
		});
		
	}
	
	$scope.change = function(id){
		
		var find = false;
		var cond = [];
		var stringcond = "";
		
		
		angular.forEach($scope.data.versions[0].rules, function(rule){
			
			if(rule.field ==  id.substring(5,10)){
				find = true;
			}			
			
			
			if(find === true){
				
				find = false;
				
				var strCond = 'if(';
				var fieldasig = '';
				var fieldasig_aux = '';
				var valueasig = '';
				
				angular.forEach($scope.data.versions[0].rules, function(rule_aux){
					
					if(rule_aux.fieldasig == rule.fieldasig){		
						
						var field  = $scope['model'+rule_aux.field]
						var option = rule_aux.option;
						var value = rule_aux.value
						var conector = rule_aux.connector;
						
						fieldasig = 'model'+ rule_aux.fieldasig;
						fieldasig_aux = rule_aux.fieldasig;
						valueasig = rule_aux.valueasig;
						
						switch (option) {
							case 'EQ':
								option = '==';
								break;
							case 'NE':
								option = '!=';
								break;
							case 'GT':
								option = '>';
								break;
							case 'LT':
								option = '<';
								break;
							case 'GE':
								option = '>=';
								break;
							case 'LE':
								option = '<=';
								break;
						}	
						
						switch (conector) {
							case 'AND':
								conector = '&&';
								break;
							case 'OR':
								conector = '||';
								break;
						}	
						
						strCond = strCond + ' "' + field + '" ' + option + ' "' + value + '" ' + conector;				

					}
					
				})		
				
				var isTrue = false;
				strCond = strCond + ')';
				
				strCond = strCond +  '{ isTrue = true }';
				
				eval(strCond);
				
				if(isTrue){
					switch (valueasig) {
					case 'REQUIRED':
						var idx = fieldasig_aux;
						document.getElementById(idx).required = true;   
						break;
					default:
						$scope[fieldasig] = valueasig;
						break;
					}					
				}else{
					var idx = fieldasig_aux;
					var bool = true;
					
					if(document.getElementById(idx).attributes.isRequired.value == 'true'){
						bool = true
					}else if (document.getElementById(idx).attributes.isRequired.value == 'false'){ 
						bool = false
					}else if (document.getElementById(idx).attributes.isRequired.value == true){
						bool = true
					}else if (document.getElementById(idx).attributes.isRequired.value == false){
						bool = true
					}
						
					document.getElementById(idx).required = bool
				}				
				
			}
			
		} )	
		
	}
	
	var sURLInit  = 'http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/forms_data/forms';
	var oParameters = {
           "inputs" 		: inputs,
           "option"		    : 'event_init',
           "formid"			: formid,
           "_method"		: 'GET',
	 };

	jQuery.ajax({
		  url: sURLInit,
		  async: true,
		  dataType: 'json',
		  data: oParameters,
		  type: 'GET',
		  
		  success: function(oData) {
			  
			  console.log(oData)
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown){
			  
			  $scope.message = "The following problem occurred: " + textStatus, XMLHttpRequest.responseText + ","	+ XMLHttpRequest.status + "," + XMLHttpRequest.statusText;
			  $('#modalerror').modal('show')
		  }
	});	
	

	var sURL  = 'http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/forms_data/forms?formid=' + formid + '&verformid=' + verformid;
	
	this.valor = 'Si lo hace yeah';
		
	$http.get( sURL ).
		success(function(list){
			list 							= list[0];
			$scope.data 					= list;
			$scope.data.logoimg 			= list.versions[0].logoimg;
			$scope.data.colorfondo 			= list.versions[0].colorfondo;
			$scope.data.colorhead 			= list.versions[0].colorhead;
			$scope.data.colorbase 			= list.versions[0].colorbase;
			$scope.data.colorsections 		= list.versions[0].colorsections;
			$scope.data.showtitle 			= list.versions[0].showtitle;
			$scope.data.sizetitlehead 		= list.versions[0].sizetitlehead;
			$scope.data.showtitlesection 	= list.versions[0].showtitlesection;
			$scope.data.sizetitlesections 	= list.versions[0].sizetitlesections;			
			
			
			// Se muestra titulo
			if($scope.data.showtitle === true){				
				var headerTitle	= $("#headerTitle");
				var titleElem = '<' + $scope.data.sizetitlehead + '><span>' + $scope.data.formtitle + '</span></' + $scope.data.sizetitlehead + '>';
				headerTitle.append(titleElem);				
			}			
			
			// Color base
			try{
				document.body.style.backgroundColor = list.versions[0].colorbase;
			}catch(err){}
			
			
			
			// Color fondo
			try{
				document.getElementById('panel').style.border = 'none';
				document.getElementById('panel').style.backgroundColor = $scope.data.colorfondo;
			}catch(err){}
			
			
			// Color 
			try{
				document.getElementById('panel-head').style.border = 'none';
				document.getElementById('panel-head').style.backgroundColor = $scope.data.colorhead;
			}catch(err){}		
			
			// Color de modal
			try{
				document.getElementById('modal-content-ok').style.border = 'none';
				document.getElementById('modal-content-ok').style.backgroundColor = $scope.data.colorsections;
			}catch(err){}	
			
			
			// Recorro las secciones
			angular.forEach(list.versions[0].sections, function(section){				
				
				var titlesection = ""
					
				// Agrego la seccion al panel
				if($scope.data.showtitlesection){
					var titlesection = section.sectiontitle
				}
				
				var elmsection = '<div class="panel panel-default" style="border: none;"><div class="panel-heading"style="border: none;background-image:none; background-color: ' + 
					$scope.data.colorsections + ';"><'+$scope.data.sizetitlesections+' >'+titlesection+'</'+$scope.data.sizetitlesections+'></div><div class="panel-body" id="'+
					list.formid + section.sectionid+'"></div></div>';
				
  				panel.append(elmsection);
  				
  				
  				//# de columnas
  				switch(section.sectioncolumn) {
	  			    case '1':
	  			    	section.sectioncolumn = 'col-md-12 col-sm-12'
	  			        break;
	  			    case '2':
	  			    	section.sectioncolumn = 'col-md-6 col-sm-6'
	  			        break;
	  			    case '3':
	  			    	section.sectioncolumn = 'col-md-4 col-sm-4'
	  			    		break;
	  			    case '4':
	  			    	section.sectioncolumn = 'col-md-3 col-sm-3'
	  			    		break;
  				}
  				
  				
  				// Agrego los campos
  				angular.forEach(section.fields, function(field){
  					

  					// Elemento padre osea la seccion
  					var nameelmparent = list.formid + section.sectionid;
  					var elm = $('#'+nameelmparent);

  					// Evaluo que tipo de elemento es
  					switch(field.fieldtype) {
					    case 'TEXT':
					        addInput(elm,field,list.formid,section,$scope, $compile);
					        break;
					    case 'CALE':
					    	addDate(elm,field,list.formid,section,$scope, $compile);
					        break;
					    case 'TIME':
					    	addTime(elm,field,list.formid,section, $scope, $compile);
					        break;
					    case 'RADIO':
					        addRadio(elm,field,list.formid,section, $scope, $compile);
					        break;
					    case 'CHECK':
					        addCheck(elm,field,list.formid,section, $scope, $compile);
					        break;
					    case 'COMBO':
					        addCombo(elm,field,list.formid,section, $scope, $compile);
					        break;
					    default:
					        addInput(elm,field,list.formid,section, $scope, $compile);
					}  					

  				})
				
			})		
			
			
		});	
});

function addInput(elmparent,field,formid,seccion,$scope, $compile){	
	
	// Creo el DIV del Input
	var newDiv 				= document.createElement('div');
	newDiv.className 		= 'form-group ' +seccion.sectioncolumn;
	
	// Agrego un label
	var newLabel 			= document.createElement('label');
	newLabel.innerHTML  	= field.fieldtitle;	

	// Creo el Input con sus propiedades
	var newInput 			= document.createElement('input');
	newInput.type 			= 'text';
	newInput.id   			=  field.fieldid;
	newInput.className  	= 'form-control';
	newInput.placeholder 	= field.fieldplaceholder;
	newInput.required 		= field.isrequired;	
	
	// Nombre del modelo
	var model = 'model' + field.fieldid;
	
	// Le agrego modelo y evento change
	newInput.setAttribute("ng-change","change('"+ model +"')");
	newInput.setAttribute("ng-model", model );
	newInput.setAttribute("isRequired", field.isrequired );
	
	
	$compile(newInput)($scope);

	// Adiciono a el div
	newDiv.appendChild(newLabel);
	newDiv.appendChild(newInput);
	
	// Agrego al parent
	elmparent.append(newDiv);
}


function addDate(elmparent,field,formid,seccion,$scope, $compile){	

	var newDiv = document.createElement('div');
	newDiv.className = 'form-group ' +seccion.sectioncolumn;


	var newLabel 		= document.createElement('label');
	newLabel.innerHTML  = field.fieldtitle;	

	var divTime = document.createElement('div');
	divTime.className = 'input-group clockpicker';
	
	var newInput = document.createElement('input');
	newInput.type = 'text';
	newInput.id   =  field.fieldid;
	newInput.className  = 'form-control';
	newInput.placeholder = field.fieldplaceholder;
	newInput.required = field.isrequired;
	
	// Nombre del modelo
	var model = 'model' + field.fieldid;
	
	// Le agrego modelo y evento change
	newInput.setAttribute("ng-change","change('"+ model +"')");
	newInput.setAttribute("ng-model", model );
	newInput.setAttribute("isRequired", field.isrequired );
	
	$compile(newInput)($scope);
	
	var span = document.createElement('span');
	span.className = 'input-group-addon';
	
	var span2 = document.createElement('span');
	span2.className = 'glyphicon glyphicon-calendar';


	span.appendChild(span2);
	divTime.appendChild(newInput);
	divTime.appendChild(span);
	
	newDiv.appendChild(newLabel);
	newDiv.appendChild(divTime);

	elmparent.append(newDiv);
	
	// Lo pongo como date picker
	$('#' + newInput.id).datepicker({
		language: 'ES',
		todayHighlight: true,
		enableOnReadonly: true,
		format: "dd/mm/yyyy",
		keyboardNavigation: false,
		autoclose: true
	});
}

function addTime(elmparent,field,formid,seccion, $scope, $compile){	

	var newDiv = document.createElement('div');
	newDiv.className = 'form-group ' +seccion.sectioncolumn;
	
	var newLabel 		= document.createElement('label');
	newLabel.innerHTML  = field.fieldtitle;	
	
	var divTime = document.createElement('div');
	divTime.className = 'input-group clockpicker';	
	divTime.setAttribute("data-placement","right");
	divTime.setAttribute("data-align","top");
	divTime.setAttribute("data-autoclose","true");
	
	var newInput = document.createElement('input');
	newInput.type = 'text';
	newInput.id   =  field.fieldid;
	newInput.className  = 'form-control';
	newInput.placeholder = field.fieldplaceholder;
	newInput.required = field.isrequired;
	
	// Nombre del modelo
	var model = 'model' + field.fieldid;
	
	// Le agrego modelo y evento change
	newInput.setAttribute("ng-change","change('"+ model +"')");
	newInput.setAttribute("ng-model", model );
	newInput.setAttribute("isRequired", field.isrequired );
	
	$compile(newInput)($scope);
	
	var span = document.createElement('span');
	span.className = 'input-group-addon';
	
	var span2 = document.createElement('span');
	span2.className = 'glyphicon glyphicon-time';
	
	span.appendChild(span2);
	divTime.appendChild(newInput);
	divTime.appendChild(span);
	
	

	var text = "";
	angular.forEach(field.values, function(value){

		text = text + ' ' + value.value;
		newInput.value = text;

	})

	newDiv.appendChild(newLabel);
	newDiv.appendChild(divTime);

	elmparent.append(newDiv);
	
	// Lo pongo como date picker
	$('#' + newInput.id).clockpicker({
		donetext: "Tomar",
		twelvehour: false,
		autoclose: true
	});
}

function addRadio(elmparent,field,formid,seccion,$scope,$compile){	

	var newDiv = document.createElement('div');
	newDiv.className = 'form-group ' +seccion.sectioncolumn;


	var newLabel 		= document.createElement('label');
	newLabel.innerHTML  = field.fieldtitle;
	newDiv.appendChild(newLabel);

	var newbr = document.createElement('br');
	newDiv.appendChild(newbr);

	var newDivButton = document.createElement('div');
	newDivButton.className = "btn-group";
	newDivButton.id  = 'div' + field.fieldid;
	newDivButton.setAttribute('data-toggle','buttons');


	angular.forEach(field.values, function(value){

		var newLabelBtn = document.createElement('label');
		newLabelBtn.className = "btn btn-primary";
		newLabelBtn.innerHTML = value.value;


		var option = document.createElement("input");
		option.type = "radio";
		option.name = field.fieldid;
		option.value = value.value;
		option.setAttribute('autocomplete','off');
		
		newLabelBtn.appendChild(option);
		newDivButton.appendChild(newLabelBtn);

	})
	
	// Nombre del modelo
	var model = 'model' + field.fieldid;
	
	// Le agrego modelo y evento change
	newDivButton.setAttribute("ng-click","change('"+ model +"')");
	newDivButton.setAttribute("ng-model", model );
	
	$compile(newDivButton)($scope);

	newDiv.appendChild(newDivButton);
	elmparent.append(newDiv);
}


function addCombo(elmparent,field,formid,seccion ,$scope,$compile){	
	
	if(field.fieldplaceholder == ''){
		field.fieldplaceholder = 'Seleccione un valor'
	}

	var newDiv = document.createElement('div');
	newDiv.className = 'form-group ' +seccion.sectioncolumn;
	

	var newLabel 		= document.createElement('label');
	newLabel.innerHTML  = field.fieldtitle;
	newDiv.appendChild(newLabel);

	var newbr = document.createElement('br');
	newDiv.appendChild(newbr);


	var newselect = document.createElement('SELECT');
	newselect.className = "form-control";
	newselect.id        = field.fieldid;

	angular.forEach(field.values, function(value){

		var newoption = document.createElement('option');
		newoption.text = value.value;
		newoption.value = value.valueext;
		newselect.add(newoption);


	})
	
	newselect.required = field.isrequired;
	
	// Nombre del modelo
	var model = 'model' + field.fieldid;
	
	// Le agrego modelo y evento change
	newselect.setAttribute("ng-change","change('"+ model +"')");
	newselect.setAttribute("ng-model", model );
	newselect.setAttribute("isRequired", field.isrequired );
	
	$compile(newselect)($scope);
	
	newDiv.appendChild(newselect);
	elmparent.append(newDiv);
}

function addCheck(elmparent,field,formid,seccion, $scope, $compile){	
	
	var newDiv = document.createElement('div');
	newDiv.className = 'form-group ' +seccion.sectioncolumn;
	newDiv.id        = 'div'+ field.fieldid;

	var newLabel 		= document.createElement('label');
	newLabel.innerHTML  = field.fieldtitle;
	newDiv.appendChild(newLabel);

	var newbr = document.createElement('br');
	newDiv.appendChild(newbr);

	var newDivButton = document.createElement('div');
	newDivButton.className = "btn-group";
	newDivButton.id  = 'div' + field.fieldid;
	newDivButton.setAttribute('data-toggle','buttons');


	angular.forEach(field.values, function(value){

		var newLabelBtn = document.createElement('label');
		newLabelBtn.className = "btn btn-primary";
		newLabelBtn.innerHTML = value.value;


		var option = document.createElement("input");
		option.type = "checkbox";
		option.name = field.fieldid;
		option.value = value.value;
		option.setAttribute('autocomplete','off');


		newLabelBtn.appendChild(option);
		newDivButton.appendChild(newLabelBtn);

	})
	
	// Nombre del modelo
	var model = 'model' + field.fieldid;
	
	// Le agrego modelo y evento change
	newDivButton.setAttribute("ng-click","change('"+ model +"')");
	newDivButton.setAttribute("ng-model", model );
	
	$compile(newDivButton)($scope);

	newDiv.appendChild(newDivButton);
	elmparent.append(newDiv);
}
