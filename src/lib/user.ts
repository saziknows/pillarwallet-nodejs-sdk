/*
Copyright (C) 2019 Stiftung Pillar Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/**
 * Import required classes / libraries / constants
 */
import { AxiosPromise } from 'axios';
import { Readable } from 'stream';
import { Configuration } from './configuration';
import { HttpEndpoints } from './constants/httpEndpoints';

/**
 * Import HTTP Request Configurations
 */
import { default as deleteConfiguration } from '../utils/requester-configurations/delete';
import { default as postConfiguration } from '../utils/requester-configurations/post';
import { default as getConfiguration } from '../utils/requester-configurations/get';
import { default as putConfiguration } from '../utils/requester-configurations/put';

/**
 * Import Validation Schemas
 */
const userInfoSchema = require('../schemas/user/info.json');
const userInfoByIdSchema = require('../schemas/user/infoById.json');
const userUpdateSchema = require('../schemas/user/update.json');
const userDeleteSchema = require('../schemas/user/delete.json');
const userSearchSchema = require('../schemas/user/search.json');
const userUsernameSearchSchema = require('../schemas/user/username-search.json');
const userValidateSchema = require('../schemas/user/validate.json');
const profileImageSchema = require('../schemas/user/profileImage.json');
const deleteProfileImageSchema = require('../schemas/user/deleteProfileImage.json');
const uploadProfileImageSchema = require('../schemas/user/uploadProfileImage.json');
const uploadProfileImageFormDataSchema = require('../schemas/user/uploadProfileImageFormData.json');
const updateNotificationPreferencesSchema = require('../schemas/user/userNotificationPreferences.json');
const imageByUserIdSchema = require('../schemas/user/imageByUserId.json');
const userCreateOneTimePasswordSchema = require('../schemas/user/createOneTimePassword.json');
const userValidateEmailSchema = require('../schemas/user/validateEmail.json');
const userValidatePhoneSchema = require('../schemas/user/validatePhone.json');
const userMapContactsAddressesSchema = require('../schemas/user/mapContactsAddresses.json');

const setAuthHeader = () => {
  const headers = {
    Authorization: '',
  };

  if (
    Configuration.accessKeys.oAuthTokens &&
    Configuration.accessKeys.oAuthTokens.accessToken
  ) {
    headers.Authorization = `Bearer ${
      Configuration.accessKeys.oAuthTokens.accessToken
    }`;
  }

  return headers;
};

export class User extends Configuration {
  /**
   * @name update
   * @desc Updates data elements on an existing wallet user.
   * @param {UserUpdate} userUpdate
   * @returns {AxiosPromise}
   */
  update(userUpdate: UserUpdate): AxiosPromise {
    return this.executeRequest({
      data: userUpdate,
      defaultRequest: postConfiguration,
      schema: userUpdateSchema,
      url: `${Configuration.accessKeys.apiUrl}${HttpEndpoints.USER_UPDATE}`,
    });
  }

  /**
   * @name info
   * @desc Retrieve information on an existing wallet user
   * @param {UserInfo} userInfo
   * @returns {AxiosPromise}
   */
  info(userInfo: UserInfo): AxiosPromise {
    return this.executeRequest({
      defaultRequest: getConfiguration,
      params: userInfo,
      schema: userInfoSchema,
      url: `${Configuration.accessKeys.apiUrl}${HttpEndpoints.USER_INFO}`,
    });
  }

  /**
   * @name infoSmartWallet
   * @desc Retrieve information from a user and his wallets
   * @param {UserInfo} userInfo
   * @returns {AxiosPromise}
   */
  infoSmartWallet(userInfo: UserInfo): AxiosPromise {
    return this.executeRequest({
      defaultRequest: getConfiguration,
      params: userInfo,
      schema: userInfoSchema,
      url: `${Configuration.accessKeys.apiUrl}${
        HttpEndpoints.USER_INFO_SMART_WALLET
      }`,
    });
  }

  /**
   * @name infoById
   * @desc Provides the user data by the target user id and users access keys
   * @param {string} targetUserId
   * @param {UserInfoById} query
   * @returns {AxiosPromise}
   */
  infoById(targetUserId: string, query: UserInfoById): AxiosPromise {
    return this.executeRequest({
      defaultRequest: getConfiguration,
      params: query,
      schema: userInfoByIdSchema,
      url: `${Configuration.accessKeys.apiUrl}${
        HttpEndpoints.USER_INFO_BY_ID
      }${targetUserId}`,
    });
  }

