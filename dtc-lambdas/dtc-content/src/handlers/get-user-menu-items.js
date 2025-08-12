const Utils = require('./../../utils/lambda-response');
const MenuPermissions = require('./../../model/menu-permissions.model');
const PortalUserModel = require('./../../model/portal-user.model');
const Message = require('./../../utils/message');
class GetUserMenuItems {
    /**
   * @desc This function is being used to to get user permission wise menu items
   * @author Innovify
   * @since 27/01/2021
   * @param {Object} req Request
   * @param {Object} req.body RequestBody
   * @param {String} req.body.userId User Id
   * @param {String} req.body.email email
   */
    async getUserMenuItems (req) {
        const body = JSON.parse(req.body);
        if (!body.user_id) {
            return Utils.errorResponse(Message.USER_ID_REQUIRED);
        } else if (!body.email) {
            return Utils.errorResponse(Message.EMAIL_REQUIRED);
        } else {
            const user = await PortalUserModel.query('email').eq(body.email.toLowerCase()).exec();
            if (user.count === 0) {
                return Utils.errorResponse(Message.USER_NOT_FOUND);
            }
            const userId = user[0].user_id;
            const userType = user[0].user_type;
            var query = MenuPermissions.query('user_id').eq(userId);
            try {
                const MenuPermissionsData = await query.exec();
                if (MenuPermissionsData.length) {
                    const data = MenuPermissionsData[0];
                    const result = this.prepareMenuData(data, userType);
                    return Utils.successResponse(result);
                } else {
                    return Utils.errorResponse(Message.MENU_PERMISSION_NOT_FOUND);
                }
            } catch (error) {
                return Utils.errorResponse(undefined, error);
            }
        }
    }

    /**
   * @desc This function is being used to Prepare Menu items
   * @param {Object} req data
   * @param {String} userType userType
   */
    prepareMenuData (data, userType) {
        var result;
        if (userType === 'retailer') {
            result = {
                left_menu: [
                    {
                        label: 'Retailer',
                        key: 'retailer',
                        icon: '',
                        menu: []
                    }
                ],
                profile_menu: []
            };
        } else {
            result = {
                left_menu: [
                    {
                        label: 'Brand',
                        key: 'brand',
                        icon: '',
                        menu: []
                    },
                    {
                        label: 'Development',
                        key: 'development',
                        icon: '',
                        menu: []
                    }
                ],
                profile_menu: []
            };
        }
        this.sortMenuData(result, data.menu_items);
        if (data.profile_items) {
            this.sortProfileMenuData(result, data.profile_items);
        }
        return result;
    }

    /**
     * @desc This function is being used to Sort Menu items
     * @param {Object} req result
     * @param {Object} req data
    */
    sortMenuData (result, data) {
        // For sorting menu items
        data.sort((a, b) => (a.order_n < b.order_n ? 1 : -1));
        data.sort((a) => (a.parent_id ? 1 : -1));

        // For Prepare menu items
        result.left_menu.forEach((value, index) => {
            for (var i = 0; i < data.length; i++) {
                if (data[i].menu_category === value.key) {
                    if (!data[i].parent_id) {
                        result.left_menu[index].menu.push({
                            menu_id: data[i].menu_id,
                            label: data[i].menu_name,
                            url: data[i].menu_link,
                            icon: data[i].menu_icon,
                            order_n: data[i].order_n,
                            submenu: []
                        });
                    } else {
                        var pi = result.left_menu[index].menu.findIndex(p => p.menu_id === data[i].parent_id);
                        result.left_menu[index].menu[pi].submenu.push({
                            menu_id: data[i].menu_id,
                            label: data[i].menu_name,
                            url: data[i].menu_link,
                            icon: data[i].menu_icon,
                            order_n: data[i].order_n,
                            parent_id: data[i].parent_id
                        });
                    }
                }
            }
        });

        // For sorting submenu menu items
        for (var typei = 0; typei < result.left_menu.length; typei++) {
            for (var menui = 0; menui < result.left_menu[typei].menu.length; menui++) {
                if (result.left_menu[typei].menu[menui].submenu) {
                    result.left_menu[typei].menu[menui].submenu.sort((a, b) => (a.order_n > b.order_n ? 1 : -1));
                }
            }
        }
        return result;
    }

    /**
     * @desc This function is being used to Sort Profle Menu items
     * @param {Object} req result
     * @param {Object} req data
    */
    sortProfileMenuData (result, data) {
        // For sorting menu items
        data.sort((a, b) => (a.order_n < b.order_n ? 1 : -1));
        data.sort((a) => (a.parent_id ? 1 : -1));

        // For Prepare menu items
        for (var i = 0; i < data.length; i++) {
            result.profile_menu.push({
                menu_id: data[i].menu_id,
                label: data[i].menu_name,
                url: data[i].menu_link,
                icon: data[i].menu_icon,
                order_n: data[i].order_n,
                submenu: []
            });
        }
        return result;
    }
}
module.exports.getUserMenuItemsHandler = async (event) => new GetUserMenuItems().getUserMenuItems(event);
