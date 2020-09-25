// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  restApiUrl: 'http://localhost:3000/dev/',
  restApiUrl1: 'https://api.trucommon.com/dev/'
};
/*
SELECT * FROM truresponse.user_account;
SELECT * FROM truresponse.account;
SELECT * FROM truresponse.user;
SELECT * FROM truresponse.user_token;
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE truresponse.user_account;
TRUNCATE truresponse.account;
TRUNCATE truresponse.user;
TRUNCATE truresponse.user_token;
SET FOREIGN_KEY_CHECKS=1;
*/
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
