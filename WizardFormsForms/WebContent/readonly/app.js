angular.module('input', ['ngRoute'])


.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl:'views/input.html',
      controller:'InputCtrl'
    })
    .when('/get/:mandt/:formid/:verformid/:token', {
      templateUrl:'views/input.html',
      controller:'InputCtrl'
    })
    .otherwise({
      redirectTo:'/'
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

.controller('InputCtrl', function($scope,$compile, $routeParams, $http) {
  var origin      = document.location.origin;
  //var origin      = 'http://hgmsapdev01.hgm.com:8000';
  var mandt       = $routeParams.mandt;
	var formid 			= $routeParams.formid;
	var verformid		= $routeParams.verformid;
  var token       = $routeParams.token;
	var panel 			= $("#ppal");

	// Carga de campos
	var sURLFields = origin + '/sap/bc/ibmformwizard/fields_data/fields?sap-client=' + mandt;

	jQuery.ajax({
		  url: sURLFields,
		  async: true,
		  dataType: 'json',
		  type: 'GET',

		  success: function(oData) {
			  $scope.fields = oData;
		  },
		  error: function(XMLHttpRequest, textStatus, errorThrown){

		  }
	});


	// Evento read
	if(token != 'NONE'){
		var sURLInit  = origin + '/sap/bc/ibmformwizard/forms_data/forms?sap-client=' + mandt;
		var oParameters = {
            "token" 			: token,
            "option"		  : 'read',
            "formid"			: formid,
            "verformid"		: verformid,
	          "_method"		  : 'GET',
    };

		jQuery.ajax({
			  url: sURLInit,
			  async: true,
			  dataType: 'json',
			  data: oParameters,
			  type: 'GET',

			  success: function(oData) {
				  $scope.initial = oData;
			  },
			  error: function(XMLHttpRequest, textStatus, errorThrown){

				  $scope.message = "The following problem occurred: " + textStatus, XMLHttpRequest.responseText + ","	+ XMLHttpRequest.status + "," + XMLHttpRequest.statusText;
				  $('#modalerror').modal('show')
			  }
		});
	}


  $scope.pressRadio = function(data){
    var val = $scope['model008161'];
    var elem = $('#008161');
    console.log(elem)
  }

	// Evento Submit
	$scope.submit = function(){
	  dataSave = '';

		dataSave = dataSave + '#-H-#' + formid + '#-|-#' + verformid + '#-|-#';

		angular.forEach($scope.data.versions[0].sections, function(section){

			angular.forEach(section.fields, function(field){

        switch (field.fieldtype) {
          case 'RADIO':
            values   = valuesCheckBox(field)
            if(values.length > 0){
              dataSave = dataSave +  field.fieldid + '#-:-#' + values + '#-,-#'
            }
            break;
          case 'CHECK':
            values   = valuesCheckBox(field)
            if(values.length > 0){
              dataSave = dataSave +  field.fieldid + '#-:-#' + values + '#-,-#'
            }
            break;
          default:
            value = $scope['model'+field.fieldid];
            if(value){
              dataSave = dataSave +  field.fieldid + '#-:-#' + $scope['model'+field.fieldid] + '#-,-#';
            }
            break;
        }
			})
		})

		dataSave = dataSave.substring(0, dataSave.length - 5);

		var sURL  = origin + '/sap/bc/ibmformwizard/forms_data/forms?sap-client=' + mandt;
		var oParameters = {
	           "data" 			: dataSave,
	           "option"		  : 'save-data',
             "token"      : token,
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
					  $scope.message = 'El formulario fue actualizado con exito.';
					  $('#modalok').modal('show')
				  }else{
					  $scope.message = oData[0].message ;
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


	// Evento change(osea para las formulas)
	$scope.change = function(id){

		var find 		= false;
		var cond 		= [];
		var stringcond  = "";


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
					case 'READ':
						var idx = fieldasig_aux;
						document.getElementById(idx).readOnly = true;
						break;
					case 'INPUT':
						var idx = fieldasig_aux;
						document.getElementById(idx).readOnly = false;
						break;
					default:
						$scope[fieldasig] = valueasig;
						break;
					}
				}else{


          switch (valueasig) {
					case 'REQUIRED':
						var idx = fieldasig_aux;
						document.getElementById(idx).required = false;
						break;
					case 'HIDE':
						var idx = fieldasig_aux;
						document.getElementById(idx).style.visibility = "visible"
						break;
					case 'SHOW':
						var idx = fieldasig_aux;
						document.getElementById(idx).style.visibility = "hidden"
						break;
					case 'READ':
						var idx = fieldasig_aux;
						document.getElementById(idx).readOnly = false;
						break;
					case 'INPUT':
						var idx = fieldasig_aux;
						document.getElementById(idx).readOnly = true;
						break;
					default:
						$scope[fieldasig] = valueasig;
						break;
					}

				}

			}

		} )

	}



	var sURL  = origin + '/sap/bc/ibmformwizard/forms_data/forms?sap-client=' + mandt + '&formid=' + formid + '&verformid=' + verformid;

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
			$scope.data.sizetitlehead		= list.versions[0].sizetitlehead;
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
					var titlesection = section.sectionvi + ' ' + section.sectiontitle
				}

				var elmsection = '<div class="panel panel-default" style="border: none;"><div class="panel-heading"style="border: none;background-image:none;display: flex; flex-direction: column; align-items: center; background-color: ' +
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


				// Elemento padre osea la seccion
				var nameelmparent = list.formid + section.sectionid;
				var elm = $('#'+nameelmparent);

  				var elmsection = '<div class="panel panel-default" style="border: none;"><div class="panel-body" id="'+
					list.formid + section.sectionid + 'fields' +'"></div></div>';

  				elm.append(elmsection);


  				// Agrego los campos
  				angular.forEach(section.fields, function(field){

  					var nameelmparent = list.formid + section.sectionid + 'fields';
					var elm = $('#'+nameelmparent);


					if(field.type.length > 0){
						field.fieldtype = field.type;
					}


  					// Evaluo que tipo de elemento es
  					switch(field.fieldtype) {
					    case 'TEXT':
					        addInput(elm,field,list.formid,section,$scope, $compile);
					        break;
					    case 'CALE':
					    	addDate(elm,field,list.formid,section,$scope, $compile);
					        break;
					    case 'TIME':
					    	addTime(elm,field,list.formid,section,$scope, $compile);
					        break;
					    case 'RADIO':
					        addRadio(elm,field,list.formid,section,$scope, $compile);
					        break;
					    case 'CHECK':
					        addCheck(elm,field,list.formid,section,$scope, $compile);
					        break;
					    case 'COMBO':
					        addCombo(elm,field,list.formid,section,$scope, $compile);
					        break;
					    default:
					        addInput(elm,field,list.formid,section,$scope, $compile);
					}

  				})

  				// Agrego las subsecciones
  				angular.forEach(section.subsections, function(subsection){


  					//# de columnas
	  				switch(subsection.sectioncolumn) {
		  			    case '1':
		  			    	subsection.sectioncolumn = 'col-md-12 col-sm-12'
		  			        break;
		  			    case '2':
		  			    	subsection.sectioncolumn = 'col-md-6 col-sm-6'
		  			        break;
		  			    case '3':
		  			    	subsection.sectioncolumn = 'col-md-4 col-sm-4'
	  			    		break;
		  			    case '4':
		  			    	subsection.sectioncolumn = 'col-md-3 col-sm-3'
	  			    		break;
	  				}


  					var titlesection = ""

  					// Elemento padre osea la seccion
  					var nameelmparent = list.formid + section.sectionid;
  					var elm = $('#'+nameelmparent);

					// Agrego la seccion al panel
					if($scope.data.showtitlesection){
						var titlesection = subsection.sectionvi + ' ' + subsection.sectiontitle
					}

					//var elmsection = '<div class="panel panel-default '+ section.sectioncolumn + '" style="border: none;"><div class="panel-heading"style="border: none;background-image:none; background-color: ' +

					var elmsection = '<div class="panel panel-default" style="border: none;"><div class="panel-heading"style="border: none;background-image:none; background-color: ' +
						$scope.data.colorsections + ';"><'+$scope.data.sizetitlesections+' >'+titlesection+'</'+$scope.data.sizetitlesections+'></div><div class="panel-body" id="'+
						list.formid + subsection.sectionid+'"></div></div>';

	  				elm.append(elmsection);

	  				// Agrego los campos
  					angular.forEach(subsection.fields, function(field){


	  					// Elemento padre osea la seccion
	  					var nameelmparent = list.formid + subsection.sectionid;
	  					elm = $('#'+nameelmparent);

	  					if(field.type.length > 0){
							field.fieldtype = field.type;
						}

	  					// Evaluo que tipo de elemento es
	  					switch(field.fieldtype) {
						    case 'TEXT':
						        addInput(elm,field,list.formid,subsection,$scope, $compile);
						        break;
						    case 'CALE':
						    	addDate(elm,field,list.formid,subsection,$scope, $compile);
						        break;
						    case 'TIME':
						    	addTime(elm,field,list.formid,subsection,$scope, $compile);
						        break;
						    case 'RADIO':
						        addRadio(elm,field,list.formid,subsection,$scope, $compile);
						        break;
						    case 'CHECK':
						        addCheck(elm,field,list.formid,subsection,$scope, $compile);
						        break;
						    case 'COMBO':
						        addCombo(elm,field,list.formid,subsection,$scope, $compile);
						        break;
						    default:
						        addInput(elm,field,list.formid,subsection,$scope, $compile);
						}

  					})

  				})
			})

			// Recorro los eventos init para asignar los valores
			angular.forEach($scope.initial, function(init){
        if(init.value.substring(0,5) == 'CHECK'){
          var char = init.value.substring(6,init.value.length);
          var values = char.split(/~/);
          angular.forEach(values,function(val){
            var nam = '#model'+ init.fieldid + val;
            $(nam).addClass('active');
            //document.getElementById(nam).remove();

          })
        }else{
		    	$scope['model'+init.fieldid] = init.value;
        }
			})

		});
});