  /**
   * @name search
   * @desc Provides a list of users that contain the search criteria in either their first name or last
   * name, and is not the current wallet user.
   * Also it performs a check if the search string term is at least 2 characters and if the user
   * allows their profile to be searched.
   * @param {UserSearch} userSearch
   * @returns {AxiosPromise}
   */
  search(userSearch: UserSearch): AxiosPromise {
    return this.executeRequest({
      defaultRequest: getConfiguration,
      params: userSearch,
      schema: userSearchSchema,
      url: `${Configuration.accessKeys.apiUrl}${HttpEndpoints.USER_SEARCH}`,
    });
  }

  /**
   * @name delete
   * @desc Remove an existing wallet user profile from the database
   * @param {UserDelete} userDelete
   * @returns {AxiosPromise}
   */
  delete(userDelete: UserDelete): AxiosPromise {
    return this.executeRequest({
      data: userDelete,
      defaultRequest: deleteConfiguration,
      schema: userDeleteSchema,
      url: `${Configuration.accessKeys.apiUrl}${HttpEndpoints.USER_DELETE}`,
    });
  }

  /**
   * @name usernameSearch
   * @desc Retrieve the userId of an existing user or return not found
   * @param {UserUsernameSearch} userUsernameSearch
   * @returns {AxiosPromise}
   */
  usernameSearch(userUsernameSearch: UserUsernameSearch): AxiosPromise {
    return this.executeRequest({
      defaultRequest: getConfiguration,
      params: userUsernameSearch,
      schema: userUsernameSearchSchema,
      url: `${Configuration.accessKeys.apiUrl}${
        HttpEndpoints.USER_USERNAME_SEARCH
      }`,
    });
  }

  /**
   * @name validate
   * @deprecated
   * @returns {AxiosPromise}
   */
  validate(data: UserValidate): AxiosPromise {
    return this.executeRequest({
      data,
      schema: userValidateSchema,
      defaultRequest: postConfiguration,
      url: Configuration.accessKeys.apiUrl + HttpEndpoints.USER_VALIDATE,
      auth: false,
    });
  }

  profileImage(data: ProfileImage): AxiosPromise {
    return this.executeRequest({
      auth: false,
      defaultRequest: { ...getConfiguration, responseType: 'stream' },
      schema: profileImageSchema,
      // Assign data to params for validation
      params: data,
      // But don't include it in the request
      sendParams: false,
      url: `${Configuration.accessKeys.apiUrl}${HttpEndpoints.USER_IMAGE}/${
        data.imageName
      }`,
    });
  }

  uploadProfileImage(image: Readable, query: UploadProfileImage): AxiosPromise {
    try {
      this.validation(uploadProfileImageSchema, query);
    } catch (e) {
      return Promise.reject(e);
    }

    const headers = setAuthHeader();

    return this.executeRequest({
      auth: false,
      data: image,
      defaultRequest: {
        ...postConfiguration,
        headers,
      },
      params: query,
      url: `${Configuration.accessKeys.apiUrl}${HttpEndpoints.USER_IMAGE}`,
    });
  }

  /**
   * @name uploadProfileImageFormData
   * @desc Upload a profile image using form data
   * @param {string} walletId
   * @param {FormData} formData
   * @returns {AxiosPromise}
   */
  uploadProfileImageFormData(walletId: string, formData: any): AxiosPromise {
    /**
     * formData should contain `walletId` and `image` fields
     */
    try {
      this.validation(uploadProfileImageFormDataSchema, { walletId });
    } catch (e) {
      return Promise.reject(e);
    }

    /**
     * A FormData object from the browser should mean that the Content-Type
     * header is set correctly for the request
     *
     * This isn't the case for Node, it has to be set explicity
     * to run the integration tests
     *
     * https://github.com/axios/axios/issues/318 has some useful information
     *
     * TODO Figure out a better way to do this,
     * i.e. integration tests should run from a browser/browser-like environment
     */

    const headers = {
      ...setAuthHeader(),
      'Content-Type': '',
    };

    const baseRequest = {
      ...postConfiguration,
      headers,
    };
    delete baseRequest.json;

    if (formData._boundary) {
      baseRequest.headers['Content-Type'] = `multipart/form-data; boundary=${
        formData._boundary
      }`;
    } else {
      delete baseRequest.headers['Content-Type'];
    }

    return this.executeRequest({
      defaultRequest: baseRequest,
      auth: false,
      data: formData,
      url: `${Configuration.accessKeys.apiUrl}${HttpEndpoints.USER_IMAGE}`,
    });
  }

