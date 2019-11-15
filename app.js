(function(){
	'use strict';

	angular.module('RestaurantMenuApp',[])
	.controller('RestaurantMenuAppController',RestaurantMenuAppController)
	.service('MenuCategoriesService',MenuCategoriesService);

	RestaurantMenuAppController.$inject=['MenuCategoriesService'];
	function RestaurantMenuAppController(MenuCategoriesService){
		var restuarantMenu = this;
		restuarantMenu.searchValue=""
		restuarantMenu.foundList=[];
		// var promise = '';			
		restuarantMenu.getMenuDetails=function(){
			console.log("In getMenuDetails",restuarantMenu.searchValue);
			var promise = MenuCategoriesService.getDetails();
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
	MenuCategoriesService.$inject=['$http'];
	function MenuCategoriesService($http){
		var service= this;
		service.getDetails=function(){
			var response=$http({
				method: 'GET',
				url: ('http://davids-restaurant.herokuapp.com/menu_items.json')
			});
			return response;
		};
	}

})();