// Budget module - add items to data structure
var budgetController = (function() {

})();


// UI Module - get input values, add new items to UI, update UI
var uiController = (function() {

})();


// Controller module - event handlers
var appController = (function(budegetCtrl, uiCtrl) {

	var ctrlAddItem = function() {
		// 1. get the input data

		// 2. add item to budget controller

		// 3. add item to UI

		// 4. caculate budget

		// 5. display budget on UI
	}

	document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

	document.addEventListener('keypress', function(event) {
		if(event.keyCode === 13 || event.which === 13) {
			ctrlAddItem();
		}
	});

})(budgetController, uiController);