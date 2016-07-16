$(function() {

    var data = '[{ "id": "cat-1", "name": "Cat-1", "clickCount": "0", "imageUrl": "./images/cat1.jpg"}, ' +
        '{ "id": "cat-2", "name": "Cat-2", "clickCount": "0", "imageUrl": "./images/cat2.jpg"}, ' +
        '{ "id": "cat-3", "name": "Cat-3", "clickCount": "0", "imageUrl": "./images/cat3.jpg"}, ' +
        '{ "id": "cat-4", "name": "Cat-4", "clickCount": "0", "imageUrl": "./images/cat4.jpg"}  ' +
        ']';

    function Model() {

        this.update = function(Obj) {
            var cats = JSON.parse(data);
            var updatedObj = cats.find(function(cat) {
                return cat.id === Obj.id;
            });
            updatedObj = Obj;
            data = JSON.stringify(cats);
        };

        this.getAllCats = function() {
            return JSON.parse(data);
        };
    }

    function Controller() {

        var model = new Model();
        var listView = new ListView();
        var detailView = new DetailView();
        var adminView = new AdminView();

        var currentlySelectedCat = null;
        var adminModeStatus = false;

        this.init = function() {
            currentlySelectedCat = model.getAllCats()[0];
            listView.init();
            detailView.init();
            adminView.init();
        };

        this.getCats = function() {
            return model.getAllCats();
        };

        this.setCurrentlySelectedCat = function(newCat) {
            currentlySelectedCat = newCat;
        };

        this.getCurrentlySelectedCat = function() {
            return currentlySelectedCat;
        };

        this.updateClickCount = function(value) {
            currentlySelectedCat.clickCount = parseInt(currentlySelectedCat.clickCount, 10) + value;
            this.update();
        };

        this.setAdminModeStatus = function(newStatus) {
            adminModeStatus = newStatus;
        };

        this.update = function() {
            model.update(currentlySelectedCat);
            this.refreshViews();
        };

        this.refreshViews = function() {
            listView.render();
            detailView.render();
            if (adminModeStatus === true) {
                adminView.render();
            }
        };
    }

    function ListView() {

        this.init = function() {

            var $imageItem = $('.imageItem');
            var cats = controller.getCats();
            controller.setCurrentlySelectedCat(cats[0]);

            for (var index in cats) {

                if (index > 0) {
                    $imageItem = $imageItem.clone();
                    $('.imageItemList').append($imageItem);
                }
                $imageItem.attr('id', cats[index].id);
                $imageItem.find('img').attr('src', cats[index].imageUrl);
                $imageItem.find('[name="catName"]').text(cats[index].name);

                $imageItem.on('click', function(selectedIdx) {

                    return function() {
                        controller.setCurrentlySelectedCat(cats[selectedIdx]);
                        controller.refreshViews();
                    };

                }(index));
            }
        };

        this.render = function() {

            var currentlySelectedCat = controller.getCurrentlySelectedCat();
            $('#' + currentlySelectedCat.id).find('img').attr('src', currentlySelectedCat.imageUrl);
            $('#' + currentlySelectedCat.id).find('[name="catName"]').text(currentlySelectedCat.name);
        };
    }

    function DetailView() {

        var self = this;

        this.init = function() {

            $('#image').on('click', function() {
                controller.updateClickCount(1);
                self.render();
            });

            this.render();
        };

        this.render = function() {

            var currentlySelectedCat = controller.getCurrentlySelectedCat();
            $('#image').find('img').attr('src', currentlySelectedCat.imageUrl);
            $('#itemName').text('My name is ' + currentlySelectedCat.name);
            $('#itemClickCount').text(currentlySelectedCat.clickCount > 0 ?
                'You have clicked me ' + currentlySelectedCat.clickCount + ' times!' :
                'You have not yet clicked me!');
        };

    }

    function AdminView() {

        var $adminForm = $('#adminForm');

        this.init = function() {

            var self = this;
            $adminForm.hide();

            $('#admin').on('click', function() {
                self.render();
                controller.setAdminModeStatus(true);
            });

            $('#cancel').on('click', function() {
                $adminForm.hide();
                controller.setAdminModeStatus(false);
            });

            $adminForm.on('submit', function(event) {
                var currentlySelectedCat = controller.getCurrentlySelectedCat();
                currentlySelectedCat.name = $('#name').val();
                currentlySelectedCat.imageUrl = $('#imageUrl').val();
                currentlySelectedCat.clickCount = $('#clickCount').val();
                controller.setCurrentlySelectedCat(currentlySelectedCat);
                controller.setAdminModeStatus(false);
                controller.update();
                $adminForm.hide();
                event.preventDefault();
            });
        };

        this.render = function() {
            var currentlySelectedCat = controller.getCurrentlySelectedCat();
            $('#name').val(currentlySelectedCat.name);
            $('#imageUrl').val(currentlySelectedCat.imageUrl);
            $('#clickCount').val(currentlySelectedCat.clickCount);
            $adminForm.show();
        };
    }

    var controller = new Controller();
    controller.init();

});