/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const expect = require('expect');
const security = require('../security');
const {LOGIN_SUCCESS, LOGIN_FAIL, RESET_ERROR, LOGOUT, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAIL} = require('../../actions/security');
const { SET_CONTROL_PROPERTY } = require('../../actions/controls');
const {USERMANAGER_UPDATE_USER} = require('../../actions/users');

describe('Test the security reducer', () => {
    let testToken = "260a670e-4dc0-4719-8bc9-85555d7dcbe1";
    let testUser = {
        "User": {
            "attribute": [
                {
                    "name": "company",
                    "value": "Some Company"
                },
                {
                    "name": "email",
                    "value": "user@email.com"
                },
                {
                    "name": "notes",
                    "value": "some notes"
                },
                {
                    "name": "UUID",
                    "value": testToken
                }
            ],
            "enabled": true,
            "groups": {
                "group": {
                    "enabled": true,
                    "groupName": "everyone",
                    "id": 3
                }
            },
            "id": 6,
            "name": "user",
            "role": "USER"
        }
    };
    let userWithSecurityToken = {
        "User": {
            "attribute": [
               {
                  "name": "UUID",
                  "value": testToken
               }
            ],
            "enabled": true,
            "groups": {},
            "id": 6,
            "name": "secured",
            "role": "USER"
        },
        "access_token": "1234567890"
    };
    let testAuthHeader = "Basic dGVzdDp0ZXN0"; // test:test
    let testError = {state: 0};
    it('login state', () => {
        let state = security({}, {type: LOGIN_SUCCESS, userDetails: testUser, authHeader: testAuthHeader});
        expect(state).toExist();
        expect(state.user.name).toBe("user");
        expect(state.authHeader).toBe(testAuthHeader);
        expect(state.token).toBe(testToken);
    });

    it('login state when bearer is used', () => {
        let state = security(undefined, {type: LOGIN_SUCCESS, userDetails: userWithSecurityToken});
        expect(state).toExist()
        .toIncludeKey("authHeader");
        expect(state.user.name).toBe("secured");
        expect(state.token).toBe("1234567890");
        expect(state.authHeader).toBe(undefined);
    });

    it('login fail', () => {
        let state = security({}, {type: LOGIN_FAIL, error: testError});
        expect(state).toExist();
        expect(state.loginError).toExist(testError);
        expect(state.loginError.state).toBe(0);

    });
    it('reset error', () => {
        let state = security({}, {type: RESET_ERROR});
        expect(state).toExist();
    });
    it('logout', () => {
        let state = security({}, {type: LOGOUT});
        expect(state).toExist();
        expect(!state.user).toBe(true);
    });
    it('update user', () => {
        let state = security({user: testUser.User}, {type: USERMANAGER_UPDATE_USER, user: {
            id: 6,
            name: "changed"
        }});
        expect(state).toExist();
        expect(state.user.name).toBe("changed");
    });

    it('do not update user', () => {
        let state = security({user: testUser.User}, {type: USERMANAGER_UPDATE_USER, user: {
            id: 7,
            name: "changed"
        }});
        expect(state).toExist();
        expect(state.user.name).toBe("user");
    });

    it('change password success', () => {
        let state = security({user: testUser.User}, {type: CHANGE_PASSWORD_SUCCESS, user: {
            id: 6,
            password: "newpassword"
        }});
        expect(state).toExist();
        expect(state.user.password).toBe("newpassword");
        expect(state.passwordChanged).toBe(true);
    });

    it('change password fail', () => {
        let state = security({user: testUser.User}, {type: CHANGE_PASSWORD_FAIL, error: {message: 'error'}});
        expect(state).toExist();
        expect(state.passwordError).toExist();
    });

    it('reset password error', () => {
        // Ignore other control properties
        let state = security(
            {
                user: testUser.User,
                passwordError: "what an error!"
            }, {type: SET_CONTROL_PROPERTY, control: "AnotherControl", property: "enabled"});
        expect(state).toExist()
        .toIncludeKey("passwordError")
        .toNotIncludeKey("passwordChanged");
        // Actually reset the control
        state = security(
            {
                user: testUser.User,
                passwordError: "what an error!"
            }, {type: SET_CONTROL_PROPERTY, control: "ResetPassword", property: "enabled"});
        expect(state).toExist()
        .toIncludeKey("passwordError")
        .toIncludeKey("passwordChanged");
        expect(state.passwordError).toBe(null);
        expect(state.passwordChanged).toBe(false);
    });

    it('do not change state by default', () => {
        let inputstate = {foo: "bar"};
        expect(security(inputstate, {type: "aaa"})).toEqual(inputstate);
    });
});
