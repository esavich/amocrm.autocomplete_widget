define(['jquery'], function($) {
	
    var CustomWidget = function () {

    	var self = this, $stylesheet, wcode, wurl, source, field, settings;

    	var renderList = function(list) {
    		return list.map(function(item) {
				return '<li class="widget-autocomplete__item" value="' + item + '">' + item + '</li>';
			}).join("");
    	}

    	var render = function(input) {

			var $list = $('<ul class="widget-autocomplete"></ul>');

			input.after($list);

			input.keyup(function(e) {
				
				var key = e.keyCode;
				var value = $(this).val().toLowerCase();
				var filteredList = list.filter(function(item) {
					return item.toLowerCase().indexOf(value) !== -1 ? true : false;
				});
				
				if (key == 13) { // enter
					$(this).val(filteredList[0]);
					return false;
				}

				$list.html(renderList(filteredList));
				$list.show();
			});

			$list.on('click', 'li', function(e) {
				input.val($(this).text());
				$list.hide();
				e.stopPropagation();
				return false;
			});

    	}

		this.callbacks = {
			render: function() {
				
				console.log('render');

				settings = self.get_settings();

				field = settings.login;

				if (typeof field != 'string') {
					return true;
				}

		    	if (field.indexOf(',') !== -1) {
		    		field = field.split(',').map(function(item) {
		    			return item.trim();
		    		});
		    	} else {
		    		field = [field];
		    	}

				wcode = settings.widget_code;
				wurl = '/upl/' + wcode + '/widget';

				$stylesheet = $('link[data-widget=' + wcode + ']');

				if ($stylesheet.length == 0) {
					$('head').append('<link rel="stylesheet" href="' + wurl + '/style.css" type="text/css" data-widget="' + wcode + '" />');
				}
				
				return true;
			},
			init: function() {
				console.log('init');
				return true;
			},
			bind_actions: function() {
				
				console.log('bind_actions');

				$.get(wurl+'/subjects.json', function(data) {

					list = data.data.map(function(item) {
						return item.name;
					});

					for (var i = 0; i < field.length; i++) {
					
						var $input = $('tr[data-id=' + field[i] + ']').find('input');
						
						if ($input.length > 0 && $('tr[data-id=' + field[i] + ']').is(':visible')) {
							render($input);
						}
					}

				});

				$(document).on('click', function() {
					$('ul.widget-autocomplete').hide();
				});
				
				return true;
			},
			settings: function() {
				console.log('settings');
				return true;
			},
			onSave: function() {
				// alert('click');
				return true;
			},
			destroy: function() {
				console.log('destroy');
			},
			contacts: {
				// select contacts in list and clicked on widget name
				selected: function() {
					console.log('contacts');
				}
			},
			leads: {
				//select leads in list and clicked on widget name
				selected: function() {
					console.log('leads');
				}
			},
			tasks: {
				//select taks in list and clicked on widget name
				selected: function() {
					console.log('tasks');
				}
			}
		};
		return this;
    };

return CustomWidget;
});