function addInput(elmparent,field,formid,seccion,$scope, $compile){

	var newDiv 				    = document.createElement('div');
	newDiv.className 		  = 'form-group ' +seccion.sectioncolumn;


	var newLabel 			    = document.createElement('label');
	newLabel.innerHTML  	= field.vineta + ' ' + field.fieldtitle;

	var newInput 			    = document.createElement('input');
	newInput.type 			  = 'text';
	newInput.id   			  =  field.fieldid;
	newInput.className  	= 'form-control';
	newInput.placeholder 	= field.fieldplaceholder;
	newInput.required 		= field.isrequired;
  newInput.setAttribute("readOnly", "true" );


	// Nombre del modelo
	var model = 'model' + field.fieldid;

	// Le agrego modelo y evento change
	newInput.setAttribute("ng-change","change('"+ model +"')");
	newInput.setAttribute("ng-model", model );
	newInput.setAttribute("isRequired", field.isrequired );


	$compile(newInput)($scope);

	newDiv.appendChild(newLabel);
	newDiv.appendChild(newInput);

	elmparent.append(newDiv);
}


function addDate(elmparent,field,formid,seccion,$scope, $compile){

	var newDiv 				    = document.createElement('div');
	newDiv.className 		  = 'form-group ' +seccion.sectioncolumn;


	var newLabel 			    = document.createElement('label');
	newLabel.innerHTML  	= field.vineta + ' ' + field.fieldtitle;

	var divTime 			    = document.createElement('div');
	divTime.className 		= 'input-group clockpicker';

	var newInput 			    = document.createElement('input');
	newInput.type 			  = 'text';
	newInput.id   			  =  field.fieldid;
	newInput.className  	= 'form-control';
	newInput.placeholder 	= 'dd/mm/aaaa';
	newInput.required 		= field.isrequired;
  newInput.setAttribute("readOnly", "true" );

	var span              = document.createElement('span');
	span.className        = 'input-group-addon';

	var span2             = document.createElement('span');
	span2.className       = 'glyphicon glyphicon-calendar';

	// Nombre del modelo
	var model = 'model' + field.fieldid;

	// Le agrego modelo y evento change
	newInput.setAttribute("ng-change","change('"+ model +"')");
	newInput.setAttribute("ng-model", model );
	newInput.setAttribute("isRequired", field.isrequired );

	$compile(newInput)($scope);

	span.appendChild(span2);
	divTime.appendChild(newInput);
	divTime.appendChild(span);

	newDiv.appendChild(newLabel);
	newDiv.appendChild(divTime);

	elmparent.append(newDiv);

}

