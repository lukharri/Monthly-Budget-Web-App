
/********************************** BUDGET MODULE **********************************/ 

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


	calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(current) {
			sum += current.value;
		});
		data.totals[type] = sum;
	};


	var data = {
		allItems: {
			expense: [],
			income: []
		},
		totals: {
			expense: 0,
			income: 0
		},
		budget: 0,
		percentage: -1
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

		caculateBudget: function() {
			// calculate total income and expenses
			calculateTotal('expense');
			calculateTotal('income');

			// calculate budget: income - expenses
			data.budget = data.totals.income - data.totals.expense;

			// calculate percentage of spent income
			if(data.totals.income > 0) {
				data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
			} else {
				data.percentage = -1;
			}
		},

		getBudget: function() {
			return {
				budget: data.budget,
				totalIncome: data.totals.income,
				totalExpense: data.totals.expense,
				percentage: data.percentage
			}
		},

		testing: function() {
			console.log(data);
		}
	};

})();


/******************************* USER INTERFACE MODULE *******************************/ 

var uiController = (function() {
	
	var DOMStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expenseLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage'
	};


	return {
		getInput: function() {
			return {
				type: document.querySelector(DOMStrings.inputType).value,
				descripton: document.querySelector(DOMStrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
			};
		},

		addListItem: function(obj, type) {
			var html, newHtml, element;

			// HTML strings w/placeholders for item values
			if(type === 'income') {
				element = DOMStrings.incomeContainer;
            	html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%descripton%</div>' +
                '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete">' +
                '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
                '</div></div></div>';

        	} else if (type === 'expense') {
        		element = DOMStrings.expenseContainer;
        		html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%descripton%</div>' +
            	'<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%percentage%</div>' +
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

		displayBudget: function(obj) {
			document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMStrings.incomeLabel).textContent = "+" + obj.totalIncome;
			document.querySelector(DOMStrings.expenseLabel).textContent = "-" + obj.totalExpense;

			if(obj.percentage > 0) {
				document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + "%";
			} else {
				document.querySelector(DOMStrings.percentageLabel).textContent = "--";
			}
		},

		displayMonth: function() {
			var date, month, months;

			date = new Date();
			months = new Array();

			months[0] = "January";
			months[1] = "February";
			months[2] = "March";
			months[3] = "April";
			months[4] = "May";
			months[5] = "June";
			months[6] = "July";
			months[7] = "August";
			months[8] = "September";
			months[9] = "October";
			months[10] = "November";
			months[11] = "December";

			month = months[date.getMonth()];

			document.querySelector('.budget__title--month').innerHTML = month;
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


/********************************** CONTROLLER MODULE **********************************/ 

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

	var updateBudget = function() {
		// 1. calculate budget
		budgetController.caculateBudget();

		// 2. return budget
		var budget = budgetController.getBudget();

		// 3. display budget on UI
		uiController.displayBudget(budget);
	};


	var ctrlAddItem = function() {
		var input, newItem;

		// 1. get the input data
		input = uiController.getInput();

		if(input.descripton !== "" && !isNaN(input.value) && input.value > 0) {
			// 2. add item to budget controller
			newItem = budgetController.addItem(input.type, input.descripton, input.value);

			// 3. add item to UI
			uiController.addListItem(newItem, input.type);

			// 4. Clear input fields
			uiController.clearFields();

			// 5. Calculate and update budget
			updateBudget();
		}

	}

	return {
		init: function() {
			setEventListeners();
			uiController.displayMonth();
			uiController.displayBudget({
				budget: 0,
				totalIncome: 0,
				totalExpense: 0,
				percentage: 0
			});
		}
	};

})(budgetController, uiController);


appController.init();