  deleteProfileImage(data: DeleteProfileImage): AxiosPromise {
    return this.executeRequest({
      data,
      schema: deleteProfileImageSchema,
      defaultRequest: deleteConfiguration,
      url: Configuration.accessKeys.apiUrl + HttpEndpoints.USER_IMAGE,
    });
  }

  /**
   * @name imageByUserId
   * @desc Get user's profile image using user's ID
   * @param {ImageByUserId} data
   * @returns {AxiosPromise}
   */
  imageByUserId(data: ImageByUserId): AxiosPromise {
    const params = {
      walletId: data.walletId,
    };

    try {
      this.validation(imageByUserIdSchema, data);
    } catch (e) {
      return Promise.reject(e);
    }

    return this.executeRequest({
      params,
      defaultRequest: getConfiguration,
      url: `${Configuration.accessKeys.apiUrl}${
        HttpEndpoints.USER_IMAGE_BY_USER_ID
      }/${data.userId}`,
    });
  }

  /**
   * @name createOneTimePassword
   * @desc Create a one-time password for email or phone,
   * store it on the user record,
   * then send an email or SMS to the user
   * @param {UserCreateOneTimePassword} data
   * @returns {AxiosPromise}
   */
  createOneTimePassword(data: UserCreateOneTimePassword): AxiosPromise {
    return this.executeRequest({
      data,
      schema: userCreateOneTimePasswordSchema,
      defaultRequest: postConfiguration,
      url: `${Configuration.accessKeys.apiUrl}${
        HttpEndpoints.USER_CREATE_ONE_TIME_PASSWORD
      }`,
    });
  }

  /**
   * @name validateEmail
   * @desc Validate a one-time password sent via email
   * @param {UserValidateEmail} data
   * @returns {AxiosPromise}
   */
  validateEmail(data: UserValidateEmail): AxiosPromise {
    return this.executeRequest({
      data,
      schema: userValidateEmailSchema,
      defaultRequest: postConfiguration,
      url: `${Configuration.accessKeys.apiUrl}${
        HttpEndpoints.USER_VALIDATE_EMAIL
      }`,
    });
  }

  /**
   * @name validatePhone
   * @desc Validate a one-time password sent via SMS
   * @param {UserValidatePhone} data
   * @returns {AxiosPromise}
   */
  validatePhone(data: UserValidatePhone): AxiosPromise {
    return this.executeRequest({
      data,
      schema: userValidatePhoneSchema,
      defaultRequest: postConfiguration,
      url: `${Configuration.accessKeys.apiUrl}${
        HttpEndpoints.USER_VALIDATE_PHONE
      }`,
    });
  }

  /**
   * @name updateNotificationPreferences
   * @desc Update notification preferences for given user
   *
   * @param {UpdateNotificationPreferences} data
   * @returns {AxiosPromise}
   */
  updateNotificationPreferences(
    data: UpdateNotificationPreferences,
  ): AxiosPromise {
    return this.executeRequest({
      data,
      schema: updateNotificationPreferencesSchema,
      defaultRequest: putConfiguration,
      url: `${Configuration.accessKeys.apiUrl}${
        HttpEndpoints.USER_NOTIFICATION_PREFERENCES
      }`,
    });
  }

  /**
   * Retrieve access tokens of current wallet user
   * @param {UserInfo} userInfo
   * @returns {AxiosPromise}
   */
  accessTokens(userInfo: UserInfo): AxiosPromise {
    return this.executeRequest({
      defaultRequest: getConfiguration,
      params: userInfo,
      schema: userInfoSchema,
      url: `${Configuration.accessKeys.apiUrl}${
        HttpEndpoints.USER_ACCESS_TOKENS
      }`,
    });
  }

  /**
   * @name mapContactsAddresses
   * @desc Returns Smart Wallet addresses for the contacts of a given user
   *
   * @param {MapContactsAddresses} data
   * @returns {AxiosPromise}
   */
  mapContactsAddresses(data: MapContactsAddresses): AxiosPromise {
    return this.executeRequest({
      data,
      schema: userMapContactsAddressesSchema,
      defaultRequest: postConfiguration,
      url: `${Configuration.accessKeys.apiUrl}${
        HttpEndpoints.USER_MAP_CONTACTS_ADDRESSES
      }`,
    });
  }
}
