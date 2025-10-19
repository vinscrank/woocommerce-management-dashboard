// import { Attributo, AttributoOpzioni } from "./Attributo"

import { components } from "./Global";

// import { ProdottoAttributo } from "./ProdottoAttributo"
export type Prodotto = components["schemas"]["WooCommerceProductResponse"];

// export interface components {
//     schemas: {
//         UpdateUserRequest: {
//             name: string;
//             roles: string;
//             active: boolean;
//         };
//         ApiResponseUserResponse: {
//             success?: boolean;
//             data?: components["schemas"]["UserResponse"];
//             message?: string;
//             errors?: Record<string, never>;
//         };
//         UserResponse: {
//             /** Format: int32 */
//             id?: number;
//             name?: string;
//             email?: string;
//             roles?: string;
//             active?: boolean;
//             /** Format: date-time */
//             createdAt?: string;
//             /** Format: date-time */
//             updatedAt?: string;
//         };
//         CreateOrUpdateUserEcommerceRequest: {
//             /** Format: int32 */
//             userId: number;
//             /** Format: int32 */
//             ecommerceId: number;
//             apiPublic?: string;
//             apiSecret?: string;
//             appUsername?: string;
//             appPassword?: string;
//         };
//         ApiResponseUserEcommerceResponse: {
//             success?: boolean;
//             data?: components["schemas"]["UserEcommerceResponse"];
//             message?: string;
//             errors?: Record<string, never>;
//         };
//         EcommerceResponse: {
//             /** Format: int32 */
//             id?: number;
//             name?: string;
//             url?: string;
//             /** @enum {string} */
//             type?: "WORDPRESS";
//             woocommerceApiVersion?: string;
//             wordpressApiVersion?: string;
//             /** Format: date-time */
//             createdAt?: string;
//             /** Format: date-time */
//             updatedAt?: string;
//         };
//         UserEcommerceResponse: {
//             /** Format: int32 */
//             id?: number;
//             user?: components["schemas"]["UserResponse"];
//             ecommerce?: components["schemas"]["EcommerceResponse"];
//         };
//         CreateOrUpdateEcommerceRequest: {
//             name: string;
//             url: string;
//             /** @enum {string} */
//             type: "WORDPRESS";
//             woocommerceApiVersion?: string;
//             wordpressApiVersion?: string;
//         };
//         ApiResponseEcommerceResponse: {
//             success?: boolean;
//             data?: components["schemas"]["EcommerceResponse"];
//             message?: string;
//             errors?: Record<string, never>;
//         };
//         UserRegisterRequest: {
//             email: string;
//             password: string;
//             name: string;
//         };
//         ApiResponseUserLoginResponse: {
//             success?: boolean;
//             data?: components["schemas"]["UserLoginResponse"];
//             message?: string;
//             errors?: Record<string, never>;
//         };
//         UserLoginResponse: {
//             /** Format: int32 */
//             id?: number;
//             name?: string;
//             email?: string;
//             roles?: string;
//             active?: boolean;
//             /** Format: date-time */
//             createdAt?: string;
//             /** Format: date-time */
//             updatedAt?: string;
//             token?: string;
//             /** Format: int64 */
//             expiresIn?: number;
//         };
//         UserLoginRequest: {
//             email: string;
//             password: string;
//         };
//         DimensionsRequest: {
//             length: string;
//             width: string;
//             height: string;
//         };
//         ImageRequest: {
//             /** Format: int32 */
//             id: number;
//             name: string;
//             src: string;
//             alt?: string;
//         };
//         LinkToCategoryRequest: {
//             /** Format: int32 */
//             id: number;
//         };
//         LinkToTagRequest: {
//             /** Format: int32 */
//             id: number;
//         };
//         WooCommerceAttributeRequest: {
//             /** Format: int32 */
//             id?: number;
//             name?: string;
//             /** Format: int32 */
//             position?: number;
//             visible?: boolean;
//             variation?: boolean;
//             options?: string[];
//         };
//         WooCommerceDefaultAttributeRequest: {
//             /** Format: int32 */
//             id: number;
//             name: string;
//             option: string;
//         };
//         WooCommerceDownloadRequest: {
//             /** Format: int32 */
//             id?: number;
//             name: string;
//             file: string;
//         };
//         WooCommerceMetaRequest: Record<string, never>;
//         WooCommerceProductRequest: {
//             /** Format: int32 */
//             id?: number;
//             name?: string;
//             link?: string;
//             type?: string;
//             status?: string;
//             description?: string;
//             sku?: string;
//             price?: string;
//             slug?: string;
//             permalink?: string;
//             dateCreated?: string;
//             dateCreatedGmt?: string;
//             dateModified?: string;
//             dateModifiedGmt?: string;
//             featured?: boolean;
//             catalogVisibility?: string;
//             shortDescription?: string;
//             regularPrice?: string;
//             salePrice?: string;
//             dateOnSaleFrom?: string;
//             dateOnSaleFromGmt?: string;
//             dateOnSaleTo?: string;
//             dateOnSaleToGmt?: string;
//             virtual?: boolean;
//             downloadable?: boolean;
//             downloads?: components["schemas"]["WooCommerceDownloadRequest"][];
//             /** Format: int32 */
//             downloadLimit?: number;
//             /** Format: int32 */
//             downloadExpiry?: number;
//             externalUrl?: string;
//             buttonText?: string;
//             taxStatus?: string;
//             taxClass?: string;
//             manageStock?: boolean;
//             /** Format: int32 */
//             stockQuantity?: number;
//             stockStatus?: string;
//             backorders?: string;
//             soldIndividually?: boolean;
//             weight?: string;
//             dimensions?: components["schemas"]["DimensionsRequest"];
//             shippingClass?: string;
//             reviewsAllowed?: boolean;
//             upsellIds?: number[];
//             crossSellIds?: number[];
//             /** Format: int32 */
//             parentId?: number;
//             purchaseNote?: string;
//             categories?: components["schemas"]["LinkToCategoryRequest"][];
//             tags?: components["schemas"]["LinkToTagRequest"][];
//             images?: components["schemas"]["ImageRequest"][];
//             attributes?: components["schemas"]["WooCommerceAttributeRequest"][];
//             defaultAttributes?: components["schemas"]["WooCommerceDefaultAttributeRequest"][];
//             groupedProducts?: Record<string, never>[];
//             /** Format: int32 */
//             menuOrder?: number;
//             metaData?: components["schemas"]["WooCommerceMetaRequest"][];
//         };
//         Ecommerce: {
//             /** Format: int32 */
//             id?: number;
//             name?: string;
//             url?: string;
//             /** @enum {string} */
//             type?: "WORDPRESS";
//             woocommerceApiVersion?: string;
//             wordpressApiVersion?: string;
//             /** Format: date-time */
//             createdAt?: string;
//             /** Format: date-time */
//             updatedAt?: string;
//             userEcommerces?: components["schemas"]["UserEcommerce"][];
//             users?: components["schemas"]["User"][];
//         };
//         GrantedAuthority: {
//             authority?: string;
//         };
//         User: {
//             /** Format: int32 */
//             id?: number;
//             name?: string;
//             email?: string;
//             roles?: string;
//             active?: boolean;
//             /** Format: date-time */
//             lastLoginAt?: string;
//             /** Format: date-time */
//             createdAt?: string;
//             /** Format: date-time */
//             updatedAt?: string;
//             userEcommerces?: components["schemas"]["UserEcommerce"][];
//             ecommerces?: components["schemas"]["Ecommerce"][];
//             authorities?: components["schemas"]["GrantedAuthority"][];
//             username?: string;
//             accountNonExpired?: boolean;
//             accountNonLocked?: boolean;
//             credentialsNonExpired?: boolean;
//             enabled?: boolean;
//         };
//         UserEcommerce: {
//             /** Format: int32 */
//             id?: number;
//             user?: components["schemas"]["User"];
//             ecommerce?: components["schemas"]["Ecommerce"];
//             apiPublic?: string;
//             apiSecret?: string;
//             appUsername?: string;
//             appPassword?: string;
//             /** Format: date-time */
//             createdAt?: string;
//             /** Format: date-time */
//             updatedAt?: string;
//         };
//         ApiResponseWooCommerceProductResponse: {
//             success?: boolean;
//             data?: components["schemas"]["WooCommerceProductResponse"];
//             message?: string;
//             errors?: Record<string, never>;
//         };
//         Category: {
//             /** Format: int32 */
//             id?: number;
//             name?: string;
//             slug?: string;
//         };
//         DimensionsResponse: {
//             length?: string;
//             width?: string;
//             height?: string;
//         };
//         LinkItem: {
//             href?: string;
//         };
//         Links: {
//             self?: components["schemas"]["LinkItem"][];
//             collection?: components["schemas"]["LinkItem"][];
//         };
//         WooCommerceAttributeResponse: {
//             /** Format: int32 */
//             id?: number;
//             name?: string;
//             /** Format: int32 */
//             position?: number;
//             visible?: boolean;
//             variation?: boolean;
//             options?: string[];
//         };
//         WooCommerceDefaultAttributeResponse: {
//             /** Format: int32 */
//             id?: number;
//             name?: string;
//             option?: string;
//         };
//         WooCommerceDownloadResponse: {
//             /** Format: int32 */
//             id?: number;
//             name?: string;
//             file?: string;
//         };
//         WooCommerceImage: {
//             /** Format: int32 */
//             id?: number;
//             src?: string;
//             name?: string;
//             alt?: string;
//             createdAt?: string;
//             createdAtGmt?: string;
//             updatedAt?: string;
//             updatedAtGmt?: string;
//             dateCreated?: string;
//             dateCreatedGmt?: string;
//             dateModified?: string;
//             dateModifiedGmt?: string;
//         };
//         WooCommerceMetaResponse: {
//             /** Format: int32 */
//             id?: number;
//             name?: string;
//             value?: string;
//         };
//         WooCommerceProductResponse: {
//             /** Format: int32 */
//             id?: number;
//             name?: string;
//             link?: string;
//             type?: string;
//             status?: string;
//             description?: string;
//             sku?: string;
//             price?: string;
//             createdAt?: string;
//             createdAtGmt?: string;
//             updatedAt?: string;
//             updatedAtGmt?: string;
//             slug?: string;
//             permalink?: string;
//             dateCreated?: string;
//             dateCreatedGmt?: string;
//             dateModified?: string;
//             dateModifiedGmt?: string;
//             featured?: boolean;
//             catalogVisibility?: string;
//             shortDescription?: string;
//             regularPrice?: string;
//             salePrice?: string;
//             dateOnSaleFrom?: string;
//             dateOnSaleFromGmt?: string;
//             dateOnSaleTo?: string;
//             dateOnSaleToGmt?: string;
//             priceHtml?: string;
//             onSale?: boolean;
//             purchasable?: boolean;
//             /** Format: int32 */
//             totalSales?: number;
//             virtual?: boolean;
//             downloadable?: boolean;
//             downloads?: components["schemas"]["WooCommerceDownloadResponse"][];
//             /** Format: int32 */
//             downloadLimit?: number;
//             /** Format: int32 */
//             downloadExpiry?: number;
//             externalUrl?: string;
//             buttonText?: string;
//             taxStatus?: string;
//             taxClass?: string;
//             manageStock?: boolean;
//             /** Format: int32 */
//             stockQuantity?: number;
//             stockStatus?: string;
//             backorders?: string;
//             backordersAllowed?: boolean;
//             backordered?: boolean;
//             soldIndividually?: boolean;
//             weight?: string;
//             dimensions?: components["schemas"]["DimensionsResponse"];
//             shippingRequired?: boolean;
//             shippingTaxable?: boolean;
//             shippingClass?: string;
//             /** Format: int32 */
//             shippingClassId?: number;
//             reviewsAllowed?: boolean;
//             averageRating?: string;
//             /** Format: int32 */
//             ratingCount?: number;
//             relatedIds?: number[];
//             upsellIds?: number[];
//             crossSellIds?: number[];
//             /** Format: int32 */
//             parentId?: number;
//             purchaseNote?: string;
//             categories?: components["schemas"]["Category"][];
//             tags?: components["schemas"]["WooCommerceTagResponse"][];
//             images?: components["schemas"]["WooCommerceImage"][];
//             attributes?: components["schemas"]["WooCommerceDefaultAttributeResponse"][];
//             defaultAttributes?: components["schemas"]["WooCommerceAttributeResponse"][];
//             variations?: number[];
//             groupedProducts?: Record<string, never>[];
//             /** Format: int32 */
//             menuOrder?: number;
//             metaData?: components["schemas"]["WooCommerceMetaResponse"][];
//             get_links?: components["schemas"]["Links"];
//         };
//         WooCommerceTagResponse: {
//             /** Format: int32 */
//             id?: number;
//             name?: string;
//             slug?: string;
//         };
//         WooCommerceProductVariationRequest: {
//             /** Format: int32 */
//             id?: number;
//             sku?: string;
//             regularPrice?: string;
//             salePrice?: string;
//             dateOnSaleFrom?: string;
//             dateOnSaleFromGmt?: string;
//             dateOnSaleTo?: string;
//             dateOnSaleToGmt?: string;
//             virtual?: boolean;
//             downloadable?: boolean;
//             downloads?: components["schemas"]["WooCommerceDownloadRequest"][];
//             /** Format: int32 */
//             downloadLimit?: number;
//             /** Format: int32 */
//             downloadExpiry?: number;
//             taxStatus?: string;
//             taxClass?: string;
//             manageStock?: Record<string, never>;
//             /** Format: int32 */
//             stockQuantity?: number;
//             stockStatus?: string;
//             backorders?: string;
//             soldIndividually?: boolean;
//             weight?: string;
//             dimensions?: components["schemas"]["DimensionsRequest"];
//             shippingClass?: string;
//             attributes?: components["schemas"]["WooCommerceDefaultAttributeRequest"][];
//             /** Format: int32 */
//             menuOrder?: number;
//             description?: string;
//             image?: string;
//             metaData?: components["schemas"]["WooCommerceMetaRequest"][];
//         };
//         ApiResponseWooCommerceProductVariationResponse: {
//             success?: boolean;
//             data?: components["schemas"]["WooCommerceProductVariationResponse"];
//             message?: string;
//             errors?: Record<string, never>;
//         };
//         WooCommerceProductVariationResponse: {
//             /** Format: int32 */
//             id?: number;
//             sku?: string;
//             price?: string;
//             regularPrice?: string;
//             salePrice?: string;
//             dateOnSaleFrom?: string;
//             dateOnSaleTo?: string;
//             onSale?: boolean;
//             status?: string;
//             description?: string;
//             shortDescription?: string;
//             manageStock?: Record<string, never>;
//             /** Format: int32 */
//             stockQuantity?: number;
//             stockStatus?: string;
//             visible?: boolean;
//             virtual?: boolean;
//             downloadable?: boolean;
//             downloads?: components["schemas"]["WooCommerceDownloadResponse"][];
//             /** Format: int32 */
//             downloadLimit?: number;
//             /** Format: int32 */
//             downloadExpiry?: number;
//             taxStatus?: string;
//             taxClass?: string;
//             shippingClass?: string;
//             weight?: string;
//             shippingClassId?: string;
//             dimensions?: components["schemas"]["DimensionsResponse"];
//             shippingRequired?: boolean;
//             shippingTaxable?: boolean;
//             shippingClassSlug?: string;
//             backordersAllowed?: boolean;
//             backordered?: boolean;
//             backorders?: string;
//             soldIndividually?: boolean;
//             purchaseNote?: string;
//             attributes?: components["schemas"]["WooCommerceDefaultAttributeResponse"][];
//             menuOrder?: string;
//             image?: components["schemas"]["WooCommerceImage"][];
//             virtualDownloads?: number[];
//             parentIsVisible?: boolean;
//             parentIsPurchasable?: boolean;
//             get_links?: components["schemas"]["Links"];
//         };
//         BatchWoocommerceProductVariationRequest: {
//             create?: components["schemas"]["WooCommerceProductVariationRequest"][];
//             update?: components["schemas"]["WooCommerceProductVariationRequest"][];
//             delete?: number[];
//         };
//         ApiResponseBatchWooCommerceProductVariationResponse: {
//             success?: boolean;
//             data?: components["schemas"]["BatchWooCommerceProductVariationResponse"];
//             message?: string;
//             errors?: Record<string, never>;
//         };
//         BatchWooCommerceProductVariationResponse: {
//             create?: components["schemas"]["WooCommerceProductVariationResponse"][];
//             update?: components["schemas"]["WooCommerceProductVariationResponse"][];
//             delete?: components["schemas"]["WooCommerceProductVariationResponse"][];
//         };
//         BatchWoocommerceProductRequest: {
//             create?: components["schemas"]["WooCommerceProductRequest"][];
//             update?: components["schemas"]["UpdateWoocommerceProductRequest"][];
//             delete?: number[];
//         };
//         UpdateWoocommerceProductRequest: {
//             /** Format: int32 */
//             id: number;
//             name?: string;
//             link?: string;
//             type?: string;
//             status?: string;
//             description?: string;
//             sku?: string;
//             price?: string;
//             slug?: string;
//             permalink?: string;
//             dateCreated?: string;
//             dateCreatedGmt?: string;
//             dateModified?: string;
//             dateModifiedGmt?: string;
//             featured?: boolean;
//             catalogVisibility?: string;
//             shortDescription?: string;
//             regularPrice?: string;
//             salePrice?: string;
//             dateOnSaleFrom?: string;
//             dateOnSaleFromGmt?: string;
//             dateOnSaleTo?: string;
//             dateOnSaleToGmt?: string;
//             virtual?: boolean;
//             downloadable?: boolean;
//             downloads?: components["schemas"]["WooCommerceDownloadRequest"][];
//             /** Format: int32 */
//             downloadLimit?: number;
//             /** Format: int32 */
//             downloadExpiry?: number;
//             externalUrl?: string;
//             buttonText?: string;
//             taxStatus?: string;
//             taxClass?: string;
//             manageStock?: boolean;
//             /** Format: int32 */
//             stockQuantity?: number;
//             stockStatus?: string;
//             backorders?: string;
//             soldIndividually?: boolean;
//             weight?: string;
//             dimensions?: components["schemas"]["DimensionsRequest"];
//             shippingClass?: string;
//             reviewsAllowed?: boolean;
//             upsellIds?: number[];
//             crossSellIds?: number[];
//             /** Format: int32 */
//             parentId?: number;
//             purchaseNote?: string;
//             categories?: components["schemas"]["LinkToCategoryRequest"][];
//             tags?: components["schemas"]["LinkToTagRequest"][];
//             images?: components["schemas"]["ImageRequest"][];
//             attributes?: components["schemas"]["WooCommerceAttributeRequest"][];
//             defaultAttributes?: components["schemas"]["WooCommerceDefaultAttributeRequest"][];
//             groupedProducts?: Record<string, never>[];
//             /** Format: int32 */
//             menuOrder?: number;
//             metaData?: components["schemas"]["WooCommerceMetaRequest"][];
//         };
//         ApiResponseBatchWoocommerceProductResponse: {
//             success?: boolean;
//             data?: components["schemas"]["BatchWoocommerceProductResponse"];
//             message?: string;
//             errors?: Record<string, never>;
//         };
//         BatchWoocommerceProductResponse: {
//             create?: components["schemas"]["WooCommerceProductResponse"][];
//             update?: components["schemas"]["WooCommerceProductResponse"][];
//             delete?: components["schemas"]["WooCommerceProductResponse"][];
//         };
//         WooCommerceProductAttributeRequest: {
//             /** Format: int32 */
//             id?: number;
//             name: string;
//             slug?: string;
//             orderBy?: string;
//             hasArchives?: boolean;
//         };
//         ApiResponseWooCommerceProductAttributeResponse: {
//             success?: boolean;
//             data?: components["schemas"]["WooCommerceProductAttributeResponse"];
//             message?: string;
//             errors?: Record<string, never>;
//         };
//         WooCommerceProductAttributeResponse: {
//             /** Format: int32 */
//             id?: number;
//             name?: string;
//             slug?: string;
//             type?: string;
//             orderBy?: string;
//             hasArchives?: boolean;
//         };
//         BatchWoocommerceProductAttributeRequest: {
//             create?: components["schemas"]["WooCommerceProductAttributeRequest"][];
//             update?: components["schemas"]["WooCommerceProductAttributeRequest"][];
//             delete?: number[];
//         };
//         ApiResponseBatchWooCommerceProductAttributeResponse: {
//             success?: boolean;
//             data?: components["schemas"]["BatchWooCommerceProductAttributeResponse"];
//             message?: string;
//             errors?: Record<string, never>;
//         };
//         BatchWooCommerceProductAttributeResponse: {
//             create?: components["schemas"]["WooCommerceProductAttributeResponse"][];
//             update?: components["schemas"]["WooCommerceProductAttributeResponse"][];
//             delete?: components["schemas"]["WooCommerceProductAttributeResponse"][];
//         };
//         CreateWordpressMediaRequest: {
//             title?: string;
//             caption?: string;
//             description?: string;
//             altText?: string;
//             /** Format: int32 */
//             post?: number;
//             status?: string;
//         };
//         ApiResponseWordpressMediaResponse: {
//             success?: boolean;
//             data?: components["schemas"]["WordpressMediaResponse"];
//             message?: string;
//             errors?: Record<string, never>;
//         };
//         Rendered: {
//             rendered?: string;
//             get_protected?: boolean;
//         };
//         WordpressMediaResponse: {
//             /** Format: int32 */
//             id?: number;
//             date?: string;
//             dateGmt?: string;
//             modified?: string;
//             modifiedGmt?: string;
//             guid?: components["schemas"]["Rendered"];
//             title?: components["schemas"]["Rendered"];
//             caption?: components["schemas"]["Rendered"];
//             description?: components["schemas"]["Rendered"];
//             link?: string;
//             slug?: string;
//             status?: string;
//             type?: string;
//             permalinkTemplate?: string;
//             generatedSlug?: string;
//             /** Format: int32 */
//             author?: number;
//             commentStatus?: string;
//             pingStatus?: string;
//             meta?: Record<string, never>[];
//             template?: string;
//             altText?: string;
//             mediaType?: string;
//             mimeType?: string;
//             mediaDetails?: Record<string, never>[];
//             /** Format: int32 */
//             post?: number;
//             sourceUrl?: string;
//             missingImageSizes?: string[];
//             createdAt?: string;
//             updatedAt?: string;
//             createdAtGmt?: string;
//             updatedAtGmt?: string;
//         };
//         CreateUserRequest: {
//             name: string;
//             roles: string;
//             active: boolean;
//             email: string;
//             password: string;
//         };
//         PatchUserRequest: {
//             name?: string;
//             roles?: string;
//             active?: boolean;
//         };
//         PatchUserEcommerceRequest: {
//             /** Format: int32 */
//             userId?: number;
//             /** Format: int32 */
//             ecommerceId?: number;
//             apiPublic?: string;
//             apiSecret?: string;
//             appUsername?: string;
//             appPassword?: string;
//         };
//         PatchEcommerceRequest: {
//             name?: string;
//             url?: string;
//             /** @enum {string} */
//             type?: "WORDPRESS";
//             woocommerceApiVersion?: string;
//             wordpressApiVersion?: string;
//         };
//         IndexRequest: {
//             /** Format: int32 */
//             page?: number;
//             /** Format: int32 */
//             perPage?: number;
//             fields?: string;
//             search?: string;
//             searchFields?: string[];
//         };
//         ApiResponsePageWooCommerceProductResponse: {
//             success?: boolean;
//             data?: components["schemas"]["PageWooCommerceProductResponse"];
//             message?: string;
//             errors?: Record<string, never>;
//         };
//         PageWooCommerceProductResponse: {
//             items?: components["schemas"]["WooCommerceProductResponse"][];
//             /** Format: int32 */
//             currentPage?: number;
//             /** Format: int32 */
//             itemsInPage?: number;
//             /** Format: int32 */
//             totalItems?: number;
//             /** Format: int32 */
//             totalPages?: number;
//         };
//         ApiResponsePageWooCommerceProductVariationResponse: {
//             success?: boolean;
//             data?: components["schemas"]["PageWooCommerceProductVariationResponse"];
//             message?: string;
//             errors?: Record<string, never>;
//         };
//         PageWooCommerceProductVariationResponse: {
//             items?: components["schemas"]["WooCommerceProductVariationResponse"][];
//             /** Format: int32 */
//             currentPage?: number;
//             /** Format: int32 */
//             itemsInPage?: number;
//             /** Format: int32 */
//             totalItems?: number;
//             /** Format: int32 */
//             totalPages?: number;
//         };
//         ApiResponsePageWooCommerceProductAttributeResponse: {
//             success?: boolean;
//             data?: components["schemas"]["PageWooCommerceProductAttributeResponse"];
//             message?: string;
//             errors?: Record<string, never>;
//         };
//         PageWooCommerceProductAttributeResponse: {
//             items?: components["schemas"]["WooCommerceProductAttributeResponse"][];
//             /** Format: int32 */
//             currentPage?: number;
//             /** Format: int32 */
//             itemsInPage?: number;
//             /** Format: int32 */
//             totalItems?: number;
//             /** Format: int32 */
//             totalPages?: number;
//         };
//         ApiResponsePageWordpressMediaResponse: {
//             success?: boolean;
//             data?: components["schemas"]["PageWordpressMediaResponse"];
//             message?: string;
//             errors?: Record<string, never>;
//         };
//         PageWordpressMediaResponse: {
//             items?: components["schemas"]["WordpressMediaResponse"][];
//             /** Format: int32 */
//             currentPage?: number;
//             /** Format: int32 */
//             itemsInPage?: number;
//             /** Format: int32 */
//             totalItems?: number;
//             /** Format: int32 */
//             totalPages?: number;
//         };
//         ApiResponseListUserResponse: {
//             success?: boolean;
//             data?: components["schemas"]["UserResponse"][];
//             message?: string;
//             errors?: Record<string, never>;
//         };
//         ApiResponseListUserEcommerceResponse: {
//             success?: boolean;
//             data?: components["schemas"]["UserEcommerceResponse"][];
//             message?: string;
//             errors?: Record<string, never>;
//         };
//         ApiResponseListEcommerceResponse: {
//             success?: boolean;
//             data?: components["schemas"]["EcommerceResponse"][];
//             message?: string;
//             errors?: Record<string, never>;
//         };
//         DeleteRequest: {
//             force?: boolean;
//         };
//         ApiResponseBoolean: {
//             success?: boolean;
//             data?: boolean;
//             message?: string;
//             errors?: Record<string, never>;
//         };
//     };
//     responses: never;
//     parameters: never;
//     requestBodies: never;
//     headers: never;
//     pathItems: never;
// }


