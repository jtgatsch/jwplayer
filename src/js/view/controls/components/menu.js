import menuTemplate from 'view/controls/templates/menu';
define([
    'view/controls/components/tooltip',
    'utils/helpers',
    'utils/underscore',
    'utils/ui',
], function(Tooltip, utils, _, UI) {

    return class Menu extends Tooltip {

        setup(list, selectedIndex, options) {
            options = options || {};
            if (!this.iconUI) {
                this.iconUI = new UI(this.el, { useHover: true, directSelect: true });

                this.toggleValueListener = this.toggleValue.bind(this);

                this.toggleOpenStateListener = this.toggleOpenState.bind(this);
                this.openTooltipListener = this.openTooltip.bind(this);
                this.closeTooltipListener = this.closeTooltip.bind(this);

                this.selectListener = this.select.bind(this);
            }

            this.reset();

            list = _.isArray(list) ? list : [];

            utils.toggleClass(this.el, 'jw-hidden', (list.length < 2));

            var isMenu = list.length > 2 || (list.length === 2 && options && options.toggle === false);
            var isToggle = !isMenu && list.length === 2;
            // Make caption menu always a toggle to show active color
            utils.toggleClass(this.el, 'jw-toggle', isToggle || options.isToggle);
            utils.toggleClass(this.el, 'jw-button-color', !isToggle);

            if (isMenu) {
                utils.removeClass(this.el, 'jw-off');

                this.iconUI
                    .on('tap', this.toggleOpenStateListener)
                    .on('over', this.openTooltipListener)
                    .on('out', this.closeTooltipListener);

                var html = menuTemplate(list);
                var elem = utils.createElement(html);
                this.addContent(elem);
                this.contentUI = new UI(this.content).on('click tap', this.selectListener);
            } else if (isToggle) {
                this.iconUI.on('click tap', this.toggleValueListener);
            }

            this.selectItem(selectedIndex);
        }

        toggleValue() {
            this.trigger('toggleValue');
        }

        select(evt) {
            if (evt.target.parentElement === this.content) {
                var classes = utils.classList(evt.target);

                // find the class with a name of the form 'jw-item-1'
                var item = _.find(classes, function(c) {
                    return c.indexOf('jw-item') === 0;
                });

                if (item) {
                    this.trigger('select', parseInt(item.split('-')[2]));
                    this.closeTooltipListener();
                }
            }
        }

        selectItem(selectedIndex) {
            if (this.content) {
                for (var i = 0; i < this.content.children.length; i++) {
                    utils.toggleClass(this.content.children[i], 'jw-active-option', (selectedIndex === i));
                }
            }
            utils.toggleClass(this.el, 'jw-off', (selectedIndex === 0));
        }

        reset() {
            utils.addClass(this.el, 'jw-off');
            this.iconUI.off();
            if (this.contentUI) {
                this.contentUI.off().destroy();
            }
            this.removeContent();
        }
    };
});
