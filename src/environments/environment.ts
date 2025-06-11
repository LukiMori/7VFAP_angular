export const environment = {

  EMPTY_MAP_FORM: {
    street: '',
    houseNumber: '',
    city: '',
    zip: '',
    country: '',
  },

  EMPTY_USER: {
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  },

  MAP_API_KEY: '4vBH4gDiYth1E7PsV6DeBfiOCQ-4RR2-Xn3ZjBEETbY',
  MAP_API_URL: 'https://api.mapy.cz/v1/',

  SIGNUP_TOKEN_URL: "http://localhost:8081/api/auth/register",
  LOGIN_TOKEN_URL: "http://localhost:8081/api/auth/login",

  PROFILE_CHANGE_URL: "http://localhost:8081/api/auth/profile/update",
  PROFILE_GET_INFO_URL: "http://localhost:8081/api/auth/profile",
  PROFILE_GET_ADDRESS_URL: "http://localhost:8081/api/address",

  GET_CATEGORY_URL: "http://localhost:8081/api/categories",
  GET_PRODUCTS_BY_CATEGORY_URL: "http://localhost:8081/api/products/by-category",

  GET_PRODUCTS_URL: "http://localhost:8081/api/products",

  GET_ORDERS_URL: "http://localhost:8081/api/orders",

  GET_CART_URL: "http://localhost:8081/api/cart",
  UPDATE_CART_URL: "http://localhost:8081/api/cart/update",
  CHECK_CART_AVAILABILITY_URL: "http://localhost:8081/api/cart/check-availability",
  REMOVE_CART_ITEM_URL: 'http://localhost:8081/api/cart/remove',

  CONFIRM_ORDER_URL: "http://localhost:8081/api/cart/confirm-order",
};






