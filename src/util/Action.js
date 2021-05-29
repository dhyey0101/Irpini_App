import { defaultRestClient } from './restclient';
import {user_registration,
        user_login,city_list,
        get_user_details,
        favorite_product_category_list,
        favorite_product_list_by_category_id,
        view_product_by_id,
        news_list,
        user_profile_update,
        user_request_mail_support,
        news_details,
        educational_list,
        educational_details,
        garbage_category_list,
        product_list_by_cat_id,
        add_favorite_product,
        assign_city_user,
        department_list,
        assign_department_user,
        check_user_exist,
        otp_verification,
        forgot_password,
        get_all_collection_points,
        get_refuiti_special_product_list,
        get_collection_points_by_product,
        add_complaint_by_corporate,
        request_bulky_waste,
        schedule_list_by_category_id,
        GETMARKETPLACECATEGORIES,
        GETMARKETPLACESUBCATEGORIES,
        GETMARKETPLACESUBCATEGORIESADVERTLIST,
        GETMARKETPLACESUBCATEGORIESADVERTLISTPRODUCTVIEW,
        user_all_schedule_list,
        SAVEADVERPRODUCTDATA,
        GETMYADVERTLISTMARKETPLAE,
        complaint_list,
        view_complaint_by_id,
        own_complaint_list,
        DELETEMYADS,
        DISABLEENABLEMYADS,
        DISABLEREPORT,
        ENABLEREPORT,
        DELETEREPORT,
        get_term_condition,
        get_term_condition_market_place,
        get_own_bulky_waste_pickup_list,
        view_bulky_waste_pickup_by_id,
        chi_siamo_details,
        get_collection_service,
        bulky_waste_city_list,
        get_term_and_condition_reporting

} from './API';

//login action
export const user_registrationAction = (data) => {
    return defaultRestClient.postWithBody(user_registration, data);
}
export const user_loginAction = (data) => {
    return defaultRestClient.postWithBody(user_login, data);
}
export const city_listAction = (data) => {
    return defaultRestClient.postWithBody(city_list, data);
}
export const get_user_detailsAction = (data) => {
    return defaultRestClient.postWithBody(get_user_details, data);
}
export const favourite_product_category_listAction = (data) => {
    return defaultRestClient.postWithBody(favorite_product_category_list, data);
}
export const favorite_product_list_by_category_idAction = (data) => {
    return defaultRestClient.postWithBody(favorite_product_list_by_category_id, data);
}

export const view_product_by_idAction = (data) => {
    return defaultRestClient.postWithBody(view_product_by_id, data);
}

// export const user_profile_updateAction = (data) => {
//     return defaultRestClient.postWithBody(user_profile_update, data);
// }

export const user_profile_updateAction = (data) => {
    return defaultRestClient.postWithBody(user_profile_update, data);
}

export const news_listAction = (data) => {
    return defaultRestClient.postWithBody(news_list, data);
}

export const educational_listAction = (data) => {
    return defaultRestClient.postWithBody(educational_list, data);
}

export const user_request_mail_supportAction = (data) => {
    return defaultRestClient.postWithBody(user_request_mail_support, data);
}

export const news_detailAction = (data) => {
    return defaultRestClient.postWithBody(news_details, data);
}

export const educational_detailsAction = (data) => {
    return defaultRestClient.postWithBody(educational_details, data);
}

export const assign_city_userAction = (data) => {
    return defaultRestClient.postWithBody(assign_city_user, data);
}

export const garbage_category_listAction = (data) => {
    return defaultRestClient.postWithBody(garbage_category_list, data);
}

export const product_list_by_cat_idAction = (data) => {
    return defaultRestClient.postWithBody(product_list_by_cat_id, data);
}

export const add_favorite_productAction = (data) => {
    return defaultRestClient.postWithBody(add_favorite_product, data);
}

export const department_listAction = (data) => {
    return defaultRestClient.postWithBody(department_list, data);
}

export const assign_department_userAction = (data) => {
    return defaultRestClient.postWithBody(assign_department_user, data);
}

export const check_user_existAction = (data) => {
    return defaultRestClient.postWithBody(check_user_exist, data);
}

export const otp_verificationAction = (data) => {
    return defaultRestClient.postWithBody(otp_verification, data);
}