// export interface Prodotto {
//      /** Format: int32 */
//             id?: number;
//             name?: string;
//             link?: string;
//             type?: string;
//             status?: string;
//             description?: string;
//             sku?: string;
//             price?: string;
//             slug?: string;
//             permalink?: string;
//             dateCreated?: string;
//             dateCreatedGmt?: string;
//             dateModified?: string;
//             dateModifiedGmt?: string;
//             featured?: boolean;
//             catalogVisibility?: string;
//             shortDescription?: string;
//             regularPrice?: string;
//             salePrice?: string;
//             dateOnSaleFrom?: string;
//             dateOnSaleFromGmt?: string;
//             dateOnSaleTo?: string;
//             dateOnSaleToGmt?: string;
//             virtual?: boolean;
//             downloadable?: boolean;
//             downloads?: components["schemas"]["WooCommerceDownloadRequest"][];
//             /** Format: int32 */
//             downloadLimit?: number;
//             /** Format: int32 */
//             downloadExpiry?: number;
//             externalUrl?: string;
//             buttonText?: string;
//             taxStatus?: string;
//             taxClass?: string;
//             manageStock?: boolean;
//             /** Format: int32 */
//             stockQuantity?: number;
//             stockStatus?: string;
//             backorders?: string;
//             soldIndividually?: boolean;
//             weight?: string;
//             dimensions?: components["schemas"]["DimensionsRequest"];
//             shippingClass?: string;
//             reviewsAllowed?: boolean;
//             upsellIds?: number[];
//             crossSellIds?: number[];
//             /** Format: int32 */
//             parentId?: number;
//             purchaseNote?: string;
//             categories?: components["schemas"]["LinkToCategoryRequest"][];
//             tags?: components["schemas"]["LinkToTagRequest"][];
//             images?: components["schemas"]["ImageRequest"][];
//             attributes?: components["schemas"]["WooCommerceAttributeRequest"][];
//             defaultAttributes?: components["schemas"]["WooCommerceDefaultAttributeRequest"][];
//             groupedProducts?: Record<string, never>[];
//             /** Format: int32 */
//             menuOrder?: number;
//             metaData?: components["schemas"]["WooCommerceMetaRequest"][];
// }





