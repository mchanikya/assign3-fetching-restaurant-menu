(function(){
	'use strict';

	angular.module('RestaurantMenuApp',[])
	.controller('NarrowItDownController',NarrowItDownController)
	.service('MenuSearchService',MenuSearchService)
	.directive('foundItems',foundItemsDirective);

	function foundItemsDirective() {
	  var ddo = {
	    templateUrl: 'foundItems.html',
			scope: {
				items: '<',
				onRemove: '&'
			},
			controller:'NarrowItDownController',
			controllerAs: 'list',
			bindToController: true
	  };
	  return ddo;
	}

	NarrowItDownController.$inject=['MenuSearchService'];
	function NarrowItDownController(MenuSearchService){
		var restuarantMenu = this;
		restuarantMenu.searchValue=""
		restuarantMenu.foundList=[];
		// var promise = '';
		restuarantMenu.getMenuDetails=function(){
			console.log("In getMenuDetails",restuarantMenu.searchValue);
			var promise = MenuSearchService.getMatchedMenuItems();
				promise.then(function(response){
					if ( restuarantMenu.searchValue != ""){
						restuarantMenu.Categories = response.data;
						for (var i = 0; i<restuarantMenu.Categories.menu_items.length ; i++) {
							if (restuarantMenu.Categories.menu_items[i].description.search(restuarantMenu.searchValue) != -1) {
								console.log("RestaurantMenuApp Categories",restuarantMenu.Categories.menu_items[i]);
								restuarantMenu.foundList.push({"name": restuarantMenu.Categories.menu_items[i].name,
								 								"short_name" : restuarantMenu.Categories.menu_items[i].short_name,
								 								"description":restuarantMenu.Categories.menu_items[i].description});
							}
								// restuarantMenu.Categories.menu_items[i]
						}
					}
					// console.log("RestaurantMenuApp Categories",restuarantMenu.Categories.menu_items);
				}).catch(function(error){
					console.log("Failed to get menu details");
			});

		};

		restuarantMenu.removeItemFromList = function(index){
			restuarantMenu.foundList.splice(index,1);
		};
	}
	MenuSearchService.$inject=['$http'];
	function MenuSearchService($http){
		var service= this;
		service.getMatchedMenuItems=function(){
			var response=$http({
				method: 'GET',
				url: ('http://davids-restaurant.herokuapp.com/menu_items.json')
			});
			return response;
		};
	}

})();
