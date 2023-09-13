import {
  UserOutlined,
  TeamOutlined,
  UserSwitchOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";

export const CREATED_DCT_TALENTS_PULSE = "2023";
export const ROLE_CANDIDATE = "candidate";
export const ROLE_ADMIN = "admin";
export const ROLE_MEMBER = "user";
export const ROLE_CUSTOMER = "customer";
export const KEY_FULLNAME = "fullname";
export const KEY_PROFILE = "profile";
export const KEY_PASSWORD = "change-password";
export const KEY_LOGOUT = "logout";
export const FORMAT_DATE = "DD/MM/YYYY";
export const FORMAT_MONTH_FORMAT = "MM/YYYY";
export const FORMAT_DATE_AGO = "YYYYMMDD";
export const FORMAT_DATETIME = "DD/MM/YYYY HH:mm:ss";
export const DATE_PICKER_FORMAT = "YYYY/MM/DD";
export const ACTION_ADD = "create";
export const ACTION_EDIT = "update";
export const ACTION_ACTIVE = "active";
export const ACTION_DISABLED = "disabled";
export const STATUS_ACTIVE = "Active";
export const STATUS_PENDING = "Pending";
export const STATUS_DISABLED = "Disabled";
export const STATUS_SUSPENDED = "Suspended";
export const ROLES = [
  { id: 1, name: "admin", icon: <TeamOutlined /> },
  { id: 2, name: "user", icon: <UserSwitchOutlined /> },
  { id: 3, name: "candidate", icon: <UserOutlined /> },
];
export const STATUS = [
  { id: 1, name: STATUS_ACTIVE, icon: <CheckCircleOutlined className="dct-talents-pulse-success" /> },
  { id: 2, name: STATUS_PENDING, icon: <ClockCircleOutlined className="dct-talents-pulse-warning" /> },
  { id: 3, name: STATUS_DISABLED, icon: <CloseCircleOutlined className="dct-talents-pulse-danger" /> },
  { id: 4, name: STATUS_SUSPENDED, icon: <StopOutlined className="dct-talents-pulse-tomato" /> },
];
export const MONTH = "Month";
export const YEAR = "Year";

export const DCT_ACTION_DESCRIPTION = "description";
export const DCT_ACTION_SALARY = "salary";
export const DCT_ACTION_DESCRIPTION_SALARY = "description-salary";
export const DCT_ACTION_SKILLS = "skills";
export const DCT_ACTION_PROJECTS = "projects";
export const DCT_ACTION_PROJECTS_DETAIL = "projects-detail";
export const DCT_ACTION_FORMATIONS = "formations";
export const DCT_ACTION_TECNICAL_SKILLS = "tecnicalSkills";
export const DCT_ACTION_LINGUISTICS = "linguistics";
export const DCT_ACTION_MATRICULE = "matricule";
export const ACTIVITY_CREATE_DCT = "ACTIVITY_CREATE_DCT";
export const DEFAULT_PASSWORD = "TalentsPulse@1234*";

export const REGREX_EMAIL =
  /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;
export const AFTER_7_DAYS = 7 * 24 * 60 * 60 * 1000;
export const NAME_ECOMMERCE = "xxxxx";
export const PREFIX_ECOMMERCE = "ECOM";
export const CREATED_ECOMMERCE = "2021";
export const CTA_VIEW = "View details";
export const CTA_UPDATE = "Update";
export const CTA_DELETE = "Delete";
export const POSITION_LEFT = "left";
export const POSITION_CENTER = "center";
export const POSITION_RIGHT = "right";
export const FORMAT_JPEG = "JPEG";
export const FORMAT_BASE_64 = "base64";

export const KEY_STATUS = "status";
export const KEY_VISIBILITY = "visibility";
export const KEY_DASHBOARD = "dashboard";
export const GENDER_MALE = "Male";
export const GENDER_FEMALE = "Female";
export const EMPTY_VALUE = "Not specified";
export const GOOGLE_PROVIDER = "google";
export const FACEBOOK_PROVIDER = "facebook";
export const PASSWORD_PROVIDER = "password";
export const STATUS_ORDER_CASH = "Cash On Delivery";
export const STATUS_ORDER_NOT_PROCESSED = "Not Processed";
export const STATUS_ORDER_PROCESSING = "Processing";
export const STATUS_ORDER_DISPATCHED = "Dispatched";
export const STATUS_ORDER_CANCELLED = "Cancelled";
export const STATUS_ORDER_COMPLETED = "Completed";
export const BREADCRUMB_DASHBOARD = "dashboard";
export const BREADCRUMB_HOME = "home";
export const BREADCRUMB_LOGIN_CONTENT = "Login Content";
export const BREADCRUMB_NEWSLETTER_CONTENT = "Newsletters Content";
export const BREADCRUMB_PASSWORD_CONTENT = "Password Content";
export const BREADCRUMB_REGISTER_CONTENT = "Register Content";
export const BREADCRUMB_BANNER_ADS_ROUTE = "banners";
export const BREADCRUMB_BANNER_ADS_LIST = "Banner Ads List";
export const BREADCRUMB_BANNER_ADS_CREATE = "Create banner Ads";
export const BREADCRUMB_BANNER_ADS_UPDATE = "Update banner Ads";
export const BREADCRUMB_PRODUCTS_LIST = "Products Store";
export const BREADCRUMB_PRODUCT_CREATE = "Create product";
export const BREADCRUMB_PRODUCT_UPDATE = "Update product";
export const BREADCRUMB_PRODUCT_VIEW = "Details product";
export const BREADCRUMB_PRODUCTS_ROUTE = "products";
export const BREADCRUMB_PRODUCTS_TYPES = "Products Type Store";
export const BREADCRUMB_PRODUCT_TYPE_CREATE = "Create product type";
export const BREADCRUMB_PRODUCT_TYPE_UPDATE = "Update product type";
export const BREADCRUMB_PRODUCT_TYPE_VIEW = "Details product type";
export const BREADCRUMB_PRODUCTS_TYPES_ROUTE = "products/types";
export const BREADCRUMB_PRODUCTS_CONDITIONS = "Products Condition Store";
export const BREADCRUMB_PRODUCT_CONDITION_CREATE = "Create product condition";
export const BREADCRUMB_PRODUCT_CONDITION_UPDATE = "Update product condition";
export const BREADCRUMB_PRODUCT_CONDITION_VIEW = "Details product condition";
export const BREADCRUMB_PRODUCTS_CONDITIONS_ROUTE = "products/conditions";
export const BREADCRUMB_CATEGORIES = "Categories Store";
export const BREADCRUMB_CATEGORY_CREATE = "Create category";
export const BREADCRUMB_CATEGORY_UPDATE = "Update category";
export const BREADCRUMB_CATEGORY_VIEW = "Details category";
export const BREADCRUMB_CATEGORIES_ROUTE = "categories";
export const BREADCRUMB_SUBCATEGORIES = "Sub categories Store";
export const BREADCRUMB_SUBCATEGORY_CREATE = "Create sub category";
export const BREADCRUMB_SUBCATEGORY_UPDATE = "Update sub category";
export const BREADCRUMB_SUBCATEGORY_VIEW = "Details sub category";
export const BREADCRUMB_SUBCATEGORIES_ROUTE = "subcategories";
export const BREADCRUMB_CHILDCATEGORIES = "Child categories Store";
export const BREADCRUMB_CHILDBCATEGORY_CREATE = "Create child category";
export const BREADCRUMB_CHILDCATEGORY_UPDATE = "Update child category";
export const BREADCRUMB_CHILDCATEGORY_VIEW = "Details child category";
export const BREADCRUMB_CHILDCATEGORIES_ROUTE = "subcategory-children";
export const BREADCRUMB_BRANDS = "Brands Store";
export const BREADCRUMB_BRAND_CREATE = "Create brand";
export const BREADCRUMB_BRAND_UPDATE = "Update brand";
export const BREADCRUMB_BRAND_VIEW = "Details brand";
export const BREADCRUMB_BRANDS_ROUTE = "brands";
export const BREADCRUMB_GLOSSARIES_OBJECT = "Glossaries Object Store";
export const BREADCRUMB_GLOSSARY_OBJECT_CREATE = "Create glossary object";
export const BREADCRUMB_COLORS = "Colors Store";
export const BREADCRUMB_COLOR_CREATE = "Create color";
export const BREADCRUMB_COLOR_UPDATE = "Update color";
export const BREADCRUMB_COLOR_VIEW = "Details color";
export const BREADCRUMB_COLORS_ROUTE = "colors";
export const BREADCRUMB_COUPONS = "Coupons Store";
export const BREADCRUMB_COUPON_CREATE = "Create coupon";
export const BREADCRUMB_COUPON_UPDATE = "Update coupon";
export const BREADCRUMB_COUPON_VIEW = "Details coupon";
export const BREADCRUMB_COUPONS_ROUTE = "coupons";
export const BREADCRUMB_ORDERS = "Orders Store";
export const BREADCRUMB_ORDER_CREATE = "Create order";
export const BREADCRUMB_ORDER_UPDATE = "Update order";
export const BREADCRUMB_ORDER_VIEW = "Details order";
export const BREADCRUMB_ORDERS_ROUTE = "orders";
export const BREADCRUMB_FAQS = "Faqs Store";
export const BREADCRUMB_FAQ_CREATE = "Create faq";
export const BREADCRUMB_FAQ_UPDATE = "Update faq";
export const BREADCRUMB_FAQ_VIEW = "Details faq";
export const BREADCRUMB_FAQS_ROUTE = "faqs";
export const BREADCRUMB_SUBFAQS = "Sub faqs Store";
export const BREADCRUMB_SUBFAQ_CREATE = "Create sub faq";
export const BREADCRUMB_SUBFAQ_UPDATE = "Update sub faq";
export const BREADCRUMB_SUBFAQ_VIEW = "Details sub faq";
export const BREADCRUMB_SUBFAQS_ROUTE = "subfaqs";
export const BREADCRUMB_NEWSLETTERS = "Newsletters Store";
export const BREADCRUMB_NEWSLETTERS_SEND = "Send message to subscribers";
export const BREADCRUMB_ADMINS = "Administrators Store";
export const BREADCRUMB_ADMIN_CREATE = "Create administrator";
export const BREADCRUMB_ADMIN_UPDATE = "Update administrator";
export const BREADCRUMB_ADMIN_VIEW = "Details administrator";
export const BREADCRUMB_ADMINS_ROUTE = "administrators";
export const BREADCRUMB_NOTIFICATIONS = "Notifications";
export const NOTIFICATION_ALERT_INFO = "info";
export const NOTIFICATION_ALERT_SUCCESS = "success";
export const NOTIFICATION_ALERT_ERROR = "error";
export const NOTIFICATION_ALERT_WARNING = "warning";
export const NOTIFICATION_ALERT_DANGER = "danger";
export const LOCAL_STORAGE_REMEMBER = "remember-me";
export const LOCAL_STORAGE_AUTH = "dct-user-logged";
