export default {
    userLogin: '/api/user/Login',
    userProfile: '/api/user/GetUserProfile',
    userSignup: '/api/user/Register',
    getAllPost: '/api/user/GetAllPosts',

    getAllUsers: '/api/admin/GetAllUser',
    getUserById: '/api/user/GetUserById',

    getAllNotifications: '/api/user/GetUserAllNotifications',
    getAllMyPosts: '/api/user/GetAllMyPost',
    getAllPostsOfAUser: '/api/user/GetAllPostofaUser',
    SavePost: '/api/user/SavePost',
    removeSavedPost: '/api/user/removeSavedPost',
    likeUnlike: '/api/user/LikeUnlikePost',
    disLikePost: '/api/user/UnlikePost',
    getCurrentStories: '/api/user/GetCurrentStories',
    getAllShops: '/api/user/GetAllSellerShop',
    getAllProductsOfAShop: '/api/user/GetProductsByShop',

    // ─── My Listings (a regular user's own shop, web calls this "Listing") ────
    getMyShops: '/api/user/GetUserAllShop',
    createMyShop: '/api/user/CreateShop',
    updateMyShop: '/api/user/UpdateShop',
    deleteMyShop: '/api/user/DeleteMyShop',
    getListingProducts: '/api/user/GetAllProductsOfShop',
    listingProductDetail: '/api/user/GetAProductDetails',
    updateListingProduct: '/api/user/UpdateAProduct',
    deleteListingProduct: '/api/user/DeleteAProduct',
    listingProductReviews: '/api/user/GetAllReviewofaProduct',
    createProductReview: '/api/user/CreateProductReview',
    deleteProductReview: '/api/user/DeleteReview',
    getAllChattedUsers: '/api/user/GetAllChatedUser',
    getAllSavedPosts: '/api/user/GetAllSavedPosts',
    followedUserStories: '/api/user/GetFollowedUserStories',
    getAllCommentofaPost: '/api/user/GetAllCommentofaPost',
    sendCommentOnPost: '/api/user/CreateComment',
    editComment: '/api/user/UpdateComment',

    getStoryViewers:'/api/user/GetStoryViewers',
    replyOnOthersStory:'/api/user/ReplyToStory',
    reactToStory:'/api/user/ReactToStory',
    watchStory:'/api/user/ViewStrories',

    getAllFollowers: '/api/user/GetAllfollowers',
    getAllFollowings: '/api/user/GetAllFollowing',
    productDetails: '/api/user/GetProductDetail',
    ChatHistory: '/api/user/GetChatHistory',

    sendFollowRequest: '/api/user/SendFollowRequest',
    updateLocation: '/api/user/UpdateLocation',
    acceptFollowReq:'/api/user/ApproveFollowRequest',

    reportPost:'/api/user/CreatePostReport',

    // ─── Post Promotion (web: Pages/PaidPromotion) ────────────────────────────
    createPostPromotion: '/api/user/CreatePostPromotion',
    getMyPostPromotions: '/api/user/GetMyPostPromotions',

    // ─── Seller ────────────────────────────────────────────────────────────
    sellerLogin: '/api/seller/Login',
    sellerSignup: '/api/seller/Register',
    sellerProfile: '/api/seller/GetSellerProfile',
    sellerUpdateProfile: '/api/seller/SellerUpdateProfile',
    sellerAllShop: '/api/seller/GetSellerAllShop',
    sellerCreateShop: '/api/seller/SellerCreateShop',
    sellerUpdateShop: '/api/seller/SellerUpdateShop',
    sellerDeleteShop: '/api/seller/SellerDeleteMyShop',
    sellerAllProducts: '/api/seller/GetAllProductsOfSeller',
    sellerCreateProduct: '/api/seller/SellerCreateProduct',
    sellerUpdateProduct: '/api/seller/UpdateASellerProduct',
    sellerDeleteProduct: '/api/seller/DeleteASellerProduct',
    sellerProductDetail: '/api/seller/GetASellerProductDetails',
    sellerChatUsers: '/api/seller/GetAllChatedUsers',
    sellerChatHistory: '/api/seller/GetSellerUserChatHistory',
    sellerUpdateLocation: '/api/seller/SellerUpdateLocation',
    sellerToggleShowData: '/api/seller/ToggleShowData',

};