function addTime(elmparent,field,formid,seccion,$scope, $compile){

	var newDiv 				    = document.createElement('div');
	newDiv.className 		  = 'form-group ' +seccion.sectioncolumn;

	var newLabel 			    = document.createElement('label');
	newLabel.innerHTML  	= field.vineta + ' ' + field.fieldtitle;

	var divTime 			    = document.createElement('div');
	divTime.className 		= 'input-group clockpicker';

	var newInput 			    = document.createElement('input');
	newInput.type 			  = 'text';
	newInput.id   			  = field.fieldid;
	newInput.className  	= 'form-control';
	newInput.placeholder 	= field.fieldplaceholder;
	newInput.required 		= field.isrequired;
  newInput.setAttribute("readOnly", "true" );


	// Nombre del modelo
	var model = 'model' + field.fieldid;

	// Le agrego modelo y evento change
	newInput.setAttribute("ng-change","change('"+ model +"')");
	newInput.setAttribute("ng-model", model );
	newInput.setAttribute("isRequired", field.isrequired );

	$compile(newInput)($scope);

	var span 				    = document.createElement('span');
	span.className 			= 'input-group-addon';

	var span2 				  = document.createElement('span');
	span2.className 		= 'glyphicon glyphicon-time';

	span.appendChild(span2);
	divTime.appendChild(newInput);
	divTime.appendChild(span);

	newDiv.appendChild(newLabel);
	newDiv.appendChild(divTime);

	elmparent.append(newDiv);


}