// export interface CategorieTreeSelect {
//     string: string
// }



// export interface Immagini {
//     id: number
//     order: number
//     src: string
//     name: string
//     alt: string
//     created_at: string
//     updated_at: string
//     is_main: number
//     prodotto_id: number
// }

// export interface ImmaginePrincipale {
//     id: number
//     order: number
//     src: string
//     name: string
//     alt: string
//     created_at: string
//     updated_at: string
//     is_main: number
//     prodotto_id: number
// }

// export interface AttributiSenzaVariazioni {
//     id: number
//     prodotto_id: number
//     attributo_id: number
//     opzioni_id: string
//     abilitato_per_variazioni: number
//     created_at: string
//     updated_at: string
//     visibile: number
//     position?: number
//     attributo: Attributo
//     opzione: any
// }




// export interface LastExport {
//     id: number
//     stato: string
//     tipo: string
//     created_at: string
//     modello_singolo: boolean
//     modello_id: number
//     user_id: number
// }

// export interface Attributi {
//     id: number
//     name: string
//     slug?: string
//     type: string
//     order_by: string
//     has_archives: number
//     created_at: string
//     updated_at: string
//     sincronizzazione_id?: number
//     export_id: any
//     is_specifico: number
//     prodotto_id: any
//     pivot: Pivot
//     attributo_opzioni: AttributoOpzioni[]
// }

// export interface Pivot {
//     prodotto_id: number
//     attributo_id: number
// }

// // export interface ProdottoAttributi {
// //     id: number
// //     prodotto_id: number
// //     attributo_id: number
// //     opzione_id: any
// //     abilitato_per_variazioni: boolean
// //     visibile: boolean
// //     position?: number
// //     attributo: Attributo
// //     opzioni_id: string[]
// // }