export const reset_passwordAction = (data) => {
    return defaultRestClient.postWithBody(forgot_password, data);
}

export const get_all_collection_pointsAction = (data) => {
    return defaultRestClient.postWithBody(get_all_collection_points, data);
}

export const get_refuiti_special_product_listAction = (data) => {
    return defaultRestClient.postWithBody(get_refuiti_special_product_list, data);
}

export const get_collection_points_by_productAction = (data) => {
    return defaultRestClient.postWithBody(get_collection_points_by_product, data);
}
export const schedule_list_by_category_idAction = (data) => {
    return defaultRestClient.postWithBody(schedule_list_by_category_id, data);
}

export const request_bulky_wasteAction = (data) => {
    return defaultRestClient.postWithBody(request_bulky_waste, data);
}

// get marketplace categories
export const getMarketPlaceCategories = (data) => {
    return defaultRestClient.postWithBody(GETMARKETPLACECATEGORIES, data);
}

// get marketplace sub categories
export const getMarketPlaceSubCategories = (data) => {
    return defaultRestClient.postWithBody(GETMARKETPLACESUBCATEGORIES, data);
}

// get marketplace sub categories advert list
export const getMarketPlaceSubCategoriesAdvertList = (data) => {
    return defaultRestClient.postWithBody(GETMARKETPLACESUBCATEGORIESADVERTLIST, data);
}

// get marketplace advert product view
export const getMarketPlaceSubCategoriesAdvertProductView = (data) => {
    return defaultRestClient.postWithBody(GETMARKETPLACESUBCATEGORIESADVERTLISTPRODUCTVIEW, data);
}

export const user_all_schedule_listAction = (data) => {
    return defaultRestClient.postWithBody(user_all_schedule_list, data);
}

export const add_complaint_by_corporateAction = (data) => {
    return defaultRestClient.postWithBody(add_complaint_by_corporate, data);
}

// Add advert product 
export const saveAdvertProductData = (data) => {
    return defaultRestClient.postWithBody(SAVEADVERPRODUCTDATA, data);
}

// get my advert list
export const getMarketPlaceMyAdvertList = (data) => {
    return defaultRestClient.postWithBody(GETMYADVERTLISTMARKETPLAE, data);
}

// delete my advert 
export const deleteMyAds = (data) => {
    return defaultRestClient.postWithBody(DELETEMYADS, data);
}

// disable and enable my advert 
export const disableMyAd = (data) => {
    return defaultRestClient.postWithBody(DISABLEENABLEMYADS, data);
}

// disable report
export const disableReport = (data) => {
    return defaultRestClient.postWithBody(DISABLEREPORT, data);
}

// enable report
export const enableReport = (data) => {
    return defaultRestClient.postWithBody(ENABLEREPORT, data);
}

// delete report
export const deleteReport = (data) => {
    return defaultRestClient.postWithBody(DELETEREPORT, data);
}

export const complaint_listAction = (data) => {
    return defaultRestClient.postWithBody(complaint_list, data);
}

export const view_complaint_by_idAction = (data) => {
    return defaultRestClient.postWithBody(view_complaint_by_id, data);
}

export const own_complaint_listAction = (data) => {
    return defaultRestClient.postWithBody(own_complaint_list, data);
}

export const get_term_conditionAction = () => {
    return defaultRestClient.postWithBody(get_term_condition);
}

export const get_term_and_condition_reportingAction = () => {
    return defaultRestClient.postWithBody(get_term_and_condition_reporting);
}
export const get_collection_serviceAction = () => {
    return defaultRestClient.postWithBody(get_collection_service);
}

export const get_term_condition_market_placeAction = () => {
    return defaultRestClient.postWithBody(get_term_condition_market_place);
}

export const get_own_bulky_waste_pickup_listAction = (data) => {
    return defaultRestClient.postWithBody(get_own_bulky_waste_pickup_list, data);
}

export const view_bulky_waste_pickup_by_idAction = (data) => {
    return defaultRestClient.postWithBody(view_bulky_waste_pickup_by_id, data);
}

export const chi_siamo_detailsAction = (data) => {
    return defaultRestClient.postWithBody(chi_siamo_details, data);
}

export const bulky_waste_city_listAction = (data) => {
    return defaultRestClient.postWithBody(bulky_waste_city_list, data);
}

