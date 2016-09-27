var customerId;
var host = "http://localhost:8080";

function getCustomerId(id){
	customerId = id;
}

function addCsrfToken(xhr){
	var header = $('input[name=_csrf_header]').val();
	var token = $('input[name=_csrf]').val();
	xhr.setRequestHeader(header, token);
}

$("#emailModal_btn_send").click(function() {
	var ids = [];
	var email = $("#emailModal_email").val();
	
	$("input[name='ids[]']:checked").each(function () {
		ids.push(parseInt($(this).val()));
	});
	
	var data = {
			ids : ids,
			email : email
	};		
	
	var json = JSON.stringify(data);
	
	$.ajax({
	    url: host + "/customer/email",
	    type: "post",
	    contentType: "application/json; charset=utf-8",
	    beforeSend: addCsrfToken,
	    data: json,
	    success: function(data) {
	    	$("#emailSentModal").modal();
	    	$("#emailSentModal").on("hidden.bs.modal", function () {
				location.reload();
   	    	});
	    }
	});
});

function openSaleModal(){
	var id = customerId;
	//clear form/modal
	$("#sale-form").validate().resetForm();
    $('#name').closest('.form-group').removeClass('has-error');
	$('#price').closest('.form-group').removeClass('has-error');
	$('#date').closest('.form-group').removeClass('has-error');
	
	$.ajax({
	    url: host + "/customer/name/" + id,
	    type: 'GET',
	    success: function (result) {
			$("#_name").val(result);
			$("#price").val("");
			$("#date").val("");
			$("#saleModal").modal();
	   	}
	})
}

$(document).on("click", ".btn-modal", (function(){
	
	var id = customerId;
	
	$.ajax({
	    url: host + "/sale/find/" + id,
	    type: 'GET',
	    success: function (result) {
	    	console.log(result);
	    	if (result) {
	    		$("#confirmationModal").modal();
	    	}
	    	else openSaleModal();
	   	}
	})
	
	$("#btn-new").click(function(){
		openSaleModal();
	});
}));

$("#sale-form").validate({
	rules: {
		name: {
		    required: true
		},
        price: {
            required: true,
            number: true
        },
        date: {
        	required: true
        }
    },
	messages: {
		name: "O nome é obrigatório",
        price: "O valor é obrigatório",
        date: "A data é obrigatória"
	},
	submitHandler: function (form) {
		var name = $('#_name').val();
		var price = $('#price').val();
		var date = $("#date").val();
		var id = customerId;
		
		$("#btn-save").prop("disabled", true);
		
		var data = {
				sale : {
						price: price,
						date: date
				},
				customer : {
						id: id,
						name: name
				}
		};
		var json = JSON.stringify(data);
		
	   	$.ajax({
	   	    url: host + "/sale/new",
	   	    type: 'POST',
	   	    contentType: "application/json; charset=utf-8",
	   	    data: json,
	   	    beforeSend: addCsrfToken,
	   	    success: function (results) {
	   	    	$("#btn-save").prop("disabled", false);
	   	    	$("#saleModal").modal('toggle');
	   	    	$("#saleModal").on("hidden.bs.modal", function () {
					location.reload();
	   	    	});
	   	   	}
	   	})
		return false; // required to block normal submit since you used ajax
    },
    highlight: function(element) {
        $(element).closest('.form-group').addClass('has-error');
    },
    unhighlight: function(element) {
        $(element).closest('.form-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) {
        if(element.parent('.input-group').length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
	
});


$(function() {
	 $("#date").datepicker({
	    dateFormat: 'yy-mm-dd',
	    dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
	    dayNamesMin: ['D','S','T','Q','Q','S','S','D'],
	    dayNamesShort: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
	    monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
	    monthNamesShort: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
	    nextText: 'Próximo',
	    prevText: 'Anterior'
	});
});