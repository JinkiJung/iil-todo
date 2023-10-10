/* tslint:disable */
/* eslint-disable */
/**
 * iil Repository API
 * Backend for iil data storage
 *
 * OpenAPI spec version: '0.1.0'
 * Contact: your.jinki.jung@gmail.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/**
 * 
 * @export
 * @interface ConditionDto
 */
export interface ConditionDto {
    /**
     * 
     * @type {string}
     * @memberof ConditionDto
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof ConditionDto
     */
    namespace?: string;
    /**
     * 
     * @type {string}
     * @memberof ConditionDto
     */
    shortName?: string;
    /**
     * 
     * @type {string}
     * @memberof ConditionDto
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof ConditionDto
     */
    type?: ConditionDtoTypeEnum;
    /**
     * 
     * @type {string}
     * @memberof ConditionDto
     */
    code?: string;
}

/**
    * @export
    * @enum {string}
    */
export enum ConditionDtoTypeEnum {
    TIME = 'TIME',
    LOCATION = 'LOCATION',
    IILINPUT = 'IIL_INPUT',
    IILVARIABLE = 'IIL_VARIABLE',
    IILSTATE = 'IIL_STATE',
    EVENT = 'EVENT'
}

