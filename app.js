// BUDGET MODULE - add items to data structure
var budgetController = (function() {

	var Expense = function(id, descripton, value) {
		this.id = id;
		this.descripton = descripton;
		this.value = value;
	};

	var Income = function(id, descripton, value) {
		this.id = id;
		this.descripton = descripton;
		this.value = value;
	};  

	var data = {
		allItems: {
			expense: [],
			income: []
		},
		totals: {
			expense: 0,
			income: 0
		}
	}


	return {
		addItem: function(type, description, value) {
			var newItem, ID;

			// create new item ID
			if(data.allItems[type].length > 0){
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}
			
			// create new item
			if(type === 'expense') {
				newItem = new Expense(ID, description, value);
			} else if( type === 'income') {
				newItem = new Income(ID, description, value);
			}

			// store new item
			data.allItems[type].push(newItem);
			return newItem;
		},

		testing: function() {
			console.log(data);
		}
	};

})();


// UI MODULE - get input values, add new items to UI, update UI
var uiController = (function() {
	
	var DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list'
	};


	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMStrings.inputType).value,
				descripton: document.querySelector(DOMStrings.inputDescription).value,
				value: document.querySelector(DOMStrings.inputValue).value
			};
		},

		addListItem: function(obj, type) {
			var html, newHtml, element;

			// HTML strings w/placeholders for item values
			if(type === 'income') {
				element = DOMStrings.incomeContainer;
				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%descripton%</div>' + 
				'<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>' + 
            	'<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
            	'</div></div></div>';

        	} else if (type === 'expense') {
        		element = DOMStrings.expenseContainer;
        		html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%descripton%</div>' +
            	'<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">10%</div>' +
            	'<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
            	'</div></div></div>';
        	}

        	// replace placeholders w/actual values
        	newHtml = html.replace('%id%', obj.id);
        	newHtml = newHtml.replace('%descripton%', obj.descripton);
        	newHtml = newHtml.replace('%value%', obj.value);

        	// update UI - insert new item into income/expense list 
        	document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		clearFields: function() {
			var fieldsList, fieldsArray;
			fieldsList = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);

			fieldsArray = Array.prototype.slice.call(fieldsList);

			fieldsArray.forEach(function(current, index, array) {
				current.value = "";
			});

			fieldsArray[0].focus();
		},

		getDOMStrings: function() {
			return DOMStrings;
		}
	};

})();


// CONTROLLER MODULE - event handlers
var appController = (function(budegetCtrl, uiCtrl) {

	var setEventListeners = function() {
		var domStrings = uiController.getDOMStrings();

		// click or 'enter' to add a new item to the budget
		document.querySelector(domStrings.inputBtn).addEventListener('click', ctrlAddItem);
		document.addEventListener('keypress', function(event) {
			if(event.keyCode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});
	}


	var ctrlAddItem = function() {
		var input, newItem;

		// 1. get the input data
		input = uiController.getInput();

		// 2. add item to budget controller
		newItem = budgetController.addItem(input.type, input.descripton, input.value);

		// 3. add item to UI
		uiController.addListItem(newItem, input.type);

		// 4. Clear input fields
		uiController.clearFields();
		// 5. caculate budget

		// 5. display budget on UI
	}

	return {
		init: function() {
			setEventListeners();
		}
	};

})(budgetController, uiController);


appController.init();