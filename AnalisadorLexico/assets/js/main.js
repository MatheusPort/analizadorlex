var analyser = new Lexical();

$(document).ready(function() {

	$("#word").keyup(function() {
		word = $(this).val();

		var validateBySpace = word.indexOf(' ') > -1;
		var validateOnExecution = analyser.getVerification() == 'execution';

		if(validateBySpace){
			var parts = word.split(' ');
			word = parts[0];
			if(parts.length > 1 && parts[parts.length-1].length > 0){
				word = parts[parts.length-1];
				$("#word").val(word);
				validateBySpace = false;
			}
		}

		if(word.length < 1){
			selectState('initial');
		}else if(validateOnExecution && word.indexOf(' ') > -1){
			selectState('error');
		}else if(analyser.isValidWord(word)){
			selectState(analyser.getWordState(word));
		}else if(analyser.isValidSequence(word) && !validateBySpace){
			selectState(analyser.getWordState(word));
		}else{
			selectState('error');
		}
	});

	$("#add").click(function(){
		word = $("#word").val();

		var parts = word.split(' ');
		word = parts[0];

		analyser.addWord(word);
		$("#word").keyup();
		buildTable();
		selectState(analyser.getWordState(word));
		$("#word").focus();
	});

	$("#remove").click(function(){
		word = $("#word").val();

		var parts = word.split(' ');
		word = parts[0];

		analyser.removeWord(word);
		$("#word").keyup();
		buildTable();
		$("#word").focus();
	});

	$("#resetDB").click(function(){
		analyser.clean();
	});

	function selectState(state){
		$('[data-state]').removeClass('active');
		$('[data-state="'+state+'"]').addClass('active');
	}

	function populateInitial(){
		var element = analyser.getLex();
		for(e in element){
			$('[data-state=initial] [data-letter="' + e + '"] .cell-state').html(element[e].state);
		}
	}

	function buildTable(){
		var object = analyser.getLex();
		var alphabet = analyser.getAlphabet();
		var rows = analyser.getStateCount();
		var lettersCount = 3;
		var arrayAlphabet = [];
		for(letter in alphabet){
			arrayAlphabet.push(letter);
		}
		arrayAlphabet.sort();

		if(rows && rows > 0){
			var firstHtmlColumns = '';
			for(letter in arrayAlphabet){
				firstHtmlColumns += '<div class="table-cell" data-letter="'+arrayAlphabet[letter]+'">' + arrayAlphabet[letter] + '</div>';
			}

			var htmlColumns = '';
			for(letter in arrayAlphabet){
				htmlColumns += '<div class="table-cell" data-letter="'+arrayAlphabet[letter]+'"><span class="cell-state"></span><span class="cell-letter">'+arrayAlphabet[letter]+'</span></div>';
				lettersCount++;
			}

			var initialRowHtml = '<div class="table-row initial-state active" data-state="initial"><div class="table-cell">Inicial</div>' + htmlColumns + '</div>';
			var errorRowHtml = '<div class="table-row error-state" data-state="error"><div class="table-cell">Erro</div>' + htmlColumns + '</div>';

			var htmlRows = initialRowHtml;
			for(i = 0; i < rows; i++){
				htmlRows += '<div class="table-row" data-state="q' + i + '"><div class="table-cell">q' + i + '</div>' + htmlColumns + '</div>';
			}
			htmlRows += errorRowHtml;

			$("#automat").css('width',(lettersCount * 45) + 20 + 'px');
			$("#automat").html(htmlRows);

			populateInitial();

			analyser.each(function(e, element){
				if(e != 'state' && e != 'final'){
					var state = element[e]['state'];
					var nexts = analyser.getNextStates(element[e]);
					if(element[e]['final']){
						$('[data-state='+state+']').addClass("final-state");
						$('[data-state='+state+'] .table-cell:first').prepend('*');
					}
					for(letter in nexts){
						$('[data-state='+state+'] [data-letter="'+letter+'"] .cell-state').html(nexts[letter]);
					}
				}
			});
		} else {
			$("#automat").html('');
		}
	}

	buildTable();

});
