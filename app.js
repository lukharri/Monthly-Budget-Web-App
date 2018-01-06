
/********************************** BUDGET MODULE **************************************/ 
/***************************************************************************************/ 

var budgetController = (function() {

	var Expense = function(id, descripton, value) {
		this.id = id;
		this.descripton = descripton;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calcPercentage = function(totalIncome) {
		if(totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function() {
		return this.percentage;
	}

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

		deleteItem: function(type, id) {
			var ids, index;

			// find the index of the item to be deleted based on its ID
			ids = data.allItems[type].map(function(current) {
				return current.id;
			});

			index = ids.indexOf(id);

			if(index !== -1) {
				data.allItems[type].splice(index, 1);
			}
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

		calculatePercentages: function() {
			data.allItems.expense.forEach(function(current) {
				current.calcPercentage(data.totals.income);
			});
		},

		getPercentages: function() {
			var allPercentages = data.allItems.expense.map(function(current) {
				return current.getPercentage();
			});
			return allPercentages;
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


/********************************* USER INTERFACE MODULE *******************************/ 
/***************************************************************************************/ 

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
		percentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensePercentageLabel: '.item__percentage',
		currentDate: '.budget__title--month'
	};

	var formatNumber = function(num, type) {
		var splitNum, integer, decimal, sign;
		num = Math.abs(num);
		num = num.toFixed(2);

		splitNum = num.split('.');
		integer = splitNum[0];

			// 23452
			// 1234
			// 111222
		if (integer.length > 3) {
			integer = integer.substr(0, integer.length - 3) + ',' + integer.substr(integer.length - 3, 3);
		}

		decimal = splitNum[1];
			
		return (type === 'expense' ? '-' : '+') + ' ' + integer + '.' + decimal;
	};


	var nodeListForEach = function(list, callBack) {
		for (var i = 0; i < list.length; i++) {
			callBack(list[i], i);
		}
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
            	'<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage"></div>' +
            	'<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>' +
            	'</div></div></div>';
        	}

        	// replace placeholders w/actual values
            newHtml = html.replace('%id%', obj.id);
        	newHtml = newHtml.replace('%descripton%', obj.descripton);
       		newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

        	// update UI - insert new item into income/expense list 
        	document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		deleteListItem: function(selectorID) {
			var element = document.getElementById(selectorID);
			element.parentNode.removeChild(element);
		},

		displayBudget: function(obj) {
			var type;
			obj.budget > 0 ? type = 'income' : type = 'expense';

			document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalIncome, 'income');
			document.querySelector(DOMStrings.expenseLabel).textContent = formatNumber(obj.totalExpense, 'expense');

			if(obj.percentage > 0) {
				document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + "%";
			} else {
				document.querySelector(DOMStrings.percentageLabel).textContent = "--";
			}
		},

		displayPercentages: function (percentages) {
			var fields = document.querySelectorAll(DOMStrings.expensePercentageLabel);

			nodeListForEach(fields, function(current, index){
				if (percentages[index] > 0) {
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '--';
				}			
			});
		},

		displayMonth: function() {
			var date, month, months, year;
			date = new Date();

			months = ["January", "February", "March", "April", "May", "June", 
			"July", "August", "September", "October", "November", "December"];

			month = months[date.getMonth()];
			year = date.getFullYear();
			document.querySelector(DOMStrings.currentDate).innerHTML = month + ' ' + year;
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

		changeType: function() {
			var fields = document.querySelectorAll(
				DOMStrings.inputType + ',' + 
				DOMStrings.inputDescription + ',' +
				DOMStrings.inputValue
			);

			nodeListForEach(fields, function(current) {
				current.classList.toggle('red-focus');
			});

			document.querySelector(DOMStrings.inputBtn).classList.toggle('red');
		},

		getDOMStrings: function() {
			return DOMStrings;
		}
	};

})();


/********************************** CONTROLLER MODULE **********************************/ 
/***************************************************************************************/ 

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

		document.querySelector(domStrings.container).addEventListener('click', ctrlDeleteItem);
		document.querySelector(domStrings.inputType).addEventListener('change', uiController.changeType);
	}

	var updateBudget = function() {
		// 1. calculate budget
		budgetController.caculateBudget();

		// 2. return budget
		var budget = budgetController.getBudget();

		// 3. display budget on UI
		uiController.displayBudget(budget);
	};

	var updatePercentages = function() {
		
		// calculate percentages
		budgetController.calculatePercentages();

		// read percents from budget controller
		var percentages = budgetController.getPercentages();

		// update UI
		uiController.displayPercentages(percentages);
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

			// 6. Calculate and update expense percentages
			updatePercentages();
		}

	};

	var ctrlDeleteItem = function(event) {
		var itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		if(itemID) {
			splitID = itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);
		}

		// delete item from data structure
		budgetController.deleteItem(type, ID);

		// delete item from UI
		uiController.deleteListItem(itemID);

		// update and display new budget
		updateBudget();

		// Calculate and update expense percentages
		updatePercentages();
	};

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