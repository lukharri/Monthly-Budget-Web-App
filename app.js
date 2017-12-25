// BUDGET MODULE - add items to data structure
var budgetController = (function() {

})();


// UI MODULE - get input values, add new items to UI, update UI
var uiController = (function() {
	
	var DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn'
	};


	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMStrings.inputType).value,
				descripton: document.querySelector(DOMStrings.inputDescription).value,
				value: document.querySelector(DOMStrings.inputValue).value
			};
		},

		getDOMStrings: function() {
			return DOMStrings;
		}
	};
	
})();


// CONTROLLER MODULE - event handlers
var appController = (function(budegetCtrl, uiCtrl) {

	var domStrings = uiController.getDOMStrings();

	var ctrlAddItem = function() {
		// 1. get the input data
		var input = uiController.getInput();
		console.log(input);
		// 2. add item to budget controller

		// 3. add item to UI

		// 4. caculate budget

		// 5. display budget on UI
	}

	document.querySelector(domStrings.inputBtn).addEventListener('click', ctrlAddItem);

	document.addEventListener('keypress', function(event) {
		if(event.keyCode === 13 || event.which === 13) {
			ctrlAddItem();
		}
	});

})(budgetController, uiController);