function addCombo(elmparent,field,formid,seccion,$scope,$compile){

	if(field.fieldplaceholder == ''){
		field.fieldplaceholder = 'Seleccione un valor'
	}

	var newDiv 				    = document.createElement('div');
	newDiv.className 		  = 'form-group ' +seccion.sectioncolumn;


	var newLabel 			    = document.createElement('label');
	newLabel.innerHTML  	= field.vineta + ' ' + field.fieldtitle;
	newDiv.appendChild(newLabel);

	var newbr 				    = document.createElement('br');
	newDiv.appendChild(newbr);


	var newselect 			  = document.createElement('SELECT');
	newselect.className 	= "form-control";
	newselect.id        	= field.fieldid;
  newselect.setAttribute("disabled", "true" );

	angular.forEach(field.values, function(value){

		var newoption 		  = document.createElement('option');
		newoption.text 		  = value.value;
		newoption.value 	  = value.valueext;
    newoption.setAttribute("disabled", "true" );
		newselect.add(newoption);
	})

	newselect.required 		= field.isrequired;

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


function addCheck(elmparent,field,formid,seccion,$scope,$compile){
	var newDiv 				    = document.createElement('div');
	newDiv.className 		  = 'form-group ' + 'model' + field.fieldid + ' ' + seccion.sectioncolumn;
  newDiv.setAttribute('data-toggle','buttons-checkbox');

	var newLabel 			    = document.createElement('label');
	newLabel.innerHTML  	= field.vineta + ' ' + field.fieldtitle;
	newDiv.appendChild(newLabel);

	var newbr 				    = document.createElement('br');
	newDiv.appendChild(newbr);

	angular.forEach(field.values, function(value){

		if(value.status == true){

      var newLabelBtn 		    = document.createElement('button');
      newLabelBtn.className 	= "btn btn-primary";
      newLabelBtn.innerHTML 	= value.value;
      newLabelBtn.type 	   		= "button";
      newLabelBtn.id          = 'model' + field.fieldid + value.valueext;
      newLabelBtn.setAttribute('value',value.valueext);

      newDiv.appendChild(newLabelBtn);
		}

	})


	$compile(newDiv)($scope);

	elmparent.append(newDiv);
}

function addRadio(elmparent,field,formid,seccion,$scope,$compile){

	var newDiv 				    = document.createElement('div');
	newDiv.className 		  = 'form-group ' +seccion.sectioncolumn;


	var newLabel 			    = document.createElement('label');
	newLabel.innerHTML  	= field.vineta + ' ' + field.fieldtitle;
	newDiv.appendChild(newLabel);


	var newDivButton 		    = document.createElement('div');
	newDivButton.className  = "radio";
	newDivButton.id  		    = 'div' + field.fieldid;
	newDivButton.setAttribute('data-toggle','buttons');


	angular.forEach(field.values, function(value){

		if(value.status == true){

			var newLabelBtn 		    = document.createElement('label');
			newLabelBtn.className 	= "btn btn-primary";
			newLabelBtn.innerHTML 	= value.value;


			var option 				      = document.createElement("input");
			option.type 			      = "radio";
			option.name 			      = formid+seccion.sectionid+field.fieldid;
			option.value 			      = value.valueext;
			option.setAttribute('autocomplete','off');


			newLabelBtn.appendChild(option);
			newDivButton.appendChild(newLabelBtn);

		}

	})

	// Nombre del modelo
	var model 						     = 'model' + field.fieldid;

	// Le agrego modelo y evento change
	newDivButton.setAttribute("ng-click","pressRadio('"+ model +"')");
	newDivButton.setAttribute("ng-model", model );

	$compile(newDivButton)($scope);

	newDiv.appendChild(newDivButton);
	elmparent.append(newDiv);
}

function valuesCheckBox(field){
  var group = '.model'+field.fieldid + ' button'
  var values = $(group);
  var finalVal = 'CHECK';

  angular.forEach(values,function(val){
    angular.forEach(val.classList,function(item){
      if(item === 'active'){
        finalVal = finalVal + '~' + val.value;
      }
    })
  })
  return finalVal;